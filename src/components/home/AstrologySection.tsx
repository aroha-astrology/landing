import Image from 'next/image';
import Link from 'next/link';
import { TrackedLink } from '@/components/ui/TrackedLink';

const CAPABILITIES = [
  { title: 'Janam Kundli', text: 'Your Lagna, Rashi and Nakshatra, with every graha placed by sign, house and degree.', href: '/kundli' },
  { title: 'Vimshottari Dasha', text: 'Mahadasha, Antardasha and Pratyantardasha: the timeline of your chart.', href: '/blog/vimshottari-dasha-guide' },
  { title: 'Yogas and doshas', text: '54 yogas and 7 doshas detected automatically, each explained against your placements.', href: '/blog/vedic-astrology-yoga-planetary-combinations' },
  { title: 'Kundli matching', text: 'The 36-point Guna Milan and a Manglik check for both charts.', href: '/blog/guna-milan-ashtakoota-compatibility' },
  { title: 'Rashifal and transits', text: 'Daily to yearly horoscopes read from your Moon sign and the planets’ current movement.', href: '/blog/planetary-transits-gochar-vedic-astrology' },
  { title: 'Remedies and practice', text: 'Gemstones, Lal Kitab remedies, a shlokas library and the Bhagavad Gita.', href: '/blog/vedic-astrology-remedies-explained' },
];

// House positions (centroids) of the North Indian chart on a 400px square.
const HOUSES: [number, number][] = [
  [200, 100], [100, 45], [45, 100], [100, 200], [45, 300], [100, 355],
  [200, 300], [300, 355], [355, 300], [300, 200], [355, 100], [300, 45],
];
// An illustrative placement using the app's own planet artwork.
const PLACED: { planet: string; house: number; dx?: number }[] = [
  { planet: 'sun', house: 10, dx: -22 },
  { planet: 'mercury', house: 10, dx: 22 },
  { planet: 'moon', house: 4 },
  { planet: 'mars', house: 7 },
  { planet: 'jupiter', house: 1 },
  { planet: 'venus', house: 11 },
  { planet: 'saturn', house: 3 },
  { planet: 'rahu', house: 6 },
  { planet: 'ketu', house: 12 },
];

/** Astrology + Kundli: what the available product actually does. */
export function AstrologySection() {
  return (
    <section id="astrology" aria-labelledby="astrology-title" className="scroll-mt-20 bg-astro-night px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,128px)] text-astro-ink">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center lg:gap-20">
          <div className="reveal">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-astro-gold">Aroha Astrology · Available now</p>
            <h2 id="astrology-title" className="font-display mt-3 text-[clamp(34px,4.6vw,58px)] font-medium leading-[1.05] text-balance">
              Understand your life through Vedic astrology
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-astro-ink-2">
              Every reading starts from your Janam Kundli, computed with the Swiss Ephemeris and the Lahiri ayanamsa from your exact date,
              time and place of birth. Aroha then explains it in plain language, in the language you choose.
            </p>
            <div id="kundli" className="mt-9 flex flex-wrap gap-4">
              <TrackedLink
                href="/kundli"
                cta="astrology_free_kundli"
                location="astrology_section"
                product="astrology"
                className="inline-flex items-center gap-2 rounded-full bg-astro-gold px-6 py-3 text-sm font-semibold text-astro-night transition-colors hover:bg-[#E6BD68]"
              >
                Generate your free Kundli <span aria-hidden>→</span>
              </TrackedLink>
              <TrackedLink
                href="/astrology"
                cta="astrology_everything"
                location="astrology_section"
                product="astrology"
                className="inline-flex items-center rounded-full border border-astro-rule px-6 py-3 text-sm font-semibold transition-colors hover:border-astro-gold hover:text-astro-gold"
              >
                Everything in Aroha Astrology
              </TrackedLink>
            </div>
          </div>

          <figure className="reveal relative mx-auto w-full max-w-[520px]" style={{ ['--reveal-i' as string]: 1 }}>
            <div className="relative aspect-square w-full rounded-[28px] border border-astro-rule bg-[radial-gradient(circle_at_50%_40%,#1B2650,#0B1020_70%)] p-[6%]">
              <svg viewBox="0 0 400 400" className="absolute inset-[6%] h-[88%] w-[88%]" aria-hidden>
                <rect x="1" y="1" width="398" height="398" fill="none" stroke="#D4A64E" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="400" y2="400" stroke="#D4A64E" strokeOpacity=".8" />
                <line x1="400" y1="0" x2="0" y2="400" stroke="#D4A64E" strokeOpacity=".8" />
                <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#D4A64E" strokeOpacity=".8" />
                <polygon points="200,0 300,100 200,200 100,100" fill="#D4A64E" fillOpacity=".08" />
              </svg>
              {PLACED.map(({ planet, house, dx = 0 }) => {
                const [x, y] = HOUSES[house - 1];
                return (
                  <Image
                    key={planet}
                    src={`/planets/${planet}.png`}
                    alt=""
                    width={44}
                    height={44}
                    className="absolute h-[9%] w-[9%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_14px_rgba(212,166,78,0.35)]"
                    style={{ left: `${6 + ((x + dx) / 400) * 88}%`, top: `${6 + (y / 400) * 88}%` }}
                  />
                );
              })}
            </div>
            <figcaption className="mt-4 text-center text-sm text-astro-ink-2">
              A North Indian Kundli: twelve houses, nine grahas. Illustrative placement, drawn with the planet art from the Aroha app.
            </figcaption>
          </figure>
        </div>

        <ul className="mt-20 grid gap-px overflow-hidden rounded-[28px] border border-astro-rule bg-astro-rule sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <li key={c.title} className="reveal bg-astro-night" style={{ ['--reveal-i' as string]: i }}>
              <Link href={c.href} className="group flex h-full flex-col px-7 py-8 transition-colors hover:bg-astro-night-2">
                <span className="font-display text-sm italic text-astro-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display mt-3 text-2xl">{c.title}</h3>
                <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-astro-ink-2">{c.text}</p>
                <span className="mt-5 text-sm font-semibold text-astro-gold opacity-80 transition-opacity group-hover:opacity-100">
                  Learn more <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
