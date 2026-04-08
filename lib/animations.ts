'use client';

import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from './utils';

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
 * Horizontal curtain reveal (left to right or right to left)
 */
export function revealHorizontal(
  element: HTMLElement,
  direction: 'left' | 'right' = 'left',
  options?: {
    delay?: number;
    duration?: number;
  }
) {
  if (prefersReducedMotion()) {
    gsap.set(element, { clipPath: 'inset(0 0 0 0)' });
    return;
  }

  // Start fully hidden from the specified direction
  const startClip = direction === 'left'
    ? 'inset(0 100% 0 0)'
    : 'inset(0 0 0 100%)';

  gsap.set(element, { clipPath: startClip });

  return gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
    },
    clipPath: 'inset(0 0 0 0)',
    duration: options?.duration ?? duration.slowest,
    delay: options?.delay ?? 0,
    ease: ease.inOut,
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
   AWWWARDS-LEVEL SIGNATURE ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Split text animation - reveals text character by character or line by line
 */
export function textReveal(
  container: HTMLElement,
  type: 'chars' | 'lines' | 'words' = 'chars',
  options?: {
    scrollTrigger?: boolean;
    delay?: number;
    stagger?: number;
  }
) {
  if (prefersReducedMotion()) {
    gsap.set(container, { opacity: 1 });
    return;
  }

  const text = container.textContent || '';
  let elements: HTMLElement[] = [];

  if (type === 'chars') {
    container.innerHTML = text
      .split('')
      .map((char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');
    elements = Array.from(container.querySelectorAll('.char'));
  } else if (type === 'words') {
    container.innerHTML = text
      .split(' ')
      .map((word) => `<span class="word">${word}</span>`)
      .join(' ');
    elements = Array.from(container.querySelectorAll('.word'));
  } else if (type === 'lines') {
    // For lines, we assume content is already split with line breaks or we split by sentences
    const lines = text.split(/[.!?]+/).filter(Boolean);
    container.innerHTML = lines
      .map((line) => `<span class="line">${line.trim()}.</span>`)
      .join(' ');
    elements = Array.from(container.querySelectorAll('.line'));
  }

  gsap.set(elements, { opacity: 0, y: type === 'chars' ? 20 : 40 });

  const config: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    duration: type === 'chars' ? duration.fast : duration.slow,
    ease: ease.out,
    stagger: options?.stagger ?? (type === 'chars' ? 0.02 : 0.15),
    delay: options?.delay ?? 0,
  };

  if (options?.scrollTrigger) {
    config.scrollTrigger = {
      trigger: container,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    };
  }

  return gsap.to(elements, config);
}

/**
 * GPU-accelerated reveal using opacity + scale instead of filter:blur()
 * filter:blur() triggers paint on every frame; opacity+scale are compositor-only
 */
export function revealWithBlur(
  element: gsap.TweenTarget,
  options: {
    trigger?: gsap.DOMTarget;
    start?: string;
    duration?: number;
    delay?: number;
    y?: number;
    scale?: number;
  } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 });
    return;
  }

  const {
    trigger = element as gsap.DOMTarget,
    start = 'top 85%',
    duration: dur = duration.slow,
    delay = 0,
    y = 30,
    scale = 0.97,
  } = options;

  return gsap.from(element, {
    scrollTrigger: {
      trigger,
      start,
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y,
    scale,
    duration: dur,
    delay,
    ease: ease.out,
    clearProps: 'transform',
  });
}

/**
 * 3D Tilt Card Effect — Interactive depth on hover (Desktop only)
 * Premium micro-interaction for cards/images
 */
export function tiltCardOnHover(card: HTMLElement, options?: { strength?: number }) {
  // Skip on mobile/touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  if (prefersReducedMotion()) return;

  const strength = options?.strength ?? 5;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateX: y * strength * -1,
      rotateY: x * strength,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);

  // Return cleanup function
  return () => {
    card.removeEventListener('mousemove', handleMouseMove);
    card.removeEventListener('mouseleave', handleMouseLeave);
  };
}
