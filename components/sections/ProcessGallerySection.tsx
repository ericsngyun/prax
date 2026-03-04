'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { revealWithBlur } from '@/lib/animations';
import { prefersReducedMotion } from '@/lib/utils';

interface ProcessItem {
  title: string;
  imageSrc: string;
}

interface ProcessGallerySectionProps {
  label?: string;
  heading?: string;
  items: ProcessItem[];
}

export function ProcessGallerySection({
  label = 'Visuals',
  heading = 'The Process in Detail',
  items,
}: ProcessGallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const images = sectionRef.current.querySelectorAll('.process-img');
    images.forEach((img) => {
      revealWithBlur(img as HTMLElement, {
        scrollTrigger: true,
        blurAmount: 8,
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <span className="text-label text-prax-silver mb-4 block">
            {label}
          </span>
          <h2 className="text-h2 md:text-h1 text-prax-white">
            {heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="relative aspect-[4/5] bg-prax-charcoal overflow-hidden rounded-sm group"
            >
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={85}
                loading="lazy"
                className="process-img object-cover transition-all duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-prax-black/80 via-prax-black/40 to-transparent p-6">
                <div className="text-body-lg text-prax-white font-medium">
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
