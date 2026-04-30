# Responsive Audit + Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit every page of the PRAX site at every supported viewport (5 pages × 13 viewports = 65 surfaces), document every visual issue, and fix all critical and major issues. Verify the result holds Lighthouse scores ≥ 90 across Performance, Accessibility, Best Practices, and SEO.

**Architecture:** Page-by-page audit produces a single canonical findings file. Findings get triaged into critical / major / minor buckets. Fix waves consume the findings file one page at a time, with one commit per fix for individual revertability. Final verification re-walks the audit and runs Lighthouse on a production build.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS 4 with `@theme` (fluid `clamp()` types, OKLCH colors), GSAP + Lenis (smooth scroll, scroll-triggered animations), Zustand (client state), pnpm 9.

**Spec reference:** `docs/superpowers/specs/2026-04-30-site-polish-and-asset-workflow-design.md` (sub-project 2).

---

## Pre-flight (read before starting)

### Hard pre-requisites

1. **Sub-project 1 (Cloudinary→Blob migration) is complete.** The site must serve real images from Vercel Blob — without working images, layout audits produce false findings (broken-image placeholders push neighboring elements around).
2. `pnpm dev` must boot cleanly. If it doesn't, fix that first; it's not part of this plan.
3. The branch is up to date with `main` (or rebased on top of the merged migration branch).

### Tools required

- A modern Chromium browser (Chrome, Edge, or Brave) with DevTools — needed for responsive mode and Lighthouse.
- That's it. No new dependencies are added by this plan; everything is observation + small edits to existing components.

### Where things live

| Concern | Location |
|---------|----------|
| Page entry points | `app/<page>/page.tsx` (or `app/page.tsx` for `/`) |
| Section components | `components/sections/*.tsx` |
| Header / Footer | `components/layout/Header.tsx`, `components/sections/Footer.tsx` |
| Global theme + breakpoints | `app/globals.css` (Tailwind 4 `@theme` block) |
| Shared UI atoms | `components/ui/*.tsx` |
| Asset map | `lib/assets.ts` (post-migration) |

---

## Audit Reference (read once, used by every audit task)

This reference is shared by Tasks 2–6. The actual per-page audit tasks reference these definitions instead of repeating them.

### Viewports (13 total)

The 13 widths to audit at, in this order:

| Tier | Width (px) | Representative device |
|------|-----------|------------------------|
| Mobile narrow | 360 | Galaxy S+ low end |
| Mobile narrow | 375 | iPhone SE / 13 mini |
| Mobile narrow | 390 | iPhone 14 |
| Mobile wide | 414 | iPhone Plus |
| Mobile wide | 430 | iPhone 14 Pro Max |
| Tablet | 768 | iPad mini portrait |
| Tablet | 820 | iPad Air portrait |
| Tablet | 1024 | iPad Pro / small laptop |
| Desktop | 1280 | 13" laptop |
| Desktop | 1440 | MBP 14" |
| Desktop | 1536 | MBP 16" |
| Desktop | 1920 | Full HD |
| Large desktop | 2560 | QHD / 27" 1440p monitor |

### How to set a precise viewport in Chrome DevTools

1. Open the page in Chrome
2. F12 to open DevTools
3. Toggle Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
4. In the device dropdown select "Responsive"
5. Click the dimensions field at the top, type the width, press Tab — height stays as-is
6. Set DPR to 2 (mobile) or 1 (desktop) to match the listed device
7. Scroll the entire page top-to-bottom; do not stop at the first fold

### 10 checks per viewport

For each (page, viewport) pair, observe:

1. **Horizontal overflow** — drag scrollbar horizontally; nothing should scroll. Most common bug.
2. **Element overlap** — sticky header overlapping content, image overlapping text, two siblings colliding
3. **Text wrapping** — headlines don't break mid-word, body text doesn't have orphans, line lengths are 45–80ch where possible
4. **Hit targets on mobile** (≤ 768 px widths only) — every clickable target measures ≥ 44 × 44 CSS pixels (use the DevTools "Inspect" tool's measurement overlay)
5. **Header behavior** — the hamburger threshold is sensible (no awkward in-between states), the logo doesn't crowd the menu, mobile menu (when open) covers content cleanly
6. **Hero scaling** — `text-hero` and `text-display` `clamp()` values look reasonable; no pixelation, no tiny floor, no cartoonishly large ceiling
7. **Gallery sections** — Portfolio marquee, BeforeAfterGallery, ProcessGallerySection, ClassroomGallerySection, StudioSpaceSection, TeamGridSection: no broken aspect ratios, no images overflowing tiles, no gaps where an image is missing, marquee animations don't stutter
8. **Footer alignment** — columns reflow predictably (multi-column on desktop, stacked on mobile, no orphan columns at intermediate widths)
9. **Sticky / fixed elements** — `Preloader`, `ScrollProgress`, `MagneticButton`, any `position: fixed` element doesn't trap content or overlap actionable areas
10. **Animation resize behavior** — resize the viewport while a GSAP `ScrollTrigger` is mid-flight. Elements should not be left at intermediate transform states. Refreshing the page at the new width should always render correctly.

### Findings file format

The audit log lives at `docs/audits/2026-04-30-responsive-audit.md`. New findings are appended; existing entries are not edited (preserves audit trail). Use this exact format:

```markdown
## /<page>/ at <width>px

### [<severity>] <one-line description>

- **Page:** /<page>/
- **Viewport:** <width>px
- **Component:** <ComponentName>.tsx (or "Header" / "Footer" / "global")
- **Category:** <one of the 10 categories>
- **Repro:** Resize to <width>px wide, scroll to <section>. Observe <specific thing>.
- **Expected:** <what should happen>
- **Actual:** <what actually happens>
- **Screenshot:** docs/audits/screenshots/<page>-<width>-<descriptor>.png (optional but recommended for visual issues)
```

Severity values: `critical` (content unreadable / unreachable / clipped), `major` (visible polish problem), `minor` (nitpick).

### Severity decision table

| Looks like | Severity |
|------------|----------|
| Text or button is cut off and unreachable | critical |
| Element overflows viewport causing horizontal scroll | critical |
| Two clickable elements physically overlap | critical |
| Color contrast on text fails WCAG AA | critical |
| Header obscures content under it | major |
| Image stretches and looks distorted | major |
| Touch target between 32–44 px on mobile | major |
| Visible misalignment (column not flush, weird gap) | major |
| Spacing inconsistency that an attentive viewer notices | major |
| Slight 1–2 px misalignment most users won't see | minor |
| Animation timing feels off | minor |
| Headline could break differently for nicer rag | minor |

### Screenshots (optional but recommended)

Capture screenshots for any `critical` or `major` finding using DevTools Capture Screenshot (Ctrl+Shift+P → "Capture full size screenshot"). Save to `docs/audits/screenshots/` with naming `<page>-<width>-<descriptor>.png` — e.g. `team-768-portrait-overflow.png`.

---

## File Structure

### New files
- `docs/audits/2026-04-30-responsive-audit.md` — appendable findings log
- `docs/audits/screenshots/` — directory for audit screenshots

### Modified files (during fix waves)
The set is determined by audit findings. The most likely candidates:
- `components/layout/Header.tsx` — hamburger threshold, logo sizing
- `components/sections/Footer.tsx` — column layout
- `components/sections/HeroSection.tsx`, `InnerPageHero.tsx` — hero scaling
- `components/sections/PortfolioSection.tsx`, `BeforeAfterGallery.tsx`, `ClassroomGallerySection.tsx`, `ProcessGallerySection.tsx`, `StudioSpaceSection.tsx`, `TeamGridSection.tsx` — gallery layout
- `components/sections/CTASection.tsx`, `StatsSection.tsx`, `TeamValuesSection.tsx`, `ServiceMenuSection.tsx`, `ServiceTiersSection.tsx`, `ExperienceTimelineSection.tsx` — section-specific issues
- `app/globals.css` — only if a fix needs a new breakpoint or a global token change
- `app/<page>/page.tsx` — only if the issue is at the page composition level

---

## Task 1: Set up audit infrastructure

**Files:**
- Create: `docs/audits/2026-04-30-responsive-audit.md`
- Create: `docs/audits/screenshots/.gitkeep`

- [ ] **Step 1: Create the audit log skeleton**

Create `docs/audits/2026-04-30-responsive-audit.md` with this exact content:

```markdown
# Responsive Audit — 2026-04-30

Findings from the 5-page × 13-viewport audit defined in `docs/superpowers/plans/2026-04-30-responsive-audit-and-polish.md`.

Findings are appended in audit order (page-by-page, then viewport ascending within page). Severities: `critical`, `major`, `minor`.

## Audit progress

- [ ] / (homepage)
- [ ] /about
- [ ] /academy
- [ ] /services
- [ ] /team

## Findings
```

- [ ] **Step 2: Create the screenshots directory**

```bash
mkdir -p docs/audits/screenshots
touch docs/audits/screenshots/.gitkeep
```

- [ ] **Step 3: Verify dev server boots**

```bash
pnpm dev
```

Expected: server starts on http://localhost:3000 with no errors. Hit Ctrl+C to stop. (Server will be re-started during audit tasks.)

- [ ] **Step 4: Commit**

```bash
git add docs/audits/
git commit -m "chore(audit): scaffold responsive audit log + screenshots dir"
```

---

## Task 2: Audit / (homepage)

**Files:**
- Modify (append only): `docs/audits/2026-04-30-responsive-audit.md`
- Add (as needed): `docs/audits/screenshots/home-*.png`

- [ ] **Step 1: Start dev server**

```bash
pnpm dev
```

Open http://localhost:3000 in Chrome.

- [ ] **Step 2: Open DevTools responsive mode**

F12 → toggle device toolbar (Cmd/Ctrl+Shift+M) → select "Responsive" from the device dropdown.

- [ ] **Step 3: Walk all 13 viewports**

For each width in this exact order — 360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440, 1536, 1920, 2560 — set the viewport, scroll the entire page top-to-bottom, and run the 10 checks (see "Audit Reference" section above this task list).

The homepage sections to walk past, in render order: HeroSection, IntroSection, PortfolioSection (marquee), DifferentiationSection, FounderSection, AcademyPreviewSection (if present), CTASection, Footer.

Pay special attention to:
- HeroSection's full-bleed video background scaling
- PortfolioSection marquee — does it pause on hover, does it overflow at narrow widths
- Header transitions (it's likely sticky)
- Cross-cutting: the global Preloader, ScrollProgress, any magnetic buttons

- [ ] **Step 4: Record findings**

For every issue observed, append a finding to `docs/audits/2026-04-30-responsive-audit.md` using the format defined in the Audit Reference section. Capture a screenshot for `critical` and `major` items into `docs/audits/screenshots/home-<width>-<descriptor>.png`.

- [ ] **Step 5: Mark page complete in audit log**

Edit the "Audit progress" section in `docs/audits/2026-04-30-responsive-audit.md` and check off the homepage box: `- [x] / (homepage)`.

- [ ] **Step 6: Stop dev server, commit**

Ctrl+C the dev server. Then:

```bash
git add docs/audits/
git commit -m "audit: homepage responsive findings (13 viewports)"
```

---

## Task 3: Audit /about

**Files:**
- Modify (append only): `docs/audits/2026-04-30-responsive-audit.md`
- Add (as needed): `docs/audits/screenshots/about-*.png`

- [ ] **Step 1: Start dev server, open /about**

```bash
pnpm dev
```

Open http://localhost:3000/about in Chrome with DevTools responsive mode (Cmd/Ctrl+Shift+M).

- [ ] **Step 2: Walk all 13 viewports**

Same 13-viewport order as Task 2 (360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440, 1536, 1920, 2560). Apply the 10 checks from the Audit Reference at every viewport.

`/about` sections in render order: InnerPageHero, OriginStorySection, CoreValuesDeepDive, StudioSpaceSection (6-image grid), PraxStandardSection, CTASection, Footer.

Pay special attention to:
- StudioSpaceSection 6-image grid — at 768 it likely shifts from 3 columns to 2; at 414 it likely stacks
- Background number "01", "02", "03" in CoreValuesDeepDive — does it overlap text on narrow widths
- Founder portrait + story split — at what width does it stack vertically

- [ ] **Step 3: Record findings**

Append findings to `docs/audits/2026-04-30-responsive-audit.md` per the Audit Reference format. Save screenshots as `docs/audits/screenshots/about-<width>-<descriptor>.png`.

- [ ] **Step 4: Mark page complete**

Check off `- [x] /about` in the audit log's progress section.

- [ ] **Step 5: Commit**

```bash
git add docs/audits/
git commit -m "audit: /about responsive findings (13 viewports)"
```

---

## Task 4: Audit /academy

**Files:**
- Modify (append only): `docs/audits/2026-04-30-responsive-audit.md`
- Add (as needed): `docs/audits/screenshots/academy-*.png`

- [ ] **Step 1: Start dev server, open /academy**

```bash
pnpm dev
```

Open http://localhost:3000/academy in Chrome with DevTools responsive mode.

- [ ] **Step 2: Walk all 13 viewports**

Apply the same 13-viewport walk and 10-check sequence from the Audit Reference.

`/academy` sections in render order: InnerPageHero (with academy video), AcademyPhilosophySection, AcademyProgramsSection, ClassroomGallerySection (8 images), SkoolCommunitySection, FAQSection, CTASection, Footer.

Pay special attention to:
- Academy video background — autoplay/muted/loop behavior, scaling at 2560
- ClassroomGallerySection 8-image grid — at 768 likely 2-up, at 414 likely 1-up; check the 1024 transition specifically
- FAQSection accordion behavior — keyboard expand/collapse, animation reflow

- [ ] **Step 3: Record findings**

Append findings to the audit log. Screenshots as `docs/audits/screenshots/academy-<width>-<descriptor>.png`.

- [ ] **Step 4: Mark page complete**

Check off `- [x] /academy` in the audit log's progress section.

- [ ] **Step 5: Commit**

```bash
git add docs/audits/
git commit -m "audit: /academy responsive findings (13 viewports)"
```

---

## Task 5: Audit /services

**Files:**
- Modify (append only): `docs/audits/2026-04-30-responsive-audit.md`
- Add (as needed): `docs/audits/screenshots/services-*.png`

- [ ] **Step 1: Start dev server, open /services**

```bash
pnpm dev
```

Open http://localhost:3000/services in Chrome with DevTools responsive mode.

- [ ] **Step 2: Walk all 13 viewports**

`/services` sections in render order: InnerPageHero (with services hero image background), ServiceTiersSection (3 pricing cards), HonestySection, DifferentiationSection, ProcessGallerySection (3 stages), ExperienceTimelineSection (4-step), BeforeAfterGallery (horizontal scroll), CTASection, Footer.

Pay special attention to:
- ServiceTiersSection — 3 cards. At 1024 it's likely 3 columns, at 768 likely 2+1 or 1+2, at 414 stacked. Verify the transition is clean.
- ExperienceTimelineSection — vertical timeline with step markers. Check that the connecting line stays attached to step circles at every width.
- BeforeAfterGallery horizontal scroll — does scroll snap work, does the gallery overflow at the right edge cleanly, does the gallery contain its content vertically.
- Pricing labels ("$150", "$200", "$50") — must remain readable at every width.

- [ ] **Step 3: Record findings**

Append findings to the audit log. Screenshots as `docs/audits/screenshots/services-<width>-<descriptor>.png`.

- [ ] **Step 4: Mark page complete**

Check off `- [x] /services` in the audit log's progress section.

- [ ] **Step 5: Commit**

```bash
git add docs/audits/
git commit -m "audit: /services responsive findings (13 viewports)"
```

---

## Task 6: Audit /team

**Files:**
- Modify (append only): `docs/audits/2026-04-30-responsive-audit.md`
- Add (as needed): `docs/audits/screenshots/team-*.png`

- [ ] **Step 1: Start dev server, open /team**

```bash
pnpm dev
```

Open http://localhost:3000/team in Chrome with DevTools responsive mode.

- [ ] **Step 2: Walk all 13 viewports**

`/team` sections in render order: InnerPageHero, TeamGridSection (5–6 members with portrait + action shot + work samples), TeamValuesSection, StatsSection, CTASection, Footer.

Pay special attention to:
- TeamGridSection alternating left/right portrait layout — at what width does it stop alternating and start stacking? Does the "right" variant flip correctly?
- Work sample sub-grids per team member (Jack: 4 images, Gavin: 4, Steven: 4, Ariel: 3, Jared: 2) — varying counts must each look right; uneven counts (3 images) are highest risk
- StatsSection — "500+ barbers, 7 cities, 12+ years" numbers; do they wrap onto multiple lines at narrow widths in a readable way

- [ ] **Step 3: Record findings**

Append findings to the audit log. Screenshots as `docs/audits/screenshots/team-<width>-<descriptor>.png`.

- [ ] **Step 4: Mark page complete**

Check off `- [x] /team` in the audit log's progress section.

- [ ] **Step 5: Commit**

```bash
git add docs/audits/
git commit -m "audit: /team responsive findings (13 viewports)"
```

---

## Task 7: Triage findings into fix waves

**Files:**
- Modify: `docs/audits/2026-04-30-responsive-audit.md`

- [ ] **Step 1: Add the triage summary to the audit log**

Open `docs/audits/2026-04-30-responsive-audit.md`. After the "Findings" section, add a new top-level section:

```markdown
## Triage summary

### Cross-cutting (header / footer / global)
<list every critical and major finding whose Component is "Header", "Footer", or "global". Bullet format: severity, page(s) where seen, viewport(s), one-line description.>

### Per-page (critical + major only)
- **/ (homepage):** <count> findings to fix
- **/about:** <count>
- **/academy:** <count>
- **/services:** <count>
- **/team:** <count>

### Minor (deferred)
<list of minor findings; these become a follow-up issue list, not fixed in this plan.>

### Triage statistics
- Total findings: <N>
- Critical: <N>
- Major: <N>
- Minor: <N>
- Cross-cutting: <N>
- Page-specific: <N>
```

Fill in counts and lists from the actual findings recorded in Tasks 2–6.

- [ ] **Step 2: Verify counts match**

Manually count the actual findings in the document — sum across all per-page sections and the cross-cutting bucket should equal the totals stated in the triage summary.

- [ ] **Step 3: Commit**

```bash
git add docs/audits/2026-04-30-responsive-audit.md
git commit -m "audit: triage findings into critical/major/minor + cross-cutting"
```

---

## Task 8: Fix wave 0 — cross-cutting (Header, Footer, global)

**Files:**
- Modify: depends on findings; most likely `components/layout/Header.tsx`, `components/sections/Footer.tsx`, `app/globals.css`

**Why first:** Header and Footer render on every page. Fixing them once eliminates that bug from all 5 pages at once. Doing this BEFORE per-page waves means we don't re-test the same header bug five times.

- [ ] **Step 1: Read the cross-cutting bucket from the audit log**

Open `docs/audits/2026-04-30-responsive-audit.md`. Read the "Cross-cutting" section of the triage summary. Extract every `critical` and `major` finding tagged Header / Footer / global.

- [ ] **Step 2: For each cross-cutting finding, work this loop**

For finding number 1 of N:

1. Re-open the page in DevTools at the exact viewport width listed in the finding's Repro.
2. Scroll to the section described in the Repro to observe the bug.
3. Identify the smallest possible fix. Examples:
   - Tailwind class change: add/remove a `md:`, `lg:`, `xl:` modifier
   - Container width / padding adjustment
   - `flex-wrap` toggle
   - Hidden `<br>` removal
   - Conditional render based on viewport (use Tailwind responsive utilities, not JS)
4. Apply the fix in the relevant component file using the Edit tool.
5. Hot reload — Next.js dev server picks up changes automatically. Confirm the bug at the original viewport.
6. Test at the next viewport tier wider AND narrower (regression check).
7. Stage and commit just this one fix:

```bash
git add components/<file-touched>.tsx
git commit -m "fix(<component>): <one-line description from the finding>

Resolves: <severity> finding at <page> @ <width>px
Audit: docs/audits/2026-04-30-responsive-audit.md"
```

8. Mark the finding addressed in the audit log: change the `### [<severity>]` heading to `### [<severity>] [FIXED <commit-sha>]`. Do not delete the finding — preserve the audit trail.

Repeat for findings 2..N.

- [ ] **Step 3: Smoke-test all 5 pages at 3 representative viewports**

For 375 (mobile narrow), 1024 (tablet), 1920 (desktop), open each of the 5 pages in DevTools. Confirm that the Header and Footer no longer have any of the originally-listed cross-cutting issues. No new regressions visible.

If a regression is found: write a NEW finding for it in the audit log (do not modify existing entries), and fix it before moving on.

- [ ] **Step 4: Stage and commit any audit-log updates**

```bash
git add docs/audits/2026-04-30-responsive-audit.md
git commit -m "audit: mark cross-cutting findings fixed (wave 0)"
```

---

## Task 9: Fix wave 1 — homepage (/) page-specific

**Files:**
- Modify: depends on findings; most likely sections under `components/sections/` referenced by `app/page.tsx`

- [ ] **Step 1: Read homepage findings from the audit log**

Filter `docs/audits/2026-04-30-responsive-audit.md` for findings where `Page` is `/` and severity is `critical` or `major`. Skip anything in the cross-cutting bucket (already fixed in Task 8).

- [ ] **Step 2: For each homepage finding, work the same loop as Task 8 Step 2**

For finding number 1 of N:

1. Open / in DevTools at the finding's listed width.
2. Scroll to the section described.
3. Apply the smallest possible fix to the relevant section component (most likely under `components/sections/`).
4. Hot reload, verify at original viewport.
5. Test at next-wider and next-narrower tiers (regression check).
6. Commit just this fix:

```bash
git add components/sections/<file>.tsx
git commit -m "fix(<section>): <one-line description>

Resolves: <severity> finding at / @ <width>px
Audit: docs/audits/2026-04-30-responsive-audit.md"
```

7. Mark in audit log: append `[FIXED <sha>]` to the heading. Do not delete.

Repeat for findings 2..N.

- [ ] **Step 3: Re-walk / at all 13 viewports**

Open the homepage. At each of the 13 widths (360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440, 1536, 1920, 2560) scroll top-to-bottom. Confirm no critical or major issues remain. If any new ones appear, add them as new findings (don't edit old ones) and fix.

- [ ] **Step 4: Commit audit-log updates**

```bash
git add docs/audits/2026-04-30-responsive-audit.md
git commit -m "audit: mark homepage findings fixed (wave 1)"
```

---

## Task 10: Fix wave 2 — /about

**Files:**
- Modify: depends on findings; most likely `components/sections/InnerPageHero.tsx`, `OriginStorySection.tsx`, `CoreValuesDeepDive.tsx`, `StudioSpaceSection.tsx`, `PraxStandardSection.tsx`

- [ ] **Step 1: Read /about findings**

Filter the audit log for `Page = /about`, severity `critical` or `major`, not in cross-cutting bucket.

- [ ] **Step 2: For each /about finding, apply the fix loop**

For finding 1 of N:

1. Open /about at the finding's width.
2. Scroll to the section in the Repro.
3. Apply minimal fix in the relevant `components/sections/<section>.tsx` file.
4. Hot reload, verify at original viewport.
5. Test at next-wider and next-narrower tiers.
6. Commit:

```bash
git add components/sections/<file>.tsx
git commit -m "fix(<section>): <one-line description>

Resolves: <severity> finding at /about @ <width>px
Audit: docs/audits/2026-04-30-responsive-audit.md"
```

7. Mark `[FIXED <sha>]` in audit log.

Repeat for findings 2..N.

- [ ] **Step 3: Re-walk /about at all 13 viewports**

Confirm zero remaining critical/major. Record any new findings as new entries.

- [ ] **Step 4: Commit audit-log updates**

```bash
git add docs/audits/2026-04-30-responsive-audit.md
git commit -m "audit: mark /about findings fixed (wave 2)"
```

---

## Task 11: Fix wave 3 — /academy

**Files:**
- Modify: depends on findings; most likely `components/sections/AcademyPhilosophySection.tsx`, `AcademyProgramsSection.tsx`, `ClassroomGallerySection.tsx`, `SkoolCommunitySection.tsx`, `FAQSection.tsx`

- [ ] **Step 1: Read /academy findings**

Filter the audit log for `Page = /academy`, severity `critical` or `major`, not in cross-cutting bucket.

- [ ] **Step 2: For each /academy finding, apply the fix loop**

For finding 1 of N:

1. Open /academy at the finding's width.
2. Scroll to the section in the Repro.
3. Apply minimal fix in the relevant `components/sections/<section>.tsx` file.
4. Hot reload, verify at original viewport.
5. Test at next-wider and next-narrower tiers.
6. Commit:

```bash
git add components/sections/<file>.tsx
git commit -m "fix(<section>): <one-line description>

Resolves: <severity> finding at /academy @ <width>px
Audit: docs/audits/2026-04-30-responsive-audit.md"
```

7. Mark `[FIXED <sha>]` in audit log.

Repeat for findings 2..N.

- [ ] **Step 3: Re-walk /academy at all 13 viewports**

Confirm clean. Record any new findings.

- [ ] **Step 4: Commit audit-log updates**

```bash
git add docs/audits/2026-04-30-responsive-audit.md
git commit -m "audit: mark /academy findings fixed (wave 3)"
```

---

## Task 12: Fix wave 4 — /services

**Files:**
- Modify: depends on findings; most likely `components/sections/ServiceTiersSection.tsx`, `HonestySection.tsx`, `DifferentiationSection.tsx`, `ProcessGallerySection.tsx`, `ExperienceTimelineSection.tsx`, `BeforeAfterGallery.tsx`

- [ ] **Step 1: Read /services findings**

Filter the audit log for `Page = /services`, severity `critical` or `major`, not in cross-cutting bucket.

- [ ] **Step 2: For each /services finding, apply the fix loop**

For finding 1 of N:

1. Open /services at the finding's width.
2. Scroll to the section in the Repro.
3. Apply minimal fix in the relevant `components/sections/<section>.tsx` file.
4. Hot reload, verify.
5. Test at next-wider and next-narrower tiers.
6. Commit:

```bash
git add components/sections/<file>.tsx
git commit -m "fix(<section>): <one-line description>

Resolves: <severity> finding at /services @ <width>px
Audit: docs/audits/2026-04-30-responsive-audit.md"
```

7. Mark `[FIXED <sha>]` in audit log.

Repeat.

- [ ] **Step 3: Re-walk /services at all 13 viewports**

Confirm clean.

- [ ] **Step 4: Commit audit-log updates**

```bash
git add docs/audits/2026-04-30-responsive-audit.md
git commit -m "audit: mark /services findings fixed (wave 4)"
```

---

## Task 13: Fix wave 5 — /team

**Files:**
- Modify: depends on findings; most likely `components/sections/TeamGridSection.tsx`, `TeamValuesSection.tsx`, `StatsSection.tsx`

- [ ] **Step 1: Read /team findings**

Filter the audit log for `Page = /team`, severity `critical` or `major`, not in cross-cutting bucket.

- [ ] **Step 2: For each /team finding, apply the fix loop**

For finding 1 of N:

1. Open /team at the finding's width.
2. Scroll to the section in the Repro.
3. Apply minimal fix.
4. Hot reload, verify.
5. Test at next-wider and next-narrower tiers.
6. Commit:

```bash
git add components/sections/<file>.tsx
git commit -m "fix(<section>): <one-line description>

Resolves: <severity> finding at /team @ <width>px
Audit: docs/audits/2026-04-30-responsive-audit.md"
```

7. Mark `[FIXED <sha>]` in audit log.

Repeat.

- [ ] **Step 3: Re-walk /team at all 13 viewports**

Confirm clean.

- [ ] **Step 4: Commit audit-log updates**

```bash
git add docs/audits/2026-04-30-responsive-audit.md
git commit -m "audit: mark /team findings fixed (wave 5)"
```

---

## Task 14: Final verification — re-audit + Lighthouse + production build

**Files:**
- Modify (append only): `docs/audits/2026-04-30-responsive-audit.md`

- [ ] **Step 1: Run a full re-audit at 3 representative viewports across all pages**

Use widths 375 (mobile), 1024 (tablet), 1920 (desktop). Open each of the 5 pages at each width. Record any newly-spotted critical or major issues at the bottom of the audit log under a new heading:

```markdown
## Re-audit findings (Task 14)

<list new findings here, or write "Zero new critical/major findings observed.">
```

If any new critical/major findings appear, fix them by repeating the relevant wave loop from Task 8–13, then re-run this step. Do not proceed to Step 2 until zero new critical/major remain.

- [ ] **Step 2: Run Lighthouse on a production build**

Build the production bundle:

```bash
pnpm build
```

Expected: `✓ Compiled successfully`. Record any warnings.

Start production server:

```bash
pnpm start
```

In Chrome, open http://localhost:3000. DevTools → Lighthouse tab. Configure:
- Mode: Navigation (Default)
- Device: Mobile
- Categories: Performance, Accessibility, Best Practices, SEO
- Click "Analyze page load"

Wait for the report. Record the four scores. Repeat for /about, /academy, /services, /team.

Then repeat all five with Device: Desktop.

That's 5 pages × 2 form factors = 10 Lighthouse runs. Capture the scores in this format and append to the audit log:

```markdown
## Lighthouse final scores (Task 14, production build)

| Page | Form factor | Performance | Accessibility | Best Practices | SEO |
|------|-------------|-------------|---------------|----------------|-----|
| / | Mobile | <N> | <N> | <N> | <N> |
| / | Desktop | <N> | <N> | <N> | <N> |
| /about | Mobile | <N> | <N> | <N> | <N> |
| /about | Desktop | <N> | <N> | <N> | <N> |
| /academy | Mobile | <N> | <N> | <N> | <N> |
| /academy | Desktop | <N> | <N> | <N> | <N> |
| /services | Mobile | <N> | <N> | <N> | <N> |
| /services | Desktop | <N> | <N> | <N> | <N> |
| /team | Mobile | <N> | <N> | <N> | <N> |
| /team | Desktop | <N> | <N> | <N> | <N> |

Budget: ≥ 90 across all four categories. Any score < 90 must be addressed before declaring done.
```

- [ ] **Step 3: Verify the budget**

Every score in the table must be ≥ 90.

If any score is < 90: open Lighthouse's report for that page/form factor, identify which audit failed (look for red/orange items), and address them with targeted fixes following the same fix-loop pattern (commit per fix, audit log notation). Re-run Lighthouse for that page/form factor after each fix until ≥ 90.

If a score < 90 cannot be brought up without exceeding scope (e.g., requires a third-party script change), document the exception in the audit log with rationale and proceed.

- [ ] **Step 4: Stop production server, run `pnpm build` once more for final confirmation**

Ctrl+C the production server. Then:

```bash
pnpm build
```

Expected: `✓ Compiled successfully` with zero warnings. If warnings exist, fix or document each.

- [ ] **Step 5: Commit final audit log**

```bash
git add docs/audits/2026-04-30-responsive-audit.md
git commit -m "audit: final verification — Lighthouse scores + clean re-audit

All critical and major findings resolved. Lighthouse ≥ 90 across all
pages/categories on production build. Sub-project 2 complete."
```

- [ ] **Step 6: Verify success criteria**

Manual check — confirm all of the following:
- [ ] The audit log lists every finding with either `[FIXED <sha>]` annotation or in the minor-deferred bucket
- [ ] Re-audit produced zero new critical/major findings
- [ ] All 10 Lighthouse score cells in the table are ≥ 90
- [ ] `pnpm build` is clean
- [ ] Working tree is clean (`git status` shows nothing modified)

If any item fails, return to the relevant earlier task; do not declare the plan complete.

---

## Self-Review (already performed)

**1. Spec coverage:** Each section/requirement of `docs/superpowers/specs/2026-04-30-site-polish-and-asset-workflow-design.md` sub-project 2 maps to a task —
- Audit methodology (Audit Reference + Tasks 2–6)
- Issue categorization (severity decision table + Task 7)
- Fix strategy (Tasks 8–13, one wave per page + cross-cutting)
- Verification (Task 14: re-audit + Lighthouse + budget check)
- Performance budget (Task 14 Step 3 enforces ≥ 90)
- "Production ready" criteria (Task 14 Step 6 manual check covers all sub-project-2 criteria from the spec)

**2. Placeholder scan:** No `TBD`, `TODO`, or vague directives. The fix-wave tasks describe a deterministic LOOP applied to a known list (the audit findings) — that's a pattern, not a placeholder. Each task instance has concrete Steps and exact commit message templates with substitution slots for finding-specific details.

**3. Type / property consistency:** Component names referenced in fix-wave tasks (TeamGridSection, ServiceTiersSection, ClassroomGallerySection, etc.) are real files in `components/sections/`. Audit log path is consistent throughout. Severity values consistent (critical, major, minor).

---

## Out of scope (per spec)

- Adding new pages or sections
- Component redesigns
- New animations or scroll effects
- Backend / API work
- Third-party integration changes
- Image quality re-tuning
- Accessibility deep-dive (axe-core scans, screen reader testing) — captured as follow-up
- Internationalization
- Cloudinary account deletion

## Estimated effort

| Phase | Tasks | Effort |
|-------|-------|--------|
| Setup | Task 1 | 5 min |
| Audit | Tasks 2–6 | ~30 min per page × 5 = 2.5 hours |
| Triage | Task 7 | 15 min |
| Fix waves | Tasks 8–13 | depends on findings; estimate 10–20 min per finding, typical site has 30–60 critical/major → 5–20 hours |
| Verification | Task 14 | 1 hour |
| **Total** | **14 tasks** | **9–24 hours of focused work** depending on issue density |

The audit phase is bounded; the fix phase has wide variance based on what's actually found.
