/* ═══════════════════════════════════════════════════════════════════════════
   RATE LIMIT
   In-process fixed window. Fluid Compute reuses instances, so this is
   effective in practice, but it is per-instance and therefore best-effort —
   it is a guard against casual abuse and runaway client loops, not a
   distributed limiter. Move to Redis/Edge Config if the endpoint is ever
   targeted in earnest.
   ═══════════════════════════════════════════════════════════════════════════ */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;
const MAX_TRACKED_KEYS = 5000;

const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, now = Date.now()): boolean {
  // Bound memory: a flood of unique keys must not grow this map forever.
  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [k, v] of hits) {
      if (v.resetAt <= now) hits.delete(k);
    }
    if (hits.size > MAX_TRACKED_KEYS) hits.clear();
  }

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_REQUESTS_PER_WINDOW;
}

/** Test seam — never called in production code paths. */
export function __resetRateLimit(): void {
  hits.clear();
}
