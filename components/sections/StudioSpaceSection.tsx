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
   STUDIO SPACE SECTION
   LA location, designed environment
   MEDIA NEEDED: 4-5 studio interior shots (show designed space, minimal aesthetic)
   MEDIA NEEDED: 3-4 detail shots (tools, products, aesthetic moments)
   ═══════════════════════════════════════════════════════════════════════════ */

interface StudioImage {
  src: string;
  alt: string;
  caption?: string;
}

interface StudioSpaceSectionProps {
  heading?: string;
  description: string[];
  images: StudioImage[];
}

export function StudioSpaceSection({
  heading = 'The Studio',
  description,
  images,
}: StudioSpaceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
      });

      descriptionRefs.current.forEach((p, i) => {
        if (!p) return;
        gsap.from(p, {
          scrollTrigger: {
            trigger: p,
            start: 'top 80%',
          },
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power2.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax">
        {/* Text */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <h2
            ref={headingRef}
            className="text-serif-h1 text-prax-white mb-8"
          >
            {heading}
          </h2>
          <div className="space-y-4">
            {description.map((paragraph, i) => (
              <p
                key={i}
                ref={(el) => {
                  if (el) descriptionRefs.current[i] = el;
                }}
                className="text-body-lg text-prax-stone leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group overflow-hidden bg-prax-charcoal"
            >
              {image.src ? (
                <>
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {image.caption && (
                    <div className="p-4">
                      <p className="text-body-sm text-prax-stone">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/5] border-2 border-dashed border-prax-graphite flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-prax-silver text-sm mb-2">
                      STUDIO PHOTO {index + 1}
                    </div>
                    <div className="text-prax-stone text-xs">
                      {image.alt}
                    </div>
                    <div className="text-prax-stone/60 text-xs mt-2">
                      {image.caption || 'Interior or detail shot'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
