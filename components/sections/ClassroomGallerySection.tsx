'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';
import { blurPlaceholders } from '@/lib/blurPlaceholder';

interface ClassroomGallerySectionProps {
  images: string[];
}

export function ClassroomGallerySection({ images }: ClassroomGallerySectionProps) {
  const visualsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      if (visualsRef.current) {
        const items = visualsRef.current.children;
        gsap.from(Array.from(items), {
          scrollTrigger: { trigger: visualsRef.current, start: 'top 80%' },
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding bg-prax-ink">
      <div className="container-prax max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16">
          <span className="text-label text-prax-silver mb-4 block">
            Academy Visuals
          </span>
          <h2 className="text-h2 md:text-h1 font-light text-prax-white">
            Inside the Classroom
          </h2>
        </div>
        <div ref={visualsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {images.map((imageSrc, index) => (
            <div
              key={index}
              className="relative aspect-[4/5] bg-prax-charcoal overflow-hidden rounded-sm group"
            >
              <Image
                src={imageSrc}
                alt={`Classroom scene ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                quality={75}
                loading="lazy"
                placeholder="blur"
                blurDataURL={blurPlaceholders.charcoal}
                className="object-cover transition-all duration-700 group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
