import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { Header } from '@/components/layout/Header';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { PreloaderWrapper } from '@/components/ui/Preloader';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { BookButton } from '@/components/ui/BookButton';

// Satoshi — Geometric sans-serif with street warmth
const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/satoshi-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi-black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Cormorant Garamond (Serif) - For editorial accent moments
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PRAX — Precision Haircuts for Men Who Care About Detail',
    template: '%s | PRAX',
  },
  description:
    'High-end grooming studio in Los Angeles specializing in precision haircuts, executed with discipline, design, and intention. Built, not rushed.',
  keywords: [
    'PRAX',
    'Jack Louii',
    'precision haircuts',
    'mens grooming',
    'Los Angeles barber',
    'high-end haircuts',
    'barber education',
    'mens hair studio',
  ],
  authors: [{ name: 'PRAX Studio' }],
  creator: 'PRAX Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prax.studio',
    siteName: 'PRAX',
    title: 'PRAX — Precision Haircuts for Men Who Care About Detail',
    description:
      'High-end grooming studio in Los Angeles. Precision haircuts executed with discipline, design, and intention.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PRAX — Precision Grooming Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRAX — Precision Haircuts',
    description: 'High-end grooming studio in Los Angeles. Built, not rushed.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0d0d0d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${cormorantGaramond.variable}`}>
      <body className="bg-prax-ink text-prax-white font-sans antialiased cursor-custom">
        <LenisProvider>
          <PreloaderWrapper>
            <Header />
            {children}
          </PreloaderWrapper>
          <ScrollProgress />
        </LenisProvider>
        {/* Custom Cursor */}
        <CustomCursor />
        {/* Fixed Book Button */}
        <BookButton />
        {/* Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
