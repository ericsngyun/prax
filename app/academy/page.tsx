import type { Metadata } from 'next';
import { InnerPageHero } from '@/components/sections/InnerPageHero';
import { StatsSection } from '@/components/sections/StatsSection';
import { TeachingPrinciplesSection } from '@/components/sections/TeachingPrinciplesSection';
import { AcademyProgramsSection } from '@/components/sections/AcademyProgramsSection';
import { SkoolCommunitySection } from '@/components/sections/SkoolCommunitySection';
import { AcademyPhilosophySection } from '@/components/sections/AcademyPhilosophySection';
import { CTASection } from '@/components/sections/CTASection';
import { assets } from '@/lib/assets';

export const metadata: Metadata = {
  title: 'Academy',
  description:
    'PRAX Academy teaches the same precision methodology we use in our studio. Structure, discipline, and fundamentals — not trends.',
};

const programs = [
  {
    number: '01',
    title: 'Fundamentals',
    format: 'In-Person',
    duration: '5 Days',
    description:
      'Master the foundation. Head shape analysis, sectioning, and the structural approach to men\'s haircutting that defines PRAX.',
  },
  {
    number: '02',
    title: 'Precision Cutting',
    format: 'In-Person',
    duration: '3 Days',
    description:
      'Advanced techniques for barbers who want to elevate their craft. Clipper-over-comb, scissor work, and fade architecture.',
  },
  {
    number: '03',
    title: 'Design & Finishing',
    format: 'In-Person',
    duration: '2 Days',
    description:
      'The details that separate good from exceptional. Texture, movement, and designing cuts that grow out with intention.',
  },
  {
    number: '04',
    title: 'Online Masterclass',
    format: 'Digital',
    duration: 'Self-Paced',
    description:
      'The PRAX methodology delivered on your schedule. Video lessons, breakdowns, and frameworks you can apply immediately.',
  },
];

export default function AcademyPage() {
  return (
    <main className="min-h-screen">
      <InnerPageHero
        label="Academy"
        headline="Elevate Your Craft"
        description="PRAX Academy teaches the same precision methodology we use in our studio. Structure, discipline, and fundamentals — not trends."
        videoSrc={assets.academyVideo}
        backgroundImage={assets.academyHeroBackground}
      />
      <StatsSection
        stats={[
          { value: 1000, suffix: '+', label: 'Students Trained' },
          { value: 12, suffix: '+', label: 'Cities Worldwide' },
          { value: 6, suffix: '+', label: 'Years Teaching' },
        ]}
      />
      <TeachingPrinciplesSection />
      <AcademyProgramsSection programs={programs} />
      <SkoolCommunitySection />
      <AcademyPhilosophySection />
      <CTASection
        headline="Ready to Raise Your Standard?"
        description="Applications for upcoming classes are open. Limited seats per session to maintain quality."
        showPrimaryButton={false}
      />
    </main>
  );
}
