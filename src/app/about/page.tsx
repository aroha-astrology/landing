import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { LINKS, SITE_URL } from '@/lib/links';

const PAGE_URL = `${SITE_URL}/about`;
const CONTACT_EMAIL = 'subir@arohaastrology.in';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who builds Aroha Astrology, how its readings are generated (Swiss Ephemeris computation plus AI-explained classical Vedic texts), and our approach to accuracy.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: 'About Aroha Astrology',
    about: { '@id': `${SITE_URL}/#organization` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };

  return (
    <Section tone="paper">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.1em] text-ink-muted">About</p>
          <h1 className="font-display mt-3 text-3xl font-medium leading-[1.15] text-ink sm:text-4xl md:text-5xl">
            About Aroha Astrology
          </h1>
          <p className="mt-4 text-lg text-ink-2">
            What we build, how a reading actually gets generated, and where to go if something
            looks wrong.
          </p>
        </header>

        <div className="space-y-9">
          <section>
            <h2 className="font-display text-xl font-medium text-ink">What we build</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Aroha Astrology is a Vedic (Jyotish) astrology app and website: a free Kundli
              (birth chart) generator, daily Panchang, Moon sign and Nakshatra tools, and an AI
              astrologer that explains what a chart means in plain language, in 13 languages.
              We built it because most Kundli tools online either stop at a raw chart with no
              explanation, or explain in astrology jargon that assumes you already know the
              subject.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">
              How our readings are generated
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Every chart — planet positions, houses, Dasha timeline, divisional charts — is
              computed from Swiss Ephemeris astronomical data, the same standard used across
              professional astrology software, not a simplified or templated approximation.
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">
              The written explanation of what that chart means is AI-generated, grounded in
              classical Vedic astrology texts and principles — it is not written by a human
              astrologer reviewing each chart individually. We think that's worth stating
              plainly rather than leaving ambiguous. Our{' '}
              <Link href={LINKS.disclaimer} className="text-accent hover:underline">
                full disclaimer
              </Link>{' '}
              covers this in legal detail; this page is the short version.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">
              Our approach to accuracy
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Vedic astrology is not one settled method — different classical traditions
              (Parashari, Jaimini, KP) sometimes disagree on how to read the same placement. In
              our{' '}
              <Link href="/blog" className="text-accent hover:underline">
                written guides
              </Link>
              , we try to say so explicitly rather than presenting one tradition's rule as
              universal, and we avoid presenting any reading as a deterministic prediction. A
              chart placement is a traditional indicator to weigh, not a verdict.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">Founder</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Aroha Astrology is built by Subir Dutta, based in Bengaluru, India.
            </p>
          </section>
        </div>

        <section className="mt-14 border-t border-ink/10 pt-8">
          <h2 className="font-display text-xl font-medium text-ink">Questions or corrections</h2>
          <p className="mt-3 leading-relaxed text-ink-2">
            If a reading looks wrong, or you have a question about how something was calculated,
            write to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>{' '}
            or visit our{' '}
            <Link href={LINKS.support} className="text-accent hover:underline">
              support page
            </Link>
            .
          </p>
        </section>

        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6 text-sm">
          <Link href="/blog" className="text-accent hover:underline">
            Blog
          </Link>
          <Link href={LINKS.support} className="text-accent hover:underline">
            Support
          </Link>
          <Link href={LINKS.disclaimer} className="text-accent hover:underline">
            Disclaimer
          </Link>
          <Link href={LINKS.privacy} className="text-accent hover:underline">
            Privacy Policy
          </Link>
          <Link href={LINKS.terms} className="text-accent hover:underline">
            Terms of Service
          </Link>
        </nav>
      </article>
    </Section>
  );
}
