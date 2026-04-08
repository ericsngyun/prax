'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { prefersReducedMotion } from '@/lib/utils';
import { getMobileAnimationConfig } from '@/lib/mobileAnimations';
import { cloudinaryAssets } from '@/lib/cloudinary';
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
      className="relative h-screen min-h-[600px] overflow-hidden"
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
              src={cloudinaryAssets.logoX}
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

          {/* Relocation Notice */}
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-body-sm text-prax-bone/50 tracking-[0.15em] uppercase mb-1.5">
              Relocation Coming Soon
            </p>
            <p className="text-body text-prax-stone/70 font-light mb-0.5">
              Prax Arcadia
            </p>
            <p className="text-body-sm text-prax-stone/50">
              Arcadia, CA
            </p>
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

            <div>
              <a
                href={primaryCTA.href}
                target={primaryCTA.href.startsWith('http') ? '_blank' : undefined}
                rel={primaryCTA.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn btn-primary text-body-sm cursor-pointer"
              >
                {primaryCTA.text}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
