/* ═══════════════════════════════════════════════════════════════════════════
   SERVER CONFIG — SECRETS
   Never imported by a client component. The access token is read here and
   nowhere else, and is never returned, logged, or echoed.
   ═══════════════════════════════════════════════════════════════════════════ */

import { META_DATASET_ID, META_GRAPH_API_VERSION } from './config';

export interface MetaServerConfig {
  datasetId: string;
  accessToken: string;
  endpoint: string;
  /** Present only outside production — see resolveTestEventCode. */
  testEventCode?: string;
}

/**
 * Meta's Test Events tool tags traffic so it lands in the test view instead of
 * the live dataset. Leaving it on in production silently diverts real
 * conversions, so production never gets it regardless of what is configured.
 */
function resolveTestEventCode(): string | undefined {
  if (process.env.VERCEL_ENV === 'production') return undefined;
  const code = process.env.META_TEST_EVENT_CODE?.trim();
  return code ? code : undefined;
}

export type ConfigResult =
  | { ok: true; config: MetaServerConfig }
  | { ok: false; reason: 'missing_dataset_id' | 'missing_access_token' };

/**
 * Validated at call time rather than module load: a missing variable should
 * disable tracking, not crash a page render.
 */
export function getMetaServerConfig(): ConfigResult {
  if (!META_DATASET_ID) return { ok: false, reason: 'missing_dataset_id' };

  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!accessToken) return { ok: false, reason: 'missing_access_token' };

  return {
    ok: true,
    config: {
      datasetId: META_DATASET_ID,
      accessToken,
      endpoint: `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${META_DATASET_ID}/events`,
      testEventCode: resolveTestEventCode(),
    },
  };
}
