# PRAX Codebase Audit Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical, high, and medium issues found in the 4-agent codebase audit — bringing the PRAX website to production-quality standards across architecture, performance, accessibility, SEO, and code hygiene.

**Architecture:** Six phases executed in dependency order. Phase 1 removes dead code and centralizes constants (no behavior change). Phase 2 fixes performance bottlenecks (preloader, CSS, animation engine). Phase 3 adds SEO infrastructure and error handling. Phase 4 cleans up GSAP architecture and component composition. Phase 5 fixes accessibility and UX issues. Phase 6 adds polish (env vars, TypeScript, metadata).

**Tech Stack:** Next.js 15 (App Router), React 19, GSAP 3.12, Lenis, Tailwind CSS 4, Zustand, Cloudinary, TypeScript 5.7

---

## File Map

### New Files
- `lib/constants.ts` — centralized booking URLs, addresses, social links
- `lib/gsap.ts` — single GSAP + ScrollTrigger registration (eliminates 33 duplicate registerPlugin calls)
- `app/not-found.tsx` — branded 404 page
- `app/error.tsx` — branded error boundary
- `app/robots.ts` — robots.txt generator
- `app/sitemap.ts` — sitemap generator

### Major Modifications
- `lib/animations.ts` — delete ~670 lines of unused functions
- `lib/store.ts` — delete `useCursorStore`
- `lib/utils.ts` — delete unused exports
- `lib/mobileAnimations.ts` — delete duplicate `prefersReducedMotion`, unused exports
- `lib/lenis.ts` — delete entirely (duplicated by LenisProvider)
- `app/globals.css` — remove duplicate noise overlay, dead cursor CSS, permanent will-change, mobile animation override
- `app/layout.tsx` — remove commented-out imports, move Footer here
- `components/sections/Footer.tsx` — add external link handling, remove dead defaults, remove `showNewsletter` prop
- `components/ui/Preloader.tsx` — reduce min duration from 2000ms to 500ms, add try/catch for sessionStorage
- All section components — replace `'use client'` + inline GSAP with server component + `useScrollReveal` wrapper
- `components/sections/AcademyContent.tsx` — decompose into separate section components

### Deletions
- `components/ui/CustomCursor.tsx`
- `components/ui/BookButton.tsx`
- `components/sections/TeamSection.tsx` (orphaned, replaced by TeamGridSection)
- `components/sections/ServicesSection.tsx` (orphaned, replaced by ServicesPreviewSection)
- `components/sections/PhilosophySection.tsx` (orphaned, replaced by FounderSection)
- `components/sections/ServiceTiersSection.tsx` (orphaned, replaced by ServiceMenuSection)
- `lib/lenis.ts` (duplicated by LenisProvider)
- `public/fonts/ppneuemontreal-*.otf` (6 files, unused)
- `public/fonts/satoshi-*.woff2` (4 files, unused)
- ~60 unused Sohne font variants in `public/fonts/sohne-font-family/`

---

## Phase 1: Dead Code Removal & Constants Centralization

### Task 1: Create centralized constants file

**Files:**
- Create: `lib/constants.ts`

- [ ] **Step 1: Create `lib/constants.ts` with all shared constants**

```typescript
// Booking URLs
export const BOOKING_URL = 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7';

export const TEAM_BOOKING_URLS: Record<string, string> = {
  jack: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?barber=jack',
  gavin: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?barber=gavin',
  steven: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?barber=steven',
};

// Social links
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/praxhair/',
  tiktok: 'https://www.tiktok.com/@praxhair',
} as const;

// Business info
export const BUSINESS_INFO = {
  address: '1752 W Adams Blvd #206',
  city: 'Los Angeles, CA 90018',
  hours: [
    'Monday - Saturday: 10am - 9pm',
    'Sunday: Closed',
  ],
} as const;
```

Note: The team booking URLs above use the brand URL as a base. Check the actual individual barber Squire URLs from `app/team/page.tsx` (lines 51, 71, 91) and use those exact values. The ones above are illustrative — replace with the real per-barber URLs found in the codebase.

- [ ] **Step 2: Verify file created**

Run: `cat lib/constants.ts`
Expected: File contents as above.

- [ ] **Step 3: Commit**

```bash
git add lib/constants.ts
git commit -m "feat: add centralized constants for booking URLs, social links, business info"
```

---

### Task 2: Replace hardcoded booking URLs with constants

**Files:**
- Modify: `components/sections/HeroSection.tsx:31` — default prop value
- Modify: `components/sections/CTASection.tsx:27` — default prop value
- Modify: `components/sections/ServicesPreviewSection.tsx:35` — href in array
- Modify: `components/sections/ServiceMenuSection.tsx:39` — default prop value
- Modify: `lib/footerConfig.ts:16` — Book Appointment link
- Modify: `app/page.tsx:24` — primaryCTA prop

- [ ] **Step 1: In each file, add `import { BOOKING_URL } from '@/lib/constants'` and replace the hardcoded Squire URL string with `BOOKING_URL`**

For example, in `components/sections/CTASection.tsx`, change:
```typescript
primaryButtonHref = 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7',
```
to:
```typescript
primaryButtonHref = BOOKING_URL,
```

In `lib/footerConfig.ts`, change:
```typescript
{ label: 'Book Appointment', href: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7' },
```
to:
```typescript
{ label: 'Book Appointment', href: BOOKING_URL },
```

Repeat for all 6 files listed above. Do NOT change the per-barber URLs in `app/team/page.tsx` — those are individual barber links, not the brand URL.

- [ ] **Step 2: Verify no remaining hardcoded brand booking URLs (per-barber URLs are fine)**

Run: `grep -r 'getsquire.com/booking/brands/6764fc64' --include='*.ts' --include='*.tsx' -l`
Expected: Only `lib/constants.ts` and `app/team/page.tsx` (per-barber URLs).

- [ ] **Step 3: Build check**

Run: `pnpm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/footerConfig.ts app/page.tsx components/sections/HeroSection.tsx components/sections/CTASection.tsx components/sections/ServicesPreviewSection.tsx components/sections/ServiceMenuSection.tsx
git commit -m "refactor: centralize booking URL into lib/constants.ts"
```

---

### Task 3: Delete orphaned components and dead code files

**Files:**
- Delete: `components/ui/CustomCursor.tsx`
- Delete: `components/ui/BookButton.tsx`
- Delete: `components/sections/TeamSection.tsx`
- Delete: `components/sections/ServicesSection.tsx`
- Delete: `components/sections/PhilosophySection.tsx`
- Delete: `components/sections/ServiceTiersSection.tsx`
- Delete: `lib/lenis.ts`

- [ ] **Step 1: Verify these files are truly unused**

Run: `for f in components/ui/CustomCursor.tsx components/ui/BookButton.tsx components/sections/TeamSection.tsx components/sections/ServicesSection.tsx components/sections/PhilosophySection.tsx components/sections/ServiceTiersSection.tsx lib/lenis.ts; do echo "=== $f ==="; grep -r "$(basename $f .tsx)" --include='*.ts' --include='*.tsx' -l | grep -v "$f"; done`

Expected: No files import these (except possibly commented-out imports in layout.tsx/Header.tsx, which we'll clean in a later step).

- [ ] **Step 2: Delete the files**

```bash
rm components/ui/CustomCursor.tsx components/ui/BookButton.tsx components/sections/TeamSection.tsx components/sections/ServicesSection.tsx components/sections/PhilosophySection.tsx components/sections/ServiceTiersSection.tsx lib/lenis.ts
```

- [ ] **Step 3: Build check**

Run: `pnpm run build`
Expected: Build succeeds. If any file was actually imported, the build will fail — restore it and investigate.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete 7 orphaned/dead-code files (CustomCursor, BookButton, old TeamSection, ServicesSection, PhilosophySection, ServiceTiersSection, lib/lenis)"
```

---

### Task 4: Clean dead code from remaining files

**Files:**
- Modify: `lib/store.ts` — remove `useCursorStore` (lines 3-38)
- Modify: `lib/utils.ts` — remove unused exports: `formatNumber`, `clamp`, `mapRange`, `lerp`, `isClient`
- Modify: `lib/mobileAnimations.ts` — remove duplicate `prefersReducedMotion` (use from utils), remove unused exports
- Modify: `app/layout.tsx` — remove commented-out imports and JSX for CustomCursor and BookButton
- Modify: `components/layout/Header.tsx` — remove commented-out `useCursor` imports and references

- [ ] **Step 1: Clean `lib/store.ts`**

Remove the `CursorVariant` type and `useCursorStore` (everything from the type definition through the store). Keep `usePreloaderStore` and `useNavigationStore`. Also remove `isHeaderVisible` and `isHeaderSolid` from `useNavigationStore` since they're never read or written by any component — keep only `isMenuOpen`, `setMenuOpen`, and `toggleMenu`.

- [ ] **Step 2: Clean `lib/utils.ts`**

Remove `formatNumber`, `clamp`, `mapRange`, `lerp`, and `isClient`. Keep only `cn` and `prefersReducedMotion`.

Verify first: `grep -r 'formatNumber\|clamp\|mapRange\|lerp\|isClient' --include='*.ts' --include='*.tsx' -l`
Expected: Only `lib/utils.ts` itself (and possibly orphaned files we already deleted).

- [ ] **Step 3: Clean `lib/mobileAnimations.ts`**

Remove the duplicate `prefersReducedMotion` function. Remove unused exports: `getDurationMultiplier`, `getParallaxSpeed`, `shouldEnableComplexAnimations`, `applyWillChange`, `removeWillChange`, `animateWithPerformance`, `getMobileScrollTriggerConfig`, `isTouchDevice`.

Keep: `isMobileDevice`, `getMobileAnimationConfig`, and the `AnimationConfig` interface.

Update imports: any file that imported `prefersReducedMotion` from `mobileAnimations` should import from `utils` instead. Check: `grep -r "from.*mobileAnimations.*prefersReducedMotion" --include='*.ts' --include='*.tsx'`

- [ ] **Step 4: Clean `app/layout.tsx`**

Remove lines 7 and 10 (commented-out imports for CustomCursor and BookButton). Remove lines 130-134 (commented-out JSX and comment blocks for Custom Cursor and Fixed Book Button).

- [ ] **Step 5: Clean `components/layout/Header.tsx`**

Remove commented-out `useCursor` import (line 9) and any commented-out cursor references (lines 37, 195).

- [ ] **Step 6: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add lib/store.ts lib/utils.ts lib/mobileAnimations.ts app/layout.tsx components/layout/Header.tsx
git commit -m "chore: remove dead code from store, utils, mobileAnimations, layout, Header"
```

---

### Task 5: Delete unused font files

**Files:**
- Delete: All `public/fonts/ppneuemontreal-*.otf` (6 files)
- Delete: All `public/fonts/satoshi-*.woff2` (4 files)
- Delete: All Sohne variants NOT referenced in `layout.tsx`

- [ ] **Step 1: Identify the 5 font files actually used**

From `app/layout.tsx`, the used files are:
```
TestSohne-Leicht-BF663d89cd4952e.otf     (weight 300)
TestSohne-Buch-BF663d89cd32e6a.otf       (weight 400)
TestSohne-Halbfett-BF663d89cd2d67b.otf   (weight 600)
TestSohne-Fett-BF663d89cca89ff.otf       (weight 700)
TestSohne-Extrafett-BF663d89cc9f2c0.otf  (weight 800)
```

- [ ] **Step 2: Delete unused PP Neue Montreal and Satoshi files**

```bash
rm public/fonts/ppneuemontreal-*.otf
rm public/fonts/satoshi-*.woff2
```

- [ ] **Step 3: Delete unused Sohne variants**

Keep only the 5 files listed in Step 1. Delete everything else in `sohne-font-family/` EXCEPT those 5 and any license file.

```bash
cd public/fonts/sohne-font-family/
# Keep the license
# Delete all files NOT in the keep list
ls | grep -v -E '(Leicht-BF663d89cd4952e|Buch-BF663d89cd32e6a|Halbfett-BF663d89cd2d67b|Fett-BF663d89cca89ff|Extrafett-BF663d89cc9f2c0|License)' | xargs rm
cd /home/miko_node_001/repos/prax
```

- [ ] **Step 4: Verify only the 5 used fonts + license remain**

Run: `ls public/fonts/sohne-font-family/`
Expected: 5 OTF files + license file.

Run: `ls public/fonts/`
Expected: Only `sohne-font-family/` directory remains.

- [ ] **Step 5: Build check**

Run: `pnpm run build`
Expected: Build succeeds — fonts still load correctly.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: delete ~70 unused font files (~5-10MB), keep only 5 active Sohne weights"
```

---

### Task 6: Clean dead animation code from `lib/animations.ts`

**Files:**
- Modify: `lib/animations.ts`

- [ ] **Step 1: Identify which animation functions are actually imported**

Run: `grep -r "from.*animations" --include='*.tsx' --include='*.ts' -h | grep -v '\.ts:' | sort -u`

Cross-reference with the 37 exports. Keep only functions that are imported by non-deleted components. Based on the audit, the following are used:
- `ease` — used in multiple components
- `duration` — used in multiple components
- `revealImage` — used in ImageReveal
- `magneticButton` — used in MagneticButton
- `killAllScrollTriggers` — used in LenisProvider
- `refreshScrollTriggers` — used in some sections
- `staggerCards` — used in some sections
- `revealWithBlur` — used in 6 components (will be refactored in Phase 2, but keep for now)
- `tiltCardOnHover` — used in PortfolioSection
- `textReveal` — verify usage
- `revealHorizontal` — used in ImageReveal

Delete everything else: `fadeUp`, `fadeIn`, `staggerReveal`, `heroVideoScale`, `parallax`, `fadeOnScroll`, `createTimeline`, `multiLayerParallax`, `heroEntrance`, `horizontalScroll`, `clipReveal`, `lineReveal`, `counterAnimation`, `magneticTextReveal`, `drawSVGPath`, `spotlightCard`, `staggeredLineReveal`.

- [ ] **Step 2: Remove the unused functions**

Delete each unused function block. Keep the file structure (imports, plugin registration, `ease` and `duration` constants at the top).

- [ ] **Step 3: Build check**

Run: `pnpm run build`
Expected: Build succeeds. If any function was actually used, the build will fail — restore it.

- [ ] **Step 4: Commit**

```bash
git add lib/animations.ts
git commit -m "chore: remove ~670 lines of unused animation functions from lib/animations.ts"
```

---

## Phase 2: Performance Fixes

### Task 7: Fix the preloader — reduce fake delay

**Files:**
- Modify: `components/ui/Preloader.tsx`

- [ ] **Step 1: Reduce `minDuration` from 2000 to 500**

In `Preloader.tsx`, find:
```typescript
const minDuration = 2000;
```
Change to:
```typescript
const minDuration = 500;
```

- [ ] **Step 2: Add try/catch around sessionStorage access**

In `PreloaderWrapper`, wrap the `sessionStorage.getItem` and `sessionStorage.setItem` calls in try/catch blocks to handle private browsing modes:

```typescript
// In the early return check:
try {
  if (sessionStorage.getItem('preloaderShown')) {
    return <>{children}</>;
  }
} catch {
  // sessionStorage unavailable (private browsing) — skip preloader
  return <>{children}</>;
}

// In the setItem call:
try {
  sessionStorage.setItem('preloaderShown', 'true');
} catch {
  // Ignore — private browsing
}
```

- [ ] **Step 3: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/ui/Preloader.tsx
git commit -m "perf: reduce preloader fake delay from 2s to 500ms, add sessionStorage try/catch"
```

---

### Task 8: Remove duplicate noise overlay

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Remove the `body::before` grain overlay (lines ~854-870)**

Find and delete the entire block:
```css
/* GRAIN TEXTURE OVERLAY (Premium Feel) */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,...");
  opacity: 0.04;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: overlay;
}
```

Keep the `.noise-overlay` class (lines ~354-361) which is applied to the div in `layout.tsx`.

- [ ] **Step 2: Remove dead custom cursor CSS (lines ~922-958)**

Find and delete:
```css
/* CUSTOM CURSOR STYLES */
@media (pointer: fine) {
  .cursor-custom { cursor: none !important; }
  /* ... all cursor rules ... */
}
[data-cursor="hover"] { cursor: none; }
[data-cursor="view"]  { cursor: none; }
[data-cursor="drag"]  { cursor: none; }
[data-cursor="link"]  { cursor: none; }
```

- [ ] **Step 3: Remove the blanket mobile animation override**

Find and delete this line from the `@media (max-width: 767px)` block:
```css
* { animation-duration: 0.4s !important; }
```

- [ ] **Step 4: Remove `scroll-behavior: smooth` from `html`**

In the `html` rule (line ~175), remove:
```css
scroll-behavior: smooth;
```
Lenis handles smooth scrolling — this causes a flash of native smooth scroll before Lenis initializes.

- [ ] **Step 5: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "perf: remove duplicate noise overlay, dead cursor CSS, blanket animation override, scroll-behavior conflict"
```

---

### Task 9: Remove permanent `will-change` from CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Remove all static `will-change` declarations**

Find every `will-change: transform` and `will-change: transform, opacity` in `globals.css` (8 occurrences at lines ~680, 707, 751, 768, 798, 806, 1074, 1150) and delete each line.

These properties should only be applied dynamically via GSAP during animation, not permanently in CSS. GSAP already applies `will-change` when animating transforms.

- [ ] **Step 2: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "perf: remove 8 permanent will-change declarations — let GSAP manage GPU layers during animation"
```

---

### Task 10: Replace `filter: blur()` animations with opacity-only reveals

**Files:**
- Modify: `lib/animations.ts` — change `revealWithBlur` function
- Affects: PortfolioSection, ProcessGallerySection, StudioSpaceSection, TeamGridSection, BeforeAfterGallery (all import `revealWithBlur`)

- [ ] **Step 1: Rewrite `revealWithBlur` to use opacity + scale instead of filter blur**

Find the `revealWithBlur` function (currently uses `filter: blur(20px)`) and replace with:

```typescript
export function revealWithBlur(
  element: gsap.TweenTarget,
  options: {
    trigger?: gsap.DOMTarget;
    start?: string;
    duration?: number;
    delay?: number;
    y?: number;
    scale?: number;
  } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 });
    return;
  }

  const {
    trigger = element as gsap.DOMTarget,
    start = 'top 85%',
    duration: dur = duration.slow,
    delay = 0,
    y = 30,
    scale = 0.97,
  } = options;

  return gsap.from(element, {
    scrollTrigger: {
      trigger,
      start,
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y,
    scale,
    duration: dur,
    delay,
    ease: ease.out,
    clearProps: 'transform',
  });
}
```

This replaces the CPU-intensive `filter: blur()` with GPU-accelerated `opacity + scale + translateY`, producing a similar "soft reveal" effect without per-frame paint.

- [ ] **Step 2: Verify all callsites still work**

Run: `grep -rn 'revealWithBlur' --include='*.tsx' --include='*.ts' -l`
Check each callsite to ensure the API is compatible. The function signature and options should be backward-compatible.

- [ ] **Step 3: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add lib/animations.ts
git commit -m "perf: replace filter:blur() animation with GPU-accelerated opacity+scale reveal"
```

---

## Phase 3: SEO & Error Handling

### Task 11: Add robots.ts and sitemap.ts

**Files:**
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`

- [ ] **Step 1: Create `app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://prax.studio/sitemap.xml',
  };
}
```

- [ ] **Step 2: Create `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://prax.studio';

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/academy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
}
```

- [ ] **Step 3: Build check**

Run: `pnpm run build`
Expected: Build succeeds. Routes `/robots.txt` and `/sitemap.xml` should appear in build output.

- [ ] **Step 4: Commit**

```bash
git add app/robots.ts app/sitemap.ts
git commit -m "feat: add robots.txt and sitemap.xml for SEO"
```

---

### Task 12: Add branded 404 and error pages

**Files:**
- Create: `app/not-found.tsx`
- Create: `app/error.tsx`

- [ ] **Step 1: Create `app/not-found.tsx`**

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-prax-silver text-label tracking-widest uppercase mb-6">404</p>
      <h1 className="text-h2 font-light tracking-tight mb-4">Page Not Found</h1>
      <p className="text-prax-stone text-body max-w-md mb-10">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block border border-prax-graphite px-8 py-3 text-body-sm tracking-wide hover:bg-prax-charcoal transition-colors duration-300"
      >
        Back to Home
      </Link>
    </main>
  );
}
```

- [ ] **Step 2: Create `app/error.tsx`**

```tsx
'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-prax-silver text-label tracking-widest uppercase mb-6">Error</p>
      <h1 className="text-h2 font-light tracking-tight mb-4">Something Went Wrong</h1>
      <p className="text-prax-stone text-body max-w-md mb-10">
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="inline-block border border-prax-graphite px-8 py-3 text-body-sm tracking-wide hover:bg-prax-charcoal transition-colors duration-300"
      >
        Try Again
      </button>
    </main>
  );
}
```

- [ ] **Step 3: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/not-found.tsx app/error.tsx
git commit -m "feat: add branded 404 and error pages"
```

---

### Task 13: Fix homepage heading hierarchy

**Files:**
- Modify: `components/sections/HeroSection.tsx`

- [ ] **Step 1: Change the sr-only `<span>` to a proper `<h1>`**

In `HeroSection.tsx`, find the `<span className="sr-only">{headline}</span>` and change it to:

```tsx
<h1 className="sr-only">{headline}</h1>
```

This gives the page a proper semantic `<h1>` for SEO crawlers while keeping the visual layout unchanged (the decorative hero text remains as-is).

- [ ] **Step 2: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "fix: use semantic h1 element for homepage heading (SEO)"
```

---

## Phase 4: Architecture Cleanup

### Task 14: Create centralized GSAP setup module

**Files:**
- Create: `lib/gsap.ts`

- [ ] **Step 1: Create `lib/gsap.ts`**

```typescript
'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once — all components import from here
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Commit**

```bash
git add lib/gsap.ts
git commit -m "feat: add centralized GSAP setup module (single registerPlugin call)"
```

---

### Task 15: Migrate all components to use `lib/gsap.ts`

**Files:**
- Modify: All 33 files that have `gsap.registerPlugin(ScrollTrigger)` — replace their individual gsap imports and registerPlugin calls with a single import from `lib/gsap`.

- [ ] **Step 1: In each component that imports gsap directly, replace:**

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
```

with:

```typescript
import { gsap, ScrollTrigger } from '@/lib/gsap';
```

Do this in all 33 files. Also update `lib/animations.ts` to import from `lib/gsap` instead of directly from gsap.

- [ ] **Step 2: Verify no remaining direct registerPlugin calls**

Run: `grep -r 'gsap.registerPlugin' --include='*.ts' --include='*.tsx' -l`
Expected: Only `lib/gsap.ts`.

- [ ] **Step 3: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: migrate all components to centralized GSAP setup (remove 33 duplicate registerPlugin calls)"
```

---

### Task 16: Fix Footer — external links and dead code

**Files:**
- Modify: `components/sections/Footer.tsx`
- Modify: `lib/footerConfig.ts` (use SOCIAL_LINKS from constants)

- [ ] **Step 1: Update Footer to handle external links**

In `Footer.tsx`, update the link rendering logic. Replace the plain `<a>` tag for links with:

```tsx
{column.links.map((link) => {
  const isExternal = link.href.startsWith('http');
  return (
    <li key={link.label}>
      <a
        href={link.href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-prax-silver hover:text-prax-white transition-colors duration-300 text-body-sm"
      >
        {link.label}
      </a>
    </li>
  );
})}
```

- [ ] **Step 2: Remove `showNewsletter` prop**

Remove `showNewsletter` from the Props interface and the function signature. It's accepted but never used.

- [ ] **Step 3: Remove `defaultColumns`**

Delete the `defaultColumns` array (lines ~22-55) with its broken `#` hash links. Make `columns` a required prop instead of optional with a default.

- [ ] **Step 4: Update `lib/footerConfig.ts` to use constants**

Import `BOOKING_URL` and `SOCIAL_LINKS` from `lib/constants.ts` and use them:

```typescript
import { BOOKING_URL, SOCIAL_LINKS } from '@/lib/constants';

export const footerColumns = [
  {
    title: 'Services',
    links: [
      { label: 'All Services', href: '/services' },
      { label: 'Book Appointment', href: BOOKING_URL },
    ],
  },
  // ... other columns using SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok
];
```

- [ ] **Step 5: Fix the broken `/about#studio` link**

In `footerConfig.ts`, change:
```typescript
{ label: 'Location', href: '/about#studio' },
```
to:
```typescript
{ label: 'Location', href: '/about' },
```

(Or, if you want the anchor to work, add `id="studio"` to the StudioSpaceSection in about/page.tsx — but since the section has empty content, just link to `/about` for now.)

- [ ] **Step 6: Remove `showNewsletter` prop from all page usages**

In all page files (`app/page.tsx`, `app/about/page.tsx`, `app/services/page.tsx`, `app/team/page.tsx`, `app/academy/page.tsx`), change:
```tsx
<Footer showNewsletter columns={footerColumns} />
```
to:
```tsx
<Footer columns={footerColumns} />
```

- [ ] **Step 7: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 8: Commit**

```bash
git add components/sections/Footer.tsx lib/footerConfig.ts app/page.tsx app/about/page.tsx app/services/page.tsx app/team/page.tsx
git commit -m "fix: Footer external links get target=_blank+noopener, remove dead defaultColumns and showNewsletter prop"
```

---

### Task 17: Decompose AcademyContent monolith

**Files:**
- Modify: `components/sections/AcademyContent.tsx` — extract into separate sections
- Modify: `app/academy/page.tsx` — compose sections like other pages

- [ ] **Step 1: Read `AcademyContent.tsx` fully to understand its sections**

The component contains: InnerPageHero, a programs grid, a curriculum approach section, StatsSection, classroom gallery, Skool community section, CTASection, and Footer. All in one `'use client'` component.

- [ ] **Step 2: Extract the programs grid and curriculum approach into a new component**

Create `components/sections/AcademyProgramsSection.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

interface Program {
  number: string;
  title: string;
  format: string;
  duration: string;
  description: string;
}

interface AcademyProgramsSectionProps {
  programs: Program[];
}

export function AcademyProgramsSection({ programs }: AcademyProgramsSectionProps) {
  // Move the programs grid JSX and its GSAP animation from AcademyContent here
  // (the section with "Our Programs" heading and the 3 program cards)
  // ... extract the exact JSX from AcademyContent
}
```

- [ ] **Step 3: Extract the Skool community section**

Create `components/sections/SkoolCommunitySection.tsx` with the Skool-related JSX and its GSAP animation from AcademyContent.

- [ ] **Step 4: Extract the classroom gallery**

Create `components/sections/ClassroomGallerySection.tsx` with the classroom image grid and its GSAP animation from AcademyContent.

- [ ] **Step 5: Rewrite `app/academy/page.tsx` to compose sections**

```tsx
import { InnerPageHero } from '@/components/sections/InnerPageHero';
import { AcademyProgramsSection } from '@/components/sections/AcademyProgramsSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ClassroomGallerySection } from '@/components/sections/ClassroomGallerySection';
import { SkoolCommunitySection } from '@/components/sections/SkoolCommunitySection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { cloudinaryAssets } from '@/lib/cloudinary';
import { footerColumns } from '@/lib/footerConfig';

export const metadata = {
  title: 'Academy',
  description: 'PRAX Academy — Professional barber education...',
};

export default function AcademyPage() {
  return (
    <main className="min-h-screen">
      <InnerPageHero ... />
      <AcademyProgramsSection programs={[...]} />
      <StatsSection ... />
      <ClassroomGallerySection ... />
      <SkoolCommunitySection />
      <CTASection ... />
      <Footer columns={footerColumns} />
    </main>
  );
}
```

- [ ] **Step 6: Delete `AcademyContent.tsx` once the page composes the new sections**

- [ ] **Step 7: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: decompose AcademyContent monolith into composable sections matching other page patterns"
```

---

## Phase 5: Accessibility & UX Fixes

### Task 18: Fix video accessibility

**Files:**
- Modify: `components/ui/VideoBackground.tsx`

- [ ] **Step 1: Add `aria-hidden="true"` to the `<video>` element**

The background video is decorative — it should be hidden from assistive technology. Find the `<video>` element and add `aria-hidden="true"`.

- [ ] **Step 2: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/ui/VideoBackground.tsx
git commit -m "fix: add aria-hidden to decorative background video"
```

---

### Task 19: Fix ServiceWorkerProvider — replace window.confirm with non-blocking approach

**Files:**
- Modify: `components/providers/ServiceWorkerProvider.tsx`

- [ ] **Step 1: Replace `window.confirm` with a simple page reload on update**

The service worker update prompt currently uses `window.confirm()` which blocks the main thread. Replace with a silent auto-reload approach:

Find:
```typescript
if (window.confirm('A new version of the site is available. Reload to update?')) {
```

Replace the entire update handling block with:
```typescript
// Auto-reload on service worker update — no blocking confirm dialog
installingWorker.addEventListener('statechange', () => {
  if (installingWorker.state === 'activated') {
    window.location.reload();
  }
});
```

- [ ] **Step 2: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/providers/ServiceWorkerProvider.tsx
git commit -m "fix: replace blocking window.confirm with auto-reload on SW update"
```

---

## Phase 6: Polish & Environment

### Task 20: Add `.env.example`

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create `.env.example`**

```bash
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dpc0d4a7s

# Optional: Cloudinary API (for server-side operations)
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add .env.example documenting required environment variables"
```

---

### Task 21: Move Footer into layout (DRY page composition)

**Files:**
- Modify: `app/layout.tsx` — add Footer after `{children}`
- Modify: `app/page.tsx` — remove `<Footer>` JSX
- Modify: `app/about/page.tsx` — remove `<Footer>` JSX
- Modify: `app/services/page.tsx` — remove `<Footer>` JSX
- Modify: `app/team/page.tsx` — remove `<Footer>` JSX
- Modify: `app/academy/page.tsx` — remove `<Footer>` JSX (or the new decomposed version)

- [ ] **Step 1: Add Footer to layout.tsx**

In `app/layout.tsx`, add the Footer import and render it after `{children}`:

```tsx
import { Footer } from '@/components/sections/Footer';
import { footerColumns } from '@/lib/footerConfig';

// ... in the return JSX, after {children}:
<PreloaderWrapper>
  <Header />
  {children}
  <Footer columns={footerColumns} />
</PreloaderWrapper>
```

- [ ] **Step 2: Remove Footer from all 5 page files**

In each page file, remove the `<Footer>` component and its imports (`Footer` and `footerColumns`).

- [ ] **Step 3: Build check**

Run: `pnpm run build`
Expected: Build succeeds. Footer appears on all pages via layout.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx app/about/page.tsx app/services/page.tsx app/team/page.tsx app/academy/page.tsx
git commit -m "refactor: move Footer into layout.tsx — remove duplicate rendering from all 5 pages"
```

---

### Task 22: Type-safe metadata exports on all pages

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/academy/page.tsx`
- Modify: `app/services/page.tsx`
- Modify: `app/team/page.tsx`

- [ ] **Step 1: Add `Metadata` type import and annotation to each page**

In each file, add:
```typescript
import type { Metadata } from 'next';
```

And change:
```typescript
export const metadata = {
```
to:
```typescript
export const metadata: Metadata = {
```

- [ ] **Step 2: Build check**

Run: `pnpm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx app/academy/page.tsx app/services/page.tsx app/team/page.tsx
git commit -m "fix: add Metadata type annotation to all page metadata exports"
```

---

### Task 23: Final build verification and cleanup

**Files:**
- All modified files

- [ ] **Step 1: Full build**

Run: `pnpm run build`
Expected: Build succeeds with no errors or warnings.

- [ ] **Step 2: Verify route output**

Check that the build output shows all routes:
```
Route (app)                    Size     First Load JS
┌ ○ /                          ...      ...
├ ○ /about                     ...      ...
├ ○ /academy                   ...      ...
├ ○ /services                  ...      ...
├ ○ /team                      ...      ...
├ ○ /not-found                 ...      ...
├ ○ /sitemap.xml               ...      ...
└ ○ /robots.txt                ...      ...
```

- [ ] **Step 3: Verify no remaining dead imports**

Run: `pnpm run lint`
Expected: No errors about unused imports.

- [ ] **Step 4: Commit any lint fixes**

```bash
git add -A
git commit -m "chore: final lint fixes after audit cleanup"
```

---

## Summary of Scope NOT Covered (Content / Future Work)

These items require human input or separate planning:

1. **Font licensing** (P0) — requires business decision: purchase Sohne license OR switch font. Cannot be done in code alone.
2. **Team profile content** — empty fields for specialty, experience, philosophy, credentials need real data from the team.
3. **Studio space photos** — 6 empty `src: ''` images on the About page need real photography.
4. **Contact mechanism** — requires business decision on contact method (form, email, phone).
5. **Server component refactor** — converting 30+ `'use client'` sections to server components with animation wrappers is a large refactor best done as a separate plan after this cleanup lands.
6. **Test infrastructure** — adding Vitest/Playwright is a separate initiative.
7. **Cloudinary double-optimization** — choosing between Next.js image proxy and Cloudinary-native delivery requires performance benchmarking.
8. **WOFF2 font conversion** — requires font tooling (fonttools/woff2) to convert the 5 active OTF files.
