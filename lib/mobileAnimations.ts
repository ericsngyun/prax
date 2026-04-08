/**
 * Mobile Animation Optimization Utility
 *
 * Provides mobile-optimized animation configurations to ensure:
 * - 60fps performance on mobile devices
 * - Battery conservation
 * - Reduced motion support
 * - Faster, simpler animations on touch devices
 */

import { prefersReducedMotion } from '@/lib/utils';

export interface AnimationConfig {
  duration: number;
  stagger: number;
  ease: string;
  enabled: boolean;
  yOffset?: number;
}

/**
 * Detects if device is mobile based on viewport width
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Returns optimized animation config based on device and user preferences
 */
export function getMobileAnimationConfig(): AnimationConfig {
  // Respect reduced motion preference (highest priority)
  if (prefersReducedMotion()) {
    return {
      duration: 0.01,
      stagger: 0,
      ease: 'none',
      enabled: false,
      yOffset: 0,
    };
  }

  // Mobile-optimized config
  if (isMobileDevice()) {
    return {
      duration: 0.4, // Faster than desktop (0.8s)
      stagger: 0.05, // Reduced stagger
      ease: 'power2.out', // Simpler easing
      enabled: true,
      yOffset: 16, // Reduced y-offset
    };
  }

  // Desktop default config
  return {
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    enabled: true,
    yOffset: 24,
  };
}
