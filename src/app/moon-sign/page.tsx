import type { Metadata } from 'next';
import { MoonSignSection } from '@/components/landing/MoonSignSection';
import { SITE_URL } from '@/lib/links';

const PAGE_URL = `${SITE_URL}/moon-sign`;
const TITLE = 'Free Moon Sign Calculator (Rashi)';
const DESCRIPTION =
  'Calculate your real Vedic Moon sign (Chandra Rashi) free, using the sidereal zodiac and your birth date, time and place.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/moon-sign' },
};

// Plain-text mirror of the two Q&As rendered below, for the FAQPage schema
// (schema.org Answer.text wants plain text, not the <em>-laden JSX).
const faqs = [
  {
    question: 'What is a Vedic Moon sign?',
    answer:
      "In Vedic (Jyotish) astrology, your Moon sign, called your Chandra Rashi, is the zodiac sign the Moon occupied at the exact moment and place you were born. Western astrology leans on the Sun sign. Vedic astrology treats the Moon as the more personal placement: it governs the mind, emotions and instinctive reactions, and many traditional predictions, including your Vimshottari Dasha timeline and monthly horoscope, are calculated from it.",
  },
  {
    question: 'Why is it different from my Western sun sign?',
    answer:
      "The two systems use different zodiacs. Western astrology uses the tropical zodiac, which is fixed to the seasons. Vedic astrology uses the sidereal zodiac, which is fixed to the observable positions of the constellations. The two were aligned roughly two thousand years ago, but the Earth's slow wobble on its axis has since moved them apart by about 24 degrees. That gap is the ayanamsha, and it is why a planet's tropical and sidereal positions can fall in different signs today.",
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Moon Sign Calculator', item: PAGE_URL },
      ],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${PAGE_URL}#app`,
      name: 'Vedic Moon Sign (Chandra Rashi) Calculator',
      url: PAGE_URL,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web',
      publisher: { '@id': `${SITE_URL}/#organization` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  ],
};

export default function MoonSignPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MoonSignSection headingLevel="h1" />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="space-y-5 text-ink-2">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            What is a Vedic Moon sign?
          </h2>
          <p>
            In Vedic (Jyotish) astrology, your Moon sign, called your <em>Chandra Rashi</em>, is
            the zodiac sign the Moon occupied at the exact moment and place you were born.
            Western astrology leans on the Sun sign. Vedic astrology treats the Moon as the more
            personal placement: it governs the mind, emotions and instinctive reactions, and many
            traditional predictions, including your Vimshottari Dasha timeline and monthly
            horoscope, are calculated from it.
          </p>
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Why is it different from my Western sun sign?
          </h2>
          <p>
            Western astrology uses the <em>tropical</em> zodiac, which is fixed to the seasons
            (0° Aries is always the spring equinox). Vedic astrology uses the <em>sidereal</em>{' '}
            zodiac, which is fixed to the observable positions of the constellations. The two
            were aligned roughly two thousand years ago, but the Earth&apos;s slow wobble on its
            axis, a 26,000-year cycle called precession, has since moved them apart by about 24
            degrees. That gap, known as the <em>ayanamsha</em>, is why a planet&apos;s tropical
            position and its sidereal position can fall in different signs today. It is also why
            a Vedic Moon sign calculation needs a precise ephemeris and not a simple date lookup.
          </p>
          <p>
            The Moon moves roughly 13 degrees across the zodiac every day, so getting the sign,
            and the more precise nakshatra (lunar mansion) and pada (quarter), right depends on
            knowing your birth time and place accurately, down to the correct UTC offset for that
            historical date. This calculator handles that for you. Enter your details above and
            it computes your real Chandra Rashi from the same Swiss Ephemeris data that powers a
            full birth chart.
          </p>
        </div>
      </section>
    </div>
  );
}
