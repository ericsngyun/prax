import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Enable modern image formats (AVIF first for best compression, WebP fallback)
    formats: ['image/avif', 'image/webp'],

    // Optimized device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for smaller images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cloudinary remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dpc0d4a7s/**',
      },
    ],

    // Cache optimization - images are cached for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60, // 60 days

    // Allow dangerous SVG usage (we control our sources)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Optimize production builds
  experimental: {
    optimizePackageImports: ['gsap', 'lenis', 'clsx'],
  },
};

export default nextConfig;
