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
      <section className="section-padding-lg bg-prax-black">
        <div className="container-prax max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="text-label text-prax-silver">The Team</span>
          </div>
          <h1 className="text-h1 md:text-display text-prax-white mb-10 max-w-4xl">
            Meet the Artists
          </h1>
          <p className="text-body-lg md:text-h4 text-prax-stone leading-relaxed max-w-2xl">
            Every member of the PRAX team holds themselves to the same standard:
            precision, consistency, and an uncompromising commitment to craft.
          </p>
        </div>
      </section>

      {/* Team Grid */}
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
            videoSrc: '', // Jack's video intro — to be provided
            instagramHandle: 'jacklouii',
            bookingUrl:
              'https://getsquire.com/booking/book/prax-los-angeles/barber/jack-183/services',
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
            videoSrc: '', // Gavin's video intro — to be provided
            instagramHandle: 'gavinblond',
            bookingUrl:
              'https://getsquire.com/booking/book/prax-los-angeles/barber/gavin-ly-1/services',
          },
          {
            name: 'Steven Tao Tran',
            role: 'Master Barber & Educator',
            specialty: "Men's Cutting & Styling",
            experience: '10+ Years',
            credentials: [
              'PRAX Master Educator',
              'International Barber',
              'Competition Winner',
              "Advanced Men's Haircutting",
            ],
            philosophy:
              'Every cut tells a story. Precision, discipline, and intention create work that lasts beyond the chair.',
            portraitSrc: cloudinaryAssets.teamSteven,
            actionSrc: '',
            videoSrc: '', // Steven's video intro — to be provided
            instagramHandle: 'steventaotran',
            bookingUrl:
              'https://getsquire.com/booking/book/prax-los-angeles/barber/steven-tran-5/services',
          },
          // ═══════════════════════════════════════════════════════════════
          // NEW TEAM MEMBERS — Placeholders until Jack provides details
          // Each has videoSrc field ready for video introductions
          // ═══════════════════════════════════════════════════════════════
          {
            name: 'Team Member',
            role: 'Barber',
            specialty: 'Specialty TBD',
            experience: 'TBD',
            credentials: [
              'PRAX Certified',
              'Credential to be added',
              'Credential to be added',
            ],
            philosophy:
              'Philosophy quote to be provided.',
            portraitSrc: '',
            actionSrc: '',
            videoSrc: '', // Video intro — to be provided
            instagramHandle: '',
            bookingUrl: '',
          },
          {
            name: 'Team Member',
            role: 'Barber',
            specialty: 'Specialty TBD',
            experience: 'TBD',
            credentials: [
              'PRAX Certified',
              'Credential to be added',
              'Credential to be added',
            ],
            philosophy:
              'Philosophy quote to be provided.',
            portraitSrc: '',
            actionSrc: '',
            videoSrc: '', // Video intro — to be provided
            instagramHandle: '',
            bookingUrl: '',
          },
          {
            name: 'Team Member',
            role: 'Barber',
            specialty: 'Specialty TBD',
            experience: 'TBD',
            credentials: [
              'PRAX Certified',
              'Credential to be added',
              'Credential to be added',
            ],
            philosophy:
              'Philosophy quote to be provided.',
            portraitSrc: '',
            actionSrc: '',
            videoSrc: '', // Video intro — to be provided
            instagramHandle: '',
            bookingUrl: '',
          },
          {
            name: 'Team Member',
            role: 'Barber',
            specialty: 'Specialty TBD',
            experience: 'TBD',
            credentials: [
              'PRAX Certified',
              'Credential to be added',
              'Credential to be added',
            ],
            philosophy:
              'Philosophy quote to be provided.',
            portraitSrc: '',
            actionSrc: '',
            videoSrc: '', // Video intro — to be provided
            instagramHandle: '',
            bookingUrl: '',
          },
          {
            name: 'Team Member',
            role: 'Barber',
            specialty: 'Specialty TBD',
            experience: 'TBD',
            credentials: [
              'PRAX Certified',
              'Credential to be added',
              'Credential to be added',
            ],
            philosophy:
              'Philosophy quote to be provided.',
            portraitSrc: '',
            actionSrc: '',
            videoSrc: '', // Video intro — to be provided
            instagramHandle: '',
            bookingUrl: '',
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
        <div className="container-prax max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center md:text-left">
              <div className="text-display-sm md:text-display text-prax-bone font-light mb-2">
                500+
              </div>
              <div className="text-caption md:text-body-sm text-prax-silver">
                Barbers trained worldwide
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-display-sm md:text-display text-prax-bone font-light mb-2">
                7
              </div>
              <div className="text-caption md:text-body-sm text-prax-silver">
                Cities with PRAX programs
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-display-sm md:text-display text-prax-bone font-light mb-2">
                12+
              </div>
              <div className="text-caption md:text-body-sm text-prax-silver">
                Years combined experience
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
