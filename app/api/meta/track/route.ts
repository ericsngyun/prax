import { META_TAGS, TRUSTED_HOSTS, isMetaEnabled } from '@/lib/meta/config';
import { validateTrackRequest } from '@/lib/meta/events';
import {
  deriveFbc,
  getClientIp,
  getUserAgent,
  readCookie,
} from '@/lib/meta/identity';
import { checkRateLimit } from '@/lib/meta/rateLimit';
import { getMetaServerConfig } from '@/lib/meta/server';

/* ═══════════════════════════════════════════════════════════════════════════
   CONVERSIONS API RELAY
   Receives the browser's copy of a conversion and sends the server-side twin
   with the same event_name and event_id so Meta deduplicates the pair.

   Runs on the default Vercel Node.js runtime (Fluid Compute), not an Edge
   Function: the access token stays server-side and node:crypto is available
   for identifier hashing.

   Logging rule for this whole file: codes and counts only. Never a token,
   never a payload, never a raw or hashed identifier.
   ═══════════════════════════════════════════════════════════════════════════ */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Meta is a best-effort side channel; never make a visitor wait on it. */
const META_TIMEOUT_MS = 3000;

function isTrustedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  if (TRUSTED_HOSTS.includes(url.hostname as (typeof TRUSTED_HOSTS)[number])) return true;
  // Preview deployments and local development only.
  if (process.env.VERCEL_ENV !== 'production') {
    return url.hostname === 'localhost' || url.hostname.endsWith('.vercel.app');
  }
  return false;
}

/** Always 204: the client has nothing to do with the outcome, and a detailed
 *  error body would tell a prober exactly how to shape a valid forgery. */
function noContent(): Response {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request): Promise<Response> {
  if (!isMetaEnabled) return noContent();

  // Consent, independent of anything the client asserts. Sec-GPC is the
  // header form of Global Privacy Control, which /privacy commits us to honor.
  if (request.headers.get('sec-gpc') === '1') return noContent();

  if (!isTrustedOrigin(request.headers.get('origin'))) return noContent();

  const ip = getClientIp(request.headers);
  if (!checkRateLimit(ip ?? 'unknown')) return noContent();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return noContent();
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const validated = validateTrackRequest(body, nowSeconds);
  if (!validated.ok) {
    console.warn(`[meta] rejected event: ${validated.reason}`);
    return noContent();
  }
  const event = validated.value;

  // The client's own consent state must agree with the server's view.
  if (event.consent !== 'granted') return noContent();

  const config = getMetaServerConfig();
  if (!config.ok) {
    console.warn(`[meta] not configured: ${config.reason}`);
    return noContent();
  }

  // fbp/fbc come from first-party cookies the pixel wrote. On the first
  // pageview of an ad click the cookie may not exist yet, so fall back to
  // rebuilding fbc from the fbclid still present in the source URL.
  const cookieHeader = request.headers.get('cookie');
  const fbp = readCookie(cookieHeader, '_fbp');
  let fbc = readCookie(cookieHeader, '_fbc');
  if (!fbc) {
    const fbclid = new URL(event.event_source_url).searchParams.get('fbclid');
    if (fbclid) fbc = deriveFbc(fbclid, Date.now());
  }

  const userAgent = getUserAgent(request.headers);

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.event_name,
        event_time: event.event_time,
        event_id: event.event_id,
        event_source_url: event.event_source_url,
        action_source: 'website',
        user_data: {
          ...(ip ? { client_ip_address: ip } : {}),
          ...(userAgent ? { client_user_agent: userAgent } : {}),
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
          // No hashed identifiers: prax.studio collects none. See
          // lib/meta/identity.ts — the hashing is built and dormant.
        },
        custom_data: {
          ...event.custom_data,
          ...META_TAGS,
        },
      },
    ],
    ...(config.config.testEventCode ? { test_event_code: config.config.testEventCode } : {}),
  };

  try {
    const response = await fetch(config.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Token in the header, never the query string — query strings end up
        // in access logs and error reports.
        Authorization: `Bearer ${config.config.accessToken}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(META_TIMEOUT_MS),
    });

    if (!response.ok) {
      // Status only. The response body can echo back submitted user_data.
      console.warn(`[meta] graph api rejected event: status=${response.status} event=${event.event_name}`);
    }
  } catch (error) {
    const reason = error instanceof Error ? error.name : 'unknown';
    console.warn(`[meta] graph api request failed: ${reason} event=${event.event_name}`);
  }

  return noContent();
}

/** Anything other than POST is not part of this contract. */
export async function GET(): Promise<Response> {
  return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}
