/**
 * Cloudinary URL helper
 * Generates optimized Cloudinary URLs for images and videos
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpc0d4a7s';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

export function getCloudinaryUrl(
  path: string,
  type: 'image' | 'video' = 'image',
  transformations?: string
): string {
  const resourceType = type === 'video' ? 'video' : 'image';
  const transforms = transformations || 'f_auto,q_auto';

  // Remove file extension from path as Cloudinary doesn't use it in URLs
  const pathWithoutExt = path.replace(/\.(png|jpg|jpeg|mp4|webp|gif)$/i, '');

  return `${BASE_URL}/${resourceType}/upload/${transforms}/home/prax/${pathWithoutExt}`;
}

// Preset URLs for common assets
export const cloudinaryAssets = {
  // Brand
  logo: getCloudinaryUrl('brand/prax_logo'),

  // Team
  teamEdward: getCloudinaryUrl('team/team_edward'),
  teamGavin: getCloudinaryUrl('team/team_gavin'),
  teamJack: getCloudinaryUrl('team/team_jack'),
  teamSteven: getCloudinaryUrl('team/team_steven'),

  // Portfolio
  portfolio01: getCloudinaryUrl('portfolio/image_01'),
  portfolio03: getCloudinaryUrl('portfolio/image_03'),
  portfolio04: getCloudinaryUrl('portfolio/image_04'),
  portfolio05: getCloudinaryUrl('portfolio/image_05'),
  portfolio06: getCloudinaryUrl('portfolio/image_06'),
  portfolio07: getCloudinaryUrl('portfolio/image_07'),

  // Content
  philosophyImage: getCloudinaryUrl('content/image_02'),

  // Videos
  heroVideo: getCloudinaryUrl('videos/hero-bg', 'video', 'f_auto,q_auto'),
};
