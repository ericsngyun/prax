'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isMetaEnabled } from '@/lib/meta/config';
import { getMarketingConsent } from '@/lib/meta/consent';
import { trackMeta } from '@/lib/meta/client';

/* ═══════════════════════════════════════════════════════════════════════════
   VIEW CONTENT OBSERVER
   Fires ViewContent for a *meaningful* view, not a scroll-past. An element
   must be at least half visible continuously for the dwell period before it
   counts, and each piece of content counts once per page view.

   Opt in by annotating an element:
     data-prax-content="barber:jack-louii"
     data-prax-content-name="Jack Louii"
     data-prax-content-type="barber"
   ═══════════════════════════════════════════════════════════════════════════ */

const VISIBILITY_THRESHOLD = 0.5;
const DWELL_MS = 1500;

export function ViewContentObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isMetaEnabled || getMarketingConsent() !== 'granted') return;
    if (typeof IntersectionObserver === 'undefined') return;

    const targets = document.querySelectorAll<HTMLElement>('[data-prax-content]');
    if (!targets.length) return;

    const seen = new Set<string>();
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const id = el.dataset.praxContent;
          if (!id || seen.has(id)) continue;

          if (entry.isIntersecting && entry.intersectionRatio >= VISIBILITY_THRESHOLD) {
            if (timers.has(el)) continue;
            timers.set(
              el,
              setTimeout(() => {
                seen.add(id);
                timers.delete(el);
                observer.unobserve(el);
                trackMeta('ViewContent', {
                  content_type: el.dataset.praxContentType ?? 'content',
                  content_ids: [id],
                  ...(el.dataset.praxContentName ? { content_name: el.dataset.praxContentName } : {}),
                  source_path: window.location.pathname,
                });
              }, DWELL_MS)
            );
          } else {
            // Scrolled away before the dwell elapsed — it was not a real view.
            const timer = timers.get(el);
            if (timer) {
              clearTimeout(timer);
              timers.delete(el);
            }
          }
        }
      },
      { threshold: [VISIBILITY_THRESHOLD] }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      timers.forEach((t) => clearTimeout(t));
      observer.disconnect();
    };
    // Re-scan on navigation: App Router swaps the tree without remounting this.
  }, [pathname]);

  return null;
}
