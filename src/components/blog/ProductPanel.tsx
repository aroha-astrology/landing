import { AppCTA } from '@/components/ui/AppCTA';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { StatusBadge } from '@/components/product/StatusBadge';
import { PRODUCTS } from '@/lib/brand';
import type { CategoryKey } from '@/lib/categories';
import { featuresFor } from '@/lib/features';

/**
 * "Related Aroha feature" box at the end of an article. Only ever names real
 * features (FEATURE_LINKS) and states the product's true status.
 */
export function ProductPanel({ category, features, slug }: { category: CategoryKey; features?: string[]; slug: string }) {
  const product = PRODUCTS[category];
  const links = featuresFor(category, features);
  return (
    <aside aria-labelledby={`product-${slug}`} className="rounded-3xl border border-rule bg-paper-raised p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <p id={`product-${slug}`} className="font-display text-2xl text-ink">
          {product.name}
        </p>
        <StatusBadge status={product.status} />
      </div>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">{product.summary}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {links.map((f) => (
          <li key={f.key} className="flex flex-col rounded-2xl border border-rule bg-paper px-5 py-5">
            <p className="font-display text-lg leading-snug text-ink">{f.label}</p>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-2">{f.description}</p>
            <div className="mt-4">
              {f.href === 'app' ? (
                <AppCTA variant="outline">{f.cta}</AppCTA>
              ) : (
                <TrackedLink href={f.href} cta={`article_feature_${f.key}`} location="article_product_panel" product={f.product} className="inline-flex items-center gap-2 text-sm font-semibold text-link underline underline-offset-4 hover:text-accent-text">
                  {f.cta} <span aria-hidden>→</span>
                </TrackedLink>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
