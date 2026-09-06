import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Link } from 'next-view-transitions';
import {
  BUSINESS_INFO,
  CONTACT_EMAIL,
  LEGAL_ENTITY,
  PRIVACY_EFFECTIVE_DATE,
  SOCIAL_LINKS,
  TRADE_NAME,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How PRAX collects, uses, and shares information from visitors to prax.studio — including advertising cookies, the Meta Pixel, and your privacy rights.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

/* ═══════════════════════════════════════════════════════════════════════════
   PRIVACY POLICY
   A legal page, not a marketing page: no scroll animation, no video, no
   client JS. Plain server-rendered prose so ad-platform reviewers (and
   screen readers) get the text immediately.
   ═══════════════════════════════════════════════════════════════════════════ */

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-prax-graphite/60 pt-8 md:pt-10">
      <div className="grid md:grid-cols-[8rem_1fr] gap-3 md:gap-10">
        <p className="text-label text-prax-silver uppercase tracking-widest pt-1">
          {number}
        </p>
        <div>
          <h2 className="text-h3 font-medium tracking-tight text-prax-white mb-5">
            {title}
          </h2>
          <div className="space-y-4 text-body text-prax-stone leading-relaxed [&_a]:text-prax-bone [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-prax-graphite [&_a]:transition-colors [&_a:hover]:text-prax-white [&_a:hover]:decoration-prax-bone [&_strong]:text-prax-bone [&_strong]:font-medium">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-disc marker:text-prax-graphite">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  const mailto = `mailto:${CONTACT_EMAIL}`;

  return (
    <main className="min-h-screen pt-32 md:pt-44 pb-24 md:pb-32">
      <div className="container-prax">
        <div className="max-w-3xl">
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <p className="text-label text-prax-silver uppercase tracking-widest mb-6">
            Legal
          </p>
          <h1 className="text-h1 font-light tracking-tight text-prax-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-body-lg text-prax-stone leading-relaxed max-w-2xl">
            This policy explains what information we collect when you visit{' '}
            <span className="text-prax-bone">prax.studio</span>, how we use it,
            and the choices you have — including how to opt out of
            advertising cookies.
          </p>
          <p className="text-caption text-prax-silver uppercase tracking-widest mt-8">
            Effective {PRIVACY_EFFECTIVE_DATE}
          </p>
        </header>

        <div className="space-y-10 md:space-y-14">
          <Section number="01" title="Who We Are">
            <p>
              {TRADE_NAME} (&ldquo;PRAX,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a grooming studio and
              barbering education brand operated by {LEGAL_ENTITY}. Our studio
              is located at {BUSINESS_INFO.address}, {BUSINESS_INFO.city}.
            </p>
            <p>
              This policy applies to the website at prax.studio and to
              inquiries you send us by email, through our social media
              accounts, or through advertisements we run on third-party
              platforms. It does not cover the separate services described in
              Section 5, each of which has its own privacy policy.
            </p>
          </Section>

          <Section number="02" title="Information We Collect">
            <p>
              <strong>Information you give us.</strong> We do not currently host
              any forms on this website. We receive personal information only when
              you choose to send it — for example, if you email us, message us
              on Instagram or TikTok, or submit your contact details through a
              lead form attached to one of our advertisements on Meta
              (Facebook or Instagram). That information typically includes your
              name, email address, phone number, and whatever you write in your
              message.
            </p>
            <p>
              <strong>Information collected automatically.</strong> Like most
              websites, we and our providers automatically collect technical
              information when you browse: IP address, browser and device type,
              operating system, referring page, the pages you view, and the
              approximate region derived from your IP address. This is
              collected through server logs and through the cookies and
              tracking technologies described in Section 3.
            </p>
            <p>
              <strong>Information from advertising platforms.</strong> When we
              run ads, Meta and similar platforms report aggregated results to
              us — impressions, clicks, and conversions — and, in the case of
              lead ads, the contact details you submitted in the ad&rsquo;s
              form.
            </p>
            <p>
              We do not collect payment card details on this website. Booking
              and payment are handled off-site by our booking provider.
            </p>
          </Section>

          <Section number="03" title="Cookies, Pixels, and Advertising Technologies">
            <p>
              We use cookies and similar technologies (pixels, tags, and local
              storage) to keep the site working, understand how it is used, and
              measure our advertising.
            </p>
            <List
              items={[
                <>
                  <strong>Essential.</strong> Required for the site to load and
                  display correctly, including caching and security protections
                  provided by our hosting platform.
                </>,
                <>
                  <strong>Analytics.</strong> Aggregated measurement of page
                  views and site performance, used to improve the site. This
                  is limited to first-party measurement provided by our
                  hosting platform.
                </>,
                <>
                  <strong>Advertising — the Meta Pixel.</strong> We use the
                  Meta Pixel, a piece of code provided by Meta Platforms, Inc.
                  It records that a browser visited our site and which actions
                  were taken (for example, clicking through to book an
                  appointment), and it may set or read Meta cookies. Meta uses
                  this to measure our ad results, to show our ads to people who
                  have visited prax.studio, and to build audiences of people
                  with similar characteristics. Information collected by the
                  pixel is processed by Meta in accordance with{' '}
                  <a
                    href="https://www.facebook.com/privacy/policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Meta&rsquo;s Privacy Policy
                  </a>
                  .
                </>,
              ]}
            />
            <p>
              Because the Meta Pixel is operated by a third party, Meta may
              collect information about your online activity over time and
              across other websites and apps, not just prax.studio. We do not
              control that collection; the opt-outs in Section 6 are the way to
              limit it.
            </p>
            <p>
              Most browsers let you block or delete cookies through their
              settings. Section 6 explains how to opt out of interest-based
              advertising specifically.
            </p>
          </Section>

          <Section number="04" title="How We Use Information">
            <List
              items={[
                'To respond to your inquiries and schedule appointments or classes.',
                'To operate, secure, maintain, and improve the website.',
                'To measure and improve our marketing — understanding which ads and pages lead to bookings and enrollments.',
                'To show relevant advertising to you and to people with similar interests on Meta platforms.',
                'To comply with law and to enforce our terms, protect our rights, or prevent fraud and abuse.',
              ]}
            />
            <p>
              We do not use automated decision-making that produces legal or
              similarly significant effects, and we do not sell your personal
              information for money.
            </p>
          </Section>

          <Section number="05" title="How We Share Information">
            <p>
              We share information only with service providers who help us run
              the business, and only for the purposes described above. We do not
              sell your personal information. Our key providers are:
            </p>
            <List
              items={[
                <>
                  <strong>Squire</strong> — appointment booking and payment.
                  When you click a booking link you leave prax.studio and
                  continue on Squire&rsquo;s platform under its privacy policy.
                </>,
                <>
                  <strong>Meta Platforms, Inc.</strong> — advertising,
                  measurement, and audience building, as described in Section 3.
                </>,
                <>
                  <strong>Vercel Inc.</strong> — website hosting, content
                  delivery, and infrastructure logging.
                </>,
                <>
                  <strong>PRAX Academy and Skool</strong> — education programs
                  and community, hosted on separate platforms with their own
                  policies.
                </>,
                <>
                  <strong>Email and messaging providers</strong> — to receive
                  and reply to your messages.
                </>,
              ]}
            />
            <p>
              We may also disclose information if required by law, subpoena, or
              other legal process, or in connection with a merger, acquisition,
              or sale of assets — in which case we will require the recipient
              to honor this policy.
            </p>
          </Section>

          <Section number="06" title="Your Choices and Opt-Outs">
            <List
              items={[
                <>
                  <strong>Advertising cookies.</strong> You can adjust your ad
                  preferences directly with Meta in your{' '}
                  <a
                    href="https://www.facebook.com/adpreferences/ad_settings"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook ad settings
                  </a>{' '}
                  or Instagram ad settings, and you can opt out of
                  interest-based advertising across many companies at{' '}
                  <a
                    href="https://optout.aboutads.info/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    optout.aboutads.info
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://optout.networkadvertising.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    optout.networkadvertising.org
                  </a>
                  .
                </>,
                <>
                  <strong>Browser controls.</strong> You can block or clear
                  cookies in your browser settings, or browse in private mode.
                  We honor the Global Privacy Control (GPC) signal where it
                  applies to us.
                </>,
                <>
                  <strong>Do Not Track.</strong> Some browsers send a
                  &ldquo;Do Not Track&rdquo; (DNT) signal. There is no common
                  industry standard for interpreting it, and we do not
                  currently respond to DNT signals. We do honor the Global
                  Privacy Control signal as described above.
                </>,
                <>
                  <strong>Marketing messages.</strong> If we email or text you,
                  every message includes a way to unsubscribe. You can also
                  email us at any time to be removed.
                </>,
              ]}
            />
          </Section>

          <Section number="07" title="California Privacy Rights">
            <p>
              In the past twelve months, we have collected the following
              categories of personal information. Each entry lists where it
              comes from; Section 4 explains why we use it and Section 5 lists
              who receives it.
            </p>
            <List
              items={[
                <>
                  <strong>Identifiers</strong> — name, email address, phone
                  number, and IP address. Collected from you directly, or from
                  a lead form you submit on a Meta platform.
                </>,
                <>
                  <strong>Internet and device activity</strong> — pages viewed,
                  referring page, clicks, browser and device type. Collected
                  automatically through server logs and the technologies in
                  Section 3.
                </>,
                <>
                  <strong>Approximate location</strong> — the general region
                  derived from your IP address. We do not collect precise
                  geolocation.
                </>,
                <>
                  <strong>Commercial information</strong> — the services or
                  programs you ask about. Collected from you directly.
                </>,
                <>
                  <strong>Inferences</strong> — advertising audience segments
                  built by Meta from the activity described in Section 3.
                </>,
              ]}
            />
            <p>
              We do not collect sensitive personal information as California
              law defines it, we do not use or disclose personal information
              for purposes beyond those described in this policy, and we do not
              knowingly sell or share the personal information of anyone under
              16.
            </p>
            <p>
              If you are a California resident, you may have the right to know
              what personal information we have collected about you, to request
              that we delete or correct it, to opt out of the
              &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal
              information for cross-context behavioral advertising, and not to
              be discriminated against for exercising these rights.
            </p>
            <p>
              We do not sell personal information for money. However, the use of
              advertising technologies such as the Meta Pixel may be considered
              &ldquo;sharing&rdquo; for cross-context behavioral advertising
              under California law. To opt out, use the controls in Section 6,
              enable Global Privacy Control in your browser, or email us with
              the subject line <strong>&ldquo;Do Not Sell or Share My
              Personal Information.&rdquo;</strong>
            </p>
            <p>
              To exercise any of these rights, email us at{' '}
              <a href={mailto}>{CONTACT_EMAIL}</a>. We will verify your request
              by asking for information that matches what we already hold, and
              we will respond within 45 days, extending once by a further 45
              days if we need more time and tell you why. You may
              designate an authorized agent to make a request on your behalf.
            </p>
          </Section>

          <Section number="08" title="Data Retention and Security">
            <p>
              We keep personal information only as long as we need it for the
              purposes described in this policy, or as long as required by law
              — for example, we keep inquiry emails while the conversation is
              active and for a reasonable period afterward, and advertising
              measurement data is retained according to the platform&rsquo;s
              own retention schedule.
            </p>
            <p>
              PRAX is a Los Angeles-area business and this site is directed to
              people in the United States. Information we collect is stored and
              processed in the United States. If you visit from outside the
              United States, you are choosing to send your information here.
            </p>
            <p>
              We use reasonable administrative and technical safeguards,
              including encryption in transit (HTTPS) across the entire site.
              No method of transmission or storage is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </Section>

          <Section number="09" title="Children's Privacy">
            <p>
              We welcome clients of all ages in the studio, but this website is
              not directed to children under 13, and we do not knowingly collect
              personal information online from children under 13. If you believe
              a child has provided us with personal information, email us and we
              will delete it. Minors should have a parent or guardian book
              appointments on their behalf.
            </p>
          </Section>

          <Section number="10" title="Third-Party Links">
            <p>
              This site links to services we do not control — including our
              booking provider, PRAX Academy, Skool, Instagram, and TikTok. We
              are not responsible for their content or privacy practices, and we
              encourage you to read the privacy policy of any site you visit.
            </p>
          </Section>

          <Section number="11" title="Changes to This Policy">
            <p>
              We may update this policy as our business or the law changes. When
              we do, we will revise the effective date at the top of this page.
              Material changes will be highlighted on this page. Continued use
              of the site after an update means you accept the revised policy.
            </p>
          </Section>

          <Section number="12" title="Contact Us">
            <p>
              Questions about this policy, or want to exercise a privacy right?
              Reach us at:
            </p>
            <div className="pt-2 space-y-1">
              <p className="text-prax-bone">
                {LEGAL_ENTITY} (doing business as {TRADE_NAME})
              </p>
              <p>
                Attn: Privacy
                <br />
                {BUSINESS_INFO.address}
                <br />
                {BUSINESS_INFO.city}
              </p>
              <p>
                <a href={mailto}>{CONTACT_EMAIL}</a>
              </p>
              <p>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @praxhair on Instagram
                </a>
              </p>
            </div>
          </Section>
        </div>

        <div className="mt-16 md:mt-20 pt-8 border-t border-prax-graphite/60">
          <Link
            href="/"
            className="inline-block border border-prax-graphite px-8 py-3 text-body-sm tracking-wide hover:bg-prax-charcoal transition-colors duration-300"
          >
            Back to Home
          </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
