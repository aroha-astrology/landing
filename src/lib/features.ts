import type { ProductKey } from './brand';

/**
 * Real, shipped (or explicitly "coming soon") Aroha features an article can
 * point to. Articles reference these by key in frontmatter `features`, so
 * the "Related Aroha feature" box is always a true statement about the
 * product and a renamed page is a one-line fix here.
 *
 * `href: 'app'` means the feature lives in the mobile app — the template
 * renders the app picker (Android now, iOS coming soon) instead of a link.
 */
export type FeatureLink = {
  key: string;
  product: ProductKey;
  label: string;
  description: string;
  href: string | 'app';
  cta: string;
};

export const FEATURE_LINKS: Record<string, FeatureLink> = {
  kundli: {
    key: 'kundli',
    product: 'astrology',
    label: 'Free Kundli generator',
    description: 'Your Lagna, house placements and all nine grahas, computed with Swiss Ephemeris precision.',
    href: '/kundli',
    cta: 'Generate your Kundli',
  },
  'moon-sign': {
    key: 'moon-sign',
    product: 'astrology',
    label: 'Moon sign calculator',
    description: 'Find your Vedic Moon sign (Chandra Rashi) and Nakshatra from your birth details.',
    href: '/moon-sign',
    cta: 'Find your Moon sign',
  },
  panchang: {
    key: 'panchang',
    product: 'astrology',
    label: 'Daily Panchang',
    description: 'Today’s Tithi, Nakshatra, Yoga, Karana, sunrise, sunset and Rahu Kaal.',
    href: '/panchang',
    cta: 'See today’s Panchang',
  },
  dasha: {
    key: 'dasha',
    product: 'astrology',
    label: 'Your Dasha timeline',
    description: 'Mahadasha, Antardasha and Pratyantardasha periods from your own Moon Nakshatra, in the app.',
    href: 'app',
    cta: 'See your Dasha timeline',
  },
  yogas: {
    key: 'yogas',
    product: 'astrology',
    label: 'Yogas and doshas in your chart',
    description: '54 yogas and 7 doshas detected automatically, each explained against your own placements.',
    href: 'app',
    cta: 'Check your yogas',
  },
  matching: {
    key: 'matching',
    product: 'astrology',
    label: 'Kundli matching',
    description: 'The 36-point Guna Milan and a Manglik check for both charts, free in the app.',
    href: 'app',
    cta: 'Match two Kundlis',
  },
  chat: {
    key: 'chat',
    product: 'astrology',
    label: 'Vedic Astrologer chat',
    description: 'Ask follow-up questions and get answers grounded in your computed chart, in 7 Indian languages.',
    href: 'app',
    cta: 'Ask about your chart',
  },
  horoscope: {
    key: 'horoscope',
    product: 'astrology',
    label: 'Daily Rashifal',
    description: 'Daily, weekly, monthly and yearly horoscope read from your Moon sign and current transits.',
    href: 'app',
    cta: 'Read your Rashifal',
  },
  reports: {
    key: 'reports',
    product: 'astrology',
    label: 'Personalised reports',
    description: 'Marriage, Kundli Milan, wealth, career and 10 more reports built from your own chart.',
    href: '/astrology#reports',
    cta: 'Browse the reports',
  },
  remedies: {
    key: 'remedies',
    product: 'astrology',
    label: 'Remedies for your chart',
    description: 'Gemstone suggestions and Lal Kitab remedies based on your own planetary placements.',
    href: 'app',
    cta: 'See your remedies',
  },
  shlokas: {
    key: 'shlokas',
    product: 'astrology',
    label: 'Shlokas and Bhagavad Gita library',
    description: 'A chanting library of shlokas with audio, and all 701 verses of the Gita, inside the app.',
    href: 'app',
    cta: 'Open the library',
  },
  'vastu-studio': {
    key: 'vastu-studio',
    product: 'vastu',
    label: 'Aroha Vastu, available now',
    description: 'Draw your floor plan and see every room checked against the eight directions and the centre, with a Vastu score.',
    href: 'app',
    cta: 'Try Aroha Vastu',
  },
  'aroha-vastu': {
    key: 'aroha-vastu',
    product: 'vastu',
    label: 'Aroha Vastu in 3D, coming soon',
    description: 'Your home in 3D, with a walk-through view and furniture placement scored against Vastu.',
    href: '/vastu',
    cta: 'Discover Aroha Vastu',
  },
  'aroha-puja': {
    key: 'aroha-puja',
    product: 'puja',
    label: 'Aroha Puja, coming soon',
    description: 'Book a pandit for any puja at home, with samagri included or arranged by you.',
    href: '/puja',
    cta: 'Discover Aroha Puja',
  },
};

/** Defaults when an article doesn't list its own features. */
const CATEGORY_DEFAULT_FEATURES: Record<ProductKey, string[]> = {
  astrology: ['kundli', 'chat'],
  vastu: ['aroha-vastu', 'vastu-studio'],
  puja: ['aroha-puja'],
};

export function featuresFor(category: ProductKey, keys?: string[]): FeatureLink[] {
  const list = keys?.length ? keys : CATEGORY_DEFAULT_FEATURES[category];
  return list.map((k) => FEATURE_LINKS[k]).filter(Boolean).slice(0, 2);
}
