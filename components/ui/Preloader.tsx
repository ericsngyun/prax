'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { usePreloaderStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/utils';
import { cloudinaryAssets } from '@/lib/cloudinary';

/* ═══════════════════════════════════════════════════════════════════════════
   PRELOADER COMPONENT
   Branded loading experience with PRAX logo animation
   ═══════════════════════════════════════════════════════════════════════════ */

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const [displayProgress, setDisplayProgress] = useState(0);

  const { isLoading, progress, isComplete, setProgress, setComplete } = usePreloaderStore();

  // Simulate loading progress
  useEffect(() => {
    if (isComplete) return;

    const startTime = Date.now();
    const minDuration = 2000; // Minimum 2 seconds
    const maxDuration = 4000; // Maximum 4 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const naturalProgress = Math.min((elapsed / minDuration) * 100, 100);

      // Ease the progress for a more natural feel
      const easedProgress = easeOutExpo(naturalProgress / 100) * 100;
      setProgress(Math.min(easedProgress, 99));
      setDisplayProgress(Math.floor(easedProgress));

      if (elapsed < minDuration) {
        requestAnimationFrame(updateProgress);
      } else {
        // Complete the loading
        setProgress(100);
        setDisplayProgress(100);
        setTimeout(() => setComplete(true), 300);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [isComplete, setProgress, setComplete]);

  // Animate logo on mount
  useEffect(() => {
    if (!logoRef.current || prefersReducedMotion()) return;

    const logo = logoRef.current;

    // Initial state - hidden and scaled down
    gsap.set(logo, {
      opacity: 0,
      scale: 0.8,
    });

    // Fade in and scale up
    gsap.to(logo, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
    });

    // Subtle breathing animation
    gsap.to(logo, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.2,
    });
  }, []);

  // Exit animation when complete
  useEffect(() => {
    if (!isComplete || !containerRef.current) return;

    const container = containerRef.current;
    const logo = logoRef.current;
    const progress = progressRef.current;

    if (prefersReducedMotion()) {
      gsap.set(container, { opacity: 0, visibility: 'hidden' });
      return;
    }

    const tl = gsap.timeline();

    // Fade out progress
    if (progress) {
      tl.to(progress, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
      });
    }

    // Scale up and fade out logo
    if (logo) {
      tl.to(
        logo,
        {
          scale: 1.2,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
        },
        '-=0.2'
      );
    }

    // Slide up curtain
    tl.to(container, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.8,
      ease: 'power3.inOut',
    });

    // Hide container
    tl.set(container, { visibility: 'hidden' });
  }, [isComplete]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-[10001] bg-prax-black flex flex-col items-center justify-center',
        isComplete && 'pointer-events-none'
      )}
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      aria-hidden={isComplete}
    >
      {/* Logo */}
      <div ref={logoRef} className="relative w-56 h-56 md:w-80 md:h-80">
        <Image
          src={cloudinaryAssets.logo}
          alt="PRAX"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Progress */}
      <div ref={progressRef} className="mt-12 flex flex-col items-center gap-4">
        {/* Progress bar */}
        <div className="w-48 h-px bg-prax-graphite overflow-hidden">
          <div
            className="h-full bg-prax-white transition-all duration-100 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Progress text */}
        <span
          ref={progressTextRef}
          className="text-label text-prax-silver tabular-nums"
        >
          {displayProgress}%
        </span>
      </div>

      {/* Tagline */}
      <p className="absolute bottom-12 text-caption text-prax-silver tracking-widest uppercase">
        The Art of Precision
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRELOADER WRAPPER
   Wraps content and shows preloader on initial load
   ═══════════════════════════════════════════════════════════════════════════ */

interface PreloaderWrapperProps {
  children: React.ReactNode;
}

export function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  const { isComplete } = usePreloaderStore();
  const [hasShown, setHasShown] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run on client to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Check if preloader has been shown this session
    if (sessionStorage.getItem('preloaderShown')) {
      setHasShown(true);
      usePreloaderStore.getState().setComplete(true);
    }
  }, []);

  useEffect(() => {
    // Mark preloader as shown for this session
    if (isComplete && !hasShown) {
      sessionStorage.setItem('preloaderShown', 'true');
      setHasShown(true);
    }
  }, [isComplete, hasShown]);

  // During SSR and initial hydration, render children without preloader
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {!hasShown && <Preloader />}
      <div
        className={cn(
          'transition-opacity duration-500',
          !isComplete && !hasShown ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </>
  );
}

// Easing function
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
