'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn, prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface VideoBackgroundProps {
  src: string;
  webmSrc?: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
  scaleOnScroll?: boolean;
  scaleAmount?: number;
  fadeOnScroll?: boolean;
}

export function VideoBackground({
  src,
  webmSrc,
  poster,
  className,
  overlayClassName,
  scaleOnScroll = true,
  scaleAmount = 1.15,
  fadeOnScroll = false,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => setIsLoaded(true);
    const handleError = () => setHasError(true);

    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('error', handleError);

    // Try to play
    video.play().catch(() => {
      // Autoplay might be blocked, show poster
      setHasError(true);
    });

    return () => {
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (scaleOnScroll) {
        gsap.to(videoRef.current, {
          scale: scaleAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (fadeOnScroll) {
        gsap.to(containerRef.current, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '60% top',
            scrub: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [scaleOnScroll, scaleAmount, fadeOnScroll]);

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 overflow-hidden', className)}
    >
      {/* Poster fallback */}
      {poster && (
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center transition-opacity duration-700',
            isLoaded && !hasError ? 'opacity-0' : 'opacity-100'
          )}
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* Video */}
      {!hasError && (
        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b from-prax-ink/60 via-prax-ink/40 to-prax-ink',
          overlayClassName
        )}
      />
    </div>
  );
}
