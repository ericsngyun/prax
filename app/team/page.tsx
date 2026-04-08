import type { Metadata } from 'next';
import { TeamGridSection } from '@/components/sections/TeamGridSection';
import { TeamValuesSection } from '@/components/sections/TeamValuesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { CTASection } from '@/components/sections/CTASection';
import { InnerPageHero } from '@/components/sections/InnerPageHero';
import { cloudinaryAssets } from '@/lib/cloudinary';

export const metadata: Metadata = {
  title: 'Team',
  description:
    'Meet the PRAX team. Master barbers and educators committed to precision and craft.',
};

export default function TeamPage() {
  return (
    <main className="min-h-screen">
      <InnerPageHero
        label="The Team"
        headline="Meet the Artists"
        description="Every member of the PRAX team holds themselves to the same standard: precision, consistency, and an uncompromising commitment to craft."
        backgroundImage="https://res.cloudinary.com/dpc0d4a7s/image/upload/v1771905931/DSC06685_custv3.jpg"
      />

      {/* Team Grid */}
      <TeamGridSection
        heading="The Artists"
        description="Trained to the same rigorous standards. United by the same philosophy."
        members={[
          {
            name: 'Jack Louii',
            role: 'Founder & Lead Artist',
            specialty: '',
            experience: '',
            credentials: [],
            philosophy:
              'Precision is not about perfection—it is about intention. Every cut should be designed to maintain structure as it grows. That is the standard.',
            portraitSrc: cloudinaryAssets.teamJack,
            actionSrc: 'https://res.cloudinary.com/dpc0d4a7s/image/upload/v1771907588/PRAXxSTMNT-Event-42_1_zoznww.jpg',
            actionSrcPosition: 'center 30%', // Show more of the top of the image
            workSamples: [
              cloudinaryAssets.jackWork01,
              cloudinaryAssets.jackWork02,
              cloudinaryAssets.jackWork03,
              cloudinaryAssets.jackWork04,
            ],

            instagramHandle: 'jacklouii',
            bookingUrl:
              'https://getsquire.com/booking/book/prax-los-angeles/barber/jack-183/services',
          },
          {
            name: 'Gavin',
            role: 'Artist',
            specialty: '',
            experience: '',
            credentials: [],
            philosophy: '',
            portraitSrc: cloudinaryAssets.teamGavin,
            actionSrc: '',
            workSamples: [
              cloudinaryAssets.gavinWork01,
              cloudinaryAssets.gavinWork02,
              cloudinaryAssets.gavinWork03,
              cloudinaryAssets.gavinWork04,
            ],

            instagramHandle: 'gavinblond',
            bookingUrl:
              'https://getsquire.com/booking/book/prax-los-angeles/barber/gavin-ly-1/services',
          },
          {
            name: 'Steven Tao Tran',
            role: 'Artist',
            specialty: '',
            experience: '',
            credentials: [],
            philosophy: '',
            portraitSrc: cloudinaryAssets.teamSteven,
            actionSrc: '',
            workSamples: [
              cloudinaryAssets.stevenWork01,
              cloudinaryAssets.stevenWork02,
              cloudinaryAssets.stevenWork03,
              cloudinaryAssets.stevenWork04,
            ],

            instagramHandle: 'steventaotran',
            bookingUrl:
              'https://getsquire.com/booking/book/prax-los-angeles/barber/steven-tran-5/services',
          },
          {
            name: 'Ariel Donnel',
            role: 'Artist',
            specialty: '',
            experience: '',
            credentials: [],
            philosophy: '',
            portraitSrc: cloudinaryAssets.teamAriel,
            actionSrc: '',
            workSamples: [
              cloudinaryAssets.arielWork01,
              cloudinaryAssets.arielWork02,
              cloudinaryAssets.arielWork03,
            ],

            instagramHandle: 'aridonnel',
            bookingUrl: '',
          },
          {
            name: 'Jared Phan',
            role: 'Artist',
            specialty: '',
            experience: '',
            credentials: [],
            philosophy: '',
            portraitSrc: cloudinaryAssets.teamJared,
            actionSrc: 'https://res.cloudinary.com/dpc0d4a7s/image/upload/v1771906340/Screenshot_2026-02-23_at_8.12.10_PM_nswdr2.png',
            workSamples: [
              cloudinaryAssets.jaredWork01,
              cloudinaryAssets.jaredWork02,
            ],

            instagramHandle: 'jaredtphan',
            bookingUrl: '',
          },
          {
            name: 'Brandon Latung',
            role: 'Intern Artist',
            specialty: '',
            experience: '',
            credentials: [],
            philosophy: '',
            portraitSrc: 'https://res.cloudinary.com/dpc0d4a7s/image/upload/v1772508153/DSC05741_hojyxk.jpg',
            actionSrc: '',

            instagramHandle: 'mysticalasian',
            bookingUrl: '',
          },
        ]}
      />

      {/* Team Values */}
      <TeamValuesSection
        heading="What We Believe"
        values={[
          {
            title: 'Consistency Over Creativity',
            description:
              'Creativity without consistency is unreliable. Our clients return because they know what to expect: precision, care, and results that last.',
          },
          {
            title: 'Education is Elevation',
            description:
              'We teach because it sharpens our own standards. Every member of the PRAX team is both a practitioner and an educator—constantly refining their craft.',
          },
          {
            title: 'Respect the Process',
            description:
              'Great haircuts are not rushed. They require time, focus, and discipline. We do not cut corners, and we do not compromise on quality.',
          },
          {
            title: 'Build for the Long-Term',
            description:
              'A haircut is not just for the day you leave the chair. It should grow out well, maintain structure, and make your life easier between appointments.',
          },
        ]}
      />

      {/* Educator Credibility */}
      <StatsSection
        stats={[
          { value: 500, suffix: '+', label: 'Barbers trained worldwide' },
          { value: 7, label: 'Cities with PRAX programs' },
          { value: 12, suffix: '+', label: 'Years combined experience' },
        ]}
      />

      {/* CTA */}
      <CTASection
        headline="Work With the Team"
        description="Book with any of our artists. Every member delivers the same PRAX standard."
      />

    </main>
  );
}
