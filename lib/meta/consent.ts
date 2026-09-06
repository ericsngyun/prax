/* ═══════════════════════════════════════════════════════════════════════════
   MARKETING CONSENT
   One definition of consent, applied identically to the browser pixel and to
   the server-side Conversions API copy of the same event.

   Posture: prax.studio is a US-directed site for a Los Angeles business, and
   /privacy declares it as such, so marketing cookies default to granted under
   an opt-out model. Two things revoke that, and the published policy commits
   us to honoring the first — see "Your Choices and Opt-Outs".
   ═══════════════════════════════════════════════════════════════════════════ */

export type ConsentState = 'granted' | 'denied';

/** Set by the opt-out control; survives reloads on this browser only. */
export const CONSENT_STORAGE_KEY = 'prax.marketing-consent';

/**
 * Global Privacy Control. Our privacy policy states plainly that we honor
 * GPC, so this is a promise already published, not a nice-to-have. Browsers
 * expose it as navigator.globalPrivacyControl and mirror it as the Sec-GPC
 * request header, which the server checks independently.
 */
function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

function storedOptOut(): boolean {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'denied';
  } catch {
    // Private mode, blocked storage, or a browser configured to throw.
    // Absence of a stored opt-out is not consent withdrawal.
    return false;
  }
}

export function getMarketingConsent(): ConsentState {
  if (typeof window === 'undefined') return 'denied';
  if (hasGlobalPrivacyControl()) return 'denied';
  if (storedOptOut()) return 'denied';
  return 'granted';
}

/** Lets a future consent banner or an opt-out link flip the state. */
export function setMarketingConsent(state: ConsentState): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, state);
  } catch {
    /* storage unavailable — the in-page decision still applies for this view */
  }
}
