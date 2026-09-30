import Link from 'next/link';

export type Crumb = { name: string; href?: string };

/** Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by each page. */
export function Breadcrumbs({ items, tone = 'paper' }: { items: Crumb[]; tone?: 'paper' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${dark ? 'text-night-ink-2' : 'text-ink-muted'}`}>
        {[{ name: 'Home', href: '/' }, ...items].map((c, i, all) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.name}-${i}`} className="flex items-center gap-2">
              {c.href && !last ? (
                <Link href={c.href} className={`transition-colors ${dark ? 'hover:text-night-ink' : 'hover:text-ink'}`}>
                  {c.name}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={`line-clamp-1 ${dark ? 'text-night-ink' : 'text-ink-2'}`}>
                  {c.name}
                </span>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
