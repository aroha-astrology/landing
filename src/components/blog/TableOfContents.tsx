import type { Heading } from '@/lib/blog';

/**
 * On-page contents from the article's own H2s. A native <details> on small
 * screens (no JS) and a sticky list beside the text on large ones.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const items = headings.filter((h) => h.depth === 2);
  if (items.length < 3) return null;
  const list = (
    <ol className="space-y-2.5 text-[14px] leading-snug">
      {items.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className="text-ink-2 transition-colors hover:text-accent-text">
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <details className="rounded-2xl border border-rule bg-paper-raised px-5 py-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-ink">In this article</summary>
        <div className="mt-4">{list}</div>
      </details>
      <nav aria-label="In this article" className="hidden lg:block">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">In this article</p>
        {list}
      </nav>
    </>
  );
}
