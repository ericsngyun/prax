'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { META_PIXEL_ID, isMetaPixelEnabled, trackMetaEvent } from '@/lib/analytics';

/* ═══════════════════════════════════════════════════════════════════════════
   META PIXEL
   Renders nothing until NEXT_PUBLIC_META_PIXEL_ID is set, so this is safe to
   ship before the ads team hands over an ID.

   Two things the stock Meta snippet does NOT handle on its own, both covered
   below:

   1. SPA navigation. The base snippet fires PageView once, on script load.
      App Router route changes never reload it, so every page after the first
      would go unrecorded without the pathname effect.

   2. Off-site conversions. Booking and enrollment happen on Squire and
      praxacademy.com — domains we cannot install a pixel on. The closest
      trackable signal on prax.studio is the outbound click, so we fire it as
      a Lead the moment a visitor leaves for one of those destinations.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Outbound destinations that count as a conversion, and the event each fires. */
const CONVERSION_DESTINATIONS: { match: string; contentName: string }[] = [
  { match: 'getsquire.com', contentName: 'Booking — Squire' },
  { match: 'praxacademy.com', contentName: 'Academy — Enrollment' },
  { match: 'skool.com', contentName: 'Academy — Skool Community' },
];

export function MetaPixel() {
  const pathname = usePathname();
  const isInitialRender = useRef(true);

  // SPA route changes → PageView. Skipped on first render because the base
  // snippet already fired one at init.
  useEffect(() => {
    if (!isMetaPixelEnabled) return;
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    trackMetaEvent('PageView');
  }, [pathname]);

  // Outbound conversion clicks. One delegated listener in the capture phase
  // catches every booking/academy link on the site — including the ones GSAP
  // and the magnetic buttons wrap — without touching a single CTA component.
  useEffect(() => {
    if (!isMetaPixelEnabled) return;

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      const href = anchor?.getAttribute('href');
      if (!href) return;

      const destination = CONVERSION_DESTINATIONS.find((d) => href.includes(d.match));
      if (!destination) return;

      trackMetaEvent('Lead', {
        content_name: destination.contentName,
        source_path: window.location.pathname,
      });
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  if (!isMetaPixelEnabled) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
