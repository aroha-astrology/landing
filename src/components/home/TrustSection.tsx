import Link from 'next/link';

const PILLARS = [
  {
    k: 'Calculated, not guessed',
    v: 'Charts are computed with the Swiss Ephemeris and the Lahiri ayanamsa, India’s official sidereal standard, down to divisional charts D1 to D60.',
    link: { href: '/astrology#method', label: 'Our method' },
  },
  {
    k: 'Honest about what it is',
    v: 'Astrology, Vastu and puja are traditions of interpretation and practice. We present them respectfully and never as scientific certainty or a reason for fear.',
    link: { href: '/editorial-standards', label: 'Editorial standards' },
  },
  {
    k: 'In the language you think in',
    v: 'Aroha Astrology reads your chart and answers your questions in 7 Indian languages.',
    link: { href: '/astrology#languages', label: 'Languages' },
  },
  {
    k: 'Your details stay yours',
    v: 'The free web Kundli is computed and returned without being stored. What the app keeps, and how, is set out in our privacy policy.',
    link: { href: '/legal/privacy', label: 'Privacy policy' },
  },
];

/** Why Aroha: four specific, checkable commitments rather than adjectives. */
export function TrustSection() {
  return (
    <section aria-labelledby="trust-title" className="bg-paper-sunk px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,120px)]">
      <div className="mx-auto max-w-[1280px]">
        <div className="reveal max-w-2xl">
          <p className="j-eyebrow text-[13px]">Why Aroha</p>
          <h2 id="trust-title" className="font-display mt-3 text-[clamp(34px,4.6vw,56px)] font-medium leading-[1.05] text-balance">
            Built with care for something people hold dear
          </h2>
        </div>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-rule bg-rule md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <li key={p.k} className="reveal flex flex-col bg-paper-sunk px-7 py-8" style={{ ['--reveal-i' as string]: i }}>
              <span className="font-display text-sm italic text-accent-text">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display mt-3 text-[22px] leading-snug text-ink">{p.k}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-2">{p.v}</p>
              <Link href={p.link.href} className="mt-6 text-sm font-semibold text-link underline underline-offset-4 hover:text-accent-text">
                {p.link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
