'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/**
 * Sends `article_scroll_depth` once each at 25/50/75/100% of the article
 * body — the only engagement signal the Knowledge Hub records.
 */
export function ArticleScrollTracker({ slug, category, targetId }: { slug: string; category: string; targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const sent = new Set<number>();
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const read = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height));
      for (const d of [25, 50, 75, 100] as const) {
        if (read * 100 >= d && !sent.has(d)) {
          sent.add(d);
          track('article_scroll_depth', { slug, category, depth: d });
        }
      }
      if (sent.size === 4) window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug, category, targetId]);
  return null;
}
