import { HeroSection } from '@/components/sections/HeroSection';
import { IntroSection } from '@/components/sections/IntroSection';
import { ServicesPreviewSection } from '@/components/sections/ServicesPreviewSection';
import { DifferentiationSection } from '@/components/sections/DifferentiationSection';
import { SocialProofSection } from '@/components/sections/SocialProofSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { FounderSection } from '@/components/sections/FounderSection';
import { LocationSection } from '@/components/sections/LocationSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { cloudinaryAssets } from '@/lib/cloudinary';
import { footerColumns } from '@/lib/footerConfig';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection
        headline="PRAX"
        kicker="Precision Haircuts for Men Who Care About Detail"
        subheadline="High-end grooming studio in Los Angeles. Executed with discipline, design, and intention."
        primaryCTA={{
          text: 'Book an Appointment',
          href: 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null',
        }}
        secondaryCTA={{ text: 'View Our Work', href: '#work' }}
        videoSrc={cloudinaryAssets.heroVideo}
      />

      {/* 2. Intro Section */}
      <IntroSection
        statement="PRAX is not a traditional barbershop."
        paragraphs={[
          'We are a precision-driven grooming studio focused on craftsmanship, structure, and long-term hair design.',
          'Every service is intentional. Every haircut is built, not rushed.',
        ]}
      />

      {/* 3. Services Preview */}
      <ServicesPreviewSection
        label="Services"
        heading="What We Offer"
      />

      {/* 4. Why PRAX — Differentiation */}
      <DifferentiationSection
        label="Why PRAX"
        heading="Built on Three Principles"
        pillars={[
          {
            number: '01',
            title: 'Precision First',
            description:
              'Every haircut is approached with structure, balance, and control — not trends or shortcuts.',
          },
          {
            number: '02',
            title: 'Education-Driven',
            description:
              'PRAX is also an academy. Our standards are higher because we teach them.',
          },
          {
            number: '03',
            title: 'Designed Experience',
            description:
              'From consultation to finish, every detail is intentional — calm, focused, and professional.',
          },
        ]}
      />

      {/* 5. Social Proof */}
      <SocialProofSection
        heading="Trusted by Clients Who Expect More"
        testimonials={[
          {
            quote: "I've never had a haircut that grew out this well.",
            author: 'Client, Los Angeles',
          },
          {
            quote: 'PRAX feels more like a design studio than a barbershop.',
            author: 'Client, Beverly Hills',
          },
          {
            quote: 'The attention to detail is unmatched. Every visit is consistent.',
            author: 'Client, West Hollywood',
          },
        ]}
      />

      {/* 6. Portfolio */}
      <PortfolioSection
        label="Selected Work"
        heading="Portfolio"
        items={[
          {
            src: '',
            alt: 'Studio cut - side profile',
            title: 'Studio Cut — Side Profile',
            note: 'Clean lighting, neutral background, sharp silhouette',
          },
          {
            src: '',
            alt: 'Close-up detailing - scissor work',
            title: 'Close-Up Detailing',
            note: 'Hands + tools, shallow depth of field',
          },
          {
            src: '',
            alt: 'Finished haircut - front view',
            title: 'Finished Look — Front View',
            note: 'Model expression neutral, high contrast',
          },
          {
            src: '',
            alt: 'Texture and movement shot',
            title: 'Texture + Movement',
            note: 'Natural motion, mid-length styling',
          },
          {
            src: '',
            alt: 'Blonding or color result',
            title: 'Color Work',
            note: 'Even tone, refined finish, no distractions',
          },
          {
            src: '',
            alt: 'Studio environment b-roll',
            title: 'Studio Atmosphere',
            note: 'Wide shot, minimalist interior, soft lighting',
          },
        ]}
      />

      {/* 7. Founder Section */}
      <FounderSection
        heading="Built on Craft, Not Hype"
        philosophy={[
          'PRAX was founded to raise the standard of men\'s haircutting — emphasizing discipline, precision, and education over speed or volume.',
          'The studio operates with the same principles we teach: clarity, structure, and mastery of fundamentals.',
        ]}
        founderName="Jack Louii"
        founderTitle="Founder & Lead Artist"
        founderBio="Raised the standard for precision haircutting through discipline, education, and an uncompromising commitment to craft."
        imageSrc={cloudinaryAssets.teamJack}
        imageAlt="Jack Louii - PRAX Founder"
      />

      {/* 8. Location */}
      <LocationSection
        label="Visit Us"
        heading="Located in Los Angeles"
        description="A calm, focused environment designed for clients who value quality and consistency."
        address="123 Main Street"
        city="Los Angeles, CA 90001"
        hours={[
          'Tuesday - Friday: 10am - 7pm',
          'Saturday: 9am - 6pm',
          'Sunday - Monday: Closed',
        ]}
      />

      {/* 9. Final CTA */}
      <CTASection />

      {/* Footer */}
      <Footer showNewsletter columns={footerColumns} />
    </main>
  );
}
