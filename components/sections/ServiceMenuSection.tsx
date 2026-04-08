'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';
import { BOOKING_URL } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceItem {
  name: string;
  price: string;
  duration: string;
  note?: string;
}

interface ServiceCategory {
  category: string;
  description?: string;
  items: ServiceItem[];
}

interface ServiceMenuSectionProps {
  heading?: string;
  description?: string;
  categories: ServiceCategory[];
  footnote?: string;
  bookingHref?: string;
  bookingLabel?: string;
}

export function ServiceMenuSection({
  heading = 'Service Menu',
  description,
  categories,
  footnote,
  bookingHref = BOOKING_URL,
  bookingLabel = 'Book an Appointment',
}: ServiceMenuSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
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

      const items = categoryRefs.current.filter(Boolean);
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: items[0],
            start: 'top 85%',
          },
          opacity: 0,
          y: 24,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [categories]);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax max-w-4xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 md:mb-20">
          <h2 className="text-h1 font-light text-prax-white mb-6">
            {heading}
          </h2>
          {description && (
            <p className="text-body-lg text-prax-stone leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-16 md:space-y-20">
          {categories.map((category, catIndex) => (
            <div
              key={catIndex}
              ref={(el) => {
                if (el) categoryRefs.current[catIndex] = el;
              }}
            >
              {/* Category Header */}
              <div className="mb-8">
                <h3 className="text-h3 text-prax-white font-medium mb-2">
                  {category.category}
                </h3>
                {category.description && (
                  <p className="text-body-sm text-prax-silver">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-prax-graphite mb-6" />

              {/* Service Items */}
              <div className="space-y-0">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="group flex items-baseline justify-between py-5 border-b border-prax-graphite/50 last:border-b-0 hover:border-prax-bone/20 transition-colors duration-300"
                  >
                    {/* Left: Name + Note */}
                    <div className="flex-1 min-w-0 pr-4">
                      <span className="text-body-lg text-prax-white group-hover:text-prax-bone transition-colors duration-300">
                        {item.name}
                      </span>
                      {item.note && (
                        <span className="block text-caption text-prax-silver mt-1">
                          {item.note}
                        </span>
                      )}
                    </div>

                    {/* Dotted line connector */}
                    <div className="flex-1 border-b border-dotted border-prax-graphite/40 mx-3 mb-1.5 hidden sm:block" />

                    {/* Right: Duration + Price */}
                    <div className="flex items-baseline gap-4 sm:gap-8 flex-shrink-0">
                      <span className="text-body-sm text-prax-silver whitespace-nowrap">
                        {item.duration}
                      </span>
                      <span className="text-body-lg text-prax-bone font-medium whitespace-nowrap min-w-[7rem] text-right">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        {footnote && (
          <div className="mt-16 pt-8 border-t border-prax-graphite/30">
            <p className="text-body-sm text-prax-silver text-center leading-relaxed">
              {footnote}
            </p>
          </div>
        )}

        {/* Booking Button */}
        <div className="mt-12 text-center">
          <a
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-wipe"
          >
            {bookingLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
