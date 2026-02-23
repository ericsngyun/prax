'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (prefersReducedMotion()) {
      return;
    }

    // Detect mobile device
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const lenis = new Lenis({
      // Faster duration on mobile for more responsive feel
      duration: isMobile ? 1.0 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      // Disable smooth wheel on mobile (native scroll feel)
      smoothWheel: !isMobile,
      wheelMultiplier: 0.8,
      // More responsive touch on mobile
      touchMultiplier: isMobile ? 1.2 : 1.5,
      // Better touch sync on mobile
      syncTouch: isMobile,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // Make lenis available globally for scrollTo utility
    (window as Window & { lenis?: Lenis }).lenis = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for consistent animation timing
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(rafCallback);
      delete (window as Window & { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
}
