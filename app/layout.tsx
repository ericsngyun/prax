import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ViewTransitions } from 'next-view-transitions';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { ServiceWorkerProvider } from '@/components/providers/ServiceWorkerProvider';
import { Header } from '@/components/layout/Header';
import { PreloaderWrapper } from '@/components/ui/Preloader';
import { Footer } from '@/components/sections/Footer';
import { footerColumns } from '@/lib/footerConfig';

// Söhne — minimalist sans-serif with editorial polish.
// Every weight the design system actually uses must have a real face, or the
// browser synthesizes (faux-bolds) it. The type scale calls for 300 (light),
// 400 (book), 500 (font-medium), 600 (h3/h4), and 700 (h1/h2/display/title).
// Halbfett covers 500–600; Fett provides the true 700 for headlines.
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
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/sohne-font-family/TestSohne-Halbfett-BF663d89cd2d67b.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/sohne-font-family/TestSohne-Fett-BF663d89cca89ff.otf',
      weight: '700',
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
    <ViewTransitions>
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
    </ViewTransitions>
  );
}
