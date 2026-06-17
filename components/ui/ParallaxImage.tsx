'use client';

import { useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { cn, prefersReducedMotion } from '@/lib/utils';

interface ParallaxImageProps extends Omit<ImageProps, 'ref'> {
  speed?: number;
  containerClassName?: string;
  offset?: number;
  sizes?: string;
  quality?: number;
}

export function ParallaxImage({
  speed = 0.5,
  containerClassName,
  offset = 0,
  className,
  alt,
  sizes = '100vw',
  quality = 85,
  ...props
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;
    if (prefersReducedMotion()) return;
    // Skip on touch — parallax tied to scroll feels off on momentum scrolling,
    // and it matches the Lenis policy (smooth scroll is desktop-only here).
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const ctx = gsap.context(() => {
      // The inner layer is overscaled (h-130%, -top-15%) so translating it
      // never reveals empty space above/below the frame.
      const range = Math.min(speed, 1) * 10; // yPercent travel, capped to the overscan
      gsap.fromTo(
        imageRef.current,
        { yPercent: -range },
        {
          yPercent: range,
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
  }, [speed, offset]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', containerClassName)}
    >
      <div ref={imageRef} className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform">
        <Image
          className={cn('object-cover w-full h-full', className)}
          alt={alt}
          sizes={sizes}
          quality={quality}
          {...props}
        />
      </div>
    </div>
  );
}
