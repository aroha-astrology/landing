import type { CategoryKey } from '@/lib/categories';

const STYLES: Record<CategoryKey, string> = {
  astrology: 'bg-astro-night text-astro-gold',
  vastu: 'bg-vastu-sand text-vastu-clay',
  puja: 'bg-puja-ivory-2 text-puja-saffron',
};

const LABELS: Record<CategoryKey, string> = { astrology: 'Astrology', vastu: 'Vastu', puja: 'Puja' };

/** Small product-coloured label. Visual only — the category is also stated in text/breadcrumbs. */
export function CategoryChip({ category, className = '' }: { category: CategoryKey; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${STYLES[category]} ${className}`}>
      {LABELS[category]}
    </span>
  );
}
