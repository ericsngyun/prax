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

   A one-shot querySelectorAll at mount is NOT enough here. PreloaderWrapper
   returns a structurally different tree once it mounts, which remounts the
   whole children subtree and replaces every annotated node. An observer that
   scanned once would be left holding detached elements that can never
   intersect, and would silently report nothing. So the element set is
   re-scanned whenever the DOM changes, which also covers view transitions and
   any future component that swaps content in.
   ═══════════════════════════════════════════════════════════════════════════ */

const VISIBILITY_THRESHOLD = 0.5;
const DWELL_MS = 1500;

export function ViewContentObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isMetaEnabled || getMarketingConsent() !== 'granted') return;
    if (typeof IntersectionObserver === 'undefined') return;

    // Keyed by content id, not by element, so a remount of the same content
    // cannot report it twice.
    const seen = new Set<string>();
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();
    const observed = new WeakSet<Element>();

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

    const scan = () => {
      for (const el of document.querySelectorAll<HTMLElement>('[data-prax-content]')) {
        const id = el.dataset.praxContent;
        if (!id || seen.has(id) || observed.has(el)) continue;
        observed.add(el);
        observer.observe(el);
      }
    };

    scan();

    // Coalesce bursts of mutations into one rescan per frame. GSAP and Lenis
    // touch the DOM constantly; rescanning per mutation would be wasteful.
    let frame = 0;
    const mutations = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      mutations.disconnect();
      timers.forEach((t) => clearTimeout(t));
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
