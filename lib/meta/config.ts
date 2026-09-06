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
 * Stamped onto every event, browser and server alike.
 *
 * The studio and PRAX Academy are on SEPARATE datasets by the advertiser's
 * decision (confirmed 2026-09-06), so these tags are no longer what keeps the
 * two properties apart — the dataset boundary does that. They stay because
 * they make the origin of an event self-describing in reporting, and because
 * this dataset has more than one producer: see EVENT_ID_PREFIX.
 */
export const META_TAGS = {
  business_unit: 'studio',
  site_domain: 'prax.studio',
} as const;

/**
 * Namespaces every event_id this property generates.
 *
 * This dataset has two producers: this site, and Squire's own Conversions API
 * connection, which reports completed appointments (see events.ts). Squire's
 * events are not ours and will never carry this prefix, so the prefix makes it
 * possible to tell at a glance which system produced an event.
 * Not a correctness measure — UUIDv4 does not collide — purely diagnostic.
 */
export const EVENT_ID_PREFIX = 'studio';

/** Hosts we accept as the origin of an event. Anything else is spoofed. */
export const TRUSTED_HOSTS = ['prax.studio', 'www.prax.studio'] as const;
