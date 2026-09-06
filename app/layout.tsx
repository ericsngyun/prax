import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ViewTransitions } from 'next-view-transitions';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { ServiceWorkerProvider } from '@/components/providers/ServiceWorkerProvider';
import { Header } from '@/components/layout/Header';
import { PreloaderWrapper } from '@/components/ui/Preloader';
import { Footer } from '@/components/sections/Footer';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { ViewContentObserver } from '@/components/analytics/ViewContentObserver';
import { footerColumns } from '@/lib/footerConfig';

// Inter — the brand sans, self-hosted by next/font at build time (no runtime
// request to Google, no CLS from a swap).
//
// Replaced Söhne, which shipped here as Klim TRIAL files ("TestSohne-*.otf")
// under a befonts "Free for Personal Use" grant — not a licence that covers a
// commercial client site. The trial subset was also missing common glyphs:
// the "@" in praxhair@gmail.com was rendering in Arial mid-word, measured on
// the live privacy page. Inter is SIL OFL, covers the full Latin set, and is
// what praxacademy.com uses, so both properties read as one brand.
//
// Variable font: one file serves every weight the type scale calls for
// (300 light, 400 book, 500/600 medium, 700 display).
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://prax.studio'),
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
  manifest: '/manifest.json',
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
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PRAX — Precision Grooming Studio',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRAX — Precision Haircuts',
    description: 'High-end grooming studio in Los Angeles. Built, not rushed.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
    <ViewTransitions>
      <html lang="en" className={sans.variable}>
      <body className="bg-prax-ink text-prax-white font-sans antialiased">
        <ServiceWorkerProvider />
        <MetaPixel />
        <ViewContentObserver />
        <LenisProvider>
          <PreloaderWrapper>
            <Header />
            {children}
            <Footer columns={footerColumns} />
          </PreloaderWrapper>
        </LenisProvider>
        {/* Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
      </html>
    </ViewTransitions>
  );
}
