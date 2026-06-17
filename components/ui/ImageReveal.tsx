'use client';

import { useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { revealImage, revealHorizontal } from '@/lib/animations';
import { cn, prefersReducedMotion } from '@/lib/utils';

interface ImageRevealProps extends Omit<ImageProps, 'ref'> {
  direction?: 'up' | 'left' | 'right';
  containerClassName?: string;
  frameColor?: string;
  showFrame?: boolean;
  frameOffset?: { x: number; y: number };
  delay?: number;
  /**
   * Opt-in scroll parallax on the image (independent of the clip reveal).
   * Pass `true` for a subtle drift or a number (0–1) to tune the speed.
   * Desktop-only, non-touch, reduced-motion-safe.
   */
  parallax?: boolean | number;
}

export function ImageReveal({
  direction = 'up',
  containerClassName,
  frameColor = 'var(--color-prax-bone)',
  showFrame = false,
  frameOffset = { x: 12, y: 12 },
  delay = 0,
  parallax = false,
  className,
  alt,
  ...props
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageWrapperRef.current) return;

    let animation;
    if (direction === 'up') {
      animation = revealImage(imageWrapperRef.current);
    } else {
      animation = revealHorizontal(imageWrapperRef.current, direction, { delay });
    }

    return () => {
      if (animation && 'kill' in animation) {
        animation.kill();
      }
    };
  }, [direction, delay]);

  // Optional parallax — translates the overscaled inner layer (clipped by the
  // reveal wrapper's overflow-hidden, so it never reveals empty edges).
  useEffect(() => {
    if (!parallax || !parallaxRef.current || !containerRef.current || prefersReducedMotion()) return;
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const speed = typeof parallax === 'number' ? parallax : 0.5;
    const range = Math.min(speed, 1) * 4; // gentle drift for portraits

    const ctx = gsap.context(() => {
      // Slight scale provides the overscan; the wrapper's overflow-hidden clips it.
      gsap.fromTo(
        parallaxRef.current,
        { yPercent: -range, scale: 1.12 },
        {
          yPercent: range,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [parallax]);

  return (
    <div
      ref={containerRef}
      className={cn('relative', containerClassName)}
      style={showFrame ? {
        paddingRight: `${frameOffset.x}px`,
        paddingBottom: `${frameOffset.y}px`,
      } : undefined}
    >
      {/* Decorative frame */}
      {showFrame && (
        <div
          className="absolute top-0 left-0 w-full h-full border-2 pointer-events-none z-0"
          style={{
            borderColor: frameColor,
            transform: `translate(${frameOffset.x}px, ${frameOffset.y}px)`,
          }}
        />
      )}

      {/* Image with reveal */}
      <div
        ref={imageWrapperRef}
        className="relative z-10 overflow-hidden w-full h-full"
      >
        <div
          ref={parallaxRef}
          className={parallax ? 'w-full h-full will-change-transform' : 'w-full h-full'}
        >
          <Image
            className={cn('w-full h-full object-cover', className)}
            alt={alt}
            {...props}
          />
        </div>
      </div>
    </div>
  );
}
