import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { Header } from '@/components/layout/Header';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { PreloaderWrapper } from '@/components/ui/Preloader';

// PP Neue Montreal Font
const ppNeueMontreal = localFont({
  src: [
    {
      path: '../public/fonts/ppneuemontreal-book.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ppneuemontreal-medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ppneuemontreal-bold.otf',
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
  title: {
    default: 'PRAX — The Art of Precision',
    template: '%s | PRAX',
  },
  description:
    'Hair artistry redefined. Premium cuts, world-class education, and a global community. Los Angeles.',
  keywords: [
    'PRAX',
    'Jack Louii',
    'hair artist',
    'barber',
    'Los Angeles',
    'hair education',
    'premium haircuts',
  ],
  authors: [{ name: 'PRAX' }],
  creator: 'PRAX',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prax.studio',
    siteName: 'PRAX',
    title: 'PRAX — The Art of Precision',
    description:
      'Hair artistry redefined. Premium cuts, world-class education, and a global community.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PRAX — The Art of Precision',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRAX — The Art of Precision',
    description: 'Hair artistry redefined. Premium cuts, world-class education.',
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
    <html lang="en" className={ppNeueMontreal.variable}>
      <body className="bg-prax-ink text-prax-white font-sans antialiased cursor-custom">
        <LenisProvider>
          <PreloaderWrapper>
            <Header />
            {children}
          </PreloaderWrapper>
        </LenisProvider>
        {/* Custom Cursor */}
        <CustomCursor />
        {/* Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
