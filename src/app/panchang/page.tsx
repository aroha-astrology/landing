import type { Metadata } from 'next';
import { PanchangSection } from '@/components/landing/PanchangSection';
import { FAQSection } from '@/components/landing/FAQSection';

export const metadata: Metadata = {
  title: "Today's Panchang — Tithi, Nakshatra, Rahu Kaal | Aroha Astrology",
  description:
    "Today's Panchang computed live from the Swiss Ephemeris — tithi, nakshatra, yoga, karana, sunrise/sunset and Rahu Kaal, updated daily.",
  alternates: { canonical: '/panchang' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: "Aroha Astrology — Today's Panchang",
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqItems = [
  {
    question: 'What is Panchang?',
    answer:
      "Panchang (literally \"five limbs\") is the traditional Vedic almanac used to read the character of a day. It's built from five components — tithi (lunar day), vara (weekday), nakshatra (lunar mansion), yoga, and karana — each computed from the real positions of the Sun and Moon, not a fixed calendar rule.",
  },
  {
    question: 'What is a tithi?',
    answer:
      "A tithi is a lunar day, defined by the angular distance between the Moon and Sun advancing by 12°. There are 30 tithis in a lunar month, split into the Shukla Paksha (waxing fortnight) and Krishna Paksha (waning fortnight) — which is why a tithi's exact start and end time shifts from day to day, unlike a fixed calendar date.",
  },
  {
    question: 'What is Rahu Kaal, and why does it matter?',
    answer:
      'Rahu Kaal is a roughly 90-minute window each day traditionally considered inauspicious for starting anything new — a shadow period ruled by Rahu. Its exact start and end time depends on the day of the week and the local sunrise/sunset, which is why it shifts by both date and city.',
  },
  {
    question: 'What is Abhijit Muhurta?',
    answer:
      "Abhijit Muhurta is the most auspicious ~48-minute window of the day, centred on local solar noon — the midpoint between sunrise and sunset. It's traditionally favoured for starting important work, precisely because it's the one window considered universally auspicious regardless of the weekday.",
  },
  {
    question: 'Why do the timings shown here differ from another Panchang site or app?',
    answer:
      'Two things commonly differ between sources: the ayanamsha used (Aroha uses the Lahiri ayanamsha, the Indian government standard) and how precisely sunrise/sunset is computed for the location. Aroha computes yours from the Swiss Ephemeris, the same precision engine used by astronomical observatories, rather than a simplified approximation.',
  },
  {
    question: 'Does this Panchang work for any city, or just Delhi?',
    answer:
      "The Panchang shown here defaults to New Delhi. Sunrise/sunset-dependent limbs — Rahu Kaal, Gulika Kaal, Yamaganda Kaal, and Abhijit Muhurta — shift for your exact location. Open the app to get every timing computed for your own city.",
  },
];

export default function PanchangPage() {
  return (
    <main>
      <PanchangSection />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="space-y-5 text-ink-2">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            What is Panchang?
          </h2>
          <p>
            Panchang — literally &ldquo;five limbs&rdquo; — is the traditional
            Vedic almanac used to read the character of a day before making a
            decision: starting a journey, signing a contract, holding a
            wedding, or simply planning your morning. It&apos;s built from
            five real astronomical measurements rather than a fixed calendar
            rule: <em>tithi</em> (lunar day), <em>vara</em> (weekday),{' '}
            <em>nakshatra</em> (the Moon&apos;s lunar mansion), <em>yoga</em>{' '}
            (a Sun-Moon angular combination), and <em>karana</em> (half a
            tithi). Because each is derived from the Moon and Sun&apos;s
            actual positions, their start and end times shift every single
            day — unlike a Gregorian date, a tithi can begin at any hour and
            run past midnight.
          </p>
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Why the timings shift by city
          </h2>
          <p>
            Four of the values above the fold — Rahu Kaal, Gulika Kaal,
            Yamaganda Kaal, and Abhijit Muhurta — aren&apos;t fixed clock
            times at all. Each is a fraction of the interval between local
            sunrise and sunset, so the same day&apos;s Rahu Kaal can fall an
            hour apart in Mumbai versus Kolkata, simply because the Sun rises
            and sets at different moments in each. Getting these right
            requires computing real sunrise/sunset for the exact
            latitude/longitude in question, not reading them off a printed
            table computed for one reference city.
          </p>
          <p>
            The Panchang above is computed live from the Swiss Ephemeris —
            the same precision engine used by astronomical observatories —
            using the Lahiri ayanamsha, the Indian government&apos;s standard
            reference point for the sidereal zodiac. Open the Aroha app to
            get every one of these timings recalculated for your own city
            rather than the New Delhi default shown here.
          </p>
        </div>
      </section>

      <FAQSection
        id="panchang-faq"
        eyebrow="Questions"
        title="Understanding today's Panchang"
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
