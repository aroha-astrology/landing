import { PLAY_STORE_URL, SITE_URL } from './links';

/**
 * The Aroha ecosystem, declared once. Every place that states what Aroha is
 * or whether a product is available — the homepage, product pages, nav,
 * footer, the JSON-LD graph and /llms.txt — reads from here, so a status
 * change (Vastu or Puja launching) is a one-line edit that can't leave one
 * surface still saying "coming soon" while another says "available".
 */

export const BRAND = {
  name: 'Aroha',
  tagline: 'Ancient wisdom. Modern guidance.',
  promise: 'Your life. Your space. Your journey.',
  description:
    'Aroha is an Indian spiritual-technology ecosystem: Aroha Astrology for Vedic astrology (available now), Aroha Vastu for understanding living spaces (coming soon) and Aroha Puja for booking pujas at home (coming soon).',
  email: 'subir@arohaastrology.in',
  founder: 'Subir Dutta',
  city: 'Bengaluru',
} as const;

export type ProductKey = 'astrology' | 'vastu' | 'puja';
export type ProductStatus = 'available' | 'coming-soon';

export type Product = {
  key: ProductKey;
  name: string;
  /** Short noun used in nav and chips: "Astrology". */
  short: string;
  status: ProductStatus;
  path: `/${ProductKey}`;
  /** The one idea in the Life → Space → Journey arc this product owns. */
  theme: 'Life' | 'Space' | 'Journey';
  realm: 'Cosmos' | 'Space' | 'Ritual';
  /** One sentence, plain and factual — reused in meta, schema and llms.txt. */
  summary: string;
  /** What it lets someone do, stated only as far as it's true today. */
  capabilities: string[];
};

export const PRODUCTS: Record<ProductKey, Product> = {
  astrology: {
    key: 'astrology',
    name: 'Aroha Astrology',
    short: 'Astrology',
    status: 'available',
    path: '/astrology',
    theme: 'Life',
    realm: 'Cosmos',
    summary:
      'Aroha Astrology is a Vedic astrology app and website: a free Janam Kundli computed with Swiss Ephemeris precision, daily Panchang and horoscope, Vimshottari Dasha, yogas and doshas, Kundli matching, personalised reports and a Vedic Astrologer chat grounded in your own chart, in 7 Indian languages.',
    capabilities: [
      'Janam Kundli with Lagna, Rashi, Nakshatra and all nine grahas',
      'Divisional charts D1 to D60, Ashtakavarga and Shadbala',
      'Vimshottari Dasha: Mahadasha, Antardasha and Pratyantardasha',
      '54 yogas and 7 doshas detected automatically',
      'Kundli matching: 36-point Guna Milan and Manglik check',
      'Daily Panchang and daily, weekly, monthly and yearly horoscope',
      'Vedic Astrologer chat that answers from your computed chart',
      '14 personalised reports, gemstones, Lal Kitab remedies, numerology and palm reading',
      'Shlokas library and the Bhagavad Gita',
    ],
  },
  vastu: {
    key: 'vastu',
    name: 'Aroha Vastu',
    short: 'Vastu',
    status: 'coming-soon',
    path: '/vastu',
    theme: 'Space',
    realm: 'Space',
    summary:
      'Aroha Vastu is an upcoming product for understanding the harmony of your home through Vastu Shastra: floor-plan analysis, direction and room-by-room guidance and 3D visualisation of your space. An early Vastu planner is already available inside the Aroha Astrology app.',
    capabilities: [
      'Floor-plan analysis against the eight directions and the centre',
      'Room-by-room guidance for entrance, kitchen, bedrooms and pooja room',
      '3D visualisation of your home',
      'Saved homes with version history, to compare layouts before you change anything',
    ],
  },
  puja: {
    key: 'puja',
    name: 'Aroha Puja',
    short: 'Puja',
    status: 'coming-soon',
    path: '/puja',
    theme: 'Journey',
    realm: 'Ritual',
    summary:
      'Aroha Puja is an upcoming premium service for booking a pandit to perform any puja at your home, with the choice of the pandit bringing all the samagri or your family arranging the items yourselves, priced accordingly.',
    capabilities: [
      'Book a pandit for a puja at your home',
      'Every kind of puja, from Griha Pravesh to milestone ceremonies',
      'Choose samagri included, or arrange the items yourself',
      'Clear pricing that reflects the choice you make',
    ],
  },
};

export const PRODUCT_ORDER: ProductKey[] = ['astrology', 'vastu', 'puja'];

export function statusLabel(status: ProductStatus): string {
  return status === 'available' ? 'Available now' : 'Coming soon';
}

// ---------------------------------------------------------------------------
// Structured data. Organization + WebSite + product Brand entities are
// emitted once from the root layout; pages link to them by @id.
// ---------------------------------------------------------------------------

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const productBrandId = (key: ProductKey) => `${SITE_URL}/${key}#brand`;
export const ASTROLOGY_APP_ID = `${SITE_URL}/#app`;

const AVAILABLE_LANGUAGES = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'es', 'fr', 'de'];

export function brandGraph() {
  return [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: BRAND.name,
      alternateName: ['Aroha Astrology', 'arohaastrology.in'],
      url: SITE_URL,
      slogan: BRAND.tagline,
      description: BRAND.description,
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: `${SITE_URL}/brand/aroha-logo-navy.png`,
      },
      image: { '@id': `${SITE_URL}/#logo` },
      founder: { '@type': 'Person', name: BRAND.founder, jobTitle: 'Founder & Developer' },
      brand: PRODUCT_ORDER.map((k) => ({ '@id': productBrandId(k) })),
      sameAs: [PLAY_STORE_URL],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: BRAND.email,
        url: `${SITE_URL}/support`,
        areaServed: 'IN',
        availableLanguage: AVAILABLE_LANGUAGES,
      },
      foundingLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: BRAND.city,
          addressRegion: 'Karnataka',
          addressCountry: 'IN',
        },
      },
    },
    ...PRODUCT_ORDER.map((k) => {
      const p = PRODUCTS[k];
      return {
        '@type': 'Brand',
        '@id': productBrandId(k),
        name: p.name,
        url: `${SITE_URL}${p.path}`,
        description: `${p.summary} Status: ${statusLabel(p.status).toLowerCase()}.`,
        parentOrganization: { '@id': ORG_ID },
      };
    }),
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: BRAND.name,
      alternateName: 'Aroha Astrology',
      description: BRAND.description,
      publisher: { '@id': ORG_ID },
      inLanguage: 'en',
    },
  ];
}

/** The Android app entity. Emitted on the homepage and /astrology. */
export function astrologyAppNode() {
  return {
    '@type': 'MobileApplication',
    '@id': ASTROLOGY_APP_ID,
    name: PRODUCTS.astrology.name,
    url: `${SITE_URL}/astrology`,
    downloadUrl: PLAY_STORE_URL,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Android',
    brand: { '@id': productBrandId('astrology') },
    publisher: { '@id': ORG_ID },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', url: PLAY_STORE_URL },
    // Real Play Store numbers as of 2026-08-31 — update by hand when they
    // drift meaningfully; a stale rating here is worse than none.
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '19',
      reviewCount: '19',
      bestRating: '5',
    },
    featureList: PRODUCTS.astrology.capabilities,
    inLanguage: AVAILABLE_LANGUAGES,
  };
}

export function breadcrumbNode(pageUrl: string, trail: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [{ name: 'Home', url: SITE_URL }, ...trail].map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}
