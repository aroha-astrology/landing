'use client';

/**
 * The only custom events the site sends. A closed set on purpose: anything
 * not listed here isn't worth tracking, and nothing here carries personal
 * data — just which CTA, where on the page, and which article.
 *
 * Sent only when PostHog is already initialised, which itself only happens
 * with analytics consent (see PostHogProvider / analytics-consent.ts).
 * posthog-js is imported lazily so CTA components don't pull the analytics
 * SDK into every page's initial bundle; the provider has already loaded it.
 */
export type AnalyticsEvent =
  | { name: 'cta_click'; props: { cta: string; location: string; product?: string } }
  | { name: 'blog_category_click'; props: { category: string; location: string } }
  | { name: 'article_scroll_depth'; props: { slug: string; category: string; depth: 25 | 50 | 75 | 100 } }
  | { name: 'app_store_click'; props: { store: 'google_play' | 'web'; location: string } };

export function track<N extends AnalyticsEvent['name']>(
  name: N,
  props: Extract<AnalyticsEvent, { name: N }>['props'],
): void {
  if (typeof window === 'undefined') return;
  void import('posthog-js').then(({ default: posthog }) => {
    if (posthog.__loaded) posthog.capture(name, props);
  });
}
