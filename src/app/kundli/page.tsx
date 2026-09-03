import type { Metadata } from 'next';
import { KundliSection } from '@/components/landing/KundliSection';
import { FAQSection } from '@/components/landing/FAQSection';

export const metadata: Metadata = {
  title: 'Free Kundli Generator — Vedic Birth Chart Online',
  description:
    'Generate your free Kundli (Vedic birth chart) online — ascendant, houses and planet placements computed from real Swiss Ephemeris data, not a template.',
  alternates: { canonical: '/kundli' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Aroha Astrology — Free Kundli Generator',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqItems = [
  {
    question: 'What is a Kundli?',
    answer:
      'A Kundli (also called a birth chart, janma kundli, or D1/Rashi chart) is a map of where the Sun, Moon and every planet sat in the sky at your exact moment and place of birth, laid out across the 12 houses of Vedic astrology. It is the foundation every other reading — dashas, doshas, compatibility — is built from.',
  },
  {
    question: 'What is the Ascendant (Lagna)?',
    answer:
      "Your Ascendant, or Lagna, is whichever zodiac sign was rising on the eastern horizon at your exact moment of birth. It's the single most important placement in your chart: it fixes the entire house structure, so where your career, relationships, health and every other life theme fall in your Kundli is measured relative to it, not to your Moon or Sun sign.",
  },
  {
    question: 'What are the 12 houses?',
    answer:
      "The 12 houses each govern a life area — the 1st house is self/body, the 7th is partnerships, the 10th is career, and so on. Every planet in your chart occupies exactly one house, and a planet's effects are read through the lens of that house's theme.",
  },
  {
    question: 'Why does my exact birth time matter so much here?',
    answer:
      "More than for a Moon sign, because the Ascendant changes roughly once every two hours as the sky rotates — a birth time off by even 15-20 minutes can shift your Lagna into a neighbouring sign, which reshuffles every house in the chart. If you're unsure of your exact time, your birth certificate or hospital record is the most reliable source.",
  },
  {
    question: 'Is this the same as my Moon sign?',
    answer:
      'No — related, but not the same. Your Moon sign is a single placement (where the Moon sat) and needs no location, only date and time. A full Kundli needs your birth place too, because it also computes the Ascendant and all 12 houses, which depend on where on Earth you were standing at that moment.',
  },
  {
    question: 'What ayanamsha and house system does this use?',
    answer:
      "Lahiri ayanamsha (the Indian government's standard for the sidereal zodiac) and the Whole Sign house system, both computed via the Swiss Ephemeris — the same precision engine astronomical observatories use. If you're used to a different house system (Placidus, Koch), your house cusps may read differently even though the planet-sign placements will match.",
  },
  {
    question: 'Is my birth data kept private?',
    answer:
      'This free chart is computed and returned to your browser without being stored. Creating a profile in the app (to save your chart and unlock deeper reports) is handled according to our privacy policy.',
  },
];

export default function KundliPage() {
  return (
    <main>
      <KundliSection headingLevel="h1" />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="space-y-5 text-ink-2">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            What is a Kundli?
          </h2>
          <p>
            A Kundli — also called a birth chart, janma kundli, or D1/Rashi
            chart — is a snapshot of the entire sky at the exact moment and
            place you were born: where the Sun, Moon, and every visible
            planet sat against the zodiac, and which of the 12 astrological
            houses each one fell into. It is the single foundational
            document of Vedic astrology; your Moon sign, your dashas
            (planetary time periods), your doshas, and your compatibility
            with a partner are all read from this one chart, not computed
            independently of it.
          </p>
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            The Ascendant is the anchor
          </h2>
          <p>
            Unlike your Moon sign — a single placement that needs only your
            birth date and time — a full Kundli also needs your birth{' '}
            <em>place</em>, because it computes your Ascendant (Lagna): the
            zodiac sign rising on the eastern horizon at your exact moment of
            birth. The Ascendant sets the entire house structure of your
            chart. Two people born the same minute in different cities can
            have different Ascendants, and therefore entirely different
            house placements for the same planets — which is why a Kundli,
            unlike a Moon sign, can&apos;t be computed from date and time
            alone.
          </p>
          <p>
            Because the sky rotates roughly one sign&apos;s width every two
            hours, the Ascendant is also the most time-sensitive placement in
            the entire chart — a birth time off by 15-20 minutes can shift it
            into a neighbouring sign and reshuffle every house that follows.
            This calculator computes yours from the Swiss Ephemeris using
            the Lahiri ayanamsha and Whole Sign houses, the same standard
            reference points used throughout Aroha&apos;s app.
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
    </main>
  );
}
