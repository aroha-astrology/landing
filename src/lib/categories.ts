import type { ProductKey } from './brand';

/**
 * Knowledge Hub categories. One per product, so every article belongs to
 * exactly one product cluster and machines can map article → product
 * without guessing from tags.
 */
export type CategoryKey = ProductKey;

export type Category = {
  key: CategoryKey;
  name: string;
  /** H1 on the category hub. */
  title: string;
  /** Meta description + hub intro (first paragraph). */
  description: string;
  /** Second paragraph of the hub intro: the careful framing for the subject. */
  framing: string;
  /** Slug of the cluster's pillar article. */
  pillar: string;
  /** Short topic list for the hub's "Popular topics" row: label → slug. */
  topics: { label: string; slug: string }[];
};

export const CATEGORIES: Record<CategoryKey, Category> = {
  astrology: {
    key: 'astrology',
    name: 'Astrology',
    title: 'Vedic astrology, explained clearly',
    description:
      'Guides to Vedic astrology (Jyotish): the Kundli, Lagna, Rashi and Nakshatra, Vimshottari Dasha, yogas, doshas, transits and Kundli matching, written in plain language.',
    framing:
      'Vedic astrology is a traditional system of interpretation, not a science that predicts the future. These guides explain how its concepts work and where classical traditions disagree, so you can read your own chart with context instead of fear.',
    pillar: 'what-is-vedic-astrology',
    topics: [
      { label: 'Kundli', slug: 'what-is-kundli-birth-chart' },
      { label: 'Lagna', slug: 'what-is-lagna-ascendant' },
      { label: 'Nakshatras', slug: '27-nakshatras-list' },
      { label: 'Dasha', slug: 'vimshottari-dasha-guide' },
      { label: 'Yogas', slug: 'vedic-astrology-yoga-planetary-combinations' },
      { label: 'Transits', slug: 'planetary-transits-gochar-vedic-astrology' },
      { label: 'Kundli matching', slug: 'guna-milan-ashtakoota-compatibility' },
      { label: 'Panchang', slug: 'what-is-panchang' },
    ],
  },
  vastu: {
    key: 'vastu',
    name: 'Vastu',
    title: 'Vastu Shastra for real homes',
    description:
      'Practical guides to Vastu Shastra: directions, the main entrance, bedroom, kitchen, living room and pooja room, apartments and how to read a floor plan.',
    framing:
      'Vastu Shastra is a traditional Indian system of architecture and spatial design. Its guidelines are traditional beliefs rather than scientifically established rules, and practitioners interpret them differently, so these guides separate what the texts say from what is practical in a modern flat.',
    pillar: 'what-is-vastu-shastra',
    topics: [
      { label: 'Directions', slug: 'vastu-directions-explained' },
      { label: 'Main entrance', slug: 'main-entrance-vastu' },
      { label: 'Bedroom', slug: 'bedroom-vastu' },
      { label: 'Kitchen', slug: 'kitchen-vastu' },
      { label: 'Living room', slug: 'living-room-vastu' },
      { label: 'Pooja room', slug: 'pooja-room-vastu' },
      { label: 'Apartments', slug: 'vastu-for-flats-apartments' },
      { label: 'Floor plans', slug: 'how-to-read-floor-plan-vastu' },
    ],
  },
  puja: {
    key: 'puja',
    name: 'Puja',
    title: 'Puja, rituals and spiritual practice',
    description:
      'Guides to Hindu puja: what it is, how to do a simple puja at home, Griha Pravesh, Vastu Shanti, vehicle and business pujas, samagri, mantras, aartis and booking a pandit.',
    framing:
      'Puja is a form of Hindu worship whose practice varies by region, community and family. These guides describe common traditions respectfully and without claiming one way is the only correct one. When in doubt, follow your family custom or your pandit.',
    pillar: 'what-is-puja',
    topics: [
      { label: 'Puja at home', slug: 'how-to-do-puja-at-home' },
      { label: 'Griha Pravesh', slug: 'griha-pravesh-puja' },
      { label: 'Vastu Shanti', slug: 'vastu-shanti-puja' },
      { label: 'Vahan puja', slug: 'vahan-puja-new-vehicle' },
      { label: 'Samagri', slug: 'puja-samagri-list' },
      { label: 'Mantras & aartis', slug: 'mantra-shloka-stotra-aarti-difference' },
      { label: 'Booking a pandit', slug: 'how-to-book-pandit-for-puja-at-home' },
    ],
  },
};

export const CATEGORY_ORDER: CategoryKey[] = ['astrology', 'vastu', 'puja'];

export function isCategory(value: string): value is CategoryKey {
  return value in CATEGORIES;
}
