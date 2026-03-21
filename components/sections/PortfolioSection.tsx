'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, formatNumber } from '@/lib/utils';
import { tiltCardOnHover, revealWithBlur } from '@/lib/animations';

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
  const isPaused = useRef(false);

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

    // Subtle 3D tilt on portfolio items (desktop only, very minimal)
    if (window.innerWidth >= 768) {
      const portfolioItems = sectionRef.current.querySelectorAll('.portfolio-item-tilt');
      const cleanupFunctions: (() => void)[] = [];

      portfolioItems.forEach((item) => {
        const cleanup = tiltCardOnHover(item as HTMLElement, { strength: 2 }); // Very subtle - 2deg max
        if (cleanup) cleanupFunctions.push(cleanup);
      });

      return () => {
        ctx.revert();
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    }

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
                scrollTrigger: true,
                blurAmount: 8,
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

  // Marquee with scroll-velocity sensitivity (optimized)
  useEffect(() => {
    if (!marqueeRef.current || prefersReducedMotion()) return;

    const marqueeInner = marqueeRef.current;
    const marqueeWidth = marqueeInner.scrollWidth / 2;

    let animationId: number;
    let position = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let isIntersecting = false;
    let scrollThrottleId: number | null = null;

    // Intersection Observer - only run animation when section is visible
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

    // Throttled scroll velocity tracking - only update every 50ms
    const handleScroll = () => {
      if (scrollThrottleId !== null) return;

      scrollThrottleId = window.requestAnimationFrame(() => {
        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) {
          const scrollDelta = Math.abs(window.scrollY - lastScrollY);
          const velocity = scrollDelta / dt;
          currentSpeed.current = 1 + Math.min(velocity * 8, 2);
          lastScrollY = window.scrollY;
          lastTime = now;
        }
        scrollThrottleId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      // Only animate if visible and not paused
      if (isIntersecting && !isPaused.current) {
        currentSpeed.current += (baseSpeed.current - currentSpeed.current) * 0.05;
        position -= 0.5 * currentSpeed.current;
        if (Math.abs(position) >= marqueeWidth) {
          position += marqueeWidth;
        }
        marqueeInner.style.transform = `translate3d(${position}px, 0, 0)`;
      }

      if (isIntersecting) {
        animationId = requestAnimationFrame(animate);
      }
    };

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused.current = true;
    };

    const handleMouseLeave = () => {
      isPaused.current = false;
    };

    marqueeInner.addEventListener('mouseenter', handleMouseEnter);
    marqueeInner.addEventListener('mouseleave', handleMouseLeave);

    // Start animation if initially visible
    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (scrollThrottleId !== null) cancelAnimationFrame(scrollThrottleId);
      window.removeEventListener('scroll', handleScroll);
      marqueeInner.removeEventListener('mouseenter', handleMouseEnter);
      marqueeInner.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  const renderItem = (item: PortfolioItem, index: number, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${index}`}
      className="portfolio-item portfolio-item-tilt flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px] group relative transform-gpu"
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
              className="portfolio-img object-cover"
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
