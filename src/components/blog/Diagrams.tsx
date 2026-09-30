import type { ReactNode } from 'react';
import { NAKSHATRAS, DASHA_SEQUENCE } from '@/data/nakshatras';
import { DIRECTIONS, type Direction } from '@/data/vastu';

/**
 * Explanatory diagrams usable inside MDX articles. Pure server-rendered SVG:
 * no client JS, real text labels (readable by screen readers and search
 * engines), and colours from the site tokens so they sit in the article
 * like typography, not like pasted images.
 */

function DiagramFigure({ caption, children, wide = false }: { caption: string; children: ReactNode; wide?: boolean }) {
  return (
    <figure className={`not-prose my-10 ${wide ? '' : 'mx-auto max-w-[560px]'}`}>
      <div className="overflow-hidden rounded-2xl border border-rule bg-paper-raised p-4 sm:p-6">{children}</div>
      <figcaption className="mt-3 text-center text-sm leading-snug text-ink-muted">{caption}</figcaption>
    </figure>
  );
}

const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

function sector(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const [ax, ay] = polar(cx, cy, r1, a0);
  const [bx, by] = polar(cx, cy, r1, a1);
  const [c2x, c2y] = polar(cx, cy, r0, a1);
  const [dx, dy] = polar(cx, cy, r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${ax},${ay} A${r1},${r1} 0 ${large} 1 ${bx},${by} L${c2x},${c2y} A${r0},${r0} 0 ${large} 0 ${dx},${dy} Z`;
}

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

/** The 27 Nakshatras around the 12 signs, with optional highlights (0-based). */
export function NakshatraWheel({ highlight = [], caption }: { highlight?: number[]; caption?: string }) {
  const cx = 300, cy = 300, span = 360 / 27;
  return (
    <DiagramFigure caption={caption ?? 'The 27 Nakshatras (outer ring) against the 12 signs (inner ring). Each Nakshatra spans 13°20′, so three Nakshatras never fit neatly into one 30° sign.'}>
      <svg viewBox="0 0 600 600" role="img" aria-label="Wheel of the 27 Nakshatras around the 12 zodiac signs" className="h-auto w-full">
        {NAKSHATRAS.map((n, i) => {
          const hi = highlight.includes(i);
          const [tx, ty] = polar(cx, cy, 252, i * span + span / 2);
          const rot = i * span + span / 2;
          const flip = rot > 90 && rot < 270;
          return (
            <g key={n.name}>
              <path d={sector(cx, cy, 214, 290, i * span, (i + 1) * span)} fill={hi ? 'var(--accent)' : i % 2 ? 'var(--paper-sunk)' : 'var(--paper-raised)'} fillOpacity={hi ? 0.35 : 1} stroke="var(--rule-strong)" strokeWidth={0.8} />
              <text x={tx} y={ty} fontSize={10.5} fill="var(--ink)" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${flip ? rot + 180 : rot} ${tx} ${ty})`} fontWeight={hi ? 700 : 500}>
                {n.name}
              </text>
            </g>
          );
        })}
        {SIGNS.map((s, i) => {
          const [tx, ty] = polar(cx, cy, 180, i * 30 + 15);
          return (
            <g key={s}>
              <path d={sector(cx, cy, 146, 214, i * 30, (i + 1) * 30)} fill={i % 2 ? 'var(--paper)' : 'var(--paper-raised)'} stroke="var(--accent)" strokeWidth={1.2} />
              <text x={tx} y={ty} fontSize={12} fill="var(--ink-2)" textAnchor="middle" dominantBaseline="middle">
                {s}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={146} fill="none" stroke="var(--accent)" strokeWidth={1.2} />
        <text x={cx} y={cy - 8} fontSize={15} textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-newsreader), Georgia, serif">
          360° zodiac
        </text>
        <text x={cx} y={cy + 14} fontSize={12} textAnchor="middle" fill="var(--ink-muted)">
          12 × 30° · 27 × 13°20′
        </text>
      </svg>
    </DiagramFigure>
  );
}

/** The 120-year Vimshottari cycle as proportional bars. */
export function DashaTimeline({ caption }: { caption?: string }) {
  const total = 120;
  let x = 0;
  const colors = ['#8C7A66', '#C9A77A', '#D98A2B', '#BDB6A6', '#B5553A', '#6B6F8A', '#D4A64E', '#5E6B94', '#7E9B6A'];
  return (
    <DiagramFigure wide caption={caption ?? 'The Vimshottari cycle: nine planetary periods totalling 120 years, always in this order. Where you start depends on your Moon’s Nakshatra at birth.'}>
      <svg viewBox="0 0 1000 150" role="img" aria-label="Vimshottari Dasha sequence with years for each planet" className="h-auto w-full">
        {DASHA_SEQUENCE.map((d, i) => {
          const w = (d.years / total) * 1000;
          const el = (
            <g key={d.planet}>
              <rect x={x + 1} y={30} width={w - 2} height={54} rx={6} fill={colors[i]} fillOpacity={0.85} />
              <text x={x + w / 2} y={62} fontSize={w < 60 ? 13 : 16} fill="#FFFDF7" textAnchor="middle" fontWeight={600}>
                {d.planet}
              </text>
              <text x={x + w / 2} y={112} fontSize={14} fill="var(--ink-2)" textAnchor="middle">
                {d.years} yrs
              </text>
            </g>
          );
          x += w;
          return el;
        })}
        <line x1={0} y1={130} x2={1000} y2={130} stroke="var(--rule-strong)" />
        <text x={0} y={146} fontSize={12} fill="var(--ink-muted)">0</text>
        <text x={1000} y={146} fontSize={12} fill="var(--ink-muted)" textAnchor="end">120 years</text>
      </svg>
    </DiagramFigure>
  );
}

const DIR_ANGLE: Record<Exclude<Direction, 'C'>, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

/** Eight directions + centre, with guardian and element. */
export function VastuCompass({ highlight = [], caption }: { highlight?: Direction[]; caption?: string }) {
  const cx = 300, cy = 300;
  return (
    <DiagramFigure caption={caption ?? 'The eight directions and the centre in Vastu, with each direction’s traditional guardian (Dikpala) and, for the corners and centre, its element. North is at the top.'}>
      <svg viewBox="0 0 600 600" role="img" aria-label="Vastu compass of the eight directions and the centre" className="h-auto w-full">
        {DIRECTIONS.filter((d) => d.key !== 'C').map((d) => {
          const a = DIR_ANGLE[d.key as Exclude<Direction, 'C'>];
          const hi = highlight.includes(d.key);
          const [tx, ty] = polar(cx, cy, 196, a);
          return (
            <g key={d.key}>
              <path d={sector(cx, cy, 90, 270, a - 22.5, a + 22.5)} fill={hi ? 'var(--vastu-clay)' : a % 90 ? 'var(--vastu-sand)' : 'var(--paper-raised)'} fillOpacity={hi ? 0.3 : 1} stroke="var(--vastu-ink)" strokeOpacity={0.3} />
              <text x={tx} y={ty - 16} fontSize={17} fontWeight={700} fill="var(--vastu-ink)" textAnchor="middle">{d.key}</text>
              <text x={tx} y={ty + 4} fontSize={12} fill="var(--vastu-ink-2)" textAnchor="middle">{d.guardian}</text>
              {d.element && <text x={tx} y={ty + 21} fontSize={11.5} fill="var(--vastu-clay)" textAnchor="middle" fontStyle="italic">{d.element}</text>}
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={270} fill="none" stroke="var(--vastu-ink)" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={90} fill={highlight.includes('C') ? 'var(--vastu-clay)' : 'var(--paper-sunk)'} fillOpacity={highlight.includes('C') ? 0.3 : 1} stroke="var(--vastu-ink)" strokeOpacity={0.5} />
        <text x={cx} y={cy - 6} fontSize={15} fontWeight={700} fill="var(--vastu-ink)" textAnchor="middle">Brahmasthan</text>
        <text x={cx} y={cy + 14} fontSize={12} fill="var(--vastu-clay)" textAnchor="middle" fontStyle="italic">Space · keep open</text>
        <path d={`M${cx},14 l9,18 l-9,-5 l-9,5 Z`} fill="var(--vastu-clay)" />
      </svg>
    </DiagramFigure>
  );
}

type Room = 'pooja' | 'living' | 'entry' | 'guest' | 'centre' | 'kitchen' | 'dining' | 'master' | 'bath';
const ROOMS: Record<Room, { label: string; box: [number, number, number, number]; labelY?: number }> = {
  pooja: { label: 'Pooja', box: [0.66, 0, 0.34, 0.24] },
  living: { label: 'Living', box: [0.3, 0, 0.36, 0.42] },
  entry: { label: 'Entrance', box: [0.66, 0.24, 0.34, 0.22], labelY: 0.41 },
  guest: { label: 'Guest room', box: [0, 0, 0.3, 0.42] },
  centre: { label: 'Open centre', box: [0.3, 0.42, 0.36, 0.2] },
  kitchen: { label: 'Kitchen', box: [0.66, 0.46, 0.34, 0.54] },
  dining: { label: 'Dining', box: [0.3, 0.62, 0.36, 0.38] },
  master: { label: 'Master bedroom', box: [0, 0.62, 0.3, 0.38] },
  bath: { label: 'Bath', box: [0, 0.42, 0.3, 0.2] },
};

/** An illustrative plan laid out along common Vastu guidance. */
export function FloorPlan({ highlight = [], grid = false, caption }: { highlight?: Room[]; grid?: boolean; caption?: string }) {
  const x0 = 40, y0 = 50, w = 620, h = 440;
  return (
    <DiagramFigure wide caption={caption ?? 'An illustrative plan following common Vastu guidance: entrance and pooja room towards the north-east, kitchen in the south-east, master bedroom in the south-west and an open centre. North is at the top.'}>
      <svg viewBox="0 0 760 540" role="img" aria-label="Illustrative Vastu floor plan with rooms labelled" className="h-auto w-full">
        <rect x={x0} y={y0} width={w} height={h} fill="var(--paper-raised)" />
        {(Object.keys(ROOMS) as Room[]).map((k) => {
          const [a, b, c, d] = ROOMS[k].box;
          const hi = highlight.includes(k);
          return (
            <g key={k}>
              <rect x={x0 + a * w} y={y0 + b * h} width={c * w} height={d * h} fill={hi ? 'var(--vastu-clay)' : 'transparent'} fillOpacity={hi ? 0.25 : 0} stroke="var(--vastu-ink)" strokeOpacity={0.45} />
              <text x={x0 + (a + c / 2) * w} y={y0 + (ROOMS[k].labelY ?? b + d / 2) * h} fontSize={14} fill="var(--vastu-ink)" textAnchor="middle" dominantBaseline="middle" fontWeight={hi ? 700 : 500}>
                {ROOMS[k].label}
              </text>
            </g>
          );
        })}
        {grid &&
          [1, 2].map((i) => (
            <g key={i} stroke="var(--vastu-clay)" strokeDasharray="6 6" strokeWidth={1.4}>
              <line x1={x0 + (w / 3) * i} y1={y0 - 16} x2={x0 + (w / 3) * i} y2={y0 + h + 16} />
              <line x1={x0 - 16} y1={y0 + (h / 3) * i} x2={x0 + w + 16} y2={y0 + (h / 3) * i} />
            </g>
          ))}
        <rect x={x0} y={y0} width={w} height={h} fill="none" stroke="var(--vastu-ink)" strokeWidth={5} />
        <line x1={x0 + w} y1={y0 + 0.28 * h} x2={x0 + w} y2={y0 + 0.42 * h} stroke="var(--paper-raised)" strokeWidth={8} />
        <text x={x0 + w + 12} y={y0 + 0.36 * h} fontSize={12} fill="var(--vastu-clay)" dominantBaseline="middle">door</text>
        <g transform={`translate(${x0 + w + 50} ${y0 + 20})`}>
          <path d="M0,-18 l9,26 l-9,-7 l-9,7 Z" fill="var(--vastu-clay)" />
          <text y={30} fontSize={13} textAnchor="middle" fill="var(--vastu-ink)" fontWeight={700}>N</text>
        </g>
        {(['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'] as const).map((d, i) =>
          grid ? (
            <text key={d} x={x0 + ((i % 3) + 0.5) * (w / 3)} y={y0 + Math.floor(i / 3) * (h / 3) + 18} fontSize={11} fill="var(--vastu-clay)" textAnchor="middle" fontWeight={700}>
              {d === 'C' ? 'CENTRE' : d}
            </text>
          ) : null,
        )}
      </svg>
    </DiagramFigure>
  );
}

/** The five limbs of the Panchang. */
export function PanchangLimbs() {
  const limbs = [
    { name: 'Tithi', what: 'Lunar day', how: 'Each 12° the Moon moves ahead of the Sun' },
    { name: 'Vara', what: 'Weekday', how: 'Counted from sunrise to sunrise' },
    { name: 'Nakshatra', what: 'Lunar mansion', how: 'The Moon’s position among the 27' },
    { name: 'Yoga', what: 'Sun–Moon combination', how: 'Their added longitudes, in 13°20′ steps' },
    { name: 'Karana', what: 'Half a Tithi', how: 'Every 6° of Sun–Moon separation' },
  ];
  return (
    <figure className="not-prose my-10">
      <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-5">
        {limbs.map((l, i) => (
          <li key={l.name} className="bg-paper-raised px-4 py-5">
            <span className="font-display text-sm italic text-accent-text">{String(i + 1).padStart(2, '0')}</span>
            <p className="font-display mt-2 text-xl text-ink">{l.name}</p>
            <p className="mt-1 text-sm font-semibold text-ink-2">{l.what}</p>
            <p className="mt-2 text-[13px] leading-snug text-ink-muted">{l.how}</p>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-center text-sm text-ink-muted">Panch-anga means “five limbs”. Together they describe the quality of a day in the traditional Hindu calendar.</figcaption>
    </figure>
  );
}

/** A numbered ritual or process sequence. */
export function RitualSteps({ steps, caption }: { steps: { title: string; text: string }[]; caption?: string }) {
  return (
    <figure className="not-prose my-10">
      <ol className="relative space-y-0 border-l border-rule-strong pl-8">
        {steps.map((s, i) => (
          <li key={s.title} className="relative pb-7 last:pb-0">
            <span className="absolute -left-[45px] top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-accent bg-paper text-[12px] font-semibold text-accent-text">
              {i + 1}
            </span>
            <p className="font-display text-lg leading-tight text-ink">{s.title}</p>
            <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink-2">{s.text}</p>
          </li>
        ))}
      </ol>
      {caption && <figcaption className="mt-4 text-sm text-ink-muted">{caption}</figcaption>}
    </figure>
  );
}

/** A practical checklist box. */
export function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <aside className="not-prose my-10 rounded-2xl border border-rule bg-paper-raised px-6 py-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15.5px] leading-snug text-ink-2">
            <span aria-hidden className="mt-[3px] inline-block h-4 w-4 shrink-0 rounded border border-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** The article's direct answer, placed right after the introduction. */
export function KeyTakeaway({ children }: { children: ReactNode }) {
  return (
    <aside className="not-prose my-8 rounded-2xl border-l-4 border-accent bg-accent-soft px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">Key takeaway</p>
      <div className="mt-2 text-[16.5px] leading-relaxed text-ink [&_strong]:font-semibold">{children}</div>
    </aside>
  );
}
