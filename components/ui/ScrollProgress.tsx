'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Minimal scroll progress indicator — 1px line at viewport top
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-px bg-prax-charcoal/30 z-[9999]">
      <div
        ref={barRef}
        className="h-full bg-prax-bone/40 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
