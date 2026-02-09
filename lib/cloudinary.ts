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

  // Team portraits (optimized for 800px max width, quality 80)
  teamEdward: getCloudinaryUrl('team_edward_vlvez4', 'image', 'f_auto,q_80,w_1200'),
  teamGavin: getCloudinaryUrl('team_gavin_boqci5', 'image', 'f_auto,q_80,w_1200'),
  teamJack: getCloudinaryUrl('team_jack_hdrea7', 'image', 'f_auto,q_80,w_1200'),
  teamSteven: getCloudinaryUrl('team_steven_xb4m6t', 'image', 'f_auto,q_80,w_1200'),

  // Portfolio images (optimized for portfolio grid, quality 85)
  portfolio01: getCloudinaryUrl('image_01_idn021', 'image', 'f_auto,q_85,w_1200'),
  portfolio03: getCloudinaryUrl('image_03_cdoopv', 'image', 'f_auto,q_85,w_1200'),
  portfolio04: getCloudinaryUrl('image_04_ylgdla', 'image', 'f_auto,q_85,w_1200'),
  portfolio05: getCloudinaryUrl('image_05_rst3gz', 'image', 'f_auto,q_85,w_1200'),
  portfolio06: getCloudinaryUrl('image_06_hy5y5h', 'image', 'f_auto,q_85,w_1200'),
  portfolio07: getCloudinaryUrl('image_07_zhgc9d', 'image', 'f_auto,q_85,w_1200'),

  // Content images
  philosophyImage: getCloudinaryUrl('image_02_egyihk', 'image', 'f_auto,q_85,w_1920'),

  // Videos (optimized for web delivery)
  heroVideo: getCloudinaryUrl('hero-bg_iun7ay', 'video', 'f_auto,q_auto,w_1920'),
};
