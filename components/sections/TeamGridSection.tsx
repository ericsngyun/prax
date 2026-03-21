'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';
import { getMobileAnimationConfig } from '@/lib/mobileAnimations';
import { revealWithBlur } from '@/lib/animations';
import { blurPlaceholders } from '@/lib/blurPlaceholder';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  experience: string;
  credentials: string[];
  philosophy: string;
  portraitSrc: string;
  actionSrc: string;
  actionSrcPosition?: string; // CSS object-position value (e.g., 'top', '50% 20%')
  workSamples?: string[]; // Array of work sample image URLs
  videoSrc?: string;
  instagramHandle?: string;
  bookingUrl?: string;
}

interface TeamGridSectionProps {
  heading?: string;
  description?: string;
  members: TeamMember[];
}

function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  memberName,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  memberName: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    if (isOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.fromTo(
        contentRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (!overlayRef.current || !contentRef.current) {
      onClose();
      return;
    }
    gsap.to(contentRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      delay: 0.1,
      onComplete: onClose,
    });
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-6"
      style={{ opacity: 0, backgroundColor: 'oklch(0.05 0 0 / 0.92)' }}
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-3xl aspect-video bg-prax-black rounded-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-prax-black/60 backdrop-blur-sm rounded-full text-prax-white hover:bg-prax-charcoal transition-colors"
          aria-label="Close video"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <video
          src={videoSrc}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          aria-label={`Video introduction by ${memberName}`}
        />
      </div>
    </div>
  );
}

function TeamMemberPortrait({
  member,
  onPlayVideo,
}: {
  member: TeamMember;
  onPlayVideo?: () => void;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !member.videoSrc) return;
    if (isHovering) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovering, member.videoSrc]);

  return (
    <div
      className="relative aspect-[3/4] bg-prax-charcoal overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={member.videoSrc ? onPlayVideo : undefined}
    >
      {member.portraitSrc ? (
        <Image
          src={member.portraitSrc}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 600px"
          quality={75}
          placeholder="blur"
          blurDataURL={blurPlaceholders.portrait}
          className={`team-portrait-img object-cover transition-opacity duration-500 ${
            isHovering && member.videoSrc ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-prax-charcoal">
          <div className="text-center p-6">
            <div className="text-prax-silver text-sm mb-2">TEAM PORTRAIT</div>
            <div className="text-prax-stone text-xs">{member.name}</div>
          </div>
        </div>
      )}

      {member.videoSrc && (
        <video
          ref={videoRef}
          src={member.videoSrc}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {member.videoSrc && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-prax-white/15 backdrop-blur-sm flex items-center justify-center border border-prax-white/20">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="ml-0.5"
            >
              <path
                d="M6 4L16 10L6 16V4Z"
                fill="currentColor"
                className="text-prax-white"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
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
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    videoSrc: string;
    memberName: string;
  }>({ isOpen: false, videoSrc: '', memberName: '' });

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const config = getMobileAnimationConfig();

    const ctx = gsap.context(() => {
      // Header — fade up (mobile-optimized)
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: config.yOffset,
        duration: config.duration * 2, // Slightly slower for headings
        ease: config.ease,
      });

      gsap.from(descriptionRef.current, {
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: config.yOffset,
        duration: config.duration * 2,
        ease: config.ease,
      });

      // Members — staggered fade up
      memberRefs.current.forEach((member) => {
        if (!member) return;
        gsap.from(member, {
          scrollTrigger: {
            trigger: member,
            start: 'top 85%',
          },
          opacity: 0,
          y: config.yOffset,
          duration: config.duration * 2,
          ease: config.ease,
        });

        // Subtle blur reveal on portrait images (luxury brand pattern)
        // Only on desktop for performance - very subtle
        const portraitImg = member.querySelector('.team-portrait-img');
        if (portraitImg && window.innerWidth >= 768) {
          revealWithBlur(portraitImg as HTMLElement, {
            scrollTrigger: true,
            blurAmount: 8, // Subtle - not aggressive
          });
        }

        // Blur reveal on work sample images (in unison)
        // Only on desktop for performance
        const workSampleImgs = member.querySelectorAll('.team-work-sample');
        if (workSampleImgs.length > 0 && window.innerWidth >= 768) {
          workSampleImgs.forEach((img) => {
            revealWithBlur(img as HTMLElement, {
              scrollTrigger: true,
              blurAmount: 8, // Subtle - consistent with portraits
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openVideoModal = useCallback(
    (videoSrc: string, memberName: string) => {
      setVideoModal({ isOpen: true, videoSrc, memberName });
    },
    []
  );

  const closeVideoModal = useCallback(() => {
    setVideoModal({ isOpen: false, videoSrc: '', memberName: '' });
  }, []);

  return (
    <>
      <section ref={sectionRef} className="section-padding bg-prax-ink">
        <div className="container-prax">
          {/* Header */}
          <div className="text-center mb-20 md:mb-24 max-w-3xl mx-auto">
            <h2
              ref={headingRef}
              className="text-h1 font-light text-prax-white mb-6"
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

          {/* Team Index + Members */}
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-12 md:gap-16 max-w-6xl mx-auto">
            {/* Team Index */}
            <aside className="hidden lg:block sticky top-28 self-start">
              <div className="text-caption text-prax-silver uppercase tracking-widest mb-6">
                Team Index
              </div>
              <div className="flex flex-col gap-3">
                {members.map((member, index) => (
                  <a
                    key={member.name}
                    href={`#team-${index + 1}`}
                    className="text-body-sm text-prax-stone hover:text-prax-white transition-colors duration-300 cursor-pointer"
                  >
                    <span className="text-prax-silver mr-2">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {member.name}
                  </a>
                ))}
              </div>
            </aside>

            {/* Team Members Grid */}
            <div className="space-y-24 md:space-y-32">
              {members.map((member, index) => (
                <div
                  key={index}
                  id={`team-${index + 1}`}
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
                  <TeamMemberPortrait
                    member={member}
                    onPlayVideo={
                      member.videoSrc
                        ? () => openVideoModal(member.videoSrc!, member.name)
                        : undefined
                    }
                  />

                  {member.actionSrc && (
                    <div className="relative aspect-[16/9] bg-prax-charcoal overflow-hidden">
                      <Image
                        src={member.actionSrc}
                        alt={`${member.name} working`}
                        fill
                        sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 600px"
                        quality={75}
                        loading="lazy"
                        className="object-cover img-portfolio"
                        style={member.actionSrcPosition ? { objectPosition: member.actionSrcPosition } : undefined}
                      />
                    </div>
                  )}

                  {/* Work Samples Grid */}
                  {member.workSamples && member.workSamples.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {member.workSamples.map((workSrc, workIndex) => (
                        <div
                          key={workIndex}
                          className="relative aspect-[3/4] bg-prax-charcoal overflow-hidden rounded-sm"
                        >
                          <Image
                            src={workSrc}
                            alt={`${member.name} work sample ${workIndex + 1}`}
                            fill
                            sizes="(max-width: 768px) 45vw, (max-width: 1024px) 22vw, 300px"
                            quality={75}
                            loading="lazy"
                            className="object-cover img-portfolio team-work-sample"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div
                  className={`space-y-6 ${
                    index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div>
                    <h3 className="text-h2 text-prax-white font-medium mb-2">
                      {member.name}
                    </h3>
                    <p className="text-label text-prax-bone uppercase tracking-widest">
                      {member.role}
                    </p>
                  </div>

                  {(member.specialty || member.experience) && (
                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-prax-graphite">
                      {member.specialty && (
                        <div>
                          <div className="text-caption text-prax-silver uppercase tracking-widest mb-2">
                            Specialty
                          </div>
                          <div className="text-body text-prax-white">
                            {member.specialty}
                          </div>
                        </div>
                      )}
                      {member.experience && (
                        <div>
                          <div className="text-caption text-prax-silver uppercase tracking-widest mb-2">
                            Experience
                          </div>
                          <div className="text-body text-prax-white">
                            {member.experience}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {member.credentials.length > 0 && (
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
                  )}

                  {member.philosophy && (
                    <div>
                      <div className="text-caption text-prax-silver uppercase tracking-widest mb-3">
                        Philosophy
                      </div>
                      <p className="text-body text-prax-stone leading-relaxed italic">
                        &ldquo;{member.philosophy}&rdquo;
                      </p>
                    </div>
                  )}

                  {member.videoSrc && (
                    <button
                      onClick={() =>
                        openVideoModal(member.videoSrc!, member.name)
                      }
                      className="inline-flex items-center gap-3 text-body-sm text-prax-bone hover:text-prax-white transition-colors duration-300 group/vid cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full border border-prax-bone/40 flex items-center justify-center group-hover/vid:border-prax-white/60 transition-colors">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="currentColor"
                          className="ml-0.5"
                        >
                          <path d="M2 1L8 5L2 9V1Z" />
                        </svg>
                      </div>
                      Watch Introduction
                    </button>
                  )}

                  {member.bookingUrl && (
                    <div className="pt-4">
                      <a
                        href={member.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-wipe w-full text-center cursor-pointer"
                      >
                        Book with {member.name.split(' ')[0]}
                      </a>
                    </div>
                  )}

                  {member.instagramHandle && (
                    <div className="pt-4 border-t border-prax-graphite">
                      <a
                        href={`https://www.instagram.com/${member.instagramHandle}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-body-sm text-prax-bone hover:text-prax-white transition-colors duration-300 group/ig cursor-pointer"
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
        </div>
      </section>

      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoSrc={videoModal.videoSrc}
        memberName={videoModal.memberName}
      />
    </>
  );
}
