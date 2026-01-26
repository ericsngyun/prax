const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function with progress
async function uploadFile(filePath, folder, resourceType = 'image') {
  try {
    console.log(`Uploading ${filePath}...`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `prax/${folder}`,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false,
    });
    console.log(`✓ Uploaded: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`✗ Failed to upload ${filePath}:`, error.message);
    throw error;
  }
}

async function uploadAllMedia() {
  console.log('Starting media upload to Cloudinary...\n');

  const uploads = [];

  // Upload logo
  uploads.push(uploadFile('public/images/prax_logo.png', 'brand', 'image'));

  // Upload team photos
  const teamFiles = fs.readdirSync('public/images/team');
  for (const file of teamFiles) {
    uploads.push(uploadFile(`public/images/team/${file}`, 'team', 'image'));
  }

  // Upload portfolio images
  const portfolioFiles = fs.readdirSync('public/images/portfolio');
  for (const file of portfolioFiles) {
    uploads.push(uploadFile(`public/images/portfolio/${file}`, 'portfolio', 'image'));
  }

  // Upload philosophy image
  uploads.push(uploadFile('public/images/image_02.jpg', 'content', 'image'));

  // Upload hero video
  uploads.push(uploadFile('public/videos/hero-bg.mp4', 'videos', 'video'));

  // Wait for all uploads
  const results = await Promise.all(uploads);

  console.log(`\n✓ Successfully uploaded ${results.length} files!`);

  // Output the URLs for reference
  console.log('\n=== Cloudinary URLs ===');
  results.forEach(r => {
    console.log(`${r.public_id}: ${r.secure_url}`);
  });
}

uploadAllMedia().catch(console.error);
