/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER CONFIGURATION
   Centralized footer links used across all pages
   ═══════════════════════════════════════════════════════════════════════════ */

import { BOOKING_URL, SOCIAL_LINKS, SKOOL_URL } from '@/lib/constants';

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
      { label: 'Location', href: '/about' },
    ],
  },
  {
    title: 'Academy',
    links: [
      { label: 'Programs', href: '/academy' },
      { label: 'In-Person Classes', href: '/academy#programs' },
      { label: 'Online Courses', href: '/academy#programs' },
      { label: 'Skool Community', href: SKOOL_URL },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Instagram', href: SOCIAL_LINKS.instagram },
      { label: 'TikTok', href: SOCIAL_LINKS.tiktok },
      { label: 'Contact', href: SOCIAL_LINKS.instagram },
    ],
  },
];
