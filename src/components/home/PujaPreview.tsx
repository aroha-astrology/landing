import { TrackedLink } from '@/components/ui/TrackedLink';
import { StatusBadge } from '@/components/product/StatusBadge';
import { PRODUCTS } from '@/lib/brand';

const OCCASIONS = ['Griha Pravesh', 'Vastu Shanti', 'Satyanarayan Katha', 'Vahan puja', 'Business opening', 'Naming ceremony', 'Milestone birthdays', 'Festival pujas'];

const MODEL = [
  { k: 'A pandit at your home', v: 'Book a pandit for the puja your family needs, performed where it matters most.' },
  { k: 'Samagri, your choice', v: 'The pandit brings everything, or your family arranges the items yourselves.' },
  { k: 'Priced for that choice', v: 'What you pay reflects the option you pick, shown clearly before you book.' },
];

/**
 * Aroha Puja preview: warm ivory, lamp light. Describes the service as the
 * founder has defined it and says plainly that bookings aren't open.
 */
export function PujaPreview() {
  const p = PRODUCTS.puja;
  return (
    <section
      id="puja-preview"
      aria-labelledby="puja-title"
      className="relative scroll-mt-20 overflow-hidden px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,128px)] text-puja-ink"
      style={{ background: 'radial-gradient(900px 600px at 18% 55%, #FFE2B0 0%, #FBF5EA 45%, #F4E8D3 100%)' }}
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <figure className="reveal relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center" aria-hidden>
          <div className="absolute inset-[12%] rounded-full bg-puja-marigold/30 blur-3xl" />
          <svg viewBox="0 0 400 400" className="relative w-full">
            <defs>
              <linearGradient id="pp-clay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8743A" />
                <stop offset="100%" stopColor="#7A3A1C" />
              </linearGradient>
              <radialGradient id="pp-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD58A" stopOpacity=".9" />
                <stop offset="100%" stopColor="#FFD58A" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="170" r="120" fill="url(#pp-halo)" />
            <g style={{ transformOrigin: '200px 250px', animation: 'aroha-flicker 2.8s ease-in-out infinite' }}>
              <path d="M200 110 C178 150 172 180 200 240 C228 180 222 150 200 110 Z" fill="#E07A1F" />
              <path d="M200 150 C190 175 188 195 200 232 C212 195 210 175 200 150 Z" fill="#FFE7A8" />
            </g>
            <path d="M110 250 Q200 330 290 250 L310 238 Q250 250 200 252 Q150 250 110 250 Z" fill="url(#pp-clay)" />
            <path d="M110 250 Q200 236 300 242" stroke="#E9A25A" strokeWidth="2" fill="none" opacity=".7" />
            {[70, 110, 290, 330].map((x, i) => (
              <g key={x} transform={`translate(${x} ${300 + (i % 2) * 18})`}>
                {Array.from({ length: 14 }, (_, j) => {
                  const a = (j * 360) / 14;
                  return <ellipse key={j} cx="0" cy="-12" rx="5" ry="9" fill={j % 2 ? '#F2A93B' : '#E07A1F'} transform={`rotate(${a})`} />;
                })}
                <circle r="5" fill="#B8561A" />
              </g>
            ))}
          </svg>
        </figure>

        <div className="reveal" style={{ ['--reveal-i' as string]: 1 }}>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-puja-saffron">{p.name}</p>
            <StatusBadge status={p.status} />
          </div>
          <h2 id="puja-title" className="font-display mt-4 text-[clamp(34px,4.6vw,58px)] font-medium leading-[1.05] text-balance">
            From your space to your spiritual journey
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-puja-ink/80">
            A new home, a new vehicle, a child’s first ceremony, a festival: the moments families mark with a puja. Aroha Puja will be a premium
            way to have one performed properly at home, for every kind of puja.
          </p>
          <ol className="mt-9 grid gap-4 sm:grid-cols-3">
            {MODEL.map((m, i) => (
              <li key={m.k} className="rounded-2xl border border-puja-ink/10 bg-puja-ivory/80 p-5">
                <span className="font-display text-sm italic text-puja-saffron">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display mt-2 text-lg leading-snug">{m.k}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-puja-ink/75">{m.v}</p>
              </li>
            ))}
          </ol>
          <ul aria-label="Example occasions" className="mt-8 flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <li key={o} className="rounded-pill border border-puja-saffron/30 px-3.5 py-1.5 text-[13px] text-puja-ink/80">
                {o}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <TrackedLink
              href="/puja"
              cta="puja_preview"
              location="puja_preview"
              product="puja"
              className="inline-flex items-center gap-2 rounded-full bg-puja-ink px-6 py-3 text-sm font-semibold text-puja-ivory transition-colors hover:bg-puja-kumkum"
            >
              Discover Aroha Puja <span aria-hidden>→</span>
            </TrackedLink>
            <span className="text-sm text-puja-ink/70">Not open for bookings yet.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
