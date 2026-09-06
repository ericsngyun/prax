/* ═══════════════════════════════════════════════════════════════════════════
   EVENT ID
   One id per logical conversion, reused by the browser and server copies of
   that same conversion. Meta deduplicates on (event_name, event_id), so a
   mismatch here double-counts and a collision under-counts.
   ═══════════════════════════════════════════════════════════════════════════ */

import { EVENT_ID_PREFIX } from './config';

export function newEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${EVENT_ID_PREFIX}_${crypto.randomUUID()}`;
  }
  // Older Safari and any non-secure context. Not cryptographically strong,
  // but event ids only need to be unique, not unguessable.
  return `${EVENT_ID_PREFIX}_${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Event ids are echoed back from the client, so bound what we accept. */
export function isValidEventId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 64
    && /^[A-Za-z0-9._-]+$/.test(value);
}
