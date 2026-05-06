# Asset Checklist

Working doc — tick each box as you replace placeholders with real assets from Jack's Drive.

**Source:** Jack's PRAX Hair image/video/media folders on Google Drive
**Local working folder:** suggested `~/Downloads/prax-assets/` (or anywhere outside the repo)
**Tool:** `pnpm add-asset <file> --key <key> --force`

## Blob folder layout

`add-asset` auto-derives the Blob folder from the key prefix (no flags needed). Final paths look like `prax/<folder>/<key>.<ext>`. Nine folders, 55 assets total:

| Folder | Count | Contents |
|---|---|---|
| `prax/brand/` | 3 | `logo`, `logoX`, `textLogo` |
| `prax/team/` | 10 | 7 portraits + 2 action shots + `teamHeroBackground` |
| `prax/portfolio/` | 6 | homepage marquee originals (`portfolio01,03–07`) |
| `prax/work-samples/` | 18 | per-stylist work (`{jack,gavin,steven,jared,ariel}Work*`) |
| `prax/before-after/` | 2 | `beforeAfter01Before/After` |
| `prax/process/` | 3 | `processConsultation`, `processCutting`, `processDetailing` |
| `prax/academy/` | 8 | `academyClassroom01–08` |
| `prax/editorial/` | 2 | `philosophyImage`, `servicesHeroImage` |
| `prax/videos/` | 3 | `heroVideo`, `academyVideo`, `aboutVideo` |

The `videos/` rule wins over page-prefix rules, so `academyVideo` lands in `videos/`, not `academy/`. Routing logic lives in `folderForKey` in `scripts/add-asset.ts`.

## Local working folder layout

Mirror the Blob structure under `~/Downloads/prax-assets/`. Name each file exactly as its key (e.g. `teamJack.jpg`) so the batch loop below picks the key up automatically.

```
~/Downloads/prax-assets/
├── brand/{logo,logoX,textLogo}.png
├── team/{teamJack,teamGavin,teamSteven,teamJared,teamAriel,teamBrandon,teamHeroBackground,teamJackAction,teamJaredAction}.jpg
├── portfolio/portfolio0{1,3,4,5,6,7}.jpg
├── work-samples/{jack,gavin,steven,jared,ariel}Work0X.jpg
├── before-after/beforeAfter01{Before,After}.jpg
├── process/process{Consultation,Cutting,Detailing}.jpg
├── academy/academyClassroom0{1..8}.jpg
├── editorial/{philosophyImage,servicesHeroImage}.jpg
└── videos/{hero,academy,about}Video.mp4
```

---

## Universal format rules

Apply to every image regardless of category. Following these makes Next.js Image optimization work as designed.

| | Spec |
|---|---|
| **Format (photos)** | JPEG, sRGB 8-bit, quality 90+ at export. Don't pre-convert to WebP/AVIF — Next.js does it at serve time, better than your export will. |
| **Format (logos / transparency)** | PNG (24-bit RGBA), or SVG if available. Skip JPEG for logos — bg color bakes in. |
| **Skip** | HEIC (convert to JPEG first), Adobe RGB, 16-bit color, pre-sharpening, pre-compression |
| **Resolution** | 2400 px on the long edge for photos. Matches Next.js's max device width (1920 × DPR-2 buffer). More is wasted. |
| **Quality** | JPEG q90+, no aggressive sharpening, no pre-compression — trust Next.js |
| **Metadata** | Strip EXIF if your export tool offers it. Smaller files, removes embedded GPS/camera data. |
| **File size** | Typical 1–3 MB; 8 MB hard cap |

**Videos:** H.264, 1920×1080 (1080p), ~3 Mbps target bitrate, **no audio track**, ≤15 sec for hero loops, ≤8 MB. Strip audio with:

```bash
ffmpeg -i input.mp4 -an -c:v libx264 -b:v 3M -movflags +faststart output.mp4
```

`-movflags +faststart` puts the metadata at the front so the video starts playing during download instead of after.

---

## Why aspect ratios matter here

Every consumer component uses Next.js `<Image fill>` with `object-cover`. That means **your image gets cropped to fit the displayed aspect ratio**. Deliver at the right ratio and nothing important gets cut. Deliver at the wrong ratio and faces/key elements get truncated.

Composition rule for portraits with `object-cover`: **keep the face / key subject in the upper third of the frame**. Bottom is what gets cropped on narrow viewports.

---

## Brand (3)

Logos display as inline `<Image>` with explicit width/height, not full-bleed. Transparent PNG or SVG required so they sit on the dark site background.

| ✓ | Key | Aspect / Dimensions | Purpose |
|---|-----|---------------------|---------|
| [ ] | `logo` | square 1:1 — **800×800 PNG (transparent)** | PRAX symbol mark — Preloader |
| [ ] | `logoX` | square 1:1 — **800×800 PNG (transparent)** | PRAX "X" mark — large hero accent (HeroSection renders at 320×320) |
| [ ] | `textLogo` | wide ~8:1 — **1600×200 PNG (transparent)** or SVG | Wordmark — Header (renders 186×24) and Footer (renders 248×32). Generous horizontal padding inside the asset. |

## Team portraits (6)

Editorial portraits, consistent lighting, dark/neutral background. Renders at **3:4 portrait** with `object-cover`. Face in the **upper third** so cropping doesn't decapitate anyone on mobile.

**Deliver at: 1800×2400 (3:4 portrait), JPEG q90+**

| ✓ | Key | Person | Role |
|---|-----|--------|------|
| [ ] | `teamJack` | Jack Louii | Founder & Lead Artist |
| [ ] | `teamGavin` | Gavin Chen | Master Barber |
| [ ] | `teamSteven` | Steven Park | Color Specialist |
| [ ] | `teamJared` | Jared Phan | Artist |
| [ ] | `teamAriel` | Ariel | Artist |
| [ ] | `teamBrandon` | Brandon Latung | Intern Artist |

## Team — additional (3)

| ✓ | Key | Aspect / Dimensions | Notes |
|---|-----|---------------------|-------|
| [ ] | `teamHeroBackground` | wide 16:9 or 21:9 — **2400×1350** (or 2400×1029 for 21:9) | `/team` page hero background. Atmospheric studio shot. Subject centered with breathing room — text overlays the center. |
| [ ] | `teamJackAction` | 16:9 landscape — **2400×1350** | Jack mid-cut, candid. Horizontal motion. Renders in TeamGridSection action-shot tile. |
| [ ] | `teamJaredAction` | 16:9 landscape — **2400×1350** | Jared mid-cut, candid. Same as above. |

## Portfolio — homepage marquee (6)

Hero portfolio shots that scroll horizontally on the homepage. Renders at **3:4 portrait** with `object-cover`. Use your strongest finished work — these are the first thing visitors see.

**Deliver at: 1800×2400 (3:4 portrait), JPEG q90+**

| ✓ | Key |
|---|-----|
| [ ] | `portfolio01` |
| [ ] | `portfolio03` |
| [ ] | `portfolio04` |
| [ ] | `portfolio05` |
| [ ] | `portfolio06` |
| [ ] | `portfolio07` |

## Per-stylist work samples — `/team` (18)

Cut/style detail shots, each stylist's best work. Renders at **3:4 portrait** with `object-cover` in a sub-grid under the stylist's portrait card.

**Deliver at: 1800×2400 (3:4 portrait), JPEG q90+**

| ✓ | Key |
|---|-----|
| [ ] | `jackWork01` |
| [ ] | `jackWork02` |
| [ ] | `jackWork03` |
| [ ] | `jackWork04` |
| [ ] | `jackWork05` |
| [ ] | `gavinWork01` |
| [ ] | `gavinWork02` |
| [ ] | `gavinWork03` |
| [ ] | `gavinWork04` |
| [ ] | `stevenWork01` |
| [ ] | `stevenWork02` |
| [ ] | `stevenWork03` |
| [ ] | `stevenWork04` |
| [ ] | `jaredWork01` |
| [ ] | `jaredWork02` |
| [ ] | `arielWork01` |
| [ ] | `arielWork02` |
| [ ] | `arielWork03` |

## Before / After — `/services` (2)

Same client, two shots, **framed identically** (same distance, same angle, same lighting). Renders at **3:4 portrait** with `object-cover`.

**Deliver at: 1800×2400 (3:4 portrait), JPEG q90+**

| ✓ | Key | What's needed |
|---|-----|---------------|
| [ ] | `beforeAfter01Before` | BEFORE shot — must match `beforeAfter01After` framing |
| [ ] | `beforeAfter01After` | AFTER shot — must match `beforeAfter01Before` framing |

## Process — `/services` (3)

Three steps of the cut experience. Renders at **4:5 portrait** (slightly taller than 3:4) with `object-cover`.

**Deliver at: 1920×2400 (4:5 portrait), JPEG q90+**

| ✓ | Key | What's needed |
|---|-----|---------------|
| [ ] | `processConsultation` | Step 1 — consultation in progress (client + barber, conversation framing) |
| [ ] | `processCutting` | Step 2 — precision cutting (close-ish on hands + scissors) |
| [ ] | `processDetailing` | Step 3 — final detailing (last touches, mirror reveal moment) |

## Academy classroom — `/academy` (8)

Teaching environment shots. Renders at **4:5 portrait** with `object-cover` in a grid.

**Deliver at: 1920×2400 (4:5 portrait), JPEG q90+**

| ✓ | Key | Suggested subject |
|---|-----|-------------------|
| [ ] | `academyClassroom01` | Wide classroom view (sets the scene) |
| [ ] | `academyClassroom02` | Instructor demoing on a model |
| [ ] | `academyClassroom03` | Students working at stations |
| [ ] | `academyClassroom04` | Close on tools / hands-on detail |
| [ ] | `academyClassroom05` | Group critique / discussion moment |
| [ ] | `academyClassroom06` | Student practicing on mannequin |
| [ ] | `academyClassroom07` | Whiteboard / theory moment |
| [ ] | `academyClassroom08` | Energy shot (laughter, candid) |

(Subject suggestions are a hint, not a hard spec — pick whatever 8 best images you have that vary tonally.)

## Content (2)

| ✓ | Key | Aspect / Dimensions | Page | Notes |
|---|-----|---------------------|------|-------|
| [ ] | `philosophyImage` | 4:5 portrait — **1920×2400** | `/about` | Founder portrait, editorial framing, breathing room around subject |
| [ ] | `servicesHeroImage` | wide 16:9 or 21:9 — **2400×1350** | `/services` | Studio interior, hero background. Subject centered, text overlays so leave space. |

## Videos (3)

**All deliver:** H.264 MP4, 1920×1080, ~3 Mbps, no audio, ≤15 sec, ≤8 MB. Use `ffmpeg -an -movflags +faststart` (see Universal rules above).

| ✓ | Key | Page |
|---|-----|------|
| [ ] | `heroVideo` | Homepage hero background loop |
| [ ] | `academyVideo` | `/academy` hero background loop |
| [ ] | `aboutVideo` | `/about` hero background loop |

**Loop tip:** start and end frames should be visually similar so the loop point is invisible. Slow camera moves loop better than fast cuts.

---

## How to upload

For each asset:

```bash
pnpm add-asset /path/to/downloaded-file.jpg --key teamJack --force
```

The `--force` is required because every key currently has a placeholder value, so add-asset would otherwise refuse the overwrite.

Batch tip — once each file is named to match its key (e.g. `teamJack.jpg`), recurse through the local folder layout above:

```bash
shopt -s globstar nullglob
for f in ~/Downloads/prax-assets/**/*.{jpg,jpeg,png,mp4,mov,webm}; do
  key=$(basename "$f" | sed 's/\.[^.]*$//')
  pnpm add-asset "$f" --key "$key" --force
done
```

You can also batch one folder at a time (e.g. `~/Downloads/prax-assets/team/*.jpg`) — the Blob folder is derived from the key, not from the local path, so directory structure on disk is purely organizational.

After each batch, commit and push so Vercel can preview-deploy:

```bash
git add lib/assets.ts
git commit -m "feat: add real team portraits"
git push
```

## Suggested order of attack

1. **High-leverage first** (~12 keys): `logo`, `logoX`, `textLogo`, all 7 team portraits, `heroVideo`, `philosophyImage`. Once these land, the homepage, team page, and about page feel real.
2. **`/services` content** (~5 keys): `servicesHeroImage`, 3 process shots, `beforeAfter01Before/After` pair.
3. **Per-stylist work samples** (18 keys, same spec, fast batch).
4. **Academy** (~9 keys): 8 classroom + `academyVideo`.
5. **`aboutVideo`** — last loop video.

## When you're done

Run a final check that no placeholders remain:

```bash
grep -c "makeImagePlaceholder" lib/assets.ts
# Should print: 0
```

If 0, every key has a real Vercel Blob URL and the site is asset-complete. Then we can run the responsive audit and lift maintenance.
