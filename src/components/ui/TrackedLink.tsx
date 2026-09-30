'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { track } from '@/lib/analytics';

type TrackedLinkProps = ComponentProps<typeof Link> & {
  /** Short stable id for the CTA, e.g. "hero_explore_astrology". */
  cta: string;
  /** Section the link sits in, e.g. "hero", "ecosystem". */
  location: string;
  product?: string;
};

/**
 * A next/link that records one `cta_click` event on click. Everything else
 * (prefetch, keyboard behaviour, crawlable href) is plain Link.
 */
export function TrackedLink({ cta, location, product, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track('cta_click', { cta, location, product });
        onClick?.(e);
      }}
    />
  );
}
