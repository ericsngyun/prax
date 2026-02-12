'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SERVICES PREVIEW SECTION
   Trust builder with clear categories and CTAs
   Per Jack's guidelines: High-End Haircutting / Grooming / Consistency
   ═══════════════════════════════════════════════════════════════════════════ */

interface ServicePreview {
  title: string;
  description: string;
  cta: {
    text: string;
    href: string;
  };
}

interface ServicesPreviewSectionProps {
  label?: string;
  heading?: string;
  services?: ServicePreview[];
}

const defaultServices: ServicePreview[] = [
  {
    title: 'High-End Haircutting',
    description:
      'Tailored haircuts designed around head shape, hair behavior, and personal style.',
    cta: {
      text: 'Book Your Haircut',
      href: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null',
    },
  },
  {
    title: 'Grooming & Styling',
    description:
      'Clean finishes, refined styling, and products selected to support your haircut beyond the chair.',
    cta: {
      text: 'Learn More',
      href: '#services',
    },
  },
  {
    title: 'Consistency-Driven Results',
    description:
      'We prioritize haircuts that grow out well and maintain structure over time.',
    cta: {
      text: 'See Our Work',
      href: '#work',
    },
  },
];

export function ServicesPreviewSection({
  label = 'Services',
  heading = 'What We Offer',
  services = defaultServices,
}: ServicesPreviewSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const serviceRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Label
      gsap.from(labelRef.current, {
        scrollTrigger: {
          trigger: labelRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      });

      // Heading
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

      // Services stagger
      serviceRefs.current.forEach((service, i) => {
        if (!service) return;
        gsap.from(service, {
          scrollTrigger: {
            trigger: service,
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
    <section
      ref={sectionRef}
      className="section-padding bg-prax-ink"
    >
      <div className="container-prax">
        {/* Header - Centered */}
        <div className="text-center mb-20 md:mb-24">
          <span
            ref={labelRef}
            className="text-label text-prax-bone uppercase tracking-widest block mb-6"
          >
            {label}
          </span>
          <h2
            ref={headingRef}
            className="text-h1 text-prax-white"
          >
            {heading}
          </h2>
        </div>

        {/* Services Grid - Editorial layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) serviceRefs.current[index] = el;
              }}
              className="group relative"
            >
              {/* Service Card */}
              <div className="relative h-full flex flex-col">
                {/* Number - Small, subtle */}
                <div className="text-sm font-mono text-prax-bone/40 mb-8">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Title */}
                <h3 className="text-h3 text-prax-white font-medium mb-6 tracking-tight">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-body text-prax-stone leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>

                {/* CTA Link - Minimal */}
                <a
                  href={service.cta.href}
                  target={service.cta.href.startsWith('http') ? '_blank' : undefined}
                  rel={service.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-sm font-medium text-prax-bone hover:text-prax-white transition-colors duration-300 group/link"
                  data-cursor="link"
                >
                  <span>{service.cta.text}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
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
                </a>

                {/* Decorative accent - appears on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-px bg-prax-bone/20 group-hover:w-full transition-all duration-700 ease-out" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
