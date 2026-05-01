# Asset Workflow

How to add new image and video assets to the PRAX site.

## Where assets live

- **Originals (your master files):** keep on your machine outside the repo (e.g. `~/Pictures/prax/`, an iCloud/Drive folder, or a backup drive). Never commit raw images to git.
- **Production copy:** Vercel Blob (`*.public.blob.vercel-storage.com/prax/<key>.<ext>`). The CDN that actually serves users.
- **Code reference:** `lib/assets.ts` — typed map of asset keys → Blob URLs. This is what your component code imports.

## Adding a new asset

```bash
pnpm add-asset <file-path> [--key <name>] [--type image|video] [--force] [--dry-run]
```

### What it does

1. Detects the media type from the file extension
2. Generates an asset key from the filename (`jack-new-cut.jpg` → `jackNewCut`), or uses your `--key` if passed
3. Uploads the file to Vercel Blob at `prax/<key>.<ext>`
4. Patches `lib/assets.ts` — appends the new entry under a `// Manually added (via add-asset)` section
5. Prints a `git diff` of the change for you to review
6. Does NOT auto-commit — `git add` and commit when you're satisfied

### Examples

```bash
# Most common: drop a file in, get a key
pnpm add-asset ~/Pictures/jack-new-cut.jpg
# → key auto-generated as "jackNewCut"

# Override the key
pnpm add-asset ~/Pictures/portfolio-08.jpg --key portfolio08

# Replace an existing asset (e.g., updated logo)
pnpm add-asset ~/Pictures/new-logo.png --key logo --force

# Preview without uploading or modifying anything
pnpm add-asset ~/Pictures/test.jpg --dry-run
```

### After running

In your component:

```tsx
import { assets } from '@/lib/assets';

<Image src={assets.jackNewCut} alt="Jack at work" />
```

Then commit:

```bash
git add lib/assets.ts
git commit -m "feat: add jackNewCut asset"
```

## Pre-requisites

- `BLOB_READ_WRITE_TOKEN` must be set in `.env.local` (run `vercel env pull .env.local --environment=development` to fetch it from Vercel)
- File must be a supported image (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, `.heic`, `.heif`) or video (`.mp4`, `.mov`, `.webm`, `.m4v`)

## What it does NOT do

- **Image optimization.** Next.js Image handles AVIF/WebP/responsive sizing at serve time. Upload originals, not pre-optimized variants.
- **Blur placeholders.** Use the existing presets in `lib/blurPlaceholder.ts` (`blurPlaceholders.charcoal`, `.portrait`, etc.) on the consuming `<Image>` component.
- **Batch upload.** One file per invocation. Loop in shell if you need multiple:

  ```bash
  for f in ~/Pictures/portfolio/*.jpg; do
    pnpm add-asset "$f"
  done
  ```

- **Asset deletion.** Use Vercel dashboard → Storage → Blob, or write a follow-up `pnpm remove-asset` if it becomes a pain point.
- **Section sorting.** New entries land in the `// Manually added (via add-asset)` block in insertion order. The migration-generated entries above stay grouped by section. If you want to reorganize, edit `lib/assets.ts` by hand.

## Testing the script itself

```bash
pnpm test:add-asset
```

Runs unit tests for `toCamelCaseKey`, `detectMediaType`, `parseAddAssetArgs`, `listExistingKeys`, and `patchAssetsFile`.
