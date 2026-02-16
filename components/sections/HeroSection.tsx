'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { prefersReducedMotion } from '@/lib/utils';

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
  subheadline = 'PRAX is a high-end grooming studio in Los Angeles specializing in modern men\'s haircuts, executed with discipline, design, and intention.',
  primaryCTA = { text: 'Book an Appointment', href: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null' },
  secondaryCTA = { text: 'View Our Work', href: '#work' },
  videoSrc = '/videos/hero-bg.mp4',
  videoPoster = '/images/hero-poster.jpg',
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(headlineRef.current, { opacity: 0, y: 40 });
      gsap.set(kickerRef.current, { opacity: 0, y: 20 });
      gsap.set(subheadlineRef.current, { opacity: 0, y: 20 });
      gsap.set(ctaRef.current, { opacity: 0, y: 15 });

      // Entrance timeline - minimal, confident
      const tl = gsap.timeline({ delay: 0.6 });

      // Headline - simple fade
      tl.to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      });

      // Kicker
      tl.to(
        kickerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.6'
      );

      // Subheadline
      tl.to(
        subheadlineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4'
      );

      // CTA
      tl.to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // Fade content on scroll
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
        opacity: 0,
        y: -50,
        ease: 'none',
      });
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

      {/* Simple, clean overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-prax-black/30 via-prax-black/20 to-prax-black/70 z-[1]" />

      {/* Content - Centered logo with anchored copy */}
      <div
        ref={contentRef}
        className="relative z-10 h-full container-prax px-6 pt-16 md:pt-20 pb-16 md:pb-20"
      >
        <div className="h-full relative">
          {/* Centered logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1
              ref={headlineRef}
              className="text-prax-white"
            >
              <span className="sr-only">{headline}</span>
              <Image
                src="/images/prax-logo-white.png"
                alt="PRAX"
                width={480}
                height={240}
                priority
                className="w-44 sm:w-56 md:w-72 lg:w-80 h-auto"
              />
            </h1>
          </div>

          {/* Bottom-right copy block */}
          <div className="absolute bottom-0 right-0 flex flex-col items-end gap-6 md:gap-8">
            <p
              ref={kickerRef}
              className="text-body-sm md:text-body text-prax-stone/90 max-w-[18rem] md:max-w-sm text-right leading-relaxed"
            >
              {kicker}
            </p>
            <p
              ref={subheadlineRef}
              className="text-body md:text-body-lg text-prax-stone/80 max-w-md text-right leading-relaxed"
            >
              {subheadline}
            </p>

            {/* Single primary CTA - confident, not salesy */}
            <div ref={ctaRef}>
              <a
                href={primaryCTA.href}
                target={primaryCTA.href.startsWith('http') ? '_blank' : undefined}
                rel={primaryCTA.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn btn-primary text-body-sm"
                data-cursor="hover"
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
