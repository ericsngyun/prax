/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS — META PIXEL
   Thin, safe wrapper around the Meta Pixel's global `fbq`. Every helper is a
   no-op when the pixel is not configured (no NEXT_PUBLIC_META_PIXEL_ID) or
   when the script is blocked, so callers never need to guard.
   ═══════════════════════════════════════════════════════════════════════════ */

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
    _fbq?: unknown;
  }
}

/** Pixel ID, injected at build time. Empty string = pixel disabled. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

export const isMetaPixelEnabled = META_PIXEL_ID.length > 0;

/**
 * Meta's standard events. Sticking to these (rather than custom events) is what
 * lets Ads Manager optimize delivery toward the action, not just report on it.
 */
export type MetaStandardEvent =
  | 'PageView'
  | 'Lead'
  | 'Schedule'
  | 'Contact'
  | 'CompleteRegistration'
  | 'ViewContent'
  | 'Search';

/** Fire a Meta standard event. Silently does nothing if the pixel is absent. */
export function trackMetaEvent(
  event: MetaStandardEvent,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
}
