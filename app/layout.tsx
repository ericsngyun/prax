import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { Header } from '@/components/layout/Header';
// import { CustomCursor } from '@/components/ui/CustomCursor'; // Disabled - using default cursor
import { PreloaderWrapper } from '@/components/ui/Preloader';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
// import { BookButton } from '@/components/ui/BookButton'; // Removed - header has booking link

// Söhne — Minimalist sans-serif with editorial polish
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
    {
      path: '../public/fonts/sohne-font-family/TestSohne-Fett-BF663d89cca89ff.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/sohne-font-family/TestSohne-Extrafett-BF663d89cc9f2c0.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
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
    <html lang="en" className={sohneSans.variable}>
      <body className="bg-prax-ink text-prax-white font-sans antialiased">
        <LenisProvider>
          <PreloaderWrapper>
            <Header />
            {children}
          </PreloaderWrapper>
          <ScrollProgress />
        </LenisProvider>
        {/* Custom Cursor - Disabled for cleaner minimal experience */}
        {/* <CustomCursor /> */}
        {/* Fixed Book Button - Removed (header has booking link) */}
        {/* <BookButton /> */}
        {/* Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
