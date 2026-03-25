'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';
import { getMobileAnimationConfig } from '@/lib/mobileAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
      href: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7',
    },
  },
  {
    title: 'Grooming & Styling',
    description:
      'Clean finishes, refined styling, and products selected to support your haircut beyond the chair.',
    cta: {
      text: 'Learn More',
      href: '/services',
    },
  },
  {
    title: 'Consistency-Driven Results',
    description:
      'We prioritize haircuts that grow out well and maintain structure over time.',
    cta: {
      text: 'See Our Work',
      href: '/team',
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
  const numberRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const config = getMobileAnimationConfig();

    const ctx = gsap.context(() => {
      // Label — fade up (mobile-optimized)
      gsap.from(labelRef.current, {
        scrollTrigger: {
          trigger: labelRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: config.yOffset,
        duration: config.duration * 1.5,
        ease: config.ease,
      });

      // Heading — fade up (mobile-optimized)
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: config.yOffset,
        duration: config.duration * 2,
        ease: config.ease,
      });

      // Services — staggered fade up (mobile-optimized)
      const services = serviceRefs.current.filter(Boolean);
      if (services.length > 0) {
        gsap.from(services, {
          scrollTrigger: {
            trigger: services[0],
            start: 'top 85%',
          },
          opacity: 0,
          y: config.yOffset,
          stagger: config.stagger,
          duration: config.duration * 2,
          ease: config.ease,
        });
      }

      // Number counter animation (intentional accent — keep, slightly faster on mobile)
      numberRefs.current.forEach((num, i) => {
        if (!num) return;
        const target = i + 1;
        const obj = { value: 0 };
        gsap.to(obj, {
          scrollTrigger: {
            trigger: num,
            start: 'top 85%',
          },
          value: target,
          duration: config.duration * 3, // Faster on mobile
          delay: i * 0.15,
          ease: 'power2.out',
          onUpdate: () => {
            num.textContent = String(Math.round(obj.value)).padStart(2, '0');
          },
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
        {/* Header */}
        <div className="text-center mb-12 md:mb-24">
          <span
            ref={labelRef}
            className="text-label text-prax-bone uppercase tracking-widest block mb-4 md:mb-6"
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) serviceRefs.current[index] = el;
              }}
              className="group relative service-card"
            >
              <div className="relative h-full flex flex-col p-6 md:p-8 border border-prax-graphite/30 hover:border-prax-bone/40 transition-all duration-500 bg-prax-charcoal/0 hover:bg-prax-charcoal/30">
                {/* Number */}
                <div
                  ref={(el) => {
                    if (el) numberRefs.current[index] = el;
                  }}
                  className="text-sm font-mono text-prax-bone/60 group-hover:text-prax-bone transition-colors duration-500 mb-8"
                >
                  00
                </div>

                {/* Title */}
                <h3 className="text-h3 text-prax-white font-medium mb-6 tracking-tight group-hover:text-prax-bone transition-colors duration-500">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-body text-prax-stone leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>

                {/* CTA Link */}
                <a
                  href={service.cta.href}
                  target={service.cta.href.startsWith('http') ? '_blank' : undefined}
                  rel={service.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-body-sm font-medium text-prax-bone hover:text-prax-white transition-colors duration-300 group/link cursor-pointer"
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

                {/* Decorative accent line - bottom */}
                <div className="absolute bottom-0 left-0 w-0 h-px bg-prax-bone group-hover:w-full transition-all duration-700 ease-out" />

                {/* Decorative accent line - top (subtle) */}
                <div className="absolute top-0 left-0 w-full h-px bg-prax-bone opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
