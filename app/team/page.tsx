import { TeamGridSection } from '@/components/sections/TeamGridSection';
import { TeamValuesSection } from '@/components/sections/TeamValuesSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { cloudinaryAssets } from '@/lib/cloudinary';
import { footerColumns } from '@/lib/footerConfig';

export const metadata = {
  title: 'Team',
  description:
    'Meet the PRAX team. Master barbers and educators committed to precision and craft.',
};

export default function TeamPage() {
  return (
    <main className="min-h-screen pt-20 md:pt-24">
      {/* Hero */}
      <section className="section-padding bg-prax-black">
        <div className="container-prax text-center max-w-4xl mx-auto">
          <h1 className="text-serif-display md:text-serif-hero text-prax-white mb-8">
            Meet the Team
          </h1>
          <p className="text-body-lg md:text-h4 text-prax-stone leading-relaxed">
            Every member of the PRAX team holds themselves to the same standard: precision, consistency, and an uncompromising commitment to craft.
          </p>
        </div>
      </section>

      {/* Team Grid - Unified bios */}
      <TeamGridSection
        heading="The Artists"
        description="Trained to the same rigorous standards. United by the same philosophy."
        members={[
          {
            name: 'Jack Louii',
            role: 'Founder & Lead Artist',
            specialty: 'Structural Design',
            experience: '12+ Years',
            credentials: [
              'PRAX Academy Founder',
              'Educator across 7 cities worldwide',
              'Trained 500+ barbers internationally',
              'Certified Master Barber',
            ],
            philosophy:
              'Precision is not about perfection—it is about intention. Every cut should be designed to maintain structure as it grows. That is the standard.',
            portraitSrc: cloudinaryAssets.teamJack,
            actionSrc: '',
            instagramHandle: 'jacklouii', // UPDATE WITH ACTUAL HANDLE
          },
          {
            name: 'Gavin',
            role: 'Master Barber',
            specialty: 'Blonding & Color',
            experience: '8+ Years',
            credentials: [
              'PRAX Senior Educator',
              'Blonding Specialist',
              'Advanced Color Techniques',
              'International Educator',
            ],
            philosophy:
              'A fade is not just a gradient—it is architecture. Every line must flow with intention. The details separate the good from the exceptional.',
            portraitSrc: cloudinaryAssets.teamGavin,
            actionSrc: '',
            instagramHandle: 'gavinblond',
          },
          {
            name: 'Edward',
            role: 'Senior Stylist',
            specialty: 'Precision Cutting',
            experience: '10+ Years',
            credentials: [
              'PRAX Lead Stylist',
              'Precision Cutting Specialist',
              'Editorial Experience',
              'Advanced Barbering Techniques',
            ],
            philosophy:
              'Hair has memory. Understanding how it moves, falls, and grows is what allows us to design cuts that work beyond the chair.',
            portraitSrc: cloudinaryAssets.teamEdward,
            actionSrc: '',
            instagramHandle: 'edwardkt_',
          },
          {
            name: 'Steven Tao Tran',
            role: 'Master Barber & Educator',
            specialty: 'Men\'s Cutting & Styling',
            experience: '10+ Years',
            credentials: [
              'PRAX Master Educator',
              'International Barber',
              'Competition Winner',
              'Advanced Men\'s Haircutting',
            ],
            philosophy:
              'Every cut tells a story. Precision, discipline, and intention create work that lasts beyond the chair.',
            portraitSrc: cloudinaryAssets.teamSteven,
            actionSrc: '',
            instagramHandle: 'steventaotran',
          },
        ]}
      />

      {/* Team Values */}
      <TeamValuesSection
        heading="What We Believe"
        values={[
          {
            title: 'Consistency Over Creativity',
            description:
              'Creativity without consistency is unreliable. Our clients return because they know what to expect: precision, care, and results that last.',
          },
          {
            title: 'Education is Elevation',
            description:
              'We teach because it sharpens our own standards. Every member of the PRAX team is both a practitioner and an educator—constantly refining their craft.',
          },
          {
            title: 'Respect the Process',
            description:
              'Great haircuts are not rushed. They require time, focus, and discipline. We do not cut corners, and we do not compromise on quality.',
          },
          {
            title: 'Build for the Long-Term',
            description:
              'A haircut is not just for the day you leave the chair. It should grow out well, maintain structure, and make your life easier between appointments.',
          },
        ]}
      />

      {/* Educator Credibility */}
      <section className="section-padding bg-prax-ink">
        <div className="container-prax text-center max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div>
              <div className="text-display text-prax-bone font-light mb-4">
                500+
              </div>
              <div className="text-body text-prax-stone">
                Barbers trained worldwide
              </div>
            </div>
            <div>
              <div className="text-display text-prax-bone font-light mb-4">
                7
              </div>
              <div className="text-body text-prax-stone">
                Cities with PRAX Academy programs
              </div>
            </div>
            <div>
              <div className="text-display text-prax-bone font-light mb-4">
                12+
              </div>
              <div className="text-body text-prax-stone">
                Years of combined teaching experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        headline="Work With the Team"
        description="Book with any of our artists. Every member delivers the same PRAX standard."
      />

      {/* Footer */}
      <Footer showNewsletter columns={footerColumns} />
    </main>
  );
}
