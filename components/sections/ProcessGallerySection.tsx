'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';
import { blurPlaceholders } from '@/lib/blurPlaceholder';

interface ProcessItem {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
}

interface ProcessGallerySectionProps {
  label?: string;
  heading?: string;
  items: ProcessItem[];
}

export function ProcessGallerySection({
  label = 'The Process',
  heading = 'How a PRAX Cut Is Built',
  items,
}: ProcessGallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.from(Array.from(gridRef.current.children), {
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
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

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <span className="text-label text-prax-silver mb-4 block">{label}</span>
          <h2 className="text-h2 md:text-h1 text-prax-white font-light">
            {heading}
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {items.map((item) => (
            <article
              key={item.title}
              className="relative aspect-[4/5] overflow-hidden border border-prax-graphite/50 hover:border-prax-bone/30 transition-colors duration-500 group"
            >
              <Image
                src={item.imageSrc}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={75}
                loading="lazy"
                placeholder="blur"
                blurDataURL={blurPlaceholders.charcoal}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ objectPosition: 'center 25%' }}
              />

              {/* Heavy gradient overlay so the type dominates */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-prax-ink via-prax-ink/85 to-prax-ink/55 group-hover:from-prax-ink group-hover:via-prax-ink/75 transition-all duration-500"
                aria-hidden="true"
              />

              {/* Editorial corner ticks */}
              <span className="absolute -top-px -left-px w-2 h-2 border-t border-l border-prax-bone/55" aria-hidden="true" />
              <span className="absolute -top-px -right-px w-2 h-2 border-t border-r border-prax-bone/55" aria-hidden="true" />
              <span className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-prax-bone/55" aria-hidden="true" />
              <span className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-prax-bone/55" aria-hidden="true" />

              {/* Content layer */}
              <div className="relative h-full p-6 md:p-7 flex flex-col justify-between">
                <span className="text-label text-prax-bone/65 tracking-[0.25em] tabular-nums">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-h3 text-prax-white font-light leading-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body-sm text-prax-stone/90 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
