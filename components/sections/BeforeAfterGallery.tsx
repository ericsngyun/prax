'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   BEFORE/AFTER GALLERY
   Horizontal scroll showcasing transformation quality
   MEDIA NEEDED: 6-8 before/after comparison images
   ═══════════════════════════════════════════════════════════════════════════ */

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
        y: 30,
        duration: 1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-24 bg-prax-black overflow-hidden">
      <div className="container-prax mb-12">
        <h2
          ref={headingRef}
          className="text-serif-h1 text-prax-white"
        >
          {heading}
        </h2>
      </div>

      {/* Horizontal scroll container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-8 px-6 md:px-16 pb-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[85vw] md:w-[600px] group"
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
                      quality={85}
                      loading="lazy"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-prax-graphite">
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
                      quality={85}
                      loading="lazy"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-prax-graphite">
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
