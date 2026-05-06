import { HeroSection } from '@/components/sections/HeroSection';
import { IntroSection } from '@/components/sections/IntroSection';
import { ServicesPreviewSection } from '@/components/sections/ServicesPreviewSection';
import { DifferentiationSection } from '@/components/sections/DifferentiationSection';
import { SocialProofSection } from '@/components/sections/SocialProofSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { FounderSection } from '@/components/sections/FounderSection';
import { LocationSection } from '@/components/sections/LocationSection';
import { CTASection } from '@/components/sections/CTASection';
import { assets } from '@/lib/assets';
import { BOOKING_URL } from '@/lib/constants';

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
          href: BOOKING_URL,
        }}
        secondaryCTA={{ text: 'View Our Work', href: '/team' }}
        videoSrc={assets.heroVideo}
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
        heading="Rated 5 Stars — Trusted by Clients Who Expect More"
        testimonials={[
          {
            quote: "After letting my hair grow out for 5 months, I wanted to try a middle part flow. I'd seen videos of Jack cutting the hair of some of the best barbers in LA, so I figured this was the place to go. He didn't disappoint—the cut turned out amazing! It looks great, feels great, and is exactly what I wanted. Couldn't be happier.",
            author: 'Clay Morton',
          },
          {
            quote: "These guys are the best! Ari and Jack are both really cool guys but have tons of knowledge about hair. Ari was the one who cut my hair and he answered all my questions and even gave me more insight regarding my hair and how to style it. I definitely will be coming back and if you're looking for people who you can trust with your hair, this is forsure the spot.",
            author: 'Arya V',
          },
          {
            quote: "Gavin always gives me the best cuts. Really skilled with scissors and actually listens to what style you want. This place is a gem especially for curly hair.",
            author: 'Parker Wenguer',
          },
        ]}
      />

      {/* 6. Portfolio */}
      <PortfolioSection
        label="Selected Work"
        heading="Portfolio"
        items={[
          { src: assets.portfolio01, alt: 'Editorial portrait', title: 'Editorial 01' },
          { src: assets.portfolio02, alt: 'Editorial portrait', title: 'Editorial 02' },
          { src: assets.portfolio03, alt: 'Editorial portrait', title: 'Editorial 03' },
          { src: assets.portfolio04, alt: 'Editorial portrait', title: 'Editorial 04' },
          { src: assets.portfolio05, alt: 'Editorial portrait', title: 'Editorial 05' },
          { src: assets.portfolio06, alt: 'Editorial portrait', title: 'Editorial 06' },
          { src: assets.portfolio07, alt: 'Editorial portrait', title: 'Editorial 07' },
          { src: assets.portfolio08, alt: 'Editorial portrait', title: 'Editorial 08' },
          { src: assets.portfolio09, alt: 'Editorial portrait', title: 'Editorial 09' },
          { src: assets.portfolio10, alt: 'Editorial portrait', title: 'Editorial 10' },
          { src: assets.portfolio11, alt: 'Editorial portrait', title: 'Editorial 11' },
          { src: assets.portfolio12, alt: 'Editorial portrait', title: 'Editorial 12' },
          { src: assets.portfolio13, alt: 'Editorial portrait', title: 'Editorial 13' },
          { src: assets.portfolio14, alt: 'Editorial portrait', title: 'Editorial 14' },
          { src: assets.portfolio15, alt: 'Editorial portrait', title: 'Editorial 15' },
          { src: assets.portfolio16, alt: 'Editorial portrait', title: 'Editorial 16' },
          { src: assets.portfolio17, alt: 'Editorial portrait', title: 'Editorial 17' },
          { src: assets.portfolio18, alt: 'Editorial portrait', title: 'Editorial 18' },
          { src: assets.portfolio19, alt: 'Editorial portrait', title: 'Editorial 19' },
        ]}
      />

      {/* 7. Founder Section */}
      <FounderSection
        heading="Built on craft, and curated design"
        philosophy={[
          'PRAX was founded to raise the standard of men\'s haircutting — emphasizing discipline, precision, and education over speed or volume.',
          'The studio operates with the same principles we teach: clarity, structure, and mastery of fundamentals.',
        ]}
        founderName="Jack Louii"
        founderTitle="Founder & Lead Artist"
        founderBio="Raised the standard for precision haircutting through discipline, education, and an uncompromising commitment to craft."
        imageSrc={assets.teamJack}
        imageAlt="Jack Louii - PRAX Founder"
      />

      {/* 8. Location */}
      <LocationSection
        label="Visit Us"
        heading="Located in Los Angeles"
        description="A calm, focused environment designed for clients who value quality and consistency."
        address="1752 W Adams Blvd #206"
        city="Los Angeles, CA 90018"
        hours={[
          'Monday - Saturday: 10am - 9pm',
          'Sunday: Closed',
        ]}
        upcomingLocations={[
          {
            name: 'PRAX Arcadia',
            city: 'Arcadia, CA',
          },
        ]}
      />

      {/* 9. Final CTA */}
      <CTASection />

    </main>
  );
}
