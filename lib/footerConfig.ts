/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER CONFIGURATION
   Centralized footer links used across all pages
   ═══════════════════════════════════════════════════════════════════════════ */

import { BOOKING_URL } from '@/lib/constants';

export const footerColumns = [
  {
    title: 'Services',
    links: [
      {
        label: 'All Services',
        href: '/services',
      },
      {
        label: 'Book Appointment',
        href: BOOKING_URL,
      },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'Team', href: '/team' },
      { label: 'About', href: '/about' },
      { label: 'Location', href: '/about#studio' },
    ],
  },
  {
    title: 'Academy',
    links: [
      { label: 'Programs', href: '/academy' },
      { label: 'In-Person Classes', href: '/academy#programs' },
      { label: 'Online Courses', href: '/academy#programs' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/praxhair/' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@praxhair' },
      { label: 'Contact', href: 'https://www.instagram.com/praxhair/' },
    ],
  },
];
