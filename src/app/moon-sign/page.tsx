import type { Metadata } from 'next';
import { MoonSignSection } from '@/components/landing/MoonSignSection';

export const metadata: Metadata = {
  title: 'Free Moon Sign Calculator (Rashi) — Aroha Astrology',
  description:
    'Calculate your real Vedic Moon sign (Chandra Rashi) free, using the sidereal zodiac — enter your birth date, time and place for an instant, accurate result.',
  alternates: { canonical: '/moon-sign' },
};

export default function MoonSignPage() {
  return (
    <main>
      <MoonSignSection headingLevel="h1" />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="space-y-5 text-ink-2">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            What is a Vedic Moon sign?
          </h2>
          <p>
            In Vedic (Jyotish) astrology, your Moon sign — called your{' '}
            <em>Chandra Rashi</em> — is the zodiac sign the Moon occupied at
            the exact moment and place you were born. Where Western astrology
            leans heavily on your Sun sign, Vedic astrology treats the Moon as
            the more personal placement: it governs the mind, emotions, and
            instinctive reactions, and many traditional predictions —
            including your Vimshottari Dasha timeline and monthly horoscope —
            are calculated from it rather than from the Sun.
          </p>
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Why is it different from my Western sun sign?
          </h2>
          <p>
            The difference isn&apos;t just which planet is used — it&apos;s
            which zodiac. Western astrology uses the <em>tropical</em>{' '}
            zodiac, which is fixed to the seasons (0° Aries is always the
            spring equinox). Vedic astrology uses the <em>sidereal</em>{' '}
            zodiac, which is fixed to the actual, observable positions of the
            constellations. The two were aligned roughly two thousand years
            ago, but the Earth&apos;s slow wobble on its axis — a 26,000-year
            cycle called precession — has since pulled them apart by about
            24 degrees. That gap, known as the <em>ayanamsha</em>, is why a
            planet&apos;s tropical position and its sidereal position can
            land in entirely different signs today, and why a Vedic Moon
            sign calculation needs its own precise ephemeris rather than a
            simple date lookup.
          </p>
          <p>
            Because the Moon moves roughly 13 degrees across the zodiac
            every day, getting the sign — and the more precise nakshatra
            (lunar mansion) and pada (quarter) — right depends on knowing
            your birth time and place accurately, down to the correct UTC
            offset for that historical date. This calculator handles that
            for you: enter your details above and it computes your real
            Chandra Rashi using the same Swiss Ephemeris data that powers a
            full birth chart.
          </p>
        </div>
      </section>
    </main>
  );
}
