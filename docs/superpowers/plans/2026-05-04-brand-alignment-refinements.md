# Brand Alignment Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing "Ink & Bone" design system on the marketing site so it shares clear visual DNA with the `prax-academy` repo (same brand) without losing the editorial/serif voice that distinguishes the studio site. Strip GSAP usage where lighter alternatives match the academy's restraint, port academy's floating-pill nav, consolidate the color palette, and add a monospace face for technical labels.

**Architecture:** No font or palette migration on the main site — Cormorant Garamond, PP Neue Montreal, and OKLCH "Ink & Bone" stay as the foundation. Refinements are surgical: replace per-section GSAP fade-ups with an IntersectionObserver-driven `FadeIn` component (ported from `prax-academy`), port the floating-pill nav pattern, audit OKLCH usage to consolidate to the 5–6 shades that earn their keep, and add IBM Plex Mono (or equivalent) for label-style typography. The academy site, when its content is built out, adopts the same fonts/palette while keeping its minimalist layout — different "voices" within one brand kit.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS 4 (`@theme`), GSAP + Lenis (scoped down by this plan), Inter / IBM Plex Mono (added by this plan).

**Spec reference:** `docs/superpowers/specs/2026-04-30-site-polish-and-asset-workflow-design.md` (sub-project 4 — added by this plan).

---

## Pre-flight

### Hard pre-requisites

1. Sub-project 1 (Cloudinary→Blob migration) **complete** — already done via the placeholder approach (`3bcad6e`)
2. Real assets uploaded for at least the high-leverage keys (logos, team portraits, hero video) — visual changes need real visuals to evaluate
3. Sub-project 2 (responsive audit + polish) is **completed for fix-waves 1–5** but **not yet final-verified**. Brand alignment is a polish layer on top of fix waves; we run final verification (Lighthouse, etc.) once after both finish

### Reference assets in this repo

- Current main site theme: `app/globals.css` (`@theme` block — colors, fonts, type scale)
- Current main site nav: `components/layout/Header.tsx`
- Current scroll animation patterns: `components/sections/*.tsx` use `gsap.to(...)` with `ScrollTrigger`; common pattern is fade-ups on section reveal
- Reference (academy): `/home/miko_node_001/repos/prax-academy/src/app/components/FadeIn.tsx` (IO-based fade-up, 30 LOC) and `Nav.tsx` (floating pill, frosted glass on scroll)

---

## File Structure

### New files

- `components/ui/FadeIn.tsx` — IntersectionObserver-based fade-up component, ported and adapted from prax-academy
- `lib/fonts.ts` — centralizes font loader declarations (currently scattered in `app/layout.tsx`)

### Modified files

- `app/globals.css` — add IBM Plex Mono `--font-mono` token; consolidate unused color tokens
- `app/layout.tsx` — load IBM Plex Mono via `next/font/google`
- `components/layout/Header.tsx` — restyle to floating-pill pattern with frosted glass on scroll
- Multiple `components/sections/*.tsx` — replace inline GSAP fade-up patterns with `<FadeIn>` (per Task 2 inventory)

### No migration

- Fonts (Cormorant Garamond, PP Neue Montreal) — kept
- Palette base (OKLCH "Ink & Bone") — kept; only consolidated, not replaced
- GSAP — kept for genuine scroll-triggered moments (hero scaling, marquee, complex sequenced animations); only blanket fade-ups are replaced

---

## Task 1: Inventory current GSAP fade-up usage

**Files (Read only):**
- `components/sections/*.tsx`

**Why:** We need to know which animations are simple fade-ups (replaceable with `FadeIn`) versus genuine GSAP-only effects (scroll-pinned, scrubbed, sequenced). This audit drives Task 2's scope.

- [ ] **Step 1: Generate the inventory**

```bash
grep -nE "gsap\.(from|to|fromTo)|ScrollTrigger" components/sections/*.tsx components/ui/*.tsx \
  | grep -v "node_modules" \
  > docs/audits/gsap-usage-inventory.txt
```

- [ ] **Step 2: Categorize each match**

Open `docs/audits/gsap-usage-inventory.txt` and annotate every line as one of:
- `[fade-up]` — simple fade + translate on viewport enter; replaceable by `<FadeIn>`
- `[scrub]` — scroll-scrubbed (e.g., scale on scroll, parallax); keep GSAP
- `[pin]` — pinned section; keep GSAP
- `[sequence]` — multi-step timeline; keep GSAP
- `[marquee]` — infinite horizontal scroll; keep GSAP

Edit the file in place to add the tag at the start of each line.

- [ ] **Step 3: Commit the audit**

```bash
git add docs/audits/gsap-usage-inventory.txt
git commit -m "audit: inventory GSAP usage — categorize fade-up vs keep"
```

Expected outcome: a known list of N call sites tagged `[fade-up]`, which Task 2 will migrate.

---

## Task 2: Port `FadeIn` from prax-academy

**Files:**
- Create: `components/ui/FadeIn.tsx`

**Why:** The academy's `FadeIn` is a 30-LOC IntersectionObserver pattern that matches the visual outcome of most GSAP fade-ups while being far lighter. Port it adapted to our component conventions.

- [ ] **Step 1: Create `components/ui/FadeIn.tsx`**

```typescript
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn, prefersReducedMotion } from '@/lib/utils';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms (useful for sibling elements). */
  delay?: number;
  /** Translation distance in px (default 24). */
  distance?: number;
  /** Once-only reveal (default true). If false, re-fades on re-entry. */
  once?: boolean;
  /** Threshold of element visibility before triggering (0-1, default 0.05). */
  threshold?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  distance = 24,
  once = true,
  threshold = 0.05,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
          }, delay);
          if (once) observer.disconnect();
        } else if (!once) {
          el.style.opacity = '0';
          el.style.transform = `translateY(${distance}px) scale(0.99)`;
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, distance, once, threshold]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: 0,
        transform: `translateY(${distance}px) scale(0.99)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: '1s',
        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
pnpm build 2>&1 | tail -5
```

Expected: build succeeds, no TS errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/FadeIn.tsx
git commit -m "feat(ui): add FadeIn IO component (ported from prax-academy)"
```

---

## Task 3: Migrate `[fade-up]` call sites to `<FadeIn>`

**Files:**
- Modify: every `components/sections/*.tsx` file flagged `[fade-up]` in Task 1's inventory

**Why:** Wholesale replace one of GSAP's most common usage patterns with a much lighter alternative. Bundle and runtime cost both drop.

- [ ] **Step 1: Read the inventory**

```bash
grep "\[fade-up\]" docs/audits/gsap-usage-inventory.txt
```

- [ ] **Step 2: For each tagged call site, work this loop**

For each `[fade-up]` entry (from Task 1):

1. Open the component
2. Identify the wrapper element that's animated (usually a `<div ref={someRef}>`)
3. Replace the `useEffect` + `gsap.from(...)` block with `<FadeIn>` wrapper:

   **Before:**
   ```tsx
   const headingRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
     if (!headingRef.current || prefersReducedMotion()) return;
     gsap.from(headingRef.current, {
       opacity: 0,
       y: 24,
       duration: 1,
       scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
     });
   }, []);

   return <div ref={headingRef}>...</div>;
   ```

   **After:**
   ```tsx
   import { FadeIn } from '@/components/ui/FadeIn';

   return <FadeIn>...</FadeIn>;
   ```

4. Remove the now-orphaned `useRef`, `useEffect`, and any unused `gsap` imports
5. Verify the visual reveal still works locally (`pnpm dev`)
6. Commit:

```bash
git add components/sections/<file>.tsx
git commit -m "refactor(<section>): replace GSAP fade-up with <FadeIn>"
```

- [ ] **Step 3: Verify nothing else regressed**

After all migrations:

```bash
pnpm build 2>&1 | tail -5
pnpm lint 2>&1 | tail -3
```

Expected: build green, lint clean.

- [ ] **Step 4: Bundle size delta**

```bash
pnpm build 2>&1 | grep "First Load JS"
```

Compare to baseline (171–178 KB per route on `feat/cloudinary-to-vercel-blob`'s last build). Expected: same or smaller. If larger, investigate.

---

## Task 4: Port floating-pill nav with frosted glass on scroll

**Files:**
- Modify: `components/layout/Header.tsx`

**Why:** The academy's nav pattern is more elegant than our current full-width sticky header — floating pill at top, transparent over hero, frosted glass once scrolled past the fold. Port it while keeping our existing nav links and CTA.

- [ ] **Step 1: Read current Header.tsx**

```bash
wc -l components/layout/Header.tsx
```

Note the line count — we want to confirm size hasn't ballooned post-refactor.

- [ ] **Step 2: Restyle Header with the pill pattern**

The structure should match academy's pattern (see `/home/miko_node_001/repos/prax-academy/src/app/components/Nav.tsx`) adapted with:
- Our existing nav items (Services / Team / About / Academy)
- Our existing CTA (booking link)
- Our `assets.textLogo` for the wordmark
- Our `prax-bone`/`prax-stone` color tokens instead of `white/[0.05]`

The two key behaviors:
1. `fixed top-4 left-1/2 -translate-x-1/2` for floating-centered position
2. Backdrop changes from transparent → `backdrop-blur-2xl` + subtle border on scroll past 50px

Specific CSS classes (adapted to Ink & Bone):

```tsx
// Replace background style on scrolled state:
scrolled
  ? 'bg-prax-bone/[0.04] backdrop-blur-2xl border border-prax-bone/[0.08]'
  : 'bg-transparent border border-transparent'
```

- [ ] **Step 3: Verify locally at all 13 audit viewports**

```bash
pnpm dev
```

Hit http://localhost:3000 and walk through 360, 768, 1024, 1280, 1920 widths. Confirm:
- Floating pill renders centered
- Scroll past 50px → frosted glass appears
- Mobile hamburger overlay still works
- Booking CTA reachable
- Nav doesn't overlap hero content at any width

- [ ] **Step 4: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "refactor(header): adopt floating-pill nav with frosted glass on scroll"
```

---

## Task 5: Audit and consolidate OKLCH palette

**Files:**
- Modify: `app/globals.css` (`@theme` block)

**Why:** The Ink & Bone palette has 8 named shades (`prax-ink`, `prax-black`, `prax-charcoal`, `prax-graphite`, `prax-white`, `prax-bone`, `prax-stone`, `prax-silver`) plus error/success. In practice, several may not be used. Consolidating reduces decision fatigue and makes the palette feel intentional.

- [ ] **Step 1: Find unused tokens**

```bash
for token in prax-ink prax-black prax-charcoal prax-graphite prax-white prax-bone prax-stone prax-silver prax-error prax-success; do
  count=$(grep -rn "$token" --include="*.tsx" --include="*.ts" --include="*.css" app/ components/ lib/ 2>/dev/null | grep -v "globals.css" | wc -l)
  echo "$count	$token"
done | sort -n
```

Tokens with count 0–2 are candidates for removal or merging.

- [ ] **Step 2: Decide consolidation**

Manually review the list. Typical decisions:
- Keep: tokens used 5+ times (these are load-bearing)
- Merge into nearest neighbor: tokens used 1–4 times that are visually adjacent (e.g., `prax-ink` and `prax-black` differ by 0.03 in lightness — pick one)
- Remove: tokens used 0 times

Document the decision in the audit log:

```bash
echo -e "## OKLCH palette consolidation (2026-05-04)\n" >> docs/audits/2026-04-30-responsive-audit.md
echo "Kept: <list>" >> docs/audits/2026-04-30-responsive-audit.md
echo "Merged: <merge-from> → <merge-to>" >> docs/audits/2026-04-30-responsive-audit.md
echo "Removed: <list>" >> docs/audits/2026-04-30-responsive-audit.md
```

- [ ] **Step 3: Apply removals/merges**

For each token being removed or merged, find-and-replace across the codebase:

```bash
# Example: merge prax-ink → prax-black
grep -rln "prax-ink" --include="*.tsx" --include="*.ts" --include="*.css" app/ components/ lib/ \
  | xargs sed -i 's/prax-ink/prax-black/g'
```

Then delete the token line from `app/globals.css`.

- [ ] **Step 4: Verify build still works**

```bash
pnpm build 2>&1 | tail -5
```

Expected: green build. If there's a CSS-specificity-related regression, address with explicit class fixes — do not roll back the consolidation.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css docs/audits/2026-04-30-responsive-audit.md \
        $(git diff --name-only HEAD)
git commit -m "refactor(theme): consolidate OKLCH palette to <N> load-bearing shades"
```

---

## Task 6: Add IBM Plex Mono for technical labels

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Why:** The academy uses IBM Plex Mono for utilitarian labels (timestamps, counts, captions, code-style metadata). The main site has nothing in this register. Adding it gives us a typographic tool for moments where serif feels too literary and PP Neue Montreal feels too generic.

- [ ] **Step 1: Add font loader to `app/layout.tsx`**

```typescript
import { IBM_Plex_Mono } from 'next/font/google';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});
```

Apply the variable to the `<body>` className alongside the existing font variables:

```tsx
<body className={`${sans.variable} ${serif.variable} ${ibmPlexMono.variable} antialiased`}>
```

- [ ] **Step 2: Add the token to `app/globals.css`**

In the `@theme` block:

```css
--font-family-mono: var(--font-mono);
```

- [ ] **Step 3: Verify it loads**

```bash
pnpm build 2>&1 | tail -5
```

Then `pnpm dev` and inspect a known label element in DevTools. Apply `font-family: var(--font-mono)` ad-hoc (Computed tab) and confirm IBM Plex Mono renders.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat(theme): add IBM Plex Mono for technical labels (--font-mono)"
```

(Adoption — actually USING it on label elements — is left to the responsive audit / polish wave to apply judgment-by-judgment, not blanket replace.)

---

## Task 7: Final verification and cross-repo cohesion check

**Files:** None modified — verification only.

- [ ] **Step 1: Re-audit at 5 representative viewports**

For each of /, /about, /academy, /services, /team at widths 375, 768, 1280, 1920, walk through and verify:
- Nav renders correctly (floating pill, frosted glass on scroll)
- FadeIn animations trigger smoothly
- No console errors
- No overlapping elements

- [ ] **Step 2: Bundle size comparison**

```bash
pnpm build 2>&1 | grep "First Load JS"
```

Expected: per-route bundle ≤ pre-task-2 baseline. If GSAP usage was meaningfully reduced, bundle should drop modestly (~10–30 KB).

- [ ] **Step 3: Lighthouse spot-check**

`pnpm start`, run Lighthouse on / (mobile and desktop). Confirm scores still ≥ 90 across Performance, Accessibility, Best Practices, SEO.

- [ ] **Step 4: Visual cross-repo comparison**

Open both sites side-by-side (academy locally via `pnpm dev` in the other repo, main on a Vercel preview). Confirm:
- Both share same dark base feeling
- Color palettes feel related (not identical — main keeps Ink & Bone warmth)
- Both use a floating-pill nav pattern (same gesture, slightly different content)
- Body fonts differ (Inter vs PP Neue Montreal — by design)
- Display fonts differ (Switzer vs Cormorant Garamond — by design — academy is utilitarian, main is editorial)

If anything feels visually disconnected, document the gap in the audit log for a follow-up iteration.

- [ ] **Step 5: Commit verification log**

```bash
echo -e "\n## Brand alignment final verification (2026-05-04)\n" >> docs/audits/2026-04-30-responsive-audit.md
echo "Bundle delta: <N> KB" >> docs/audits/2026-04-30-responsive-audit.md
echo "Lighthouse mobile: <P/A/BP/SEO>" >> docs/audits/2026-04-30-responsive-audit.md
echo "Lighthouse desktop: <P/A/BP/SEO>" >> docs/audits/2026-04-30-responsive-audit.md
git add docs/audits/2026-04-30-responsive-audit.md
git commit -m "verify: brand alignment refinements complete"
```

---

## Self-Review (already performed)

**1. Spec coverage:**
- Recommendation 1 ("Replace heavy GSAP fade-ups with academy's FadeIn IO pattern") → Tasks 1, 2, 3
- Recommendation 2 ("Port floating-pill nav style") → Task 4
- Recommendation 3 ("Audit and consolidate OKLCH palette") → Task 5
- Recommendation 4 ("Add IBM Plex Mono for labeling") → Task 6
- Cross-repo cohesion verification → Task 7

**2. Placeholder scan:** No `TBD`, no vague directives. Task 1 produces an inventory file that drives Task 3's per-site loop; that loop is concrete (open file → identify wrapper → replace pattern → commit).

**3. Type / property consistency:** Component names (`FadeIn`), token names (`--font-mono`, `--font-family-mono`), and CSS class names referenced are consistent across tasks.

---

## Out of scope

- Font migration (Cormorant Garamond and PP Neue Montreal stay)
- Palette migration (OKLCH "Ink & Bone" stays as the foundation; we only consolidate, not replace)
- Lenis removal (smooth scroll stays — it's a global behavior, not a per-section animation)
- Adopting `FadeIn` for non-fade-up GSAP usage (scrub, pin, sequence, marquee — these stay GSAP)
- Modifying the academy repo (this plan only touches the main site; academy adopts shared brand kit when its content is built out — separate future work)

## Estimated effort

| Phase | Tasks | Effort |
|-------|-------|--------|
| Inventory | Task 1 | 30 min |
| Port + migrate fade-ups | Tasks 2, 3 | 2–4 hours (depends on call-site count) |
| Pill nav | Task 4 | 1.5 hours |
| Palette consolidation | Task 5 | 1 hour |
| Mono font | Task 6 | 15 min |
| Verification | Task 7 | 45 min |
| **Total** | **7 tasks** | **5–8 hours of focused work** |

This is a half-day to full-day pass, executed AFTER the responsive audit fix waves but BEFORE the final Lighthouse verification of sub-project 2.
