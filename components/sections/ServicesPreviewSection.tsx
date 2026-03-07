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

const defaultServices: ServicePreview[] = [];

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

        {/* Pricing */}
        <div className="max-w-lg mx-auto text-center">
          <div className="space-y-4 mb-10">
            <p className="text-h3 text-prax-white font-light tracking-wide">
              $70 - $125 Haircut
            </p>
            <p className="text-h3 text-prax-white font-light tracking-wide">
              $90 - $150 Haircut & Beard
            </p>
          </div>

          <a
            href="https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary text-body-sm cursor-pointer inline-block"
          >
            Book with Team
          </a>
        </div>
      </div>
    </section>
  );
}
