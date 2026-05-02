# Asset Checklist

Working doc — tick each box as you replace placeholders with real assets from Jack's Drive.

**Source:** Jack's PRAX Hair image/video/media folders on Google Drive
**Local working folder:** suggested `~/Downloads/prax-assets/` (or anywhere outside the repo)
**Tool:** `pnpm add-asset <file> --key <key> --force`

---

## File specs (request from photographer if needed)

- **Images:** JPEG, sRGB 8-bit, 2400 px on long edge, quality 90+, no pre-compression. Aim for 1–3 MB; 8 MB hard cap.
- **Videos:** H.264 1080p (1920×1080 max), ~3 Mbps, no audio track, ≤15 sec for hero loops. Aim for <8 MB.

---

## Brand (3)

| ✓ | Key | What's needed | Aspect |
|---|-----|---------------|--------|
| [ ] | `logo` | PRAX square mark — used in Header & Footer | square |
| [ ] | `logoX` | PRAX "X" mark — large hero accent | square |
| [ ] | `textLogo` | PRAX wordmark (text-only logo) | landscape, wide |

## Team portraits (6)

Editorial portraits, consistent lighting, dark/neutral background. Used in `/team` and as homepage references.

| ✓ | Key | Person | Role |
|---|-----|--------|------|
| [ ] | `teamJack` | Jack Louii | Founder & Lead Artist |
| [ ] | `teamGavin` | Gavin Chen | Master Barber |
| [ ] | `teamEdward` | Edward Santos | Senior Stylist |
| [ ] | `teamSteven` | Steven Park | Color Specialist |
| [ ] | `teamJared` | Jared Phan | Artist |
| [ ] | `teamAriel` | Ariel | Artist |
| [ ] | `teamBrandon` | Brandon Latung | Intern Artist |

## Team — additional (3)

| ✓ | Key | What's needed | Aspect |
|---|-----|---------------|--------|
| [ ] | `teamHeroBackground` | Wide landscape — `/team` hero background, atmospheric studio shot | landscape, wide |
| [ ] | `teamJackAction` | Jack working — candid, in motion | landscape |
| [ ] | `teamJaredAction` | Jared working — candid, in motion | landscape |

## Portfolio — homepage marquee (6)

Hero portfolio shots that scroll horizontally on the homepage. Best work, varied subjects.

| ✓ | Key |
|---|-----|
| [ ] | `portfolio01` |
| [ ] | `portfolio03` |
| [ ] | `portfolio04` |
| [ ] | `portfolio05` |
| [ ] | `portfolio06` |
| [ ] | `portfolio07` |

## Per-stylist work samples — `/team`

Cut/style detail shots, ideally each stylist's best 2–5.

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

Same client, two shots, framed identically. Show the transformation.

| ✓ | Key | What's needed |
|---|-----|---------------|
| [ ] | `beforeAfter01Before` | BEFORE shot — same client as After |
| [ ] | `beforeAfter01After` | AFTER shot — same client as Before |

## Process — `/services` (3)

Three steps of the cut experience.

| ✓ | Key | What's needed |
|---|-----|---------------|
| [ ] | `processConsultation` | Step 1 — consultation in progress |
| [ ] | `processCutting` | Step 2 — precision cutting |
| [ ] | `processDetailing` | Step 3 — final detailing |

## Academy classroom — `/academy` (8)

Teaching environment shots — classroom, students, instruction in progress.

| ✓ | Key |
|---|-----|
| [ ] | `academyClassroom01` |
| [ ] | `academyClassroom02` |
| [ ] | `academyClassroom03` |
| [ ] | `academyClassroom04` |
| [ ] | `academyClassroom05` |
| [ ] | `academyClassroom06` |
| [ ] | `academyClassroom07` |
| [ ] | `academyClassroom08` |

## Content (2)

| ✓ | Key | What's needed | Page |
|---|-----|---------------|------|
| [ ] | `philosophyImage` | Founder portrait, editorial framing | `/about` |
| [ ] | `servicesHeroImage` | Studio interior, hero background | `/services` |

## Videos (3)

| ✓ | Key | What's needed | Length |
|---|-----|---------------|--------|
| [ ] | `heroVideo` | Homepage hero background loop, 1080p, no audio | ≤15 s |
| [ ] | `academyVideo` | `/academy` hero background loop | ≤15 s |
| [ ] | `aboutVideo` | `/about` hero background loop | ≤15 s |

---

## How to upload

For each asset:

```bash
pnpm add-asset /path/to/downloaded-file.jpg --key teamJack --force
```

The `--force` is required because every key currently has a placeholder value, so add-asset would otherwise refuse the overwrite.

Batch tip — if you've named your downloaded files to match the keys (e.g. `teamJack.jpg`):

```bash
for f in ~/Downloads/prax-assets/*.{jpg,png,mp4}; do
  key=$(basename "$f" | sed 's/\.[^.]*$//')
  pnpm add-asset "$f" --key "$key" --force
done
```

After each batch, commit and push so Vercel can preview-deploy:

```bash
git add lib/assets.ts
git commit -m "feat: add real team portraits"
git push
```

## Suggested order of attack

1. **High-leverage first:** `logo`, `logoX`, `textLogo`, all 7 team portraits, `heroVideo`. Once these land, the homepage and team page already feel real.
2. **Process + before/after:** 5 keys, makes `/services` feel real.
3. **Per-stylist work samples:** 18 keys but they all have the same spec, fast batch.
4. **Academy classroom:** 8 keys.
5. **Videos for /academy and /about:** the remaining 2 video slots.

## When you're done

Run a final check that no placeholders remain:

```bash
grep -c "makeImagePlaceholder" lib/assets.ts
# Should print: 0
```

If 0, every key has a real Vercel Blob URL and the site is asset-complete. Then we can run the responsive audit and lift maintenance.
