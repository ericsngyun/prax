import { HeroSection } from '@/components/sections/HeroSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { cloudinaryAssets } from '@/lib/cloudinary';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Video background with multi-layer parallax */}
      <HeroSection
        headline="PRECISION"
        tagline="Hair artistry redefined. Los Angeles."
        videoSrc={cloudinaryAssets.heroVideo}
      />

      {/* Philosophy Section - Split layout with image reveal */}
      <PhilosophySection
        label="Our Philosophy"
        heading="We craft transformations that transcend technique"
        paragraphs={[
          "Every cut tells a story. Every detail matters. At PRAX, we believe in the power of precision—where artistry meets intention.",
          "Founded in Los Angeles by Jack Louii, we've built a community that values craft above all else. Our work isn't about following trends; it's about setting them.",
        ]}
        imageSrc={cloudinaryAssets.philosophyImage}
        imageAlt="PRAX Team - Master craftsmanship"
      />

      {/* Portfolio Section - Horizontal scroll gallery */}
      <PortfolioSection
        label="Selected Work"
        heading="Portfolio"
        items={[
          { src: cloudinaryAssets.portfolio01, alt: 'Precision Cut', title: 'Precision Cut' },
          { src: cloudinaryAssets.portfolio03, alt: 'Textured Style', title: 'Textured Style' },
          { src: cloudinaryAssets.portfolio04, alt: 'Platinum Fade', title: 'Platinum Fade' },
          { src: cloudinaryAssets.portfolio06, alt: 'Modern Mullet', title: 'Modern Mullet' },
          { src: cloudinaryAssets.portfolio05, alt: 'Silver Texture', title: 'Silver Texture' },
          { src: cloudinaryAssets.portfolio07, alt: 'Neon Art Design', title: 'Neon Art Design' },
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
          { name: 'Jack', role: 'Founder & Lead Artist', imageSrc: cloudinaryAssets.teamJack },
          { name: 'Gavin', role: 'Master Barber', imageSrc: cloudinaryAssets.teamGavin },
          { name: 'Edward', role: 'Senior Stylist', imageSrc: cloudinaryAssets.teamEdward },
          { name: 'Steven', role: 'Color Specialist', imageSrc: cloudinaryAssets.teamSteven },
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
