import type { Metadata } from 'next';
import { TeamGridSection } from '@/components/sections/TeamGridSection';
import { TeamValuesSection } from '@/components/sections/TeamValuesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { CTASection } from '@/components/sections/CTASection';
import { InnerPageHero } from '@/components/sections/InnerPageHero';
import { assets } from '@/lib/assets';

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
        backgroundImage={assets.teamHeroBackground}
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
            portraitSrc: assets.jackWork04,
            workSamples: [
              assets.jackWork01,
              assets.jackWork02,
              assets.jackWork03,
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
            portraitSrc: assets.teamGavin,
            workSamples: [
              assets.gavinWork01,
              assets.gavinWork02,
              assets.gavinWork03,
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
            portraitSrc: assets.teamSteven,
            portraitPosition: 'center 25%',
            workSamples: [],
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
            portraitSrc: assets.arielWork02,
            workSamples: [],
            instagramHandle: 'aridonnel',
            bookingUrl:
              'https://getsquire.com/booking/book/prax-arcadia/barber/ariel-30/services',
          },
          {
            name: 'Jared Phan',
            role: 'Artist',
            specialty: '',
            experience: '',
            credentials: [],
            philosophy: '',
            portraitSrc: assets.jaredWork03,
            workSamples: [],
            instagramHandle: 'jaredtphan',
            bookingUrl:
              'https://getsquire.com/booking/book/prax-arcadia/barber/jared-phan-2/services',
          },
          {
            name: 'Brandon Latung',
            role: 'Intern Artist',
            specialty: '',
            experience: '',
            credentials: [],
            philosophy: '',
            portraitSrc: assets.teamBrandon,
            workSamples: [],
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
