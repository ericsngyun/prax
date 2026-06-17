'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { prefersReducedMotion } from '@/lib/utils';
import { getMobileAnimationConfig } from '@/lib/mobileAnimations';
import { assets } from '@/lib/assets';
import { blurPlaceholders } from '@/lib/blurPlaceholder';
import { BOOKING_URL } from '@/lib/constants';

interface HeroSectionProps {
  headline?: string;
  kicker?: string;
  subheadline?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  videoSrc?: string;
  videoPoster?: string;
}

export function HeroSection({
  headline = 'PRAX',
  kicker = 'Precision Haircuts for Men Who Care About Detail',
  subheadline = 'High-end grooming studio in Los Angeles. Executed with discipline, design, and intention.',
  primaryCTA = { text: 'Book an Appointment', href: BOOKING_URL },
  secondaryCTA = { text: 'View Our Work', href: '#work' },
  videoSrc = '/videos/hero-bg.mp4',
  videoPoster,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const bottomBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const config = getMobileAnimationConfig();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Simple entrance timeline — mobile-optimized
      const tl = gsap.timeline({ delay: isMobile ? 0.3 : 0.6 });

      // Logo fades in
      tl.from(logoRef.current, {
        opacity: 0,
        duration: config.duration * 2.5, // Still slower for logo impact
        ease: config.ease,
      });

      // Kicker fades in with delay
      tl.from(
        kickerRef.current,
        {
          opacity: 0,
          y: isMobile ? 8 : 10,
          duration: config.duration * 2,
          ease: config.ease,
        },
        '-=0.4'
      );

      // Bottom block fades up
      tl.from(
        bottomBlockRef.current,
        {
          opacity: 0,
          y: config.yOffset,
          duration: config.duration * 2,
          ease: config.ease,
        },
        '-=0.4'
      );

      // Scroll: simple opacity fade (no blur) - skip on mobile for performance
      if (!isMobile) {
        gsap.to(contentRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '60% top',
            scrub: true,
          },
          opacity: 0,
          ease: 'none',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[600px] overflow-hidden"
    >
      {/* Video Background */}
      <VideoBackground
        src={videoSrc}
        poster={videoPoster}
        scaleOnScroll
        scaleAmount={1.15}
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-prax-black/30 via-prax-black/20 to-prax-black/70 z-[1]" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full container-prax pt-16 md:pt-20 pb-10 md:pb-20"
      >
        <div className="h-full relative flex flex-col items-center justify-center">
          {/* Centered logo image */}
          <div ref={logoRef}>
            <Image
              src={assets.logoX}
              alt="PRAX Studio logo"
              width={320}
              height={320}
              priority
              quality={85}
              placeholder="blur"
              blurDataURL={blurPlaceholders.black}
              className="w-36 sm:w-48 md:w-72 lg:w-80 h-auto"
            />
            <h1 className="sr-only">{headline}</h1>
          </div>

          {/* Kicker — centered below logo */}
          <p
            ref={kickerRef}
            className="text-label text-prax-bone/80 tracking-[0.2em] md:tracking-[0.3em] mt-5 md:mt-8 text-center max-w-[280px] sm:max-w-none"
          >
            {kicker}
          </p>

          {/* New Location — subtle address chip */}
          <div className="mt-7 md:mt-10 flex justify-center">
            <a
              href="https://www.google.com/maps/search/?api=1&query=142+E+Huntington+Drive+Arcadia+CA+91006"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 md:gap-3 border border-prax-bone/15 bg-prax-black/40 backdrop-blur-sm px-3.5 py-2 md:px-4 md:py-2.5 hover:border-prax-bone/35 transition-colors duration-300"
            >
              {/* Editorial corner ticks */}
              <span className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-prax-bone/60" aria-hidden="true" />
              <span className="absolute -top-px -right-px w-1.5 h-1.5 border-t border-r border-prax-bone/60" aria-hidden="true" />
              <span className="absolute -bottom-px -left-px w-1.5 h-1.5 border-b border-l border-prax-bone/60" aria-hidden="true" />
              <span className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-prax-bone/60" aria-hidden="true" />

              <svg
                className="w-3 h-3 md:w-3.5 md:h-3.5 text-prax-bone/65 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 1.5c-2.8 0-5 2.2-5 5 0 3.75 5 8 5 8s5-4.25 5-8c0-2.8-2.2-5-5-5z"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <circle cx="8" cy="6.5" r="1.4" stroke="currentColor" strokeWidth="1" />
              </svg>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 leading-tight">
                <span className="text-label text-prax-bone/50 tracking-[0.2em] uppercase">
                  Now Open
                </span>
                <address className="not-italic text-caption md:text-body-sm text-prax-bone leading-snug">
                  142 E Huntington Dr, Arcadia
                </address>
              </div>

              <span
                className="text-caption text-prax-bone/65 group-hover:text-prax-bone group-hover:translate-x-0.5 transition-all duration-300 ml-0.5 md:ml-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </div>

          {/* Bottom block — centered on mobile, right-aligned on desktop */}
          <div
            ref={bottomBlockRef}
            className="absolute bottom-0 left-0 right-0 md:left-auto flex flex-col items-center md:items-end gap-5 md:gap-8"
          >
            <p
              className="text-body-sm md:text-body-lg text-prax-stone/80 max-w-sm md:max-w-md text-center md:text-right leading-relaxed"
            >
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a
                href={primaryCTA.href}
                target={primaryCTA.href.startsWith('http') ? '_blank' : undefined}
                rel={primaryCTA.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn btn-primary text-body-sm cursor-pointer"
              >
                {primaryCTA.text}
              </a>
              {secondaryCTA && (
                <a
                  href={secondaryCTA.href}
                  target={secondaryCTA.href.startsWith('http') ? '_blank' : undefined}
                  rel={secondaryCTA.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-2 text-body-sm text-prax-bone/90 hover:text-prax-white transition-colors duration-300 cursor-pointer"
                >
                  {secondaryCTA.text}
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
