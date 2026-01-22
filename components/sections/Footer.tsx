'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn, prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  columns?: FooterColumn[];
  showNewsletter?: boolean;
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'Studio',
    links: [
      { label: 'Book Appointment', href: '#book' },
      { label: 'Our Work', href: '#work' },
      { label: 'Location', href: '#location' },
    ],
  },
  {
    title: 'Academy',
    links: [
      { label: 'In-Person Classes', href: '#classes' },
      { label: 'Online Courses', href: '#courses' },
      { label: 'Workshops', href: '#workshops' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', href: '#story' },
      { label: 'Team', href: '#team' },
      { label: 'Press', href: '#press' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'YouTube', href: 'https://youtube.com' },
      { label: 'Contact', href: '#contact' },
    ],
  },
];

export function Footer({
  columns = defaultColumns,
  showNewsletter = true,
}: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!footerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer
      ref={footerRef}
      className="bg-prax-black py-20"
    >
      <div ref={contentRef} className="container-prax">
        {/* Newsletter */}
        {showNewsletter && (
          <div className="mb-16 pb-16 border-b border-prax-charcoal">
            <div className="max-w-xl">
              <h3 className="text-title font-bold text-prax-white mb-4">
                Stay in the loop
              </h3>
              <p className="text-body text-prax-stone mb-6">
                Subscribe for updates on new courses, events, and exclusive content.
              </p>
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-prax-charcoal text-prax-white px-4 py-3 rounded-sm border border-transparent focus:border-prax-bone focus:outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary whitespace-nowrap disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {columns.map((column, i) => (
            <div key={i}>
              <h4 className="text-label text-prax-bone uppercase tracking-widest mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-body text-prax-stone hover:text-prax-white transition-colors link-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-prax-charcoal">
          {/* Logo */}
          <div className="text-2xl font-bold text-prax-white tracking-tight">
            PRAX
          </div>

          {/* Copyright */}
          <p className="text-sm text-prax-silver">
            &copy; {new Date().getFullYear()} PRAX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
