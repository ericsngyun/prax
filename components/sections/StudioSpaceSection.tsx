'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';
import { revealWithBlur } from '@/lib/animations';
import { blurPlaceholders } from '@/lib/blurPlaceholder';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header — fade up
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Images — staggered fade up
      const imgs = imageRefs.current.filter(Boolean);
      if (imgs.length > 0) {
        gsap.from(imgs, {
          scrollTrigger: {
            trigger: imgs[0],
            start: 'top 85%',
          },
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Image reveal animations
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const studioImages = sectionRef.current.querySelectorAll('.studio-img');
    studioImages.forEach((img) => {
      revealWithBlur(img as HTMLElement, {
        scrollTrigger: true,
        blurAmount: 8, // Subtle blur like team page
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax">
        {/* Text */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <h2
            className="text-h1 font-light text-prax-white mb-8"
          >
            {heading}
          </h2>
          <div className="space-y-4">
            {description.map((paragraph, i) => (
              <p
                key={i}
                className="text-body-lg text-prax-stone leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {images.map((image, index) => {
            const isFeature = index === 0;
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) imageRefs.current[index] = el;
                }}
                className={`relative group overflow-hidden bg-prax-charcoal ${
                  isFeature ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {image.src ? (
                  <>
                    <div className={`relative overflow-hidden ${isFeature ? 'aspect-[16/9]' : 'aspect-[4/5]'}`}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes={isFeature ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                        quality={75}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={blurPlaceholders.charcoal}
                        className="studio-img object-cover transition-all duration-700 group-hover:scale-[1.03]"
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
                  <div className={`${isFeature ? 'aspect-[16/9]' : 'aspect-[4/5]'} flex items-center justify-center p-6 bg-prax-charcoal border border-prax-graphite/30`}>
                    <div className="text-center">
                      <div className="text-h3 text-prax-bone/40 font-light mb-3">
                        Coming Soon
                      </div>
                      <div className="text-body-sm text-prax-stone/60">
                        New location opening soon
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
