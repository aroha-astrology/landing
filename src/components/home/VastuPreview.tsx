import { TrackedLink } from '@/components/ui/TrackedLink';
import { StatusBadge } from '@/components/product/StatusBadge';
import { PRODUCTS } from '@/lib/brand';

// Plan layout in a 12 × 9 grid, north at the top: pooja and entrance
// north-east, kitchen south-east, master bedroom south-west, open centre.
const ROOMS: { name: string; col: string; row: string; tone?: 'clay' | 'light' | 'open' }[] = [
  { name: 'Guest', col: '1 / 5', row: '1 / 4' },
  { name: 'Living', col: '5 / 9', row: '1 / 5' },
  { name: 'Pooja', col: '9 / 13', row: '1 / 3', tone: 'light' },
  { name: 'Entrance', col: '9 / 13', row: '3 / 5', tone: 'light' },
  { name: 'Bath', col: '1 / 5', row: '4 / 6' },
  { name: 'Centre', col: '5 / 9', row: '5 / 7', tone: 'open' },
  { name: 'Kitchen', col: '9 / 13', row: '5 / 10', tone: 'clay' },
  { name: 'Master', col: '1 / 5', row: '6 / 10', tone: 'clay' },
  { name: 'Dining', col: '5 / 9', row: '7 / 10' },
];

/**
 * Aroha Vastu preview. The plan is real DOM (labelled rooms) lifted into
 * 3D with a CSS transform when it scrolls into view: a 2D floor plan
 * becoming a space, which is exactly what the product is being built to do.
 */
export function VastuPreview() {
  const p = PRODUCTS.vastu;
  return (
    <section id="vastu-preview" aria-labelledby="vastu-title" className="scroll-mt-20 overflow-hidden bg-vastu-sand px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,128px)] text-vastu-ink">
      <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="reveal">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-vastu-clay">{p.name}</p>
            <StatusBadge status={p.status} />
          </div>
          <h2 id="vastu-title" className="font-display mt-4 text-[clamp(34px,4.6vw,58px)] font-medium leading-[1.05] text-balance">
            From the cosmos to your space
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-vastu-ink-2">
            Vastu Shastra is India’s traditional system of architecture and spatial design: how a home’s directions, centre and rooms are arranged. Aroha Vastu is
            being built to read your own floor plan through that lens, and to show you the result in 3D before you move a single wall.
          </p>
          <ul className="mt-8 space-y-3">
            {p.capabilities.map((c) => (
              <li key={c} className="flex gap-3 text-[15.5px]">
                <span aria-hidden className="mt-[9px] h-1 w-3 shrink-0 rounded-full bg-vastu-clay" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-xl rounded-2xl border border-vastu-ink/15 bg-[#F4EDDF] px-5 py-4 text-[14.5px] leading-relaxed text-vastu-ink-2">
            <strong className="text-vastu-ink">Available today:</strong> an early Vastu planner lives inside the Aroha Astrology app, where you can
            draw a 2D floor plan and check it against the eight directions.
          </p>
          <TrackedLink
            href="/vastu"
            cta="vastu_preview"
            location="vastu_preview"
            product="vastu"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-vastu-ink px-6 py-3 text-sm font-semibold text-vastu-sand transition-colors hover:bg-vastu-clay"
          >
            Discover Aroha Vastu <span aria-hidden>→</span>
          </TrackedLink>
        </div>

        <figure className="reveal relative mx-auto w-full max-w-[620px] [perspective:1600px]" style={{ ['--reveal-i' as string]: 1 }}>
          <div className="vastu-plan relative mx-auto aspect-[4/3] w-[86%]">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-9 border-[6px] border-vastu-ink bg-[#F7F1E6] shadow-[0_40px_80px_-30px_rgba(59,45,34,0.45)]">
              {ROOMS.map((r) => (
                <div
                  key={r.name}
                  className={`flex items-center justify-center border border-vastu-ink/35 text-[11px] font-semibold uppercase tracking-[0.1em] sm:text-xs ${
                    r.tone === 'clay' ? 'bg-vastu-clay/20' : r.tone === 'light' ? 'bg-[#FFF6DF]' : r.tone === 'open' ? 'bg-transparent text-vastu-clay' : ''
                  }`}
                  style={{ gridColumn: r.col, gridRow: r.row }}
                >
                  {r.name}
                </div>
              ))}
            </div>
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-xs font-bold tracking-[0.2em] text-vastu-clay">N</span>
            <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs font-bold tracking-[0.2em] text-vastu-ink-2">E</span>
            <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs font-bold tracking-[0.2em] text-vastu-ink-2">S</span>
            <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-bold tracking-[0.2em] text-vastu-ink-2">W</span>
            <span aria-hidden className="absolute right-0 top-[33%] h-[16%] w-[6px] translate-x-[6px] bg-[#FFF6DF]" />
          </div>
          <figcaption className="mt-16 text-center text-sm text-vastu-ink-2">
            An illustrative plan laid out along common Vastu guidance. Aroha Vastu is in development.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
