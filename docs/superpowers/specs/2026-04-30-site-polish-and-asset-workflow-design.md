# Site Polish + Responsive Audit + Asset Workflow — Design Spec

**Date:** 2026-04-30
**Author:** PRAX team (brainstormed with Claude)
**Status:** Draft, pending user review

## Goal

Bring the PRAX studio website to production-ready state across all standard resolutions: no overlapping or clipped elements, fully responsive 360–2560 px, performance-neutral or better, and equipped with a self-service workflow for adding new image and video assets going forward.

## Context

The site (Next.js 15 App Router, Tailwind 4 with `@theme`-based fluid type, GSAP + Lenis, Zustand) has had two prior polish passes: a March 2026 performance pass (PWA, blur placeholders, AVIF/WebP, bundle reduction documented in `PERFORMANCE_OPTIMIZATIONS.md`) and an in-flight Cloudinary→Vercel Blob asset migration (`docs/superpowers/specs/2026-04-08-cloudinary-to-vercel-blob-design.md`). Production currently 502s on Next.js Image because the Cloudinary cloud `dpc0d4a7s` is disabled at the platform level — that's the immediate gating issue.

This spec covers what comes after the migration unblocks: a methodical responsive audit, the polish work it surfaces, and tooling so adding new assets is no longer a manual ritual.

## Architecture

The work decomposes into three sub-projects. Each gets its own implementation plan and executes in order.

```
┌────────────────────────────────────┐
│ Sub-project 1: Migration completion│  Existing plan, mid-flight
│   Cloudinary → Vercel Blob         │  Blocked on cloud re-enable
└──────────────┬─────────────────────┘
               │  unblocks
               ▼
┌────────────────────────────────────┐    ┌──────────────────────────────────┐
│ Sub-project 2: Responsive audit    │    │ Sub-project 3: Asset workflow CLI│
│   + polish                         │    │   pnpm add-asset <path>          │
│   (5 pages × 13 viewports)         │    │   — independent of audit         │
└────────────────────────────────────┘    └──────────────────────────────────┘
```

Sub-project 3 has no functional dependency on sub-project 2. They can run in parallel once sub-project 1 lands.

---

## Sub-project 1: Cloudinary→Blob migration completion

**Plan:** `docs/superpowers/plans/2026-04-28-cloudinary-to-vercel-blob.md` (existing, valid).

**Status:**
- Task 1 (tsx + migrate:blob script) — committed `b926251`
- Task 2 (extend asset map, raw fetches) — committed `73c827f`
- Task 3 (run migration) — **blocked**: cloud `dpc0d4a7s` disabled, every fetch returns 401
- Tasks 4–7 — depend on Task 3

**Adjustment based on debugging during execution:**

The current `getDownloadUrl` uses an empty transform string to fetch raw originals. When the cloud is re-enabled, this may still hit Cloudinary's "Strict Transformations" feature (which whitelists exact transform strings used by the live site). If 401s persist after re-enable:
- First, retry with the live-site-proven transform (`f_auto,q_100` for images, `q_auto` for videos). Quality difference vs raw original is imperceptible.
- If that also 401s, populate `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in `.env.local`. The migration script already supports signed URLs.

**Out of scope here** — fully covered by the existing migration spec and plan.

---

## Sub-project 2: Responsive audit + polish

### Goals

1. Identify every visual issue at every supported viewport.
2. Categorize and prioritize.
3. Fix everything in `critical` and `major` buckets.
4. Verify final state by re-running the audit and checking Lighthouse.

### Audit methodology

The audit runs **after** sub-project 1 lands (so real images are present). Without real images, layout shifts and overlap detection are unreliable.

#### Viewports (13 total)

| Tier | Widths (px) | Representative devices |
|------|------------|-------------------------|
| Mobile narrow | 360, 375, 390 | Galaxy S+ low end, iPhone SE/13 mini, iPhone 14 |
| Mobile wide | 414, 430 | iPhone Plus, iPhone 14 Pro Max |
| Tablet | 768, 820, 1024 | iPad mini portrait, iPad Air, iPad Pro / small laptop |
| Desktop | 1280, 1440, 1536, 1920 | 13" laptop, MBP 14", MBP 16", Full HD |
| Large desktop | 2560 | QHD / 27" 1440p monitor |

The audit checks each viewport at the listed width. Tablet portrait/landscape distinctions are captured implicitly: portrait iPad mini = 768 px, landscape iPad Air = 1024 px. Adding more orientation-specific viewports is reserved for after the initial audit if device-specific issues turn up.

#### What gets checked at each viewport

For every page (`/`, `/about`, `/academy`, `/services`, `/team`):

1. **No element overflows** the viewport horizontally (most common bug)
2. **No overlap** between sibling components or sticky headers and content
3. **Text wraps without orphans/widows** at headline scales
4. **Hit targets** ≥ 44 × 44 px on mobile (links, buttons, nav items)
5. **Header behavior** at narrow widths — does the hamburger appear at the right breakpoint, does the menu cover content cleanly
6. **Hero scaling** — fluid type doesn't break at floor or ceiling
7. **Gallery sections** — no gaps, no broken aspect ratios, no images overflowing their tile
8. **Footer alignment** — columns don't collapse weirdly, social icons stay aligned
9. **Sticky / fixed elements** — preloader, scroll progress, magnetic buttons don't trap or overlap
10. **GSAP/Lenis interactions** — verify scroll-triggered animations don't leave elements offscreen on resize

#### Tooling

Audit work runs locally against `pnpm dev`. For each page:
1. Open in browser at each viewport using DevTools' device toolbar (responsive mode)
2. Take a screenshot
3. Walk the DOM with the viewport at exact width
4. Document issues into a structured markdown checklist

A single audit log file (`docs/audits/2026-04-30-responsive-audit.md`) tracks findings — page, viewport, severity, description, repro steps, screenshot path.

### Issue categorization

| Severity | Definition | Action |
|---------|-----------|--------|
| `critical` | Content is unreadable, clipped, unreachable, or breaks core flows | Fix before declaring done |
| `major` | Visible polish problem that a careful viewer would notice (overlap, alignment, broken hierarchy) | Fix before declaring done |
| `minor` | Nitpick — slight whitespace inconsistency, animation timing, etc. | Capture in follow-up issue list, do not block |

### Fix strategy

Fixes proceed page-by-page, mobile-first within each page. One commit per fix (or per small group of related fixes on the same component) so each is independently reviewable and revertable.

**Tailwind 4 specifics:** the project uses `@theme` with fluid `clamp()` types, OKLCH colors, and custom breakpoints in `app/globals.css`. Polish fixes adjust:
- Container widths and padding (most overflow bugs)
- Breakpoint-specific spacing (`md:`, `lg:`, `xl:`)
- Stack-vs-grid switches at narrow widths
- Sticky offsets that account for header height
- New breakpoints if a `lg`/`xl` jump leaves a 1280–1440 zone visibly compromised

**GSAP/Lenis caveat:** scroll-triggered animations can leave layout in unexpected states on viewport resize. For any animation-related issue, the fix is one of:
- Add a `ScrollTrigger.refresh()` call on resize (cleanest)
- Convert the animation to CSS-only (where viable)
- Disable the animation below a width threshold (last resort)

Any GSAP/Lenis change is verified at all 13 viewports specifically because resize behavior is the failure mode.

### Verification

The polish phase is "done" when:
1. Re-running the audit at all 13 viewports surfaces zero critical and zero major issues
2. Lighthouse scores hold or improve: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90 (current targets per `PERFORMANCE_OPTIMIZATIONS.md`)
3. No new console errors
4. `pnpm build` is green

---

## Sub-project 3: Asset workflow CLI

### Behavior

A new pnpm script: `pnpm add-asset <file-path> [--key <name>] [--type image|video]`.

Given:

```bash
pnpm add-asset ~/Pictures/jack-new-cut.jpg
pnpm add-asset ~/Videos/studio-walkthrough.mp4 --key studioWalkthrough
pnpm add-asset ~/Pictures/portfolio-08.jpg --key portfolio08
```

The script:
1. Validates the file exists and is an image or video (by mime/content sniff)
2. Determines the asset key — explicit `--key` argument wins, otherwise camelCase the filename stem (`jack-new-cut.jpg` → `jackNewCut`)
3. Refuses to overwrite an existing key in `lib/assets.ts` unless `--force` is passed
4. Uploads the file to Vercel Blob via `@vercel/blob`'s `put()` with a stable filename: `prax/<key>.<ext>`
5. Patches `lib/assets.ts` — inserts the new entry, preserving formatting, alphabetically within the appropriate section if discoverable, otherwise at end before the closing brace
6. Prints a `git diff` of the change and exits with success
7. Does **not** auto-commit — leaves staging to the user

### Interface

```
USAGE
  pnpm add-asset <file-path> [options]

OPTIONS
  --key <name>      Override the auto-generated asset key
  --type <type>     Force "image" or "video" (default: detect from mime)
  --force           Allow overwriting an existing key
  --dry-run         Print what would happen, do not upload or modify files

EXAMPLES
  pnpm add-asset ~/Pictures/jack-new.jpg
  pnpm add-asset ~/Videos/intro.mp4 --key heroVideoV2 --force
```

### Implementation

`scripts/add-asset.ts` — TypeScript, runs via `tsx` (already installed for the migration script).

Modules:
- **CLI argument parsing** — Node's built-in `parseArgs` (no external dep)
- **File reading + mime detection** — `fs.readFileSync` + extension-based fallback (no `file` binary required)
- **Upload** — `put(filename, bytes, { access: 'public', contentType, addRandomSuffix: false })`. `addRandomSuffix: false` ensures `prax/<key>.<ext>` is stable so re-uploads with `--force` overwrite cleanly
- **lib/assets.ts patcher** — read file as text, parse the `assets` object via a tiny regex (find the closing `} as const;`, insert new key before it), write back. No AST parser — overkill for this. Tests verify the patcher handles edge cases (empty object, single entry, trailing comma).
- **Diff output** — `child_process.execSync('git diff --color lib/assets.ts')`

Estimated size: ~150 lines including argument parsing and tests.

### Tests

`scripts/add-asset.test.ts` — runs via `tsx scripts/add-asset.test.ts` (no Jest needed for this small utility).

Test cases:
- camelCase conversion: `jack-new-cut.jpg` → `jackNewCut`
- camelCase with numbers: `portfolio-08.jpg` → `portfolio08`
- Refuses overwrite without `--force`
- Patcher correctly inserts entry into `lib/assets.ts`
- `--dry-run` makes no changes

Real upload to Blob is not tested in CI — exercised via manual `--dry-run`.

### Out of scope for the CLI

- **No automatic image optimization** — Next.js Image handles that at serve time. The CLI uploads raw originals.
- **No automatic blur placeholder generation** — `lib/blurPlaceholder.ts` provides reusable preset placeholders; new assets reuse them.
- **No batch upload** — single file per invocation. Loop in shell if needed.
- **No deletion** — Vercel dashboard or a future `pnpm remove-asset` if it becomes painful.

---

## Performance budget

Defined as a non-regression contract:

| Metric | Floor | Source |
|--------|-------|--------|
| Lighthouse Performance | ≥ 90 | Current target |
| Lighthouse Accessibility | ≥ 90 | Current target |
| Lighthouse Best Practices | ≥ 90 | Current target |
| Lighthouse SEO | ≥ 90 | Current target |
| First Load JS (any route) | ≤ 200 KB | Current is 173–177 KB; budget is +5% headroom |
| LCP at 4G slow throttle | ≤ 2.5 s | Core Web Vital good threshold |
| CLS | ≤ 0.05 | Tighter than the 0.1 standard, since images have placeholders |

Polish work that pushes any of these below floor must be reverted or reworked.

---

## Success criteria — "production ready"

The site is production ready when **all** of the following hold:

1. Sub-project 1 complete: every asset references a Vercel Blob URL, no Cloudinary references in source (only in the retained migration script for re-runs)
2. Sub-project 2 complete: zero critical/major audit issues across 5 pages × 13 viewports
3. Sub-project 3 complete: `pnpm add-asset` works end-to-end, tests pass, documented in `README.md` or a new `docs/asset-workflow.md`
4. `pnpm build` clean (zero warnings, zero TS errors)
5. Performance budget met (per table above)
6. Production domain `https://www.prax.studio` deploys successfully and renders all 5 pages without console errors
7. The follow-up `minor` issue list (from the audit) is captured as a markdown file or GitHub issues — not lost

## Rollback

Each sub-project is independently revertable:
- Sub-project 1: revert the migration commits, Cloudinary URLs return (assuming cloud is re-enabled)
- Sub-project 2: each polish fix is its own commit, can revert individually
- Sub-project 3: delete `scripts/add-asset.ts` and the `add-asset` line in `package.json`

## Out of scope

- Adding new pages or sections (this is polish, not new feature work)
- Redesigning components (visual style stays put)
- Backend work (no API routes change)
- Third-party integrations (no new analytics, no new auth, etc.)
- Image quality re-tuning beyond what Next.js Image already handles
- Accessibility deep-dive — the audit checks hit-target sizes and obvious contrast issues, but specialized a11y work (screen reader testing, keyboard nav exhaustive coverage, axe-core scans) is a follow-up
- Internationalization
- Cloudinary account deletion — keep as inert backup
