/* ═══════════════════════════════════════════════════════════════════════════
   IDENTITY — SERVER ONLY
   Importing node:crypto here is deliberate: it makes this module fail the
   build if it is ever pulled into a client component.

   Nothing in this file may be logged. Hashed identifiers are still personal
   data, and the raw inputs obviously are.
   ═══════════════════════════════════════════════════════════════════════════ */

import { createHash } from 'node:crypto';

/**
 * Meta requires identifiers lowercased and trimmed before hashing; an
 * unnormalized hash simply fails to match and silently degrades attribution.
 */
function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** E.164 without the leading +, per Meta's phone normalization rules. */
function normalizePhone(value: string): string {
  return value.replace(/[^0-9]/g, '').replace(/^0+/, '');
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export type IdentifierKind = 'email' | 'phone' | 'first_name' | 'last_name';

const NORMALIZERS: Record<IdentifierKind, (v: string) => string> = {
  email: normalizeEmail,
  phone: normalizePhone,
  first_name: normalizeName,
  last_name: normalizeName,
};

/**
 * Normalize then SHA-256 an identifier, per Meta's Advanced Matching spec.
 *
 * NOTE: prax.studio currently collects no email, phone, or name — there are
 * no forms and no phone number on the site. This is built, tested, and
 * deliberately wired to nothing. It exists so that the day a form ships, the
 * hashing is already correct rather than improvised. Do not invent callers.
 */
export function hashIdentifier(kind: IdentifierKind, raw: string): string | undefined {
  const normalized = NORMALIZERS[kind](raw);
  if (!normalized) return undefined;
  return createHash('sha256').update(normalized, 'utf8').digest('hex');
}

/* ── Request-derived signals ─────────────────────────────────────────────── */

/**
 * First hop of x-forwarded-for is the client on Vercel; later hops are
 * proxies. x-real-ip is the fallback.
 */
export function getClientIp(headers: Headers): string | undefined {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip')?.trim() || undefined;
}

export function getUserAgent(headers: Headers): string | undefined {
  return headers.get('user-agent') || undefined;
}

/** Parses a single cookie out of a Cookie header without pulling in a parser. */
export function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim()) || undefined;
    }
  }
  return undefined;
}

/**
 * Builds the _fbc value from a click id when the pixel has not yet written
 * the cookie — the common case for the very first pageview of an ad click,
 * which is exactly the one that matters most for attribution.
 */
export function deriveFbc(fbclid: string, creationTimeMs: number): string {
  return `fb.1.${creationTimeMs}.${fbclid}`;
}
