/* ═══════════════════════════════════════════════════════════════════════════
   META INTEGRATION — SHARED CONFIG
   Imported by both the browser transport and the server route, so anything
   here must be safe to inline into the client bundle. Secrets live only in
   lib/meta/server.ts.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Graph API version. Verified current as of 2026-09-05 (v26.0, released
 * 2026-07-29). Meta supports each version for roughly two years; bump
 * deliberately and re-run the Test Events check, never silently.
 */
export const META_GRAPH_API_VERSION = 'v26.0';

/**
 * The dataset ID. Meta unified "pixel ID" and "dataset ID" — the browser
 * snippet and the Conversions API address the same dataset with the same
 * number, so one public variable serves both transports. It is not a secret;
 * it ships in the page source either way.
 */
export const META_DATASET_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

export const isMetaEnabled = META_DATASET_ID.length > 0;

/**
 * Stamped onto every event, browser and server alike. PRAX Academy shares this
 * dataset, so without these two tags studio and academy conversions are
 * indistinguishable downstream.
 */
export const META_TAGS = {
  business_unit: 'studio',
  site_domain: 'prax.studio',
} as const;

/** Hosts we accept as the origin of an event. Anything else is spoofed. */
export const TRUSTED_HOSTS = ['prax.studio', 'www.prax.studio'] as const;
