import Link from 'next/link';
import { ArticleCard, toSummary } from '@/components/blog/ArticleCard';
import { getFeaturedPosts, getPostsByCategory } from '@/lib/blog';
import { CATEGORIES, type CategoryKey } from '@/lib/categories';

/** A product page's link into its Knowledge Hub cluster. */
export function GuidesStrip({ category, title }: { category: CategoryKey; title: string }) {
  const guides = getFeaturedPosts(category, 3);
  const count = getPostsByCategory(category).length;
  return (
    <section aria-labelledby={`${category}-guides`} className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id={`${category}-guides`} className="font-display text-3xl font-medium sm:text-4xl">
            {title}
          </h2>
          <Link href={`/blog/${category}`} className="text-sm font-semibold text-link underline underline-offset-4">
            {count > 0 ? `All ${count} ${CATEGORIES[category].name} articles →` : `${CATEGORIES[category].name} articles →`}
          </Link>
        </div>
        {guides.length > 0 ? (
          <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((p) => (
              <li key={p.slug}>
                <ArticleCard article={toSummary(p)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 max-w-xl text-ink-2">Our first {CATEGORIES[category].name} guides are in editorial review and will appear here once published.</p>
        )}
      </div>
    </section>
  );
}
