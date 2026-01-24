'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerCards } from '@/lib/animations';
import { cn, prefersReducedMotion, formatNumber } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ServicesSectionProps {
  label?: string;
  heading?: string;
  services?: ServiceItem[];
}

const defaultServices: ServiceItem[] = [
  {
    title: 'The Studio',
    description: 'Premium cuts and styling at our flagship Los Angeles location. Experience precision craftsmanship in an environment designed for excellence.',
  },
  {
    title: 'The Academy',
    description: 'In-person education programs across 7 cities worldwide. Learn from master craftsmen and elevate your technique to the next level.',
  },
  {
    title: 'PRAX Online',
    description: 'Digital courses and workshops accessible anywhere. Master the fundamentals and advanced techniques at your own pace.',
  },
];

export function ServicesSection({
  label = 'What We Do',
  heading = 'Services',
  services = defaultServices,
}: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Cards stagger
      if (cardsRef.current) {
        staggerCards(cardsRef.current, '.service-card');
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-prax-ink"
    >
      <div className="container-prax">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <span className="text-label text-prax-bone uppercase tracking-widest block mb-4">
            {label}
          </span>
          <h2 className="text-display font-bold text-prax-white tracking-tight">
            {heading}
          </h2>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group relative bg-prax-charcoal/50 p-6 md:p-8 rounded-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-0 h-0.5 bg-prax-bone transition-all duration-500 group-hover:w-full" />

              {/* Number */}
              <span className="text-label text-prax-bone block mb-6">
                {formatNumber(index + 1)}
              </span>

              {/* Icon placeholder */}
              {service.icon && (
                <div className="mb-6 text-prax-bone">
                  {service.icon}
                </div>
              )}

              {/* Title */}
              <h3 className="text-title font-bold text-prax-white mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-body text-prax-stone leading-relaxed">
                {service.description}
              </p>

              {/* Hover arrow */}
              <div className="mt-6 flex items-center gap-2 text-prax-bone opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                <span className="text-sm font-medium">Learn more</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
