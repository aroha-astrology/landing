import { LandingPage } from '@/components/landing/LandingPage';
import { SITE_URL, PLAY_STORE_URL } from '@/lib/links';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'Aroha Astrology — Vedic Birth Chart, Moon Sign & Daily Panchang',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      breadcrumb: { '@id': `${SITE_URL}/#breadcrumb` },
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/#breadcrumb`,
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#app`,
      name: 'Aroha Astrology',
      url: SITE_URL,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Android',
      publisher: { '@id': `${SITE_URL}/#organization` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', url: PLAY_STORE_URL },
      // Real Play Store numbers as of 2026-08-31 — update by hand when they
      // drift meaningfully; a stale rating here is worse than none.
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        ratingCount: '19',
        reviewCount: '19',
        bestRating: '5',
      },
      featureList: [
        'Janma Kundli (Vedic birth chart)',
        'Divisional charts D1–D60',
        'Vimshottari Dasha timeline',
        '54 yogas and 7 doshas',
        'Guna Milan compatibility matching',
        'Daily Panchang',
        'Daily, weekly, monthly and yearly horoscope',
        'Gemstone recommendations',
        'Lal Kitab remedies',
        'Numerology',
        'Palm reading',
        'Vastu Studio: floor plan Vastu check with live room ratings, fixes and 3D view',
        'Marriage, Kundli Milan, Wealth and 10 other personalized reports',
        'Vedic Astrologer chat',
      ],
      inLanguage: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'es', 'fr', 'de'],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
