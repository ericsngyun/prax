import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { ServiceWorkerProvider } from '@/components/providers/ServiceWorkerProvider';
import { Header } from '@/components/layout/Header';
import { PreloaderWrapper } from '@/components/ui/Preloader';
import { Footer } from '@/components/sections/Footer';
import { footerColumns } from '@/lib/footerConfig';

// Söhne — minimalist sans-serif with editorial polish.
// Audited Tailwind classes show only font-light (300), default (400), and
// font-medium (mapped to 600). Weights 700 / 800 were dead bytes — removed.
const sohneSans = localFont({
  src: [
    {
      path: '../public/fonts/sohne-font-family/TestSohne-Leicht-BF663d89cd4952e.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/sohne-font-family/TestSohne-Buch-BF663d89cd32e6a.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/sohne-font-family/TestSohne-Halbfett-BF663d89cd2d67b.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
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
    <html lang="en" className={sohneSans.variable}>
      <body className="bg-prax-ink text-prax-white font-sans antialiased">
        <ServiceWorkerProvider />
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
  );
}
