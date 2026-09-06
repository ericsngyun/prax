'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { META_DATASET_ID, isMetaEnabled } from '@/lib/meta/config';
import { getMarketingConsent } from '@/lib/meta/consent';
import { trackMeta, trackPageView } from '@/lib/meta/client';
import type { CustomData, MetaEventName } from '@/lib/meta/events';

/* ═══════════════════════════════════════════════════════════════════════════
   META PIXEL
   Renders nothing without NEXT_PUBLIC_META_PIXEL_ID, and nothing when
   marketing consent is withheld — no script, no cookies, no events.

   Outbound clicks are classified here rather than in each CTA, because the
   booking links are spread across seven components and several are wrapped by
   GSAP magnetic buttons. One delegated capture-phase listener covers them all
   and cannot be forgotten when a new CTA is added.
   ═══════════════════════════════════════════════════════════════════════════ */

interface OutboundRule {
  match: (href: string) => boolean;
  event: MetaEventName;
  data: (href: string) => CustomData;
}

/** Which Squire tenant a booking URL belongs to — the shop is split across two. */
function squireTenant(href: string): string | undefined {
  const match = href.match(/getsquire\.com\/booking\/book\/([^/]+)/);
  return match?.[1];
}

const OUTBOUND_RULES: OutboundRule[] = [
  {
    // Booking intent. Deliberately NOT Schedule — nothing here confirms an
    // appointment; the booking completes on a domain we cannot observe.
    match: (href) => href.includes('getsquire.com'),
    event: 'BookNowClick',
    data: (href) => ({
      content_type: 'booking',
      ...(squireTenant(href) ? { booking_tenant: squireTenant(href) } : {}),
    }),
  },
  {
    match: (href) => href.includes('instagram.com'),
    event: 'Contact',
    data: () => ({ content_type: 'instagram' }),
  },
  {
    match: (href) => href.includes('tiktok.com'),
    event: 'Contact',
    data: () => ({ content_type: 'tiktok' }),
  },
  {
    match: (href) => href.startsWith('mailto:'),
    event: 'Contact',
    data: () => ({ content_type: 'email' }),
  },
  // praxacademy.com and skool.com are intentionally absent: those are Academy
  // conversions, and this dataset is tagged business_unit="studio". Mapping
  // them here would attribute Academy interest to studio campaigns.
];

export function MetaPixel() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Consent depends on browser-only signals (GPC, localStorage), so it cannot
  // be evaluated during SSR. Resolving it after mount keeps the server and the
  // first client render identical — reading it during render renders nothing
  // on the server and a script on the client, which is a hydration mismatch
  // that drops the pixel entirely.
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (isMetaEnabled && getMarketingConsent() === 'granted') setActive(true);
  }, []);

  // SPA route changes. The base snippet fires the first PageView at init, so
  // the first render is skipped to avoid doubling it.
  useEffect(() => {
    if (!active) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPageView();
  }, [pathname, active]);

  useEffect(() => {
    if (!active) return;

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      const href = anchor?.getAttribute('href');
      if (!href) return;

      const rule = OUTBOUND_RULES.find((r) => r.match(href));
      if (!rule) return;

      // Nearest annotated ancestor supplies context — which barber's card the
      // booking button sits in, for example — without threading props through
      // every CTA component.
      const context = anchor?.closest<HTMLElement>('[data-prax-content]');
      const contentId = context?.dataset.praxContent;
      const contentName = context?.dataset.praxContentName;

      trackMeta(rule.event, {
        ...rule.data(href),
        source_path: window.location.pathname,
        ...(contentId ? { content_ids: [contentId] } : {}),
        ...(contentName ? { content_name: contentName } : {}),
      });
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [active]);

  if (!active) return null;

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
fbq('init', '${META_DATASET_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_DATASET_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
