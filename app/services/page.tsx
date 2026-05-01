import type { Metadata } from 'next';
import { ServiceMenuSection } from '@/components/sections/ServiceMenuSection';
import { ProcessGallerySection } from '@/components/sections/ProcessGallerySection';
import { HonestySection } from '@/components/sections/HonestySection';
import { DifferentiationSection } from '@/components/sections/DifferentiationSection';
import { ExperienceTimelineSection } from '@/components/sections/ExperienceTimelineSection';
import { BeforeAfterGallery } from '@/components/sections/BeforeAfterGallery';
import { CTASection } from '@/components/sections/CTASection';
import { InnerPageHero } from '@/components/sections/InnerPageHero';
import { assets } from '@/lib/assets';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Precision haircuts, grooming, and styling. Built, not rushed. Los Angeles.',
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <InnerPageHero
        label="Services"
        headline="Built, Not Rushed"
        description="Clear service categories. Transparent expectations. Direct booking."
        backgroundImage={assets.servicesHeroImage}
      />

      {/* Service Menu */}
      <ServiceMenuSection
        heading="Service Menu"
        description="All services include consultation."
        categories={[
          {
            category: 'Cuts',
            description: 'Precision haircuts built around your head shape and hair behavior.',
            items: [
              {
                name: 'Haircut',
                price: '$70 – $125',
                duration: '60–75 min',
                note: 'Includes consultation, precision cut, styling, and product recommendations',
              },
              {
                name: 'Haircut & Beard',
                price: '$90 – $150',
                duration: '60–90 min',
                note: 'Full haircut plus beard sculpting, hot towel, and face grooming',
              },
            ],
          },
        ]}
        footnote="Prices reflect current Squire booking rates and may vary by artist. Book through our team page to see individual pricing."
      />

      {/* Honesty Section */}
      <HonestySection
        heading="Is PRAX Right for You?"
        forYouItems={[
          'You care about details and precision',
          'You want haircuts that grow out well over time',
          'You value consistency and professional results',
          'You appreciate a calm, focused environment',
          'You are willing to invest in quality',
        ]}
        notForYouItems={[
          'You need a quick, walk-in service',
          'You are looking for the cheapest option',
        ]}
      />

      {/* What Makes PRAX Different */}
      <DifferentiationSection
        label="What Makes PRAX Different"
        heading="Built on Structure, and curated design"
        pillars={[
          {
            number: '01',
            title: 'Structural Approach',
            description:
              'We design haircuts based on your head shape and hair behavior — not fleeting trends. Every cut is engineered to maintain shape as it grows.',
          },
          {
            number: '02',
            title: 'Education Standards',
            description:
              'PRAX is also an academy. We hold ourselves to the same rigorous standards we teach our students worldwide.',
          },
          {
            number: '03',
            title: 'Long-Term Results',
            description:
              'Our clients return because their haircuts maintain structure and grow out cleanly. We build for consistency, not just the first day.',
          },
        ]}
      />

      {/* The Experience */}
      <ExperienceTimelineSection
        heading="What to Expect"
        description="Every appointment follows the same disciplined process."
        steps={[
          {
            step: '01',
            title: 'Consultation',
            description:
              'We start by understanding your hair, lifestyle, and goals. This is not rushed. We assess head shape, hair texture, growth patterns, and maintenance capacity.',
          },
          {
            step: '02',
            title: 'Cutting',
            description:
              'Precision work. Every section is measured, cut with intention, and checked for balance. We work methodically, not quickly.',
          },
          {
            step: '03',
            title: 'Detailing',
            description:
              'Final refinements. Edge work, texture adjustments, and ensuring every angle is clean. This is where the difference shows.',
          },
          {
            step: '04',
            title: 'Styling & Guidance',
            description:
              'We show you how to maintain your haircut at home. Product recommendations, styling techniques, and when to return for your next appointment.',
          },
        ]}
      />

      {/* The Process in Detail */}
      <ProcessGallerySection
        items={[
          { title: 'Consultation', imageSrc: assets.processConsultation },
          { title: 'Precision Cutting', imageSrc: assets.processCutting },
          { title: 'Detailing', imageSrc: assets.processDetailing },
        ]}
      />

      {/* Before/After Gallery */}
      <BeforeAfterGallery
        heading="Results Speak"
        items={[
          {
            beforeSrc: assets.beforeAfter01Before,
            afterSrc: assets.beforeAfter01After,
            title: 'Precision Fade',
            service: 'Signature Cut'
          },
        ]}
      />

      {/* Final CTA */}
      <CTASection
        headline="Ready to Book?"
        description="If you are looking for precision haircuts executed with discipline and care, PRAX is for you."
      />

    </main>
  );
}
