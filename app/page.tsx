import { HeroSection } from '@/components/sections/HeroSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Video background with multi-layer parallax */}
      <HeroSection
        headline="PRECISION"
        tagline="Hair artistry redefined. Los Angeles."
        videoSrc="/videos/hero-bg.mp4"
        videoPoster="/images/hero-poster.jpg"
      />

      {/* Philosophy Section - Split layout with image reveal */}
      <PhilosophySection
        label="Our Philosophy"
        heading="We craft transformations that transcend technique"
        paragraphs={[
          "Every cut tells a story. Every detail matters. At PRAX, we believe in the power of precision—where artistry meets intention.",
          "Founded in Los Angeles by Jack Louii, we've built a community that values craft above all else. Our work isn't about following trends; it's about setting them.",
        ]}
        imageSrc="/images/philosophy-portrait.jpg"
        imageAlt="PRAX Philosophy - Master craftsmanship"
      />

      {/* Portfolio Section - Horizontal scroll gallery */}
      <PortfolioSection
        label="Selected Work"
        heading="Portfolio"
        items={[
          { src: '/images/work/work-01.jpg', alt: 'Precision Cut', title: 'Precision Cut' },
          { src: '/images/work/work-02.jpg', alt: 'Textured Fade', title: 'Textured Fade' },
          { src: '/images/work/work-03.jpg', alt: 'Classic Style', title: 'Classic Style' },
          { src: '/images/work/work-04.jpg', alt: 'Modern Edge', title: 'Modern Edge' },
          { src: '/images/work/work-05.jpg', alt: 'Clean Lines', title: 'Clean Lines' },
          { src: '/images/work/work-06.jpg', alt: 'Artistic Vision', title: 'Artistic Vision' },
        ]}
      />

      {/* Services Section - 3-column card grid with stagger */}
      <ServicesSection
        label="What We Do"
        heading="Services"
        services={[
          {
            title: 'The Studio',
            description: 'Premium cuts and styling at our flagship Los Angeles location. Experience precision craftsmanship in an environment designed for excellence.',
          },
          {
            title: 'The Academy',
            description: 'In-person education programs across 7 cities worldwide. Learn from master craftsmen and elevate your technique to the next level.',
          },
          {
            title: 'PRAX Online',
            description: 'Digital courses and workshops accessible anywhere. Master the fundamentals and advanced techniques at your own pace.',
          },
        ]}
      />

      {/* Team Section - Portrait grid with grayscale effect */}
      <TeamSection
        label="The Artists"
        heading="Meet the Team"
        members={[
          { name: 'Jack Louii', role: 'Founder & Lead Artist', imageSrc: '/images/team/artist-01.jpg' },
          { name: 'Marcus Chen', role: 'Senior Stylist', imageSrc: '/images/team/artist-02.jpg' },
          { name: 'Elena Vasquez', role: 'Color Specialist', imageSrc: '/images/team/artist-03.jpg' },
          { name: 'Andre Williams', role: 'Master Barber', imageSrc: '/images/team/artist-04.jpg' },
        ]}
      />

      {/* CTA Section - Large typography with magnetic buttons */}
      <CTASection
        headline="Ready to elevate your craft?"
        description="Whether you're looking for a premium cut or want to join our academy, we're here to help you reach the next level."
        primaryButtonText="Book a Cut"
        primaryButtonHref="#book"
        secondaryButtonText="Join Academy"
        secondaryButtonHref="#academy"
      />

      {/* Footer - Newsletter and navigation */}
      <Footer
        showNewsletter
        columns={[
          {
            title: 'Studio',
            links: [
              { label: 'Book Appointment', href: '#book' },
              { label: 'Our Work', href: '#work' },
              { label: 'Location', href: '#location' },
            ],
          },
          {
            title: 'Academy',
            links: [
              { label: 'In-Person Classes', href: '#classes' },
              { label: 'Online Courses', href: '#courses' },
              { label: 'Workshops', href: '#workshops' },
            ],
          },
          {
            title: 'About',
            links: [
              { label: 'Our Story', href: '#story' },
              { label: 'Team', href: '#team' },
              { label: 'Press', href: '#press' },
            ],
          },
          {
            title: 'Connect',
            links: [
              { label: 'Instagram', href: 'https://instagram.com' },
              { label: 'YouTube', href: 'https://youtube.com' },
              { label: 'Contact', href: '#contact' },
            ],
          },
        ]}
      />
    </main>
  );
}
