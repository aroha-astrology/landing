import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ProductHero } from '@/components/product/ProductHero';
import { CelestialSvg } from '@/components/three/CelestialSvg';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { AppCTA } from '@/components/ui/AppCTA';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { NavagrahaSection } from '@/components/landing/NavagrahaSection';
import { ReportsSection } from '@/components/landing/ReportsSection';
import { PrecisionSection } from '@/components/landing/PrecisionSection';
import { LanguagesSection } from '@/components/landing/LanguagesSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { AskSection } from '@/components/home/AskSection';
import { ArticleCard, toSummary } from '@/components/blog/ArticleCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getFeaturedPosts, getPostsByCategory } from '@/lib/blog';
import {
  PRODUCTS,
  WEBSITE_ID,
  astrologyAppNode,
  astrologyWebAppNode,
  breadcrumbNode,
  productBrandId,
} from '@/lib/brand';
import { SITE_URL } from '@/lib/links';
import Link from 'next/link';

const PAGE_URL = `${SITE_URL}/astrology`;
const TITLE = 'Aroha Astrology: Free Kundli, Dasha & Vedic Astrology App';
const DESCRIPTION =
  'Free Janam Kundli with Swiss Ephemeris precision, Vimshottari Dasha, yogas, Kundli matching, daily Panchang and chart-grounded answers. Available now.';

export const metadata: Metadata = pageMetadata({ absoluteTitle: true, title: TITLE, description: DESCRIPTION, path: '/astrology' });

const TOOLS = [
  { href: '/kundli', title: 'Free Kundli', text: 'Lagna, houses and all nine planets from your birth details.' },
  { href: '/moon-sign', title: 'Moon sign calculator', text: 'Your Chandra Rashi and Nakshatra in seconds.' },
  { href: '/panchang', title: 'Today’s Panchang', text: 'Tithi, Nakshatra, Yoga, Karana and Rahu Kaal, live.' },
];

const FAQS = [
  {
    question: 'What is Aroha Astrology?',
    answer: PRODUCTS.astrology.summary,
  },
  {
    question: 'Which ayanamsa and house system does Aroha use?',
    answer:
      'Charts use the Lahiri (Chitrapaksha) ayanamsa, India’s official standard for the sidereal zodiac, computed with the Swiss Ephemeris. The free web Kundli uses whole-sign houses.',
  },
  {
    question: 'Is Aroha Astrology free?',
    answer:
      'Your Kundli, daily Panchang, horoscope, Moon sign, Guna Milan and the shlokas and Gita libraries are free. Deeper reports and chat use a simple credit system, always shown before you spend anything, and every report has a free preview.',
  },
  {
    question: 'Is it available on iPhone?',
    answer: 'Aroha Astrology is available on Android through Google Play and on the web at app.arohaastrology.in. The iOS app is coming soon.',
  },
  {
    question: 'Does Aroha predict the future?',
    answer:
      'No. Vedic astrology is a traditional system of interpretation. Aroha computes your chart accurately and explains what classical texts say about it, as a tool for reflection, not as a prediction or a substitute for professional advice.',
  },
];

export default function AstrologyPage() {
  const guides = getFeaturedPosts('astrology', 4);
  const count = getPostsByCategory('astrology').length;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': productBrandId('astrology') },
        mainEntity: { '@id': `${SITE_URL}/#app` },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      },
      breadcrumbNode(PAGE_URL, [{ name: 'Aroha Astrology', url: PAGE_URL }]),
      astrologyAppNode(),
      astrologyWebAppNode(),
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductHero
        product={PRODUCTS.astrology}
        title={
          <>
            Understand yourself through <em className="font-normal text-astro-gold">Vedic astrology</em>
          </>
        }
        lead="Your Janam Kundli, computed with Swiss Ephemeris precision, then explained in plain language: your Lagna, Rashi and Nakshatra, the Dasha you’re in, the yogas in your chart and what today’s sky means for you."
        visual={<CelestialSvg className="pointer-events-none absolute right-[-20%] top-1/2 -z-10 h-[130%] w-auto -translate-y-1/2 opacity-40 md:right-[-6%] md:opacity-70" />}
      >
        <TrackedLink
          href="/kundli"
          cta="astrology_page_kundli"
          location="astrology_hero"
          product="astrology"
          className="inline-flex items-center gap-2 rounded-full bg-astro-gold px-7 py-3.5 text-[15px] font-semibold text-astro-night transition-colors hover:bg-[#E6BD68]"
        >
          Generate your free Kundli <span aria-hidden>→</span>
        </TrackedLink>
        <AppCTA variant="outline" location="astrology_hero" className="!border-astro-rule !text-astro-ink hover:!border-astro-gold hover:!text-astro-gold">
          Get the app
        </AppCTA>
      </ProductHero>

      <section aria-labelledby="tools-title" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(56px,7vw,96px)]">
        <div className="mx-auto max-w-[1180px]">
          <h2 id="tools-title" className="font-display text-3xl font-medium sm:text-4xl">
            Free on the web
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {TOOLS.map((t, i) => (
              <li key={t.href} className="reveal" style={{ ['--reveal-i' as string]: i }}>
                <Link href={t.href} className="group flex h-full flex-col rounded-3xl border border-rule bg-paper-raised p-7 transition-colors hover:border-accent">
                  <h3 className="font-display text-2xl text-ink">{t.title}</h3>
                  <p className="mt-2 flex-1 text-[15px] text-ink-2">{t.text}</p>
                  <span className="mt-5 text-sm font-semibold text-link">
                    Open <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <AskSection />
      <NavagrahaSection />
      <ReportsSection />
      <div id="method">
        <PrecisionSection />
      </div>
      <LanguagesSection />

      <section aria-labelledby="guides-title" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(56px,7vw,96px)]">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="guides-title" className="font-display text-3xl font-medium sm:text-4xl">
              Learn the concepts behind your chart
            </h2>
            <Link href="/blog/astrology" className="text-sm font-semibold text-link underline underline-offset-4">
              All {count} astrology articles →
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((p) => (
              <li key={p.slug}>
                <ArticleCard article={toSummary(p)} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQSection id="astrology-faq" eyebrow="Questions" title="About Aroha Astrology" items={FAQS} />
    </>
  );
}
