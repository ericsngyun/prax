'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEAM GRID SECTION
   Unified bios, role clarity, educator credibility
   MEDIA NEEDED: 4-6 team portraits (consistent style, same background/lighting)
   MEDIA NEEDED: 4-6 action shots (each member working)
   ═══════════════════════════════════════════════════════════════════════════ */

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  experience: string;
  credentials: string[];
  philosophy: string;
  portraitSrc: string;
  actionSrc: string;
  instagramHandle?: string; // Optional Instagram handle
}

interface TeamGridSectionProps {
  heading?: string;
  description?: string;
  members: TeamMember[];
}

export function TeamGridSection({
  heading = 'The Team',
  description = 'Every member holds themselves to the same standard: precision, consistency, and craft.',
  members,
}: TeamGridSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const memberRefs = useRef<HTMLDivElement[]>([]);

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

      memberRefs.current.forEach((member, i) => {
        if (!member) return;
        gsap.from(member, {
          scrollTrigger: {
            trigger: member,
            start: 'top 85%',
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          delay: (i % 2) * 0.15,
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

        {/* Team Members Grid */}
        <div className="space-y-24 md:space-y-32 max-w-6xl mx-auto">
          {members.map((member, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) memberRefs.current[index] = el;
              }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Portrait */}
              <div
                className={`space-y-4 ${
                  index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                {/* Main portrait */}
                <div className="relative aspect-[3/4] bg-prax-charcoal overflow-hidden group">
                  {member.portraitSrc ? (
                    <Image
                      src={member.portraitSrc}
                      alt={member.name}
                      fill
                      className="object-cover img-team"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-prax-graphite">
                      <div className="text-center p-6">
                        <div className="text-prax-silver text-sm mb-2">
                          TEAM PORTRAIT
                        </div>
                        <div className="text-prax-stone text-xs">
                          {member.name}
                        </div>
                        <div className="text-prax-stone/60 text-xs mt-1">
                          Consistent background, lighting, framing
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action shot (optional) */}
                <div className="relative aspect-[16/9] bg-prax-charcoal overflow-hidden">
                  {member.actionSrc ? (
                    <Image
                      src={member.actionSrc}
                      alt={`${member.name} working`}
                      fill
                      className="object-cover img-portfolio"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-prax-graphite">
                      <div className="text-center p-6">
                        <div className="text-prax-silver text-sm mb-2">
                          ACTION SHOT
                        </div>
                        <div className="text-prax-stone text-xs">
                          {member.name} at work
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div
                className={`space-y-6 ${
                  index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                {/* Name & Role */}
                <div>
                  <h3 className="text-h2 text-prax-white font-medium mb-2">
                    {member.name}
                  </h3>
                  <p className="text-label text-prax-bone uppercase tracking-widest">
                    {member.role}
                  </p>
                </div>

                {/* Quick facts */}
                <div className="grid grid-cols-2 gap-6 py-6 border-y border-prax-graphite">
                  <div>
                    <div className="text-caption text-prax-silver uppercase tracking-widest mb-2">
                      Specialty
                    </div>
                    <div className="text-body text-prax-white">
                      {member.specialty}
                    </div>
                  </div>
                  <div>
                    <div className="text-caption text-prax-silver uppercase tracking-widest mb-2">
                      Experience
                    </div>
                    <div className="text-body text-prax-white">
                      {member.experience}
                    </div>
                  </div>
                </div>

                {/* Credentials */}
                <div>
                  <div className="text-caption text-prax-silver uppercase tracking-widest mb-3">
                    Education & Credentials
                  </div>
                  <ul className="space-y-2">
                    {member.credentials.map((credential, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-prax-bone mt-1.5">·</span>
                        <span className="text-body-sm text-prax-stone">
                          {credential}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Philosophy - Unified voice */}
                <div>
                  <div className="text-caption text-prax-silver uppercase tracking-widest mb-3">
                    Philosophy
                  </div>
                  <p className="text-body text-prax-stone leading-relaxed italic">
                    "{member.philosophy}"
                  </p>
                </div>

                {/* Instagram Link */}
                {member.instagramHandle && (
                  <div className="pt-6 border-t border-prax-graphite">
                    <a
                      href={`https://www.instagram.com/${member.instagramHandle}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-body-sm text-prax-bone hover:text-prax-white transition-colors duration-300 group/ig"
                      data-cursor="link"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span className="group-hover/ig:translate-x-1 transition-transform duration-300">
                        @{member.instagramHandle}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
