import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root to this app. Multiple lockfiles were detected
  // (a stray parent package-lock.json), which made Next infer the wrong root
  // for output file tracing. This forces correct, deterministic tracing.
  outputFileTracingRoot: process.cwd(),

  images: {
    // Enable modern image formats (AVIF first for best compression, WebP fallback)
    formats: ['image/avif', 'image/webp'],

    // Optimized device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for smaller images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Vercel Blob remote pattern (data: URIs work natively without config)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
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
