'use client';

import Image from 'next/image';
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
  columns: FooterColumn[];
}

export function Footer({ columns }: FooterProps) {

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
                {column.links.map((link) => {
                  const isExternal = link.href.startsWith('http');
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="text-body text-prax-stone hover:text-prax-white transition-colors link-underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-prax-charcoal">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src={cloudinaryAssets.textLogo}
              alt="PRAX"
              width={248}
              height={32}
              quality={90}
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
