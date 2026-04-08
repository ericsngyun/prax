'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

interface UpcomingLocation {
  name: string;
  city: string;
  status?: string;
}

interface LocationSectionProps {
  label?: string;
  heading: string;
  description: string;
  address?: string;
  city?: string;
  hours?: string[];
  showMap?: boolean;
  mapEmbedUrl?: string;
  upcomingLocations?: UpcomingLocation[];
}

export function LocationSection({
  label = 'Visit Us',
  heading = 'Located in Los Angeles',
  description = 'PRAX Studio offers a calm, focused environment designed for clients who value quality and consistency.',
  address = '1752 W Adams Blvd #206',
  city = 'Los Angeles, CA 90018',
  hours = [
    'Monday - Saturday: 10am - 9pm',
    'Sunday: Closed',
  ],
  showMap = false,
  mapEmbedUrl,
  upcomingLocations = [],
}: LocationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const detailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header block — fade up
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

      // Details — staggered fade up
      const details = detailRefs.current.filter(Boolean);
      if (details.length > 0) {
        gsap.from(details, {
          scrollTrigger: {
            trigger: details[0],
            start: 'top 85%',
          },
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
    <section
      ref={sectionRef}
      className="section-padding bg-prax-ink"
    >
      <div className="container-prax">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-10 md:mb-20">
            <span
              className="text-label text-prax-bone uppercase tracking-widest block mb-4 md:mb-6"
            >
              {label}
            </span>
            <h2
              className="text-h1 text-prax-white mb-8"
            >
              {heading}
            </h2>
            <p
              className="text-body-lg text-prax-stone max-w-2xl mx-auto leading-relaxed"
            >
              {description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Address */}
            <div
              ref={(el) => {
                if (el) detailRefs.current[0] = el;
              }}
              className="space-y-4"
            >
              <h3 className="text-label text-prax-bone uppercase tracking-widest">
                Address
              </h3>
              <div className="text-body-lg text-prax-white space-y-2">
                <p>{address}</p>
                <p>{city}</p>
              </div>
            </div>

            {/* Hours */}
            <div
              ref={(el) => {
                if (el) detailRefs.current[1] = el;
              }}
              className="space-y-4"
            >
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

          {/* Upcoming Locations */}
          {upcomingLocations.length > 0 && (
            <div
              ref={(el) => {
                if (el) detailRefs.current[2] = el;
              }}
              className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-prax-graphite/40"
            >
              <h3 className="text-label text-prax-bone uppercase tracking-widest mb-6">
                Coming Soon
              </h3>
              <div className="space-y-6">
                {upcomingLocations.map((location, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between p-6 md:p-8 border border-dashed border-prax-graphite/60 hover:border-prax-bone/30 transition-all duration-500"
                  >
                    <div>
                      <p className="text-h4 text-prax-white font-medium mb-1">
                        {location.name}
                      </p>
                      <p className="text-body text-prax-stone">
                        {location.city}
                      </p>
                    </div>
                    <span className="text-label text-prax-bone uppercase tracking-widest border border-prax-bone/20 px-4 py-2 group-hover:border-prax-bone/40 transition-colors duration-500">
                      {location.status || 'Coming Soon'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
