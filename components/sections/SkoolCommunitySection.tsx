import { SKOOL_URL } from '@/lib/constants';

export function SkoolCommunitySection() {
  return (
    <section className="section-padding bg-prax-charcoal">
      <div className="container-prax max-w-3xl mx-auto text-center">
        <div className="border border-prax-graphite/40 bg-prax-ink/30 px-8 md:px-12 py-12 md:py-16">
          <span className="text-label text-prax-bone/80 tracking-[0.2em] uppercase mb-4 block">
            Join the Community
          </span>
          <h2 className="text-h2 md:text-h1 font-light text-prax-white mb-6">
            Connect with PRAX Academy
          </h2>
          <p className="text-body-lg text-prax-stone leading-relaxed mb-10 max-w-2xl mx-auto">
            Join our exclusive community of barbers learning precision haircutting. Get access to educational content, connect with fellow students, and stay updated on upcoming programs.
          </p>
          <a
            href={SKOOL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary text-body-sm cursor-pointer inline-block"
          >
            Join Skool Community
          </a>
        </div>
      </div>
    </section>
  );
}
