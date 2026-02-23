'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { prefersReducedMotion } from '@/lib/utils';
import { getMobileAnimationConfig } from '@/lib/mobileAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  primaryCTA = { text: 'Book an Appointment', href: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null' },
  secondaryCTA = { text: 'View Our Work', href: '#work' },
  videoSrc = '/videos/hero-bg.mp4',
  videoPoster = '/images/hero-poster.jpg',
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
        className="relative z-10 h-full container-prax px-6 pt-16 md:pt-20 pb-16 md:pb-20"
      >
        <div className="h-full relative flex flex-col items-center justify-center">
          {/* Centered logo image */}
          <div ref={logoRef}>
            <Image
              src="/images/prax-logo-white.png"
              alt=""
              width={320}
              height={320}
              priority
              className="w-44 sm:w-56 md:w-72 lg:w-80 h-auto"
            />
            <span className="sr-only">{headline}</span>
          </div>

          {/* Kicker — centered below logo */}
          <p
            ref={kickerRef}
            className="text-label text-prax-bone/80 tracking-[0.3em] mt-6 md:mt-8 text-center"
          >
            {kicker}
          </p>

          {/* Bottom-right anchored block */}
          <div
            ref={bottomBlockRef}
            className="absolute bottom-0 right-0 flex flex-col items-end gap-6 md:gap-8"
          >
            <p
              className="text-body md:text-body-lg text-prax-stone/80 max-w-md text-right leading-relaxed"
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
