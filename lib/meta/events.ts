/* ═══════════════════════════════════════════════════════════════════════════
   EVENT CONTRACT
   The single source of truth for what may be sent, shared by the browser
   transport and the server route so the two can never drift.
   ═══════════════════════════════════════════════════════════════════════════ */

import { isValidEventId } from './eventId';
import { TRUSTED_HOSTS } from './config';

/**
 * Meta standard events we emit. Deliberately narrow.
 *
 * `Schedule` is absent and must stay absent — and there is now a second,
 * stronger reason than when this was written.
 *
 * 1. We still cannot observe it. Booking completes on getsquire.com and
 *    nothing here confirms an appointment, so it would be a claim we cannot
 *    support. A Book Now click and a booking-page visit are intent.
 * 2. Squire already reports it. Squire operates its own Conversions API
 *    connection on this dataset that tracks COMPLETED appointment bookings
 *    (confirmed by the advertiser 2026-09-06). That connection is the
 *    authoritative source for confirmed bookings.
 *
 * So adding Schedule here would not merely be unsupportable, it would
 * DOUBLE-COUNT real appointments against Squire's feed — and it could not be
 * deduplicated, because Squire's events do not share our event_id. Our events
 * and Squire's are deliberately disjoint: we report intent, Squire reports
 * outcome.
 *
 * `Lead` is absent because no lead surface exists — the site has no forms, no
 * phone number, and no inquiry capture. When one ships, add it here in the
 * same commit that adds the accepted-submission handler, never before.
 */
export const STANDARD_EVENTS = ['PageView', 'ViewContent', 'Contact'] as const;

/** Custom events. Outbound booking intent, explicitly not a Schedule. */
export const CUSTOM_EVENTS = ['BookNowClick'] as const;

export type StandardEvent = (typeof STANDARD_EVENTS)[number];
export type CustomEvent = (typeof CUSTOM_EVENTS)[number];
export type MetaEventName = StandardEvent | CustomEvent;

const ALLOWED_EVENTS: readonly string[] = [...STANDARD_EVENTS, ...CUSTOM_EVENTS];

export function isAllowedEvent(name: unknown): name is MetaEventName {
  return typeof name === 'string' && ALLOWED_EVENTS.includes(name);
}

export function isCustomEvent(name: MetaEventName): name is CustomEvent {
  return (CUSTOM_EVENTS as readonly string[]).includes(name);
}

/**
 * PageView is browser-only by design: it is high volume, carries no
 * conversion value, and is the event most likely to double-count against the
 * Conversions API connection already attached to this dataset.
 */
export const SERVER_FORWARDED_EVENTS: readonly MetaEventName[] = [
  'ViewContent',
  'Contact',
  'BookNowClick',
];

export function isServerForwarded(name: MetaEventName): boolean {
  return SERVER_FORWARDED_EVENTS.includes(name);
}

/* ── Custom data ─────────────────────────────────────────────────────────── */

/** Only these keys survive validation; anything else is dropped silently. */
const ALLOWED_CUSTOM_DATA_KEYS = [
  'content_type',
  'content_name',
  'content_ids',
  'content_category',
  'source_path',
  'booking_tenant',
] as const;

const MAX_STRING_LENGTH = 200;
const MAX_CONTENT_IDS = 10;

export type CustomData = Partial<Record<(typeof ALLOWED_CUSTOM_DATA_KEYS)[number], unknown>>;

/**
 * Whitelist-and-clamp rather than reject: a slightly malformed field should
 * not lose an otherwise legitimate conversion. Anything unrecognized is
 * dropped, so an attacker cannot smuggle arbitrary keys into the dataset.
 */
export function sanitizeCustomData(input: unknown): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
  const source = input as Record<string, unknown>;

  for (const key of ALLOWED_CUSTOM_DATA_KEYS) {
    const value = source[key];
    if (value == null) continue;

    if (key === 'content_ids') {
      const ids = (Array.isArray(value) ? value : [value])
        .filter((v): v is string | number => typeof v === 'string' || typeof v === 'number')
        .slice(0, MAX_CONTENT_IDS)
        .map((v) => String(v).slice(0, MAX_STRING_LENGTH));
      if (ids.length) out[key] = ids;
      continue;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const str = String(value).slice(0, MAX_STRING_LENGTH);
      if (str.length) out[key] = str;
    }
  }
  return out;
}

/* ── Envelope ────────────────────────────────────────────────────────────── */

export interface TrackRequest {
  event_name: MetaEventName;
  event_id: string;
  event_time: number;
  event_source_url: string;
  consent: 'granted' | 'denied';
  custom_data: Record<string, string | string[]>;
  fbp?: string;
  fbc?: string;
}

export type ValidationResult =
  | { ok: true; value: TrackRequest }
  | { ok: false; reason: string };

/** Meta rejects events older than 7 days; allow small clock skew forward. */
const MAX_EVENT_AGE_SECONDS = 7 * 24 * 60 * 60;
const MAX_CLOCK_SKEW_SECONDS = 5 * 60;

/**
 * Validates an untrusted request body. Failure reasons are deliberately
 * coarse strings — they are safe to log, because none of them echo payload
 * content back into the log line.
 */
export function validateTrackRequest(body: unknown, nowSeconds: number): ValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, reason: 'body_not_object' };
  }
  const b = body as Record<string, unknown>;

  if (!isAllowedEvent(b.event_name)) return { ok: false, reason: 'event_not_allowed' };
  if (!isValidEventId(b.event_id)) return { ok: false, reason: 'event_id_invalid' };

  const eventTime = typeof b.event_time === 'number' ? Math.floor(b.event_time) : NaN;
  if (!Number.isFinite(eventTime)) return { ok: false, reason: 'event_time_invalid' };
  if (eventTime > nowSeconds + MAX_CLOCK_SKEW_SECONDS) return { ok: false, reason: 'event_time_future' };
  if (eventTime < nowSeconds - MAX_EVENT_AGE_SECONDS) return { ok: false, reason: 'event_time_stale' };

  // The source URL is attacker-controlled, so pin it to our own hosts rather
  // than forwarding whatever we are handed into the dataset.
  if (typeof b.event_source_url !== 'string') return { ok: false, reason: 'source_url_missing' };
  let sourceUrl: URL;
  try {
    sourceUrl = new URL(b.event_source_url);
  } catch {
    return { ok: false, reason: 'source_url_unparseable' };
  }
  if (sourceUrl.protocol !== 'https:' && sourceUrl.hostname !== 'localhost') {
    return { ok: false, reason: 'source_url_not_https' };
  }
  if (
    !TRUSTED_HOSTS.includes(sourceUrl.hostname as (typeof TRUSTED_HOSTS)[number]) &&
    sourceUrl.hostname !== 'localhost' &&
    !sourceUrl.hostname.endsWith('.vercel.app')
  ) {
    return { ok: false, reason: 'source_url_untrusted_host' };
  }

  const consent = b.consent === 'granted' ? 'granted' : 'denied';

  return {
    ok: true,
    value: {
      event_name: b.event_name,
      event_id: b.event_id,
      event_time: eventTime,
      event_source_url: sourceUrl.toString(),
      consent,
      custom_data: sanitizeCustomData(b.custom_data),
      fbp: typeof b.fbp === 'string' && b.fbp.length <= 128 ? b.fbp : undefined,
      fbc: typeof b.fbc === 'string' && b.fbc.length <= 256 ? b.fbc : undefined,
    },
  };
}
