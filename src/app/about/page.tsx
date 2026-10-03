import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { ProsePage } from '@/components/content/ProsePage';
import { StatusBadge } from '@/components/product/StatusBadge';
import { JsonLd } from '@/components/seo/JsonLd';
import { BRAND, ORG_ID, PRODUCTS, PRODUCT_ORDER, WEBSITE_ID, breadcrumbNode } from '@/lib/brand';
import { LINKS, SITE_URL } from '@/lib/links';

const PAGE_URL = `${SITE_URL}/about`;

export const metadata: Metadata = pageMetadata({
  title: 'About Aroha',
  description:
    'What Aroha is and why it exists: Aroha Astrology and Aroha Vastu (available now), Aroha Puja (coming soon), and how we use AI.',
  path: '/about',
});

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'About Aroha',
        about: { '@id': ORG_ID },
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      },
      breadcrumbNode(PAGE_URL, [{ name: 'About', url: PAGE_URL }]),
    ],
  };

  return (
    <ProsePage
      crumb="About"
      eyebrow="About Aroha"
      title="Vedic astrology, Vastu and puja, explained plainly"
      lead="Aroha is built in India for Vedic astrology, Vastu and puja. It started with astrology, added Vastu for the home, and is adding puja for the moments that mark a life."
    >
      <JsonLd data={jsonLd} />

      <h2>What Aroha is</h2>
      <p>
        Aroha has three products: astrology for understanding yourself, Vastu for understanding your home, and puja for the rituals
        that mark your life.
      </p>
      <ul className="not-prose my-8 grid gap-4">
        {PRODUCT_ORDER.map((k) => (
          <li key={k} className="rounded-2xl border border-rule bg-paper-raised p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Link href={PRODUCTS[k].path} className="font-display text-2xl text-ink hover:text-accent-text">
                {PRODUCTS[k].name}
              </Link>
              <StatusBadge status={PRODUCTS[k].status} />
            </div>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{PRODUCTS[k].summary}</p>
          </li>
        ))}
      </ul>

      <h2>Why Aroha exists</h2>
      <p>
        Aroha began with astrology because most Kundli tools online either stop at a raw chart with no explanation, or explain it in jargon
        that assumes you already know the subject. We wanted a chart computed carefully and explained plainly, in the language you think
        in.
      </p>
      <p>
        The same gap exists for the home and for ritual. Vastu advice online is often contradictory, and arranging a puja at home
        can mean finding a pandit by word of mouth and guessing what to buy. Aroha Vastu
        covers the home today, and Aroha Puja is being built for ritual.
      </p>

      <h2>How Aroha Astrology generates a reading</h2>
      <p>
        Every chart (planet positions, houses, the Dasha timeline, divisional charts) is computed from Swiss Ephemeris astronomical data
        with the Lahiri ayanamsa, the standard used across professional astrology software.
      </p>
      <p>
        The written explanation of what that chart means is AI-generated, grounded in classical Vedic astrology texts and principles. A
        human astrologer does not review each chart individually. Our <Link href={LINKS.disclaimer}>full disclaimer</Link> covers this
        in legal detail.
      </p>

      <h2>How we think about AI</h2>
      <p>
        We use AI where it helps someone understand their own chart: turning computed positions and classical rules into plain language,
        and answering follow-up questions. We do not present readings as predictions or claim a certainty that astrology does not have.
        Articles in our <Link href="/blog">Knowledge Hub</Link> may be drafted with AI assistance, and none is
        published until a person has reviewed it against our <Link href="/editorial-standards">editorial standards</Link>.
      </p>

      <h2>Cultural context</h2>
      <p>
        Vedic astrology is a traditional system of interpretation. Vastu Shastra is a traditional Indian system of architecture and spatial
        design. Puja is a form of Hindu worship whose practice varies by region, community and family. None is one settled method, and
        classical traditions (Parashari, Jaimini and KP in astrology, for example) sometimes disagree. We say so when they do, describe
        beliefs as beliefs, and do not present them as scientific fact or use them to frighten anyone.
      </p>

      <h2>Who builds Aroha</h2>
      <p>
        Aroha is built by {BRAND.founder}, based in {BRAND.city}, India. Aroha Astrology is available on the web and on Android; the iOS app
        is coming soon.
      </p>

      <h2>Questions and corrections</h2>
      <p>
        If a reading or an article looks wrong, or you have a question about how something was calculated, write to{' '}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> or use our <Link href={LINKS.support}>support page</Link>.
      </p>
    </ProsePage>
  );
}
