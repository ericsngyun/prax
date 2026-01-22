'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATION TOKENS
   ═══════════════════════════════════════════════════════════════════════════ */

export const ease = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  outExpo: 'expo.out',
  outBack: 'back.out(1.7)',
  spring: 'elastic.out(1, 0.5)',
} as const;

export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
  slower: 1.0,
  slowest: 1.4,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   TEXT ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Fade up animation with optional stagger for multiple elements
 */
export function fadeUp(
  element: HTMLElement | HTMLElement[] | NodeListOf<Element>,
  options?: {
    delay?: number;
    stagger?: number;
    scrollTrigger?: boolean;
  }
) {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }

  const config: gsap.TweenVars = {
    y: 60,
    opacity: 0,
    duration: duration.slower,
    ease: ease.out,
    delay: options?.delay ?? 0,
    stagger: options?.stagger ?? 0,
  };

  if (options?.scrollTrigger) {
    config.scrollTrigger = {
      trigger: element as HTMLElement,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    };
  }

  return gsap.from(element, config);
}

/**
 * Simple fade in animation
 */
export function fadeIn(
  element: HTMLElement | HTMLElement[],
  options?: {
    delay?: number;
    duration?: number;
  }
) {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 });
    return;
  }

  return gsap.from(element, {
    opacity: 0,
    duration: options?.duration ?? duration.slow,
    ease: ease.out,
    delay: options?.delay ?? 0,
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   IMAGE ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Image curtain reveal (bottom to top)
 */
export function revealImage(element: HTMLElement) {
  if (prefersReducedMotion()) {
    gsap.set(element, { clipPath: 'inset(0% 0 0 0)' });
    return;
  }

  gsap.set(element, { clipPath: 'inset(100% 0 0 0)' });

  return gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
    },
    clipPath: 'inset(0% 0 0 0)',
    duration: duration.slowest,
    ease: ease.inOut,
  });
}

/**
 * Stagger reveal for grid items (gallery, team, etc.)
 */
export function staggerReveal(container: HTMLElement, itemSelector: string) {
  const items = container.querySelectorAll(itemSelector);

  if (prefersReducedMotion()) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }

  return gsap.from(items, {
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
    },
    y: 80,
    opacity: 0,
    duration: duration.slower,
    ease: ease.out,
    stagger: {
      amount: 0.6,
      from: 'start',
    },
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL-DRIVEN ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Hero video scale on scroll
 */
export function heroVideoScale(video: HTMLElement, scale = 1.08) {
  if (prefersReducedMotion()) return;

  return gsap.to(video, {
    scrollTrigger: {
      trigger: video,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    scale,
    ease: 'none',
  });
}

/**
 * Parallax effect
 */
export function parallax(element: HTMLElement, speed = 0.5) {
  if (prefersReducedMotion()) return;

  return gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    y: (1 - speed) * 200,
    ease: 'none',
  });
}

/**
 * Fade content on scroll (hero text)
 */
export function fadeOnScroll(element: HTMLElement, distance = '60vh') {
  if (prefersReducedMotion()) return;

  return gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top top',
      end: distance,
      scrub: true,
    },
    opacity: 0,
    ease: 'none',
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTERACTIVE ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Magnetic button effect
 * Call this on mouseenter and track mouse position
 */
export function magneticButton(
  button: HTMLElement,
  strength = 0.35,
  options?: {
    onEnter?: () => void;
    onLeave?: () => void;
  }
) {
  if (prefersReducedMotion()) return;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * strength,
      y: y * strength,
      duration: duration.normal,
      ease: ease.out,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: duration.slow,
      ease: ease.outBack,
    });
    options?.onLeave?.();
  };

  const handleMouseEnter = () => {
    options?.onEnter?.();
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);
  button.addEventListener('mouseenter', handleMouseEnter);

  // Return cleanup function
  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
    button.removeEventListener('mouseenter', handleMouseEnter);
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Kill all ScrollTriggers for cleanup
 */
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

/**
 * Refresh all ScrollTriggers (useful after content changes)
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

/**
 * Create a timeline with common defaults
 */
export function createTimeline(options?: gsap.TimelineVars) {
  return gsap.timeline({
    defaults: {
      ease: ease.out,
      duration: duration.slow,
    },
    ...options,
  });
}
