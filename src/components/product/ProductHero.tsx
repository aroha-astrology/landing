import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { StatusBadge } from './StatusBadge';
import type { Product } from '@/lib/brand';

const TONE = {
  astrology: { wrap: 'bg-astro-night text-astro-ink', eyebrow: 'text-astro-gold', dark: true },
  vastu: { wrap: 'bg-vastu-sand text-vastu-ink', eyebrow: 'text-vastu-clay', dark: false },
  puja: { wrap: 'text-puja-ink', eyebrow: 'text-puja-saffron', dark: false },
} as const;

/** Shared product-page hero: breadcrumb, product name as eyebrow, status in text. */
export function ProductHero({
  product,
  title,
  lead,
  children,
  visual,
}: {
  product: Product;
  title: ReactNode;
  lead: string;
  children?: ReactNode;
  visual?: ReactNode;
}) {
  const t = TONE[product.key];
  return (
    <section
      aria-labelledby="product-title"
      className={`relative isolate overflow-hidden px-[clamp(20px,4vw,56px)] pb-[clamp(64px,8vw,112px)] pt-8 ${t.wrap}`}
      style={product.key === 'puja' ? { background: 'radial-gradient(900px 600px at 80% 40%, #FFE2B0 0%, #FBF5EA 50%, #F4E8D3 100%)' } : undefined}
    >
      {visual}
      <div className="relative mx-auto max-w-[1280px]">
        <Breadcrumbs items={[{ name: product.name }]} tone={t.dark ? 'dark' : 'paper'} />
        <div className="mt-[clamp(48px,8vw,104px)] max-w-[760px]">
          <div className="flex flex-wrap items-center gap-3">
            <p className={`text-[13px] font-bold uppercase tracking-[0.18em] ${t.eyebrow}`}>{product.name}</p>
            <StatusBadge status={product.status} tone={t.dark ? 'dark' : 'paper'} />
          </div>
          <h1 id="product-title" className="font-display mt-5 text-[clamp(42px,6.2vw,80px)] font-medium leading-[1.02] text-balance">
            {title}
          </h1>
          <p className="mt-6 max-w-[620px] text-[clamp(17px,1.5vw,20px)] leading-relaxed opacity-85">{lead}</p>
          {children && <div className="mt-10 flex flex-wrap items-center gap-4">{children}</div>}
        </div>
      </div>
    </section>
  );
}
