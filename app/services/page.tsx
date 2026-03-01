import { ServiceTiersSection } from '@/components/sections/ServiceTiersSection';
import { HonestySection } from '@/components/sections/HonestySection';
import { DifferentiationSection } from '@/components/sections/DifferentiationSection';
import { ExperienceTimelineSection } from '@/components/sections/ExperienceTimelineSection';
import { BeforeAfterGallery } from '@/components/sections/BeforeAfterGallery';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { InnerPageHero } from '@/components/sections/InnerPageHero';
import { cloudinaryAssets } from '@/lib/cloudinary';
import { footerColumns } from '@/lib/footerConfig';

export const metadata = {
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
      />

      {/* Service Tiers */}
      <ServiceTiersSection
        heading="Choose Your Service"
        description="Custom experiences designed by PRAX. Pricing varies by artist—view our team to learn more and book."
        tiers={[
          {
            name: 'Signature Cut',
            price: 'Custom',
            duration: '60-75 min',
            description:
              'Our foundational service. Tailored haircut designed around your head shape, hair behavior, and personal style.',
            includes: [
              'Consultation and style analysis',
              'Precision cutting and detailing',
              'Styling and finishing',
              'Product recommendations',
              'Maintenance guidance',
            ],
            bookingHref: '/team',
          },
          {
            name: 'Grooming Package',
            price: 'Custom',
            duration: '90 min',
            description:
              'Complete grooming experience. Haircut plus beard sculpting, detailing, and finishing.',
            includes: [
              'Everything in Signature Cut',
              'Beard trim and shaping',
              'Hot towel treatment',
              'Face grooming and cleanup',
              'Premium product application',
            ],
            bookingHref: '/team',
          },
          {
            name: 'Consultation',
            price: 'Custom',
            duration: '30 min',
            description:
              'Not sure what you need? Start here. In-depth consultation to assess your hair and plan your style direction.',
            includes: [
              'Hair and scalp analysis',
              'Style recommendations',
              'Maintenance plan',
              'Product suggestions',
              'Credit toward first service',
            ],
            bookingHref: '/team',
          },
        ]}
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

      {/* Services Media Placeholder */}
      <section className="section-padding bg-prax-ink">
        <div className="container-prax max-w-6xl mx-auto">
          <div className="mb-12 md:mb-16">
            <span className="text-label text-prax-silver mb-4 block">
              Visuals
            </span>
            <h2 className="text-h2 md:text-h1 text-prax-white">
              The Process in Detail
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Consultation',
                note: 'Wide or medium shot, client + artist, calm lighting',
              },
              {
                title: 'Precision Cutting',
                note: 'Close-up hands + scissors/clipper, shallow depth',
              },
              {
                title: 'Detailing',
                note: 'Edge work or texture refinement, clean backdrop',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative aspect-[4/5] bg-prax-charcoal flex items-center justify-center"
              >
                <div className="text-center px-6">
                  <div className="text-label text-prax-bone/60 mb-3">
                    Placeholder
                  </div>
                  <div className="text-body text-prax-white mb-2">
                    {item.title}
                  </div>
                  <div className="text-caption text-prax-stone">
                    {item.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <BeforeAfterGallery
        heading="Results Speak"
        items={[
          {
            beforeSrc: cloudinaryAssets.beforeAfter01Before,
            afterSrc: cloudinaryAssets.beforeAfter01After,
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

      {/* Footer */}
      <Footer showNewsletter columns={footerColumns} />
    </main>
  );
}
