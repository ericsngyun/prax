/**
 * Migration script: Cloudinary -> Vercel Blob
 *
 * Downloads each asset from Cloudinary (original quality),
 * uploads to Vercel Blob, and generates lib/assets.ts.
 *
 * Requires: BLOB_READ_WRITE_TOKEN env var
 * Usage: npx tsx scripts/migrate-to-blob.ts
 */

import { put } from '@vercel/blob';
import { createHash } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpc0d4a7s';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

// Current asset mapping: key -> { publicId, type, originalTransforms }
// We fetch with q_100 to get best quality originals for images
const assetMap: Record<string, { publicId: string; type: 'image' | 'video' }> = {
  // Brand
  logo: { publicId: 'prax_logo_cdbskt', type: 'image' },
  logoX: { publicId: 'prax-logo-x_qxhivx', type: 'image' },
  textLogo: { publicId: 'prax-text-logo_zdkdmr', type: 'image' },

  // Team portraits
  teamEdward: { publicId: 'team_edward_vlvez4', type: 'image' },
  teamGavin: { publicId: 'PRAXxSTMNT-Event-9_apdeyi', type: 'image' },
  teamJack: { publicId: 'PRAXxSTMNT-Event-29_hxxcjn', type: 'image' },
  teamSteven: { publicId: 'PRAXxSTMNT-Event-12_iwdkre', type: 'image' },
  teamJared: { publicId: 'RenderedImage_caryjl', type: 'image' },
  teamAriel: { publicId: 'IMG_8140_Original_eq0epb', type: 'image' },

  // Portfolio
  portfolio01: { publicId: 'image_01_idn021', type: 'image' },
  portfolio03: { publicId: 'image_03_cdoopv', type: 'image' },
  portfolio04: { publicId: 'image_04_ylgdla', type: 'image' },
  portfolio05: { publicId: 'image_05_rst3gz', type: 'image' },
  portfolio06: { publicId: 'image_06_hy5y5h', type: 'image' },
  portfolio07: { publicId: 'image_07_zhgc9d', type: 'image' },

  // Jack's work
  jackWork01: { publicId: 'IMG_4930_rh1hup', type: 'image' },
  jackWork02: { publicId: 'IMG_4935_htfz57', type: 'image' },
  jackWork03: { publicId: 'IMG_4931_kojzwq', type: 'image' },
  jackWork04: { publicId: 'IMG_4939_ktvv2m', type: 'image' },
  jackWork05: { publicId: 'IMG_4940_jcvdso', type: 'image' },

  // Gavin's work
  gavinWork01: { publicId: 'IMG_5350_bqwqbq', type: 'image' },
  gavinWork02: { publicId: 'IMG_5349_k82fmb', type: 'image' },
  gavinWork03: { publicId: 'IMG_5354_ga49iw', type: 'image' },
  gavinWork04: { publicId: 'IMG_5353_ieopgq', type: 'image' },

  // Steven's work
  stevenWork01: { publicId: 'IMG_5344_lrawxx', type: 'image' },
  stevenWork02: { publicId: 'IMG_5343_xwjuyx', type: 'image' },
  stevenWork03: { publicId: 'IMG_5342_y9atlh', type: 'image' },
  stevenWork04: { publicId: 'IMG_5341_pgsdkn', type: 'image' },

  // Jared's work
  jaredWork01: { publicId: 'IMG_5362_ivzgsc', type: 'image' },
  jaredWork02: { publicId: 'IMG_5361_rza7a9', type: 'image' },

  // Ariel's work
  arielWork01: { publicId: 'IMG_2570_iofp38', type: 'image' },
  arielWork02: { publicId: 'IMG_0246_ti086v', type: 'image' },
  arielWork03: { publicId: '04E2E046-7A5E-4332-9075-1A233611158D_me9ehx', type: 'image' },

  // Before/After
  beforeAfter01Before: { publicId: 'IMG_5371_xwg8oh', type: 'image' },
  beforeAfter01After: { publicId: 'IMG_5372_nlryw8', type: 'image' },

  // Process
  processConsultation: { publicId: 'Screenshot_2026-03-01_at_9.29.34_PM_a8k4be', type: 'image' },
  processCutting: { publicId: 'Screenshot_2026-03-01_at_9.30.05_PM_je4vld', type: 'image' },
  processDetailing: { publicId: 'Screenshot_2026-03-01_at_9.30.44_PM_bymkyu', type: 'image' },

  // Academy
  academyClassroom01: { publicId: 'DSC05494_ieuo7z', type: 'image' },
  academyClassroom02: { publicId: 'DSC05410_ftp8ad', type: 'image' },
  academyClassroom03: { publicId: 'DSC05443_wzotnm', type: 'image' },
  academyClassroom04: { publicId: 'DSC05507_lllr0d', type: 'image' },
  academyClassroom05: { publicId: 'DSC05464_fwgwln', type: 'image' },
  academyClassroom06: { publicId: 'DSC05420_pv8bgc', type: 'image' },
  academyClassroom07: { publicId: 'DSC05460_aljec1', type: 'image' },
  academyClassroom08: { publicId: 'DSC05448_jtyltx', type: 'image' },

  // Content
  philosophyImage: { publicId: 'image_02_egyihk', type: 'image' },
  servicesHeroImage: { publicId: 'DSC02662_1_zstxlc', type: 'image' },

  // Team page inline (previously hard-coded URLs in app/team/page.tsx)
  teamHeroBackground: { publicId: 'DSC06685_custv3', type: 'image' },
  teamJackAction: { publicId: 'PRAXxSTMNT-Event-42_1_zoznww', type: 'image' },
  teamJaredAction: { publicId: 'Screenshot_2026-02-23_at_8.12.10_PM_nswdr2', type: 'image' },
  teamBrandon: { publicId: 'DSC05741_hojyxk', type: 'image' },

  // Videos
  heroVideo: { publicId: 'hero-bg_iun7ay', type: 'video' },
  academyVideo: { publicId: 'academy-prax_unh9ay', type: 'video' },
  aboutVideo: { publicId: 'about-prax_am9dvd', type: 'video' },
};

function signUrl(publicId: string, type: 'image' | 'video', transforms: string): string {
  const resourceType = type === 'video' ? 'video' : 'image';
  const path = transforms ? `${transforms}/${publicId}` : publicId;

  if (!API_KEY || !API_SECRET) {
    return `${BASE_URL}/${resourceType}/upload/${path}`;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = createHash('sha1').update(toSign).digest('hex');

  return `${BASE_URL}/${resourceType}/upload/${path}?api_key=${API_KEY}&timestamp=${timestamp}&signature=${signature}`;
}

function getDownloadUrl(publicId: string, type: 'image' | 'video'): string {
  // Empty transform string yields the original upload (no Cloudinary processing)
  return signUrl(publicId, type, '');
}

function getFilename(key: string, contentType: string): string {
  const ext = contentType.includes('video')
    ? contentType.split('/')[1] || 'mp4'
    : contentType.split('/')[1] || 'jpg';
  return `prax/${key}.${ext}`;
}

async function migrate() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is required');
    process.exit(1);
  }

  if (!API_KEY || !API_SECRET) {
    console.warn('Warning: CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET not set — using unsigned URLs');
  }

  const entries = Object.entries(assetMap);
  console.log(`Migrating ${entries.length} assets...\n`);

  const results: Record<string, string> = {};
  const errors: string[] = [];

  for (const [key, { publicId, type }] of entries) {
    const url = getDownloadUrl(publicId, type);
    process.stdout.write(`  ${key}... `);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || (type === 'video' ? 'video/mp4' : 'image/jpeg');
      const blob = await response.blob();
      const filename = getFilename(key, contentType);

      const { url: blobUrl } = await put(filename, blob, {
        access: 'public',
        contentType,
      });

      results[key] = blobUrl;
      console.log(`OK (${(blob.size / 1024).toFixed(0)}KB)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`FAILED: ${msg}`);
      errors.push(`${key}: ${msg}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} asset(s) failed to migrate:`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  // Validate all keys have URLs
  for (const key of Object.keys(assetMap)) {
    if (!results[key]) {
      console.error(`Missing URL for asset: ${key}`);
      process.exit(1);
    }
  }

  // Generate lib/assets.ts
  const assetLines = Object.entries(results)
    .map(([key, url]) => `  ${key}: '${url}',`)
    .join('\n');

  const output = `// Auto-generated by scripts/migrate-to-blob.ts
// Vercel Blob URLs for all static assets — do not edit manually

export const assets = {
${assetLines}
} as const;

// Re-export for backward compatibility during migration
export const cloudinaryAssets = assets;
`;

  const outPath = join(import.meta.dirname, '..', 'lib', 'assets.ts');
  writeFileSync(outPath, output, 'utf-8');
  console.log(`\nGenerated ${outPath}`);
  console.log(`${Object.keys(results).length} assets migrated successfully.`);
}

migrate();
