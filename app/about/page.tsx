import { OriginStorySection } from '@/components/sections/OriginStorySection';
import { CoreValuesDeepDive } from '@/components/sections/CoreValuesDeepDive';
import { StudioSpaceSection } from '@/components/sections/StudioSpaceSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { cloudinaryAssets } from '@/lib/cloudinary';
import { footerColumns } from '@/lib/footerConfig';

export const metadata = {
  title: 'About',
  description:
    'PRAX was founded to raise the standard of men\'s haircutting — emphasizing discipline, precision, and education over speed or volume.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20 md:pt-24">
      {/* Hero — Left-aligned, structured */}
      <section className="section-padding-lg bg-prax-black">
        <div className="container-prax max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="text-label text-prax-silver">About</span>
          </div>
          <h1 className="text-h1 md:text-display text-prax-white mb-10 max-w-4xl">
            Built on Craft, Not Hype
          </h1>
          <p className="text-body-lg md:text-h4 text-prax-stone leading-relaxed max-w-2xl">
            PRAX was founded to raise the standard of men&apos;s haircutting —
            emphasizing discipline, precision, and education over speed or
            volume.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <OriginStorySection
        heading="Why PRAX Exists"
        story={[
          'In 2012, Jack Louii recognized a gap in the industry: too many barbers prioritized speed over structure, trends over fundamentals, and volume over quality.',
          'PRAX was founded as a response — a studio that would operate differently. One that valued precision, educated its team to the highest standards, and built haircuts designed to last.',
          'What started as a single chair in Los Angeles has grown into a global education platform, teaching barbers in 7 cities worldwide the same principles: clarity, structure, and mastery of fundamentals.',
          'Today, PRAX serves both clients and students — offering precision haircuts in our LA studio, and world-class education for barbers who want to elevate their craft.',
        ]}
        founderImageSrc={cloudinaryAssets.teamJack}
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
          { src: '', alt: 'Studio interior - main floor', caption: 'The main cutting floor' },
          { src: '', alt: 'Individual cutting station', caption: 'Each station is designed for focus' },
          { src: '', alt: 'Tool detail shot', caption: 'Tools selected for precision' },
          { src: '', alt: 'Product shelf', caption: 'Curated product selection' },
          { src: '', alt: 'Waiting area', caption: 'Minimal aesthetic throughout' },
          { src: '', alt: 'Studio exterior', caption: 'Located in Los Angeles' },
        ]}
      />

      {/* The PRAX Standard */}
      <section className="section-padding bg-prax-black">
        <div className="container-prax max-w-5xl mx-auto">
          <h2 className="text-h1 text-prax-white mb-16 text-center">
            The PRAX Standard
          </h2>
          <p className="text-body-lg text-prax-stone leading-relaxed text-center mb-16">
            Every service. Every class. Every interaction.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="text-center">
              <div className="text-h2 text-prax-bone mb-3">Precision</div>
              <div className="text-body text-prax-silver">
                Intention in every cut
              </div>
            </div>
            <div className="text-center">
              <div className="text-h2 text-prax-bone mb-3">Consistency</div>
              <div className="text-body text-prax-silver">
                Reliable results, every time
              </div>
            </div>
            <div className="text-center">
              <div className="text-h2 text-prax-bone mb-3">Education</div>
              <div className="text-body text-prax-silver">
                Elevating the industry
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        headline="Experience the Difference"
        description="If you value precision, consistency, and long-term results, PRAX is for you."
      />

      {/* Footer */}
      <Footer showNewsletter columns={footerColumns} />
    </main>
  );
}
