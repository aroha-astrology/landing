import Image from 'next/image';
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
        <figure className="reveal relative mx-auto w-full max-w-[540px]">
          <div aria-hidden className="absolute inset-[-8%] rounded-full bg-puja-marigold/30 blur-3xl" />
          {/* 768 px source: keep the frame at or under ~540 px so it stays sharp on dense screens. */}
          <Image
            src="/assets/home/puja-still-life.webp"
            alt="A lit brass diya on a wooden table beside a kalash topped with a coconut and mango leaves"
            width={768}
            height={400}
            quality={90}
            sizes="(min-width: 1024px) 540px, 92vw"
            className="relative h-auto w-full rounded-[28px] shadow-[0_30px_70px_-20px_rgba(122,58,28,0.55)] ring-1 ring-puja-ink/10"
          />
        </figure>

        <div className="reveal" style={{ ['--reveal-i' as string]: 1 }}>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-puja-saffron">{p.name}</p>
            <StatusBadge status={p.status} />
          </div>
          <h2 id="puja-title" className="font-display mt-4 text-[clamp(34px,4.6vw,58px)] font-medium leading-[1.05] text-balance">
            Pujas at home, with a pandit you book
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-puja-ink/80">
            A new home, a new vehicle, a child’s first ceremony, a festival: families mark these with a puja. Aroha Puja will let you book a
            pandit to perform any of them at your home.
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
