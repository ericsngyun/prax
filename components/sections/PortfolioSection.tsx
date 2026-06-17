'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion, formatNumber } from '@/lib/utils';
import { revealWithBlur } from '@/lib/animations';

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
  // Effective pause = explicit user toggle OR transient hover. Refs drive the
  // rAF loop (no stale closures); `paused`/`motionOn` state drives the UI.
  const explicitPaused = useRef(false);
  const hovered = useRef(false);
  const [paused, setPaused] = useState(false);
  const [motionOn, setMotionOn] = useState(false);

  useEffect(() => {
    setMotionOn(!prefersReducedMotion());
  }, []);

  const togglePause = () => {
    explicitPaused.current = !explicitPaused.current;
    setPaused(explicitPaused.current);
  };

  useEffect(() => {
    if (!sectionRef.current || !marqueeRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
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

  // Image reveal animations - deferred and optimized
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    // Use Intersection Observer to only animate images when they're near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLElement;
            // Only apply animation if not already animated
            if (!img.dataset.animated) {
              img.dataset.animated = 'true';
              revealWithBlur(img, {
                trigger: img,
                start: 'top 85%',
              });
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    const portfolioImages = sectionRef.current.querySelectorAll('.portfolio-img');
    portfolioImages.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, []);

  // Constant-speed marquee loop, paused while off-screen and on hover.
  // Removed the scroll-velocity tracking — it added a continuous scroll
  // listener for a barely-perceptible speed nudge.
  useEffect(() => {
    if (!marqueeRef.current || prefersReducedMotion()) return;

    const marqueeInner = marqueeRef.current;
    const marqueeWidth = marqueeInner.scrollWidth / 2;
    const speedPxPerFrame = 0.5;

    let animationId = 0;
    let position = 0;
    let isIntersecting = false;

    const animate = () => {
      if (isIntersecting && !explicitPaused.current && !hovered.current) {
        position -= speedPxPerFrame;
        if (Math.abs(position) >= marqueeWidth) {
          position += marqueeWidth;
        }
        marqueeInner.style.transform = `translate3d(${position}px, 0, 0)`;
      }
      if (isIntersecting) {
        animationId = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (!isIntersecting && animationId) {
            cancelAnimationFrame(animationId);
            animationId = 0;
          } else if (isIntersecting && !animationId) {
            animationId = requestAnimationFrame(animate);
          }
        });
      },
      { rootMargin: '100px' }
    );
    observer.observe(marqueeInner);

    const handleMouseEnter = () => { hovered.current = true; };
    const handleMouseLeave = () => { hovered.current = false; };
    marqueeInner.addEventListener('mouseenter', handleMouseEnter);
    marqueeInner.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      marqueeInner.removeEventListener('mouseenter', handleMouseEnter);
      marqueeInner.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  const renderItem = (item: PortfolioItem, index: number, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${index}`}
      className="portfolio-item flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px] group relative transform-gpu"
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
              sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, 400px"
              quality={75}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgZmlsbD0iIzFhMWExYSIvPjwvc3ZnPg=="
              className="portfolio-img img-portfolio object-cover"
            />
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
        className="container-prax pb-12 md:pb-16 flex items-end justify-between gap-6"
      >
        <div>
          <span className="text-label text-prax-bone uppercase tracking-widest block mb-4">
            {label}
          </span>
          <h2 className="text-display text-prax-white tracking-tight">
            {heading}
          </h2>
        </div>

        {/* Accessible pause/play for the auto-scrolling marquee (WCAG 2.2.2) */}
        {motionOn && (
          <button
            type="button"
            onClick={togglePause}
            aria-pressed={paused}
            aria-label={paused ? 'Play portfolio carousel' : 'Pause portfolio carousel'}
            className="group shrink-0 inline-flex items-center gap-2 border border-prax-graphite hover:border-prax-stone px-3 py-2 text-prax-stone hover:text-prax-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-prax-white"
          >
            <span aria-hidden="true" className="text-[0.7rem] leading-none">
              {paused ? '▶' : '❚❚'}
            </span>
            <span className="text-label uppercase tracking-widest">
              {paused ? 'Play' : 'Pause'}
            </span>
          </button>
        )}
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Infinite Marquee */}
        <div
          ref={marqueeRef}
          className="flex gap-6 md:gap-8 will-change-transform"
        >
          {items.map((item, index) => renderItem(item, index, 'first'))}
          {items.map((item, index) => renderItem(item, index, 'second'))}
        </div>
      </div>
    </section>
  );
}
