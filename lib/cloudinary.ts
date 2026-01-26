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
  const transforms = transformations || 'f_auto,q_auto';

  return `${BASE_URL}/${resourceType}/upload/${transforms}/${publicId}`;
}

// Preset URLs for common assets (using exact Cloudinary Public IDs)
export const cloudinaryAssets = {
  // Brand
  logo: getCloudinaryUrl('prax_logo_cdbskt'),

  // Team
  teamEdward: getCloudinaryUrl('team_edward_vlvez4'),
  teamGavin: getCloudinaryUrl('team_gavin_boqci5'),
  teamJack: getCloudinaryUrl('team_jack_hdrea7'),
  teamSteven: getCloudinaryUrl('team_steven_xb4m6t'),

  // Portfolio
  portfolio01: getCloudinaryUrl('image_01_idn021'),
  portfolio03: getCloudinaryUrl('image_03_cdoopv'),
  portfolio04: getCloudinaryUrl('image_04_ylgdla'),
  portfolio05: getCloudinaryUrl('image_05_rst3gz'),
  portfolio06: getCloudinaryUrl('image_06_hy5y5h'),
  portfolio07: getCloudinaryUrl('image_07_zhgc9d'),

  // Content
  philosophyImage: getCloudinaryUrl('image_02_egyihk'),

  // Videos
  heroVideo: getCloudinaryUrl('hero-bg_iun7ay', 'video', 'f_auto,q_auto'),
};
