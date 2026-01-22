'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { PreSplitText } from '@/components/ui/SplitText';
import { heroEntrance, fadeOnScroll, multiLayerParallax } from '@/lib/animations';
import { cn, prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  headline?: string;
  tagline?: string;
  videoSrc?: string;
  videoPoster?: string;
}

export function HeroSection({
  headline = 'PRECISION',
  tagline = 'Hair artistry redefined. Los Angeles.',
  videoSrc = '/videos/hero-bg.mp4',
  videoPoster = '/images/hero-poster.jpg',
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Initial states
      const chars = headlineRef.current?.querySelectorAll('.char');
      if (chars) {
        gsap.set(chars, { opacity: 0, y: 80 });
      }
      gsap.set(taglineRef.current, { opacity: 0, y: 30 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.5 });

      // Character reveal
      if (chars && chars.length > 0) {
        tl.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
        });
      }

      // Tagline
      tl.to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      );

      // Scroll indicator
      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.2'
      );

      // Multi-layer parallax on scroll
      if (watermarkRef.current && contentRef.current) {
        multiLayerParallax(
          [
            { element: watermarkRef.current, speed: 0.6 },
            { element: contentRef.current, speed: 0.9 },
          ],
          sectionRef.current!
        );
      }

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

      {/* Watermark */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[20vw] font-bold text-prax-white/[0.03] tracking-tighter">
          PRAX
        </span>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col items-center justify-center container-prax"
      >
        <div className="text-center">
          {/* Eyebrow */}
          <p className="text-label text-prax-bone tracking-widest mb-4 uppercase">
            The Art of
          </p>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-hero font-bold text-prax-white tracking-tighter leading-none mb-6"
          >
            <PreSplitText type="chars" charClassName="opacity-0">
              {headline}
            </PreSplitText>
          </h1>

          {/* Tagline */}
          <p
            ref={taglineRef}
            className="text-body text-prax-stone max-w-md mx-auto"
          >
            {tagline}
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs text-prax-bone uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-12 bg-prax-charcoal relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-prax-bone animate-scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
