import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';

/** Long-form static page (About, Editorial standards): same reading measure as articles. */
export function ProsePage({ crumb, eyebrow, title, lead, children }: { crumb: string; eyebrow: string; title: string; lead: string; children: ReactNode }) {
  return (
    <div className="bg-paper px-[clamp(20px,4vw,56px)] pb-[clamp(64px,8vw,112px)] pt-8 text-ink">
      <div className="mx-auto max-w-[1180px]">
        <Breadcrumbs items={[{ name: crumb }]} />
        <header className="mx-auto mt-12 max-w-[760px]">
          <p className="j-eyebrow text-[13px]">{eyebrow}</p>
          <h1 className="font-display mt-3 text-[clamp(38px,5.5vw,64px)] font-medium leading-[1.05] text-balance">{title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-ink-2">{lead}</p>
        </header>
        <div className="article-body mx-auto mt-12 max-w-[760px]">{children}</div>
      </div>
    </div>
  );
}
