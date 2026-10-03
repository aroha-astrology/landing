import { LandingPage } from '@/components/landing/LandingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { ORG_ID, WEBSITE_ID, astrologyAppNode, breadcrumbNode, productBrandId } from '@/lib/brand';
import { SITE_URL } from '@/lib/links';

// ISR: the Panchang section is live data, refreshed hourly.
export const revalidate = 3600;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'Aroha: Vedic Astrology, Vastu and Puja',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORG_ID },
      mentions: ['astrology', 'vastu', 'puja'].map((k) => ({ '@id': productBrandId(k as 'astrology') })),
      breadcrumb: { '@id': `${SITE_URL}/#breadcrumb` },
      inLanguage: 'en',
    },
    breadcrumbNode(`${SITE_URL}/`, []),
    astrologyAppNode(),
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <LandingPage />
    </>
  );
}
