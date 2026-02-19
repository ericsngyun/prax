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
  note?: string;
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
  const baseSpeed = useRef(1);
  const currentSpeed = useRef(1);

  useEffect(() => {
    if (!sectionRef.current || !marqueeRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header — simple fade up
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Marquee with scroll-velocity sensitivity (functional — keep)
  useEffect(() => {
    if (!marqueeRef.current || prefersReducedMotion()) return;

    const marqueeInner = marqueeRef.current;
    const marqueeWidth = marqueeInner.scrollWidth / 2;

    let animationId: number;
    let position = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    // Track scroll velocity
    const handleScroll = () => {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const scrollDelta = Math.abs(window.scrollY - lastScrollY);
        const velocity = scrollDelta / dt;
        currentSpeed.current = 1 + Math.min(velocity * 8, 2);
        lastScrollY = window.scrollY;
        lastTime = now;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      currentSpeed.current += (baseSpeed.current - currentSpeed.current) * 0.05;

      position -= 0.5 * currentSpeed.current;
      if (Math.abs(position) >= marqueeWidth) {
        position += marqueeWidth;
      }

      marqueeInner.style.transform = `translate3d(${position}px, 0, 0)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderItem = (item: PortfolioItem, index: number, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${index}`}
      className="portfolio-item flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px] group relative"
    >
      <span className="absolute -top-8 left-0 text-label text-prax-bone opacity-60">
        {formatNumber(index + 1)}
      </span>

      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-prax-charcoal">
        {item.src ? (
          <>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="400px"
              quality={85}
              loading="lazy"
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-prax-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              {item.title && (
                <h3 className="text-body-lg font-medium text-prax-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {item.title}
                </h3>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-prax-charcoal">
            <div className="text-center px-6">
              <div className="text-body text-prax-white/60 mb-2">
                {item.title || 'Portfolio Image'}
              </div>
              {item.note && (
                <div className="text-caption text-prax-stone/60">
                  {item.note}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
        <h2 className="text-display text-prax-white tracking-tight">
          {heading}
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-prax-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-prax-black to-transparent z-10 pointer-events-none" />

        {/* Infinite Marquee */}
        <div
          ref={marqueeRef}
          className="flex gap-6 md:gap-8 will-change-transform"
          data-cursor="drag"
        >
          {items.map((item, index) => renderItem(item, index, 'first'))}
          {items.map((item, index) => renderItem(item, index, 'second'))}
        </div>
      </div>
    </section>
  );
}
