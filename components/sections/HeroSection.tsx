'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  videoSrc?: string;
  videoPoster?: string;
}

export function HeroSection({
  headline = 'Precision Haircuts for Men Who Care About Detail',
  subheadline = 'PRAX is a high-end grooming studio in Los Angeles specializing in modern men\'s haircuts, executed with discipline, design, and intention.',
  primaryCTA = { text: 'Book an Appointment', href: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null' },
  secondaryCTA = { text: 'View Our Work', href: '#work' },
  videoSrc = '/videos/hero-bg.mp4',
  videoPoster = '/images/hero-poster.jpg',
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(headlineRef.current, { opacity: 0, y: 40 });
      gsap.set(subheadlineRef.current, { opacity: 0, y: 20 });
      gsap.set(ctaRef.current, { opacity: 0, y: 15 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      // Entrance timeline - minimal, confident
      const tl = gsap.timeline({ delay: 0.6 });

      // Headline - simple fade
      tl.to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      });

      // Subheadline
      tl.to(
        subheadlineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.5'
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

      // Scroll indicator
      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.2'
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

      {/* Content - Centered, minimal, generous spacing */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col items-center justify-center container-prax px-6"
      >
        <div className="text-center max-w-4xl mx-auto space-y-10 md:space-y-12">
          {/* Headline - Bold sans, impactful */}
          <h1
            ref={headlineRef}
            className="text-h1 md:text-display text-prax-white leading-tight"
          >
            {headline}
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-body md:text-body-lg text-prax-stone/80 max-w-2xl mx-auto leading-relaxed"
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

      {/* Minimal scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-prax-stone uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-12 bg-prax-graphite relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-prax-bone animate-scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
