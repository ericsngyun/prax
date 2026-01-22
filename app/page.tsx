export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-svh flex items-end pb-20">
        {/* Background gradient placeholder */}
        <div className="absolute inset-0 bg-prax-black" />
        <div className="absolute inset-0 hero-gradient" />

        {/* Hero Content */}
        <div className="container-prax relative z-10">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <p className="text-label text-prax-silver mb-4">
              THE ART OF
            </p>

            {/* Headline */}
            <h1 className="text-hero text-prax-white mb-6">
              PRECISION
            </h1>

            {/* Tagline */}
            <p className="text-body-lg text-prax-stone max-w-md">
              Hair artistry redefined. Los Angeles.
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2 text-prax-silver">
              <span className="text-caption">Scroll</span>
              <div className="w-px h-8 bg-prax-silver/30 relative overflow-hidden">
                <div className="absolute inset-x-0 h-full bg-prax-white animate-scroll-line" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding">
        <div className="container-prax">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-label text-prax-silver mb-8">
              THE PRAX PHILOSOPHY
            </p>
            <h2 className="text-h2 text-prax-white mb-8">
              We don&apos;t do haircuts. We craft transformations.
            </h2>
            <p className="text-body-lg text-prax-stone">
              Every cut is a collaboration between artist and canvas—precision
              technique meets creative vision. This is hair elevated to its highest form.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-prax-black/50">
        <div className="container-prax">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Service Card 1 */}
            <article className="card-lift bg-prax-charcoal border border-white/[0.08] rounded-lg p-8">
              <span className="text-display text-prax-graphite font-bold leading-none">
                01
              </span>
              <h3 className="text-h3 text-prax-white mt-4 mb-3">
                The Studio
              </h3>
              <p className="text-body text-prax-stone mb-6">
                Premium cuts in our LA space. Where precision meets comfort.
              </p>
              <a href="/book" className="text-body-sm text-prax-white link-underline">
                Explore →
              </a>
            </article>

            {/* Service Card 2 */}
            <article className="card-lift bg-prax-charcoal border border-white/[0.08] rounded-lg p-8">
              <span className="text-display text-prax-graphite font-bold leading-none">
                02
              </span>
              <h3 className="text-h3 text-prax-white mt-4 mb-3">
                The Academy
              </h3>
              <p className="text-body text-prax-stone mb-6">
                Master the craft. In-person education across 7 cities.
              </p>
              <a href="/academy" className="text-body-sm text-prax-white link-underline">
                Explore →
              </a>
            </article>

            {/* Service Card 3 */}
            <article className="card-lift bg-prax-charcoal border border-white/[0.08] rounded-lg p-8">
              <span className="text-display text-prax-graphite font-bold leading-none">
                03
              </span>
              <h3 className="text-h3 text-prax-white mt-4 mb-3">
                PRAX Online
              </h3>
              <p className="text-body text-prax-stone mb-6">
                Learn anywhere. Digital courses for the modern stylist.
              </p>
              <a href="/online" className="text-body-sm text-prax-white link-underline">
                Explore →
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-lg">
        <div className="container-prax text-center">
          <h2 className="text-h1 text-prax-white mb-6">
            Ready to elevate your craft?
          </h2>
          <p className="text-body-lg text-prax-stone mb-10 max-w-xl mx-auto">
            Whether you&apos;re seeking a premium cut or looking to master the art,
            we&apos;re here to help you reach the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/book" className="btn btn-primary">
              Book a Cut
            </a>
            <a href="/academy" className="btn btn-secondary">
              Join the Academy
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-12">
        <div className="container-prax">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-h4 font-bold">PRAX</div>
            <nav className="flex gap-8">
              <a href="/work" className="text-body-sm text-prax-stone hover:text-prax-white transition-colors">
                Work
              </a>
              <a href="/academy" className="text-body-sm text-prax-stone hover:text-prax-white transition-colors">
                Academy
              </a>
              <a href="/online" className="text-body-sm text-prax-stone hover:text-prax-white transition-colors">
                Online
              </a>
              <a href="/team" className="text-body-sm text-prax-stone hover:text-prax-white transition-colors">
                Team
              </a>
            </nav>
            <p className="text-caption text-prax-silver">
              © 2026 PRAX. Los Angeles, CA.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
