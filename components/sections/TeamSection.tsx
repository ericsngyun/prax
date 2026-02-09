'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerReveal } from '@/lib/animations';
import { cn, prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  name: string;
  role: string;
  imageSrc: string;
}

interface TeamSectionProps {
  label?: string;
  heading?: string;
  members?: TeamMember[];
}

const defaultMembers: TeamMember[] = [
  { name: 'Jack Louii', role: 'Founder & Lead Artist', imageSrc: '/images/team/artist-01.jpg' },
  { name: 'Marcus Chen', role: 'Senior Stylist', imageSrc: '/images/team/artist-02.jpg' },
  { name: 'Elena Vasquez', role: 'Color Specialist', imageSrc: '/images/team/artist-03.jpg' },
  { name: 'Andre Williams', role: 'Master Barber', imageSrc: '/images/team/artist-04.jpg' },
];

export function TeamSection({
  label = 'The Artists',
  heading = 'Meet the Team',
  members = defaultMembers,
}: TeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      // Team members stagger with parallax
      const members = gridRef.current?.querySelectorAll('.team-member');
      if (members) {
        members.forEach((member, i) => {
          const offset = i % 2 === 0 ? 30 : -30;
          gsap.from(member, {
            scrollTrigger: {
              trigger: member,
              start: 'top 85%',
            },
            opacity: 0,
            y: 60 + offset,
            duration: 1,
            delay: i * 0.1,
            ease: 'power3.out',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-prax-black"
    >
      <div className="container-prax">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="text-label text-prax-bone uppercase tracking-widest block mb-4">
            {label}
          </span>
          <h2 className="text-display font-bold text-prax-white tracking-tight">
            {heading}
          </h2>
        </div>

        {/* Team Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {members.map((member, index) => (
            <div
              key={index}
              className="team-member group"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-prax-charcoal mb-4">
                <Image
                  src={member.imageSrc}
                  alt={member.name}
                  fill
                  className="object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.03]"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-prax-ink via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* View Profile Text */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-sm text-prax-bone font-medium">
                    View Profile
                  </span>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-body-lg font-bold text-prax-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-prax-stone">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
