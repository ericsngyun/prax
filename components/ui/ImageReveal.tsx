'use client';

import { useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import { revealImage, revealHorizontal } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface ImageRevealProps extends Omit<ImageProps, 'ref'> {
  direction?: 'up' | 'left' | 'right';
  containerClassName?: string;
  frameColor?: string;
  showFrame?: boolean;
  frameOffset?: { x: number; y: number };
  delay?: number;
}

export function ImageReveal({
  direction = 'up',
  containerClassName,
  frameColor = 'var(--color-prax-bone)',
  showFrame = false,
  frameOffset = { x: 12, y: 12 },
  delay = 0,
  className,
  alt,
  ...props
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

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
        <Image
          className={cn('w-full h-full object-cover', className)}
          alt={alt}
          {...props}
        />
      </div>
    </div>
  );
}
