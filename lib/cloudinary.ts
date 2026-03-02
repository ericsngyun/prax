/**
 * Cloudinary URL helper
 * Generates optimized Cloudinary URLs for images and videos
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpc0d4a7s';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

export function getCloudinaryUrl(
  publicId: string,
  type: 'image' | 'video' = 'image',
  transformations?: string
): string {
  const resourceType = type === 'video' ? 'video' : 'image';
  const transforms = transformations || 'f_auto,q_auto,w_1920';

  return `${BASE_URL}/${resourceType}/upload/${transforms}/${publicId}`;
}

// Preset URLs for common assets (using exact Cloudinary Public IDs)
// Optimized with appropriate max widths and quality settings
export const cloudinaryAssets = {
  // Brand
  logo: getCloudinaryUrl('prax_logo_cdbskt', 'image', 'f_auto,q_auto,w_400'),
  textLogo: getCloudinaryUrl('prax-text-logo_zdkdmr', 'image', 'f_png,q_100,w_500'),

  // Team portraits (optimized for 800px max width, quality 80)
  teamEdward: getCloudinaryUrl('team_edward_vlvez4', 'image', 'f_auto,q_80,w_1200'),
  teamGavin: getCloudinaryUrl('PRAXxSTMNT-Event-9_apdeyi', 'image', 'f_auto,q_80,w_1200'),
  teamJack: getCloudinaryUrl('PRAXxSTMNT-Event-29_hxxcjn', 'image', 'f_auto,q_80,w_1200'),
  teamSteven: getCloudinaryUrl('PRAXxSTMNT-Event-12_iwdkre', 'image', 'f_auto,q_80,w_1200'),
  teamJared: getCloudinaryUrl('RenderedImage_caryjl', 'image', 'f_auto,q_80,w_1200'),
  teamAriel: getCloudinaryUrl('IMG_8140_Original_eq0epb', 'image', 'f_auto,q_80,w_1200'),

  // Portfolio images (optimized for portfolio grid, quality 85)
  portfolio01: getCloudinaryUrl('image_01_idn021', 'image', 'f_auto,q_85,w_1200'),
  portfolio03: getCloudinaryUrl('image_03_cdoopv', 'image', 'f_auto,q_85,w_1200'),
  portfolio04: getCloudinaryUrl('image_04_ylgdla', 'image', 'f_auto,q_85,w_1200'),
  portfolio05: getCloudinaryUrl('image_05_rst3gz', 'image', 'f_auto,q_85,w_1200'),
  portfolio06: getCloudinaryUrl('image_06_hy5y5h', 'image', 'f_auto,q_85,w_1200'),
  portfolio07: getCloudinaryUrl('image_07_zhgc9d', 'image', 'f_auto,q_85,w_1200'),

  // Jack's work (5 images)
  jackWork01: getCloudinaryUrl('IMG_4930_rh1hup', 'image', 'f_auto,q_85,w_1200'),
  jackWork02: getCloudinaryUrl('IMG_4935_htfz57', 'image', 'f_auto,q_85,w_1200'),
  jackWork03: getCloudinaryUrl('IMG_4931_kojzwq', 'image', 'f_auto,q_85,w_1200'),
  jackWork04: getCloudinaryUrl('IMG_4939_ktvv2m', 'image', 'f_auto,q_85,w_1200'),
  jackWork05: getCloudinaryUrl('IMG_4940_jcvdso', 'image', 'f_auto,q_85,w_1200'),

  // Gavin's work (4 images)
  gavinWork01: getCloudinaryUrl('IMG_5350_bqwqbq', 'image', 'f_auto,q_85,w_1200'),
  gavinWork02: getCloudinaryUrl('IMG_5349_k82fmb', 'image', 'f_auto,q_85,w_1200'),
  gavinWork03: getCloudinaryUrl('IMG_5354_ga49iw', 'image', 'f_auto,q_85,w_1200'),
  gavinWork04: getCloudinaryUrl('IMG_5353_ieopgq', 'image', 'f_auto,q_85,w_1200'),

  // Steven's work (4 images)
  stevenWork01: getCloudinaryUrl('IMG_5344_lrawxx', 'image', 'f_auto,q_85,w_1200'),
  stevenWork02: getCloudinaryUrl('IMG_5343_xwjuyx', 'image', 'f_auto,q_85,w_1200'),
  stevenWork03: getCloudinaryUrl('IMG_5342_y9atlh', 'image', 'f_auto,q_85,w_1200'),
  stevenWork04: getCloudinaryUrl('IMG_5341_pgsdkn', 'image', 'f_auto,q_85,w_1200'),

  // Jared's work (3 images)
  jaredWork01: getCloudinaryUrl('IMG_5362_ivzgsc', 'image', 'f_auto,q_85,w_1200'),
  jaredWork02: getCloudinaryUrl('IMG_5361_rza7a9', 'image', 'f_auto,q_85,w_1200'),

  // Ariel's work (3 images)
  arielWork01: getCloudinaryUrl('IMG_2570_iofp38', 'image', 'f_auto,q_85,w_1200'),
  arielWork02: getCloudinaryUrl('IMG_0246_ti086v', 'image', 'f_auto,q_85,w_1200'),
  arielWork03: getCloudinaryUrl('04E2E046-7A5E-4332-9075-1A233611158D_me9ehx', 'image', 'f_auto,q_85,w_1200'),

  // Before/After images
  beforeAfter01Before: getCloudinaryUrl('IMG_5371_xwg8oh', 'image', 'f_auto,q_85,w_1200'),
  beforeAfter01After: getCloudinaryUrl('IMG_5372_nlryw8', 'image', 'f_auto,q_85,w_1200'),

  // Experience timeline process images
  processConsultation: getCloudinaryUrl('Screenshot_2026-03-01_at_9.29.34_PM_a8k4be', 'image', 'f_auto,q_85,w_1200'),
  processCutting: getCloudinaryUrl('Screenshot_2026-03-01_at_9.30.05_PM_je4vld', 'image', 'f_auto,q_85,w_1200'),
  processDetailing: getCloudinaryUrl('Screenshot_2026-03-01_at_9.30.44_PM_bymkyu', 'image', 'f_auto,q_85,w_1200'),

  // Content images
  philosophyImage: getCloudinaryUrl('image_02_egyihk', 'image', 'f_auto,q_85,w_1920'),

  // Videos (optimized for web delivery)
  heroVideo: getCloudinaryUrl('hero-bg_iun7ay', 'video', 'f_auto,q_auto,w_1920'),
};
