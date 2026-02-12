'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOCATION SECTION
   Clean, functional studio information
   Optional map embed, contact details
   ═══════════════════════════════════════════════════════════════════════════ */

interface LocationSectionProps {
  label?: string;
  heading: string;
  description: string;
  address?: string;
  city?: string;
  hours?: string[];
  showMap?: boolean;
  mapEmbedUrl?: string;
}

export function LocationSection({
  label = 'Visit Us',
  heading = 'Located in Los Angeles',
  description = 'PRAX Studio offers a calm, focused environment designed for clients who value quality and consistency.',
  address = '123 Main Street',
  city = 'Los Angeles, CA 90001',
  hours = [
    'Tuesday - Friday: 10am - 7pm',
    'Saturday: 9am - 6pm',
    'Sunday - Monday: Closed',
  ],
  showMap = false,
  mapEmbedUrl,
}: LocationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

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

      // Description
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

      // Details
      gsap.from(detailsRef.current, {
        scrollTrigger: {
          trigger: detailsRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <span
              ref={labelRef}
              className="text-label text-prax-bone uppercase tracking-widest block mb-6"
            >
              {label}
            </span>
            <h2
              ref={headingRef}
              className="text-h1 text-prax-white mb-8"
            >
              {heading}
            </h2>
            <p
              ref={descriptionRef}
              className="text-body-lg text-prax-stone max-w-2xl mx-auto leading-relaxed"
            >
              {description}
            </p>
          </div>

          {/* Details Grid */}
          <div
            ref={detailsRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
          >
            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-label text-prax-bone uppercase tracking-widest">
                Address
              </h3>
              <div className="text-body-lg text-prax-white space-y-2">
                <p>{address}</p>
                <p>{city}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="space-y-4">
              <h3 className="text-label text-prax-bone uppercase tracking-widest">
                Hours
              </h3>
              <div className="text-body text-prax-stone space-y-2">
                {hours.map((hour, i) => (
                  <p key={i}>{hour}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Map */}
          {showMap && mapEmbedUrl && (
            <div className="mt-16 md:mt-20">
              <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-sm border border-prax-graphite">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PRAX Studio Location"
                />
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-prax-graphite mt-16 md:mt-20" />
        </div>
      </div>
    </section>
  );
}
