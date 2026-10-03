import { TrackedLink } from '@/components/ui/TrackedLink';
import { StatusBadge } from '@/components/product/StatusBadge';
import { PRODUCTS, PRODUCT_ORDER, type ProductKey } from '@/lib/brand';
import { AstrologyGlyph, PujaGlyph, VastuGlyph } from './Glyphs';

const LOOK: Record<ProductKey, { card: string; glyph: string; cta: string; lead: string; line: string; Glyph: typeof AstrologyGlyph; points: string[] }> = {
  astrology: {
    card: 'bg-astro-night text-astro-ink',
    glyph: 'text-astro-gold',
    cta: 'Explore Astrology',
    lead: 'Understand yourself',
    line: 'Your birth chart, computed with Swiss Ephemeris precision and explained in plain language, in 7 Indian languages.',
    Glyph: AstrologyGlyph,
    points: ['Free Janam Kundli: Lagna, Rashi and Nakshatra', 'Vimshottari Dasha, yogas and Kundli matching', 'Daily Panchang, Rashifal and chart-based answers'],
  },
  vastu: {
    card: 'bg-vastu-sand text-vastu-ink',
    glyph: 'text-vastu-clay',
    cta: 'Explore Vastu',
    lead: 'Understand your space',
    line: 'Your home’s directions, rooms and centre read through Vastu Shastra, with a score for every room. 3D is coming soon.',
    Glyph: VastuGlyph,
    points: ['Draw your floor plan, room by room', 'Every room judged by its direction', 'A Vastu score and live analysis'],
  },
  puja: {
    card: 'bg-puja-ivory-2 text-puja-ink',
    glyph: 'text-puja-saffron',
    cta: 'See what’s coming',
    lead: 'Perform pujas at home',
    line: 'A pandit comes to your home for any puja, and you choose who arranges the samagri.',
    Glyph: PujaGlyph,
    points: ['Book a pandit for any puja at home', 'Samagri included, or arranged by you', 'The price depends on who arranges the samagri'],
  },
};

/**
 * The three products side by side with their true status, joined by the
 * Life → Space → Journey arc so they read as one system.
 */
export function EcosystemSection() {
  return (
    <section id="ecosystem" aria-labelledby="ecosystem-title" className="scroll-mt-20 bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,128px)]">
      <div className="mx-auto max-w-[1280px]">
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="j-eyebrow text-[13px]">What Aroha offers</p>
            <h2 id="ecosystem-title" className="font-display mt-3 text-[clamp(36px,5vw,64px)] font-medium leading-[1.04] text-balance">
              Astrology, Vastu and puja in one place
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-ink-2 lg:justify-self-end">
            Aroha starts with your birth chart, moves to the home you live in, and ends with the rituals that mark your life. You can use
            each one on its own.
          </p>
        </div>

        <ol aria-label="Life, space, journey" className="reveal mt-12 hidden grid-cols-3 items-center text-sm font-semibold uppercase tracking-[0.16em] text-ink-muted lg:grid">
          {PRODUCT_ORDER.map((k, i) => (
            <li key={k} className="flex items-center gap-4">
              <span className="whitespace-nowrap">
                {`${String(i + 1).padStart(2, '0')} · Your ${PRODUCTS[k].theme.toLowerCase()}`}
              </span>
              {i < 2 && <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-rule-strong to-transparent" />}
            </li>
          ))}
        </ol>

        <ul className="mt-6 grid gap-5 lg:grid-cols-3">
          {PRODUCT_ORDER.map((k, i) => {
            const p = PRODUCTS[k];
            const L = LOOK[k];
            const dark = k === 'astrology';
            return (
              <li key={k} className="reveal" style={{ ['--reveal-i' as string]: i }}>
                <article className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 sm:p-9 ${L.card}`}>
                  <L.Glyph className={`absolute -right-6 -top-6 h-40 w-40 opacity-25 transition-transform duration-[1.2s] ease-out group-hover:rotate-12 ${L.glyph}`} />
                  <div className="flex items-center justify-between gap-3">
                    <L.Glyph className={`h-12 w-12 ${L.glyph}`} />
                    <StatusBadge status={p.status} tone={dark ? 'dark' : 'paper'} />
                  </div>
                  <p className={`mt-10 text-xs font-bold uppercase tracking-[0.16em] ${L.glyph}`}>{L.lead}</p>
                  <h3 className="font-display mt-2 text-[34px] leading-tight">{p.name}</h3>
                  <p className="mt-4 text-[15.5px] leading-relaxed opacity-85">{L.line}</p>
                  <ul className="mt-6 flex-1 space-y-2.5 text-[14.5px]">
                    {L.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <span aria-hidden className={`mt-[9px] h-1 w-3 shrink-0 rounded-full bg-current ${L.glyph}`} />
                        <span className="opacity-90">{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <TrackedLink
                    href={p.path}
                    cta={`ecosystem_${k}`}
                    location="ecosystem"
                    product={k}
                    className={`mt-9 inline-flex items-center justify-between gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
                      dark ? 'border-astro-gold bg-astro-gold text-astro-night hover:bg-[#E6BD68]' : 'border-current/30 hover:border-current'
                    }`}
                  >
                    {p.status === 'available' ? L.cta : `Coming soon · ${L.cta}`}
                    <span aria-hidden>→</span>
                  </TrackedLink>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
