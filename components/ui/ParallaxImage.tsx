'use client';

import { useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn, prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
    if (!containerRef.current || !imageRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { y: offset - 50 },
        {
          y: offset + 50 * speed,
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
      <div ref={imageRef} className="w-full h-full">
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
