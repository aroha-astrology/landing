import type { Metadata } from 'next';
import { KundliSection } from '@/components/landing/KundliSection';
import { FAQSection } from '@/components/landing/FAQSection';

export const metadata: Metadata = {
  title: 'Free Kundli Generator: Vedic Birth Chart Online',
  description:
    'Generate your free Kundli (Vedic birth chart) online. Ascendant, houses and planet placements are computed from Swiss Ephemeris data.',
  alternates: { canonical: '/kundli' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Aroha Astrology: Free Kundli Generator',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqItems = [
  {
    question: 'What is a Kundli?',
    answer:
      'A Kundli (also called a birth chart, janma kundli, or D1/Rashi chart) is a map of where the Sun, Moon and every planet sat in the sky at your exact moment and place of birth, laid out across the 12 houses of Vedic astrology. Dashas, doshas and compatibility are all read from it.',
  },
  {
    question: 'What is the Ascendant (Lagna)?',
    answer:
      "Your Ascendant, or Lagna, is the zodiac sign that was rising on the eastern horizon at your exact moment of birth. It is the most important placement in your chart because it fixes the house structure. Your career, relationships, health and every other life theme are measured from it, and not from your Moon or Sun sign.",
  },
  {
    question: 'What are the 12 houses?',
    answer:
      "The 12 houses each govern an area of life: the 1st house is self and body, the 7th is partnerships, the 10th is career, and so on. Every planet in your chart sits in exactly one house, and its effects are read through that house's theme.",
  },
  {
    question: 'Why does my exact birth time matter so much here?',
    answer:
      "The Ascendant changes roughly once every two hours as the sky rotates, so a birth time that is off by even 15 to 20 minutes can move your Lagna into the next sign and reshuffle every house in the chart. This matters more here than for a Moon sign. If you are unsure of your exact time, your birth certificate or hospital record is the most reliable source.",
  },
  {
    question: 'Is this the same as my Moon sign?',
    answer:
      'They are related but different. Your Moon sign is a single placement (where the Moon sat) and needs only date and time. A full Kundli also needs your birth place, because it computes the Ascendant and all 12 houses, which depend on where on Earth you were at that moment.',
  },
  {
    question: 'What ayanamsha and house system does this use?',
    answer:
      "Lahiri ayanamsha (the Indian government's standard for the sidereal zodiac) and the Whole Sign house system, both computed with the Swiss Ephemeris, the engine astronomical observatories use. If you are used to a different house system such as Placidus or Koch, your house cusps may read differently, although the planet-sign placements will match.",
  },
  {
    question: 'Is my birth data kept private?',
    answer:
      'This free chart is computed and returned to your browser without being stored. Creating a profile in the app (to save your chart and unlock deeper reports) is handled according to our privacy policy.',
  },
];

export default function KundliPage() {
  return (
    <div>
      <KundliSection headingLevel="h1" />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="space-y-5 text-ink-2">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            What is a Kundli?
          </h2>
          <p>
            A Kundli, also called a birth chart, janma kundli or D1/Rashi chart, is a snapshot of
            the sky at the exact moment and place you were born: where the Sun, Moon and every
            visible planet sat against the zodiac, and which of the 12 astrological houses each
            one fell into. It is the foundation of Vedic astrology. Your Moon sign, your dashas
            (planetary time periods), your doshas and your compatibility with a partner are all
            read from this one chart.
          </p>
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            The Ascendant anchors the chart
          </h2>
          <p>
            A Moon sign needs only your birth date and time. A full Kundli also needs your birth{' '}
            <em>place</em>, because it computes your Ascendant (Lagna): the zodiac sign rising on
            the eastern horizon at the moment of your birth. The Ascendant sets the house
            structure of your chart. Two people born in the same minute in different cities can
            have different Ascendants, and so different house placements for the same planets.
            That is why a Kundli cannot be computed from date and time alone.
          </p>
          <p>
            The sky rotates through roughly one sign every two hours, so the Ascendant is the most
            time-sensitive placement in the chart. A birth time off by 15 to 20 minutes can move
            it into the next sign and reshuffle every house that follows. This calculator
            computes yours from the Swiss Ephemeris using the Lahiri ayanamsha and Whole Sign
            houses, the same reference points used throughout the Aroha app.
          </p>
        </div>
      </section>

      <FAQSection
        id="kundli-faq"
        eyebrow="Questions"
        title="Understanding your Kundli"
        items={faqItems}
      />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
