'use client';

import { useId, useMemo, useState } from 'react';
import { ArticleCard, type ArticleSummary } from './ArticleCard';
import { track } from '@/lib/analytics';
import type { CategoryKey } from '@/lib/categories';

const FILTERS: { key: 'all' | CategoryKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'astrology', label: 'Astrology' },
  { key: 'vastu', label: 'Vastu' },
  { key: 'puja', label: 'Puja' },
];

/**
 * Search + category filter over the full article list. State lives only in
 * React — never in the URL — so filtering can't create indexable duplicate
 * pages. The server-rendered HTML contains every article, so crawlers and
 * no-JS readers see the complete list.
 */
export function KnowledgeHubSearch({ articles }: { articles: ArticleSummary[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | CategoryKey>('all');
  const inputId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (filter !== 'all' && a.category !== filter) return false;
      if (!q) return true;
      return [a.title, a.description, ...a.tags].some((t) => t.toLowerCase().includes(q));
    });
  }, [articles, query, filter]);

  return (
    <section aria-labelledby="all-articles">
      <div className="flex flex-col gap-6 border-b border-rule pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="all-articles" className="font-display text-3xl font-medium sm:text-4xl">
            All articles
          </h2>
          <p className="mt-2 text-ink-2" aria-live="polite">
            {results.length === articles.length ? `${articles.length} articles` : `${results.length} of ${articles.length} articles`}
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div role="radiogroup" aria-label="Filter by topic" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setFilter(f.key);
                    if (f.key !== 'all') track('blog_category_click', { category: f.key, location: 'hub_filter' });
                  }}
                  className={`rounded-pill border px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? 'border-ink bg-ink text-paper' : 'border-rule-strong text-ink-2 hover:border-ink hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="relative">
            <label htmlFor={inputId} className="sr-only">
              Search articles
            </label>
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: Dasha, kitchen, Griha Pravesh…"
              className="w-full rounded-pill border border-rule-strong bg-paper-raised px-5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent sm:w-72"
            />
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center text-ink-2">No articles match that yet. Try a broader word, or clear the filter.</p>
      ) : (
        <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
