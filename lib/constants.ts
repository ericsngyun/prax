// Booking URLs
export const BOOKING_URL = 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7';

export const TEAM_BOOKING_URLS: Record<string, string> = {
  jack: 'https://getsquire.com/booking/book/prax-los-angeles/barber/jack-183/services',
  gavin: 'https://getsquire.com/booking/book/prax-los-angeles/barber/gavin-ly-1/services',
  steven: 'https://getsquire.com/booking/book/prax-los-angeles/barber/steven-tran-5/services',
};

// Social links
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/praxhair/',
  tiktok: 'https://www.tiktok.com/@praxhair',
} as const;

// PRAX Academy — education site (programs, enrollment)
export const PRAX_ACADEMY_URL = 'https://praxacademy.com';

// PRAX Academy community (Skool)
export const SKOOL_URL = 'https://www.skool.com/praxacademy/about';

// Business info
export const BUSINESS_INFO = {
  address: '142 E Huntington Dr',
  city: 'Arcadia, CA 91006',
  hours: [
    'Monday - Saturday: 10am - 9pm',
    'Sunday: Closed',
  ],
} as const;

// Legal / privacy
// "PRAX Hair" is the trade name; JACKLOUII LLC is the operating entity that
// controls the data. Confirm the exact registered name with the CA Secretary
// of State filing before this is cited in a Meta lead form.
export const LEGAL_ENTITY = 'JACKLOUII LLC';
export const TRADE_NAME = 'PRAX Hair';
export const CONTACT_EMAIL = 'praxhair@gmail.com';

// Displayed on /privacy. Bump whenever the policy text materially changes.
export const PRIVACY_EFFECTIVE_DATE = 'September 4, 2026';
