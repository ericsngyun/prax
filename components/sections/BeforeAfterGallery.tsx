'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';
import { revealWithBlur } from '@/lib/animations';
import { blurPlaceholders } from '@/lib/blurPlaceholder';

interface BeforeAfterItem {
  beforeSrc: string;
  afterSrc: string;
  title: string;
  service: string;
}

interface BeforeAfterGalleryProps {
  heading?: string;
  items: BeforeAfterItem[];
}

export function BeforeAfterGallery({
  heading = 'Results',
  items,
}: BeforeAfterGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
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

  // Image reveal animations
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const galleryImages = sectionRef.current.querySelectorAll('.before-after-img');
    galleryImages.forEach((img) => {
      revealWithBlur(img as HTMLElement, {
        trigger: img as HTMLElement,
        start: 'top 85%',
      });
    });
  }, []);

  // Single item layout (centered, featured)
  if (items.length === 1) {
    const item = items[0];
    return (
      <section ref={sectionRef} className="section-padding bg-prax-black">
        <div className="container-prax max-w-5xl mx-auto">
          <h2
            ref={headingRef}
            className="text-h1 font-light text-prax-white text-center mb-16 md:mb-20"
          >
            {heading}
          </h2>

          {/* Featured Before/After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            {/* Before */}
            <div className="relative aspect-[3/4] bg-prax-charcoal overflow-hidden rounded-sm">
              <div className="absolute top-4 left-4 z-10 text-label text-prax-bone bg-prax-black/70 px-4 py-2 backdrop-blur-sm rounded-sm">
                BEFORE
              </div>
              {item.beforeSrc && (
                <Image
                  src={item.beforeSrc}
                  alt={`${item.title} - Before`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={80}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={blurPlaceholders.portrait}
                  className="before-after-img object-cover"
                />
              )}
            </div>

            {/* After */}
            <div className="relative aspect-[3/4] bg-prax-charcoal overflow-hidden rounded-sm">
              <div className="absolute top-4 left-4 z-10 text-label text-prax-bone bg-prax-black/70 px-4 py-2 backdrop-blur-sm rounded-sm">
                AFTER
              </div>
              {item.afterSrc && (
                <Image
                  src={item.afterSrc}
                  alt={`${item.title} - After`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={80}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={blurPlaceholders.portrait}
                  className="before-after-img object-cover"
                />
              )}
            </div>
          </div>

          {/* Transformation Highlight */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="h-px flex-1 bg-prax-graphite" />
              <svg
                className="w-6 h-6 text-prax-bone/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="h-px flex-1 bg-prax-graphite" />
            </div>
            <p className="text-body-lg text-prax-stone leading-relaxed">
              Precision cutting designed to maintain structure as it grows. Built for consistency, not just the first day.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Multiple items layout (horizontal scroll)
  return (
    <section ref={sectionRef} className="py-20 md:py-24 bg-prax-black overflow-hidden">
      <div className="container-prax mb-12">
        <h2
          ref={headingRef}
          className="text-h1 font-light text-prax-white"
        >
          {heading}
        </h2>
      </div>

      {/* Horizontal scroll container with snap */}
      <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex gap-8 px-6 md:px-16 pb-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[85vw] md:w-[600px] group snap-center"
            >
              {/* Before/After comparison */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Before */}
                <div className="relative aspect-[3/4] bg-prax-charcoal overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 text-label text-prax-bone bg-prax-black/60 px-3 py-1 backdrop-blur-sm">
                    BEFORE
                  </div>
                  {item.beforeSrc ? (
                    <Image
                      src={item.beforeSrc}
                      alt={`${item.title} - Before`}
                      fill
                      sizes="(max-width: 768px) 40vw, 300px"
                      quality={80}
                      loading="lazy"
                      className="before-after-img object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-prax-charcoal">
                      <div className="text-center p-6">
                        <div className="text-prax-silver text-sm mb-2">
                          BEFORE PHOTO
                        </div>
                        <div className="text-prax-stone text-xs">
                          Portrait shot, consistent lighting
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* After */}
                <div className="relative aspect-[3/4] bg-prax-charcoal overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 text-label text-prax-bone bg-prax-black/60 px-3 py-1 backdrop-blur-sm">
                    AFTER
                  </div>
                  {item.afterSrc ? (
                    <Image
                      src={item.afterSrc}
                      alt={`${item.title} - After`}
                      fill
                      sizes="(max-width: 768px) 40vw, 300px"
                      quality={80}
                      loading="lazy"
                      className="before-after-img object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-prax-charcoal">
                      <div className="text-center p-6">
                        <div className="text-prax-silver text-sm mb-2">
                          AFTER PHOTO
                        </div>
                        <div className="text-prax-stone text-xs">
                          Same angle, same lighting
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <h3 className="text-body-lg text-prax-white font-medium">
                  {item.title}
                </h3>
                <p className="text-body-sm text-prax-stone">
                  {item.service}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="container-prax mt-8">
        <p className="text-caption text-prax-silver italic">
          Scroll horizontally to view more
        </p>
      </div>
    </section>
  );
}
