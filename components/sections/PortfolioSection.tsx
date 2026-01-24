'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { horizontalScroll } from '@/lib/animations';
import { cn, prefersReducedMotion, formatNumber } from '@/lib/utils';

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
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !wrapperRef.current || prefersReducedMotion()) return;

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

      // Horizontal scroll
      const totalWidth = wrapperRef.current!.scrollWidth - sectionRef.current!.offsetWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(wrapperRef.current, {
        x: -totalWidth,
        ease: 'none',
      });

      // Item reveal
      const items = wrapperRef.current!.querySelectorAll('.portfolio-item');
      items.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            containerAnimation: tl,
            start: 'left 90%',
            end: 'left 60%',
            scrub: true,
          },
          opacity: 0.3,
          scale: 0.9,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen bg-prax-black overflow-hidden"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="container-prax pt-16 sm:pt-20 pb-8 sm:pb-12"
      >
        <span className="text-label text-prax-bone uppercase tracking-widest block mb-4">
          {label}
        </span>
        <h2 className="text-display font-bold text-prax-white tracking-tight">
          {heading}
        </h2>
      </div>

      {/* Horizontal Gallery */}
      <div
        ref={wrapperRef}
        data-scroll-wrapper
        className="flex gap-4 sm:gap-6 md:gap-8 px-4 sm:px-8 lg:px-16 h-[55vh] sm:h-[60vh]"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="portfolio-item flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[40vw] min-w-[280px] max-w-[500px] group relative"
          >
            {/* Number */}
            <span className="absolute -top-8 left-0 text-label text-prax-bone">
              {formatNumber(index + 1)}
            </span>

            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-prax-charcoal">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
    </section>
  );
}
