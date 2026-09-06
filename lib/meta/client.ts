'use client';

/* ═══════════════════════════════════════════════════════════════════════════
   BROWSER TRANSPORT
   Fires the browser pixel and, for conversion events, posts a matching copy
   to our own route so the Conversions API can send the server-side twin with
   the SAME event_name and event_id. Meta collapses the pair into one event.
   ═══════════════════════════════════════════════════════════════════════════ */

import { isMetaEnabled } from './config';
import { getMarketingConsent } from './consent';
import { newEventId } from './eventId';
import { isCustomEvent, isServerForwarded, type CustomData, type MetaEventName } from './events';

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

const TRACK_ENDPOINT = '/api/meta/track';

/**
 * A magnetic button can register two clicks from one intent, and users
 * double-tap outbound links constantly. Without this, one decision to book
 * becomes several conversions.
 */
const DEDUPE_WINDOW_MS = 2000;
const recentEvents = new Map<string, number>();

function isDuplicate(key: string): boolean {
  const now = Date.now();
  for (const [k, ts] of recentEvents) {
    if (now - ts > DEDUPE_WINDOW_MS) recentEvents.delete(k);
  }
  const seen = recentEvents.get(key);
  recentEvents.set(key, now);
  return seen !== undefined && now - seen < DEDUPE_WINDOW_MS;
}

function dedupeKey(name: MetaEventName, data: CustomData): string {
  const ids = Array.isArray(data.content_ids) ? data.content_ids.join(',') : String(data.content_ids ?? '');
  return `${name}:${String(data.content_type ?? '')}:${ids}`;
}

/**
 * Outbound clicks navigate away immediately, which cancels a normal fetch.
 * sendBeacon is queued by the browser and survives the unload; keepalive
 * fetch is the fallback for browsers without it.
 */
function postToServer(payload: unknown): void {
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(TRACK_ENDPOINT, blob)) return;
    }
  } catch {
    /* fall through to fetch */
  }
  try {
    void fetch(TRACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    /* tracking must never break navigation */
  }
}

export function trackMeta(name: MetaEventName, customData: CustomData = {}): void {
  if (!isMetaEnabled) return;
  if (getMarketingConsent() !== 'granted') return;
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  const key = dedupeKey(name, customData);
  if (isDuplicate(key)) return;

  const eventId = newEventId();

  // Browser copy. The eventID is what lets Meta match it to the server twin.
  window.fbq(
    isCustomEvent(name) ? 'trackCustom' : 'track',
    name,
    customData,
    { eventID: eventId }
  );

  if (!isServerForwarded(name)) return;

  postToServer({
    event_name: name,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: window.location.href,
    consent: 'granted',
    custom_data: customData,
  });
}

/** PageView is browser-only — see SERVER_FORWARDED_EVENTS for why. */
export function trackPageView(): void {
  trackMeta('PageView');
}
