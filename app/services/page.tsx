import { ServiceTiersSection } from '@/components/sections/ServiceTiersSection';
import { HonestySection } from '@/components/sections/HonestySection';
import { DifferentiationSection } from '@/components/sections/DifferentiationSection';
import { ExperienceTimelineSection } from '@/components/sections/ExperienceTimelineSection';
import { BeforeAfterGallery } from '@/components/sections/BeforeAfterGallery';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { footerColumns } from '@/lib/footerConfig';

export const metadata = {
  title: 'Services',
  description:
    'Precision haircuts, grooming, and styling. Built, not rushed. Los Angeles.',
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-20 md:pt-24">
      {/* Hero — Left-aligned, structured */}
      <section className="section-padding-lg bg-prax-black">
        <div className="container-prax max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="text-label text-prax-silver">Services</span>
          </div>
          <h1 className="text-h1 md:text-display text-prax-white mb-10 max-w-4xl">
            Built, Not Rushed
          </h1>
          <p className="text-body-lg md:text-h4 text-prax-stone max-w-2xl leading-relaxed">
            Clear service categories. Transparent expectations. Direct booking.
          </p>
        </div>
      </section>

      {/* Service Tiers */}
      <ServiceTiersSection
        heading="Choose Your Service"
        description="Every service is built around precision, consistency, and long-term results."
        tiers={[
          {
            name: 'Signature Cut',
            price: '$150',
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
            bookingHref:
              'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null',
          },
          {
            name: 'Grooming Package',
            price: '$200',
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
            bookingHref:
              'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null',
          },
          {
            name: 'Consultation',
            price: '$50',
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
            bookingHref:
              'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null',
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
          'You prefer trendy styles over structural design',
          'You want to be in and out in 20 minutes',
        ]}
      />

      {/* What Makes PRAX Different */}
      <DifferentiationSection
        label="What Makes PRAX Different"
        heading="Built on Structure, Not Trends"
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
            duration: '10-15 min',
            description:
              'We start by understanding your hair, lifestyle, and goals. This is not rushed. We assess head shape, hair texture, growth patterns, and maintenance capacity.',
          },
          {
            step: '02',
            title: 'Cutting',
            duration: '30-40 min',
            description:
              'Precision work. Every section is measured, cut with intention, and checked for balance. We work methodically, not quickly.',
          },
          {
            step: '03',
            title: 'Detailing',
            duration: '10-15 min',
            description:
              'Final refinements. Edge work, texture adjustments, and ensuring every angle is clean. This is where the difference shows.',
          },
          {
            step: '04',
            title: 'Styling & Guidance',
            duration: '10 min',
            description:
              'We show you how to maintain your haircut at home. Product recommendations, styling techniques, and when to return for your next appointment.',
          },
        ]}
      />

      {/* Before/After Gallery */}
      <BeforeAfterGallery
        heading="Results Speak"
        items={[
          { beforeSrc: '', afterSrc: '', title: 'Precision Fade', service: 'Signature Cut' },
          { beforeSrc: '', afterSrc: '', title: 'Textured Crop', service: 'Signature Cut' },
          { beforeSrc: '', afterSrc: '', title: 'Classic Taper', service: 'Signature Cut' },
          { beforeSrc: '', afterSrc: '', title: 'Modern Pompadour', service: 'Grooming Package' },
          { beforeSrc: '', afterSrc: '', title: 'Beard Sculpting', service: 'Grooming Package' },
          { beforeSrc: '', afterSrc: '', title: 'Structural Cut', service: 'Signature Cut' },
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
