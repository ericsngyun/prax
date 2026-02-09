'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, formatNumber } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PortfolioItem {
  src: string;
  alt: string;
  title?: string;
}

interface PortfolioSectionProps {
  label?: string;
  heading?: string;
  items?: PortfolioItem[];
}

const defaultItems: PortfolioItem[] = [
  { src: '/images/work/work-01.jpg', alt: 'Work 1', title: 'Precision Cut' },
  { src: '/images/work/work-02.jpg', alt: 'Work 2', title: 'Textured Fade' },
  { src: '/images/work/work-03.jpg', alt: 'Work 3', title: 'Classic Style' },
  { src: '/images/work/work-04.jpg', alt: 'Work 4', title: 'Modern Edge' },
  { src: '/images/work/work-05.jpg', alt: 'Work 5', title: 'Clean Lines' },
  { src: '/images/work/work-06.jpg', alt: 'Work 6', title: 'Artistic Vision' },
];

export function PortfolioSection({
  label = 'Selected Work',
  heading = 'Portfolio',
  items = defaultItems,
}: PortfolioSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !marqueeRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Separate effect for marquee animation (CSS-based for smoothness)
  useEffect(() => {
    if (!marqueeRef.current || prefersReducedMotion()) return;

    const marqueeInner = marqueeRef.current;
    const marqueeWidth = marqueeInner.scrollWidth / 2; // Half because we duplicate

    let animationId: number;
    let startTime: number;
    const duration = 40000; // 40 seconds for full loop

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      const x = -progress * marqueeWidth;

      marqueeInner.style.transform = `translate3d(${x}px, 0, 0)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-prax-black overflow-hidden relative"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="container-prax pb-12 md:pb-16"
      >
        <span className="text-label text-prax-bone uppercase tracking-widest block mb-4">
          {label}
        </span>
        <h2 className="text-display font-bold text-prax-white tracking-tight">
          {heading}
        </h2>
      </div>

      {/* Marquee Container with Blur Edges */}
      <div className="relative">
        {/* Left blur gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-prax-black via-prax-black/80 to-transparent z-10 pointer-events-none" />

        {/* Right blur gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-prax-black via-prax-black/80 to-transparent z-10 pointer-events-none" />

        {/* Infinite Marquee */}
        <div
          ref={marqueeRef}
          className="flex gap-6 md:gap-8 will-change-transform"
        >
          {/* First set of items */}
          {items.map((item, index) => (
            <div
              key={`first-${index}`}
              className="portfolio-item flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px] group relative"
            >
              {/* Number */}
              <span className="absolute -top-8 left-0 text-label text-prax-bone opacity-60">
                {formatNumber(index + 1)}
              </span>

              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-prax-charcoal">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="400px"
                  quality={85}
                  loading="lazy"
                  className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-prax-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  {item.title && (
                    <h3 className="text-body-lg font-medium text-prax-white">
                      {item.title}
                    </h3>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Duplicate set for seamless loop */}
          {items.map((item, index) => (
            <div
              key={`second-${index}`}
              className="portfolio-item flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px] group relative"
            >
              {/* Number */}
              <span className="absolute -top-8 left-0 text-label text-prax-bone opacity-60">
                {formatNumber(index + 1)}
              </span>

              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-prax-charcoal">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="400px"
                  quality={85}
                  loading="lazy"
                  className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-prax-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  {item.title && (
                    <h3 className="text-body-lg font-medium text-prax-white">
                      {item.title}
                    </h3>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
