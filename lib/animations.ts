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

/* ═══════════════════════════════════════════════════════════════════════════
   ADVANCED ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Multi-layer parallax effect for hero sections
 * Each layer moves at a different speed creating depth
 */
export function multiLayerParallax(
  layers: { element: HTMLElement; speed: number }[],
  trigger?: HTMLElement
) {
  if (prefersReducedMotion()) return [];

  const triggerElement = trigger || layers[0]?.element;
  if (!triggerElement) return [];

  return layers.map(({ element, speed }) => {
    return gsap.to(element, {
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: (1 - speed) * 300,
      ease: 'none',
    });
  });
}

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

/**
 * Hero entrance sequence - orchestrated timeline for hero elements
 */
export function heroEntrance(
  container: HTMLElement,
  elements: {
    video?: HTMLElement;
    headline?: HTMLElement;
    tagline?: HTMLElement;
    scrollIndicator?: HTMLElement;
  }
) {
  if (prefersReducedMotion()) {
    Object.values(elements).forEach((el) => {
      if (el) gsap.set(el, { opacity: 1, y: 0, scale: 1 });
    });
    return;
  }

  const tl = createTimeline({ delay: 0.3 });

  // Video/background fade in with subtle scale
  if (elements.video) {
    gsap.set(elements.video, { opacity: 0, scale: 1.1 });
    tl.to(elements.video, {
      opacity: 1,
      scale: 1,
      duration: duration.slowest,
      ease: ease.out,
    });
  }

  // Headline character reveal
  if (elements.headline) {
    const chars = elements.headline.querySelectorAll('.char');
    if (chars.length > 0) {
      gsap.set(chars, { opacity: 0, y: 50 });
      tl.to(
        chars,
        {
          opacity: 1,
          y: 0,
          duration: duration.slow,
          stagger: 0.03,
          ease: ease.out,
        },
        '-=0.8'
      );
    } else {
      gsap.set(elements.headline, { opacity: 0, y: 60 });
      tl.to(
        elements.headline,
        {
          opacity: 1,
          y: 0,
          duration: duration.slower,
          ease: ease.out,
        },
        '-=0.8'
      );
    }
  }

  // Tagline fade up
  if (elements.tagline) {
    gsap.set(elements.tagline, { opacity: 0, y: 30 });
    tl.to(
      elements.tagline,
      {
        opacity: 1,
        y: 0,
        duration: duration.slow,
        ease: ease.out,
      },
      '-=0.5'
    );
  }

  // Scroll indicator
  if (elements.scrollIndicator) {
    gsap.set(elements.scrollIndicator, { opacity: 0 });
    tl.to(
      elements.scrollIndicator,
      {
        opacity: 1,
        duration: duration.slow,
        ease: ease.out,
      },
      '-=0.2'
    );
  }

  return tl;
}

/**
 * Horizontal scroll gallery - pins section and scrolls content horizontally
 */
export function horizontalScroll(
  container: HTMLElement,
  options?: {
    itemSelector?: string;
    spacing?: number;
  }
) {
  if (prefersReducedMotion()) return;

  const wrapper = container.querySelector('[data-scroll-wrapper]') as HTMLElement;
  if (!wrapper) return;

  const items = options?.itemSelector
    ? wrapper.querySelectorAll(options.itemSelector)
    : wrapper.children;

  // Calculate total scroll distance
  const totalWidth = wrapper.scrollWidth - container.offsetWidth;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: () => `+=${totalWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.to(wrapper, {
    x: -totalWidth,
    ease: 'none',
  });

  // Stagger reveal items as they come into view
  if (items.length > 0) {
    gsap.set(items, { opacity: 0.5, scale: 0.95 });

    Array.from(items).forEach((item, index) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item as HTMLElement,
          containerAnimation: tl,
          start: 'left 80%',
          end: 'left 20%',
          scrub: true,
        },
        opacity: 1,
        scale: 1,
        ease: 'none',
      });
    });
  }

  return tl;
}

/**
 * Stagger cards animation with optional hover effects
 */
export function staggerCards(
  container: HTMLElement,
  cardSelector: string,
  options?: {
    delay?: number;
    direction?: 'up' | 'left' | 'right';
  }
) {
  const cards = container.querySelectorAll(cardSelector);

  if (prefersReducedMotion()) {
    gsap.set(cards, { opacity: 1, y: 0, x: 0 });
    return;
  }

  const dir = options?.direction ?? 'up';
  const initialState = {
    opacity: 0,
    y: dir === 'up' ? 60 : 0,
    x: dir === 'left' ? -60 : dir === 'right' ? 60 : 0,
  };

  gsap.set(cards, initialState);

  return gsap.to(cards, {
    scrollTrigger: {
      trigger: container,
      start: 'top 75%',
    },
    opacity: 1,
    y: 0,
    x: 0,
    duration: duration.slower,
    ease: ease.out,
    stagger: 0.12,
    delay: options?.delay ?? 0,
  });
}
