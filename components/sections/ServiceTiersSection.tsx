'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceTier {
  name: string;
  price: string;
  duration: string;
  description: string;
  includes: string[];
  bookingHref: string;
}

interface ServiceTiersSectionProps {
  heading?: string;
  description?: string;
  tiers: ServiceTier[];
}

export function ServiceTiersSection({
  heading = 'Services',
  description = 'Every service is built around precision, consistency, and long-term results.',
  tiers,
}: ServiceTiersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tierRefs = useRef<HTMLDivElement[]>([]);
  const priceRefs = useRef<HTMLSpanElement[]>([]);

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

      // Tiers — staggered fade up
      const items = tierRefs.current.filter(Boolean);
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: items[0],
            start: 'top 85%',
          },
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      // Price counter animation (intentional accent — keep)
      priceRefs.current.forEach((priceEl, i) => {
        if (!priceEl) return;
        const priceText = tiers[i]?.price || '';
        const numMatch = priceText.match(/\d+/);
        if (!numMatch) return;
        const target = parseInt(numMatch[0], 10);
        const prefix = priceText.slice(0, priceText.indexOf(numMatch[0]));
        const obj = { value: 0 };
        gsap.to(obj, {
          scrollTrigger: {
            trigger: priceEl,
            start: 'top 85%',
          },
          value: target,
          duration: 1.5,
          delay: i * 0.15,
          ease: 'power2.out',
          onUpdate: () => {
            priceEl.textContent = `${prefix}${Math.round(obj.value)}`;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [tiers]);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20 md:mb-24 max-w-3xl mx-auto">
          <h2
            className="text-h1 font-light text-prax-white mb-6"
          >
            {heading}
          </h2>
          <p
            className="text-body-lg text-prax-stone leading-relaxed"
          >
            {description}
          </p>
        </div>

        {/* Service Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) tierRefs.current[index] = el;
              }}
              className="group relative bg-prax-charcoal border border-prax-graphite hover:border-prax-bone/40 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="p-8 md:p-10">
                <h3 className="text-h3 text-prax-white font-medium mb-2">
                  {tier.name}
                </h3>

                <div className="flex items-baseline gap-3 mb-6">
                  <span
                    ref={(el) => {
                      if (el) priceRefs.current[index] = el;
                    }}
                    className="text-h2 text-prax-bone font-light"
                  >
                    {tier.price}
                  </span>
                  <span className="text-body text-prax-silver">
                    {tier.duration}
                  </span>
                </div>

                <p className="text-body text-prax-stone leading-relaxed mb-8">
                  {tier.description}
                </p>

                <div className="space-y-3 mb-10">
                  {tier.includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-prax-bone rounded-full mt-2.5 flex-shrink-0" />
                      <span className="text-body-sm text-prax-stone">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href={tier.bookingHref}
                  className="block w-full text-center btn btn-secondary btn-wipe hover:bg-prax-bone/5 cursor-pointer"
                >
                  View Team
                </a>
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-prax-bone group-hover:w-full transition-all duration-700 ease-out" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
