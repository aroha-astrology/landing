'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArticleCard, type ArticleSummary } from '@/components/blog/ArticleCard';
import { track } from '@/lib/analytics';
import type { CategoryKey } from '@/lib/categories';

type Tab = { key: CategoryKey; label: string; articles: ArticleSummary[]; empty: string };

/**
 * Accessible tabs (roving tabindex, arrow keys). Every panel is rendered in
 * the HTML — inactive ones are `hidden` — so all featured articles are
 * crawlable links regardless of which tab is selected.
 */
export function KnowledgeTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) refs.current[i]?.focus();
    track('blog_category_click', { category: tabs[i].key, location: 'home_knowledge_tabs' });
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') select((active + 1) % tabs.length, true);
    else if (e.key === 'ArrowLeft') select((active - 1 + tabs.length) % tabs.length, true);
    else if (e.key === 'Home') select(0, true);
    else if (e.key === 'End') select(tabs.length - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <div>
      <div role="tablist" aria-label="Knowledge Hub topics" onKeyDown={onKey} className="flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${base}-tab-${t.key}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`${base}-panel-${t.key}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => select(i)}
            className={`rounded-pill border px-5 py-2.5 text-sm font-semibold transition-colors ${
              active === i ? 'border-ink bg-ink text-paper' : 'border-rule-strong text-ink-2 hover:border-ink hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.key} id={`${base}-panel-${t.key}`} role="tabpanel" aria-labelledby={`${base}-tab-${t.key}`} hidden={active !== i} className="mt-10">
          {t.articles.length > 0 ? (
            <ul className="grid gap-x-6 gap-y-12 md:grid-cols-3">
              {t.articles.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-xl text-ink-2">{t.empty}</p>
          )}
          <Link href={`/blog/${t.key}`} className="mt-10 inline-block text-sm font-semibold text-link underline underline-offset-4 hover:text-accent-text">
            All {t.label} articles →
          </Link>
        </div>
      ))}
    </div>
  );
}
