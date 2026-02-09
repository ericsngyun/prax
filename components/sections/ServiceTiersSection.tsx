'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SERVICE TIERS SECTION
   Clear service categories with pricing and booking
   ═══════════════════════════════════════════════════════════════════════════ */

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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const tierRefs = useRef<HTMLDivElement[]>([]);

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

      gsap.from(descriptionRef.current, {
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      });

      tierRefs.current.forEach((tier, i) => {
        if (!tier) return;
        gsap.from(tier, {
          scrollTrigger: {
            trigger: tier,
            start: 'top 85%',
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          delay: i * 0.15,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax">
        {/* Header */}
        <div className="text-center mb-20 md:mb-24 max-w-3xl mx-auto">
          <h2
            ref={headingRef}
            className="text-serif-h1 text-prax-white mb-6"
          >
            {heading}
          </h2>
          <p
            ref={descriptionRef}
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
              className="group relative bg-prax-charcoal border border-prax-graphite hover:border-prax-bone/40 transition-all duration-500"
            >
              <div className="p-8 md:p-10">
                {/* Service Name */}
                <h3 className="text-h3 text-prax-white font-medium mb-2">
                  {tier.name}
                </h3>

                {/* Price & Duration */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-h2 text-prax-bone font-light">
                    {tier.price}
                  </span>
                  <span className="text-body text-prax-silver">
                    {tier.duration}
                  </span>
                </div>

                {/* Description */}
                <p className="text-body text-prax-stone leading-relaxed mb-8">
                  {tier.description}
                </p>

                {/* Includes */}
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

                {/* Book CTA */}
                <a
                  href={tier.bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center btn btn-secondary hover:bg-prax-bone/5"
                  data-cursor="hover"
                >
                  Book Now
                </a>
              </div>

              {/* Accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-prax-bone group-hover:w-full transition-all duration-700 ease-out" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
