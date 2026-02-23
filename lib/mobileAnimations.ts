/**
 * Mobile Animation Optimization Utility
 *
 * Provides mobile-optimized animation configurations to ensure:
 * - 60fps performance on mobile devices
 * - Battery conservation
 * - Reduced motion support
 * - Faster, simpler animations on touch devices
 */

export interface AnimationConfig {
  duration: number;
  stagger: number;
  ease: string;
  enabled: boolean;
  yOffset?: number;
}

/**
 * Detects if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detects if device is mobile based on viewport width
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Detects if device has touch capability
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
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

/**
 * Returns optimized GSAP ScrollTrigger config for mobile
 */
export function getMobileScrollTriggerConfig() {
  const isMobile = isMobileDevice();

  return {
    start: isMobile ? 'top 90%' : 'top 80%', // Trigger earlier on mobile
    end: isMobile ? 'bottom 20%' : 'bottom top',
    toggleActions: 'play none none reverse',
    // Disable scrubbing on mobile for better performance
    scrub: isMobile ? false : 0.3,
  };
}

/**
 * Returns optimized duration multiplier for mobile
 * Use this to scale existing animation durations
 */
export function getDurationMultiplier(): number {
  if (prefersReducedMotion()) return 0.01;
  if (isMobileDevice()) return 0.5; // 50% faster on mobile
  return 1; // Normal on desktop
}

/**
 * Disables/reduces complex animations on mobile
 */
export function shouldEnableComplexAnimations(): boolean {
  if (prefersReducedMotion()) return false;
  if (isMobileDevice()) return false;
  return true;
}

/**
 * Returns optimized parallax speed for mobile
 */
export function getParallaxSpeed(desktopSpeed: number = 0.5): number {
  if (!shouldEnableComplexAnimations()) return 0; // Disable parallax on mobile
  return desktopSpeed;
}

/**
 * Helper to conditionally apply will-change for performance
 * Only apply during animations, remove when idle
 */
export function applyWillChange(element: HTMLElement, properties: string = 'transform') {
  if (typeof window === 'undefined') return;
  element.style.willChange = properties;
}

export function removeWillChange(element: HTMLElement) {
  if (typeof window === 'undefined') return;
  element.style.willChange = 'auto';
}

/**
 * Performance-conscious animation wrapper
 * Automatically handles will-change optimization
 */
export function animateWithPerformance(
  element: HTMLElement,
  callback: () => void,
  properties: string = 'transform, opacity'
) {
  applyWillChange(element, properties);
  callback();

  // Remove will-change after animation completes
  setTimeout(() => {
    removeWillChange(element);
  }, getDurationMultiplier() * 1000);
}
