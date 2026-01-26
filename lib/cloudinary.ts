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

  return `${BASE_URL}/${resourceType}/upload/${transforms}/home/prax/${path}`;
}

// Preset URLs for common assets
export const cloudinaryAssets = {
  // Brand
  logo: getCloudinaryUrl('brand/prax_logo.png'),

  // Team
  teamEdward: getCloudinaryUrl('team/team_edward.jpg'),
  teamGavin: getCloudinaryUrl('team/team_gavin.jpg'),
  teamJack: getCloudinaryUrl('team/team_jack.jpg'),
  teamSteven: getCloudinaryUrl('team/team_steven.jpg'),

  // Portfolio
  portfolio01: getCloudinaryUrl('portfolio/image_01.png'),
  portfolio03: getCloudinaryUrl('portfolio/image_03.png'),
  portfolio04: getCloudinaryUrl('portfolio/image_04.png'),
  portfolio05: getCloudinaryUrl('portfolio/image_05.png'),
  portfolio06: getCloudinaryUrl('portfolio/image_06.png'),
  portfolio07: getCloudinaryUrl('portfolio/image_07.png'),

  // Content
  philosophyImage: getCloudinaryUrl('content/image_02.jpg'),

  // Videos
  heroVideo: getCloudinaryUrl('videos/hero-bg.mp4', 'video', 'f_auto,q_auto'),
};
