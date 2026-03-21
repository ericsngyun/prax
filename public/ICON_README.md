# Icon & OG Image Assets

## Required Images

To complete the PWA and SEO setup, please add the following images to the `/public` directory:

### 1. Favicon & Icons
- **favicon.ico** (32x32 or 16x16)
  - Standard browser favicon

- **icon-192.png** (192x192)
  - PWA app icon for mobile home screen
  - Should be a simplified version of your logo on solid background

- **icon-512.png** (512x512)
  - PWA app icon for high-res displays
  - Same design as icon-192 but larger

- **apple-touch-icon.png** (180x180)
  - iOS home screen icon
  - Should have no transparency (solid background)

### 2. Open Graph (Social Sharing) Image
- **og-image.jpg** (1200x630)
  - Displays when sharing on social media
  - Should include:
    - PRAX logo/branding
    - Tagline: "Precision Haircuts for Men Who Care About Detail"
    - High-quality background image
    - Dark theme (#0d0d0d background)

## Design Guidelines

### Color Scheme
- Background: #0d0d0d (prax-ink)
- Primary: #e8e6e3 (prax-bone)
- Accent: #a8a29e (prax-stone)

### Icons (192x192, 512x512)
- Solid dark background (#0d0d0d)
- Centered logo/mark in bone color (#e8e6e3)
- 10-15% padding around logo
- Export as PNG with no transparency

### OG Image (1200x630)
- Dark, premium aesthetic
- Clear, legible text
- Professional imagery
- Test at small sizes (appears ~400px in feeds)

## Temporary Placeholders

Until you add custom images, the manifest and metadata reference these files. The site will work fine, but custom icons will enhance the PWA experience.

## Tools

- **Favicon Generator**: https://realfavicongenerator.net/
- **OG Image**: Use Figma/Photoshop with 1200x630 canvas
- **Icon Testing**: https://www.pwabuilder.com/imageGenerator
