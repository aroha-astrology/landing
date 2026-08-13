import { LandingPage } from '@/components/landing/LandingPage';
import { SITE_URL, PLAY_STORE_URL } from '@/lib/links';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'Aroha Astrology — Vedic Birth Chart, Moon Sign & AI Astrologer',
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
      featureList: [
        'Janma Kundli (Vedic birth chart)',
        'Vimshottari Dasha timeline',
        'AI chat astrologer',
        'Divisional charts D1–D60',
        'Gemstone recommendations',
        'Vastu planner',
        'Daily, weekly, monthly and yearly horoscope',
        'Compatibility matching',
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
