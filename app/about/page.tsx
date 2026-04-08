import { OriginStorySection } from '@/components/sections/OriginStorySection';
import { CoreValuesDeepDive } from '@/components/sections/CoreValuesDeepDive';
import { StudioSpaceSection } from '@/components/sections/StudioSpaceSection';
import { PraxStandardSection } from '@/components/sections/PraxStandardSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { InnerPageHero } from '@/components/sections/InnerPageHero';
import { cloudinaryAssets } from '@/lib/cloudinary';
import { footerColumns } from '@/lib/footerConfig';

export const metadata = {
  title: 'About',
  description:
    'PRAX was founded to raise the standard of men\'s haircutting — emphasizing discipline, precision, and education over speed or volume.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <InnerPageHero
        label="About"
        headline="Built on craft, and curated design"
        description="PRAX was founded to raise the standard of men's haircutting — emphasizing discipline, precision, and education over speed or volume."
        videoSrc={cloudinaryAssets.aboutVideo}
      />

      {/* Origin Story */}
      <OriginStorySection
        heading="Why PRAX Exists"
        story={[
          'In 2018, Jack Louii recognized a gap in the industry: too many barbers prioritized speed over structure, trends over fundamentals, and volume over quality.',
          'PRAX was founded as a response — a studio that would operate differently. One that valued precision, educated its team to the highest standards, and built haircuts designed to last.',
          'What started as a single chair in Los Angeles has grown into a global education platform, teaching barbers in 12+ cities worldwide the same principles: clarity, structure, and mastery of fundamentals.',
          'Today, PRAX serves both clients and students — offering precision haircuts in our LA studio, and world-class education for barbers who want to elevate their craft.',
        ]}
        founderImageSrc={cloudinaryAssets.philosophyImage}
        founderImageAlt="Jack Louii - PRAX Founder"
      />

      {/* Core Values */}
      <CoreValuesDeepDive
        heading="What We Stand For"
        values={[
          {
            number: '01',
            title: 'Precision as a Value',
            subtitle: 'Not just a technique — a commitment',
            description: [
              'Precision is not about perfection. It is about intention. Every cut is designed with structure, balance, and long-term wearability in mind.',
              'We do not chase trends. We build haircuts that work — that grow out well, maintain shape, and make your life easier between appointments.',
              'This requires discipline. It requires time. And it requires a refusal to cut corners.',
            ],
          },
          {
            number: '02',
            title: 'Design + Discipline',
            subtitle: 'Form follows function, always',
            description: [
              'Great design is not decoration — it is problem-solving. Every haircut we create solves for head shape, hair texture, growth patterns, and lifestyle.',
              'We approach haircutting like architects: understanding the foundation, building with intention, and refining every detail.',
              'This is why our clients return. Not because we followed a trend, but because we designed something that works.',
            ],
          },
          {
            number: '03',
            title: 'Long-Term Vision',
            subtitle: 'Building for the future, not just today',
            description: [
              'PRAX is not interested in being the biggest — we are interested in being the best at what we do.',
              'Our vision is to continue raising the standard: for our clients, for our students, and for the industry as a whole.',
              'We measure success not by how many appointments we book, but by how many barbers we educate, how many clients we serve with excellence, and how many people we inspire to demand better.',
            ],
          },
        ]}
      />

      {/* Studio Space */}
      <StudioSpaceSection
        heading="The Space"
        description={[
          'PRAX Studio in Los Angeles is designed to reflect our values: clean, focused, and intentional.',
          'No distractions. No rush. Just a calm environment where precision work can happen.',
        ]}
        images={[
          {
            src: '',
            alt: 'Studio interior wide shot',
            caption: 'Wide studio interior — clean lines, neutral tones',
          },
          {
            src: '',
            alt: 'Individual cutting station',
            caption: 'Station detail — mirror, chair, tools, minimal clutter',
          },
          {
            src: '',
            alt: 'Tool detail shot',
            caption: 'Close-up tools — scissors/clipper, shallow depth of field',
          },
          {
            src: '',
            alt: 'Product shelf',
            caption: 'Product shelf — curated, orderly, monochrome styling',
          },
          {
            src: '',
            alt: 'Waiting area',
            caption: 'Waiting area — calm, soft lighting, minimal texture',
          },
          {
            src: '',
            alt: 'Studio exterior',
            caption: 'Exterior — signage + street context, late-afternoon light',
          },
        ]}
      />

      {/* The PRAX Standard */}
      <PraxStandardSection />

      {/* CTA */}
      <CTASection
        headline="Experience the Difference"
        description="If you value precision, consistency, and long-term results, PRAX is for you."
      />

      {/* Footer */}
      <Footer columns={footerColumns} />
    </main>
  );
}
