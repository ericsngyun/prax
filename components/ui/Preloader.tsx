'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { usePreloaderStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/utils';
import { cloudinaryAssets } from '@/lib/cloudinary';

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [displayProgress, setDisplayProgress] = useState(0);

  const { isComplete, setProgress, setComplete } = usePreloaderStore();

  // Simulate loading progress
  useEffect(() => {
    if (isComplete) return;

    const startTime = Date.now();
    const minDuration = 2000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const naturalProgress = Math.min((elapsed / minDuration) * 100, 100);
      const easedProgress = easeOutExpo(naturalProgress / 100) * 100;
      setProgress(Math.min(easedProgress, 99));
      setDisplayProgress(Math.floor(easedProgress));

      if (elapsed < minDuration) {
        requestAnimationFrame(updateProgress);
      } else {
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

    gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
    gsap.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.2,
    });
  }, []);

  // Exit animation — simple opacity fade-out
  useEffect(() => {
    if (!isComplete || !containerRef.current) return;

    const container = containerRef.current;
    const logo = logoRef.current;
    const counter = counterRef.current;

    if (prefersReducedMotion()) {
      gsap.set(container, { opacity: 0, visibility: 'hidden' });
      return;
    }

    const tl = gsap.timeline();

    // Fade out counter
    if (counter) {
      tl.to(counter, {
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

    // Simple opacity fade-out
    tl.to(container, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    tl.set(container, { visibility: 'hidden' });
  }, [isComplete]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-[10001] bg-prax-black flex flex-col items-center justify-center',
        isComplete && 'pointer-events-none'
      )}
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

      {/* Progress counter — large display text */}
      <div ref={counterRef} className="mt-12 flex flex-col items-center gap-4">
        {/* Progress bar */}
        <div className="w-48 h-px bg-prax-graphite overflow-hidden">
          <div
            className="h-full bg-prax-white transition-all duration-100 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Progress text — larger for impact */}
        <span className="text-display font-light text-prax-silver/40 tabular-nums">
          {displayProgress}
        </span>
      </div>

      {/* Tagline */}
      <p className="absolute bottom-12 text-caption text-prax-silver tracking-widest uppercase">
        The Art of Precision
      </p>
    </div>
  );
}

interface PreloaderWrapperProps {
  children: React.ReactNode;
}

export function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  const { isComplete } = usePreloaderStore();
  const [hasShown, setHasShown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem('preloaderShown')) {
      setHasShown(true);
      usePreloaderStore.getState().setComplete(true);
    }
  }, []);

  useEffect(() => {
    if (isComplete && !hasShown) {
      sessionStorage.setItem('preloaderShown', 'true');
      setHasShown(true);
    }
  }, [isComplete, hasShown]);

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

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
