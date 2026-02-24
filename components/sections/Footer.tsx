'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { cloudinaryAssets } from '@/lib/cloudinary';

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

  return (
    <footer
      className="bg-prax-black py-12 md:py-20 relative overflow-hidden"
    >
      {/* Decorative large PRAX text */}
      <div
        className="text-display md:text-hero text-prax-charcoal select-none pointer-events-none mb-8 md:mb-16 px-4"
        aria-hidden="true"
      >
        PRAX
      </div>

      <div className="container-prax">

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-10 md:mb-16">
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
          <div className="flex items-center">
            <Image
              src="https://res.cloudinary.com/dpc0d4a7s/image/upload/v1771808559/prax-text-logo_zdkdmr.png"
              alt="PRAX"
              width={120}
              height={36}
              className="h-7 md:h-8 w-auto"
            />
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
