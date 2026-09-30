'use client';

import { useId, useState } from 'react';

export type AccordionItem = {
  question: string;
  answer: string;
};

/**
 * Single-open FAQ accordion. Render its `items` alongside a matching
 * FAQPage JSON-LD block. Every answer stays in the DOM (collapsed panels
 * use a 0fr grid row, not unmounting), so the full Q&A is present in the
 * server HTML for readers, crawlers and find-in-page alike.
 */
export function Accordion({ items, tone = 'paper' }: { items: AccordionItem[]; tone?: 'paper' | 'dark' }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();
  const dark = tone === 'dark';

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.question} className={`border-b ${dark ? 'border-night-rule' : 'border-rule'}`}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className={`font-display flex w-full items-center justify-between gap-4 py-[22px] text-left text-lg ${dark ? 'text-night-ink' : 'text-ink'}`}
              >
                {item.question}
                {/* A plain +/- rather than a chevron, per the design. It's
                    decorative: aria-expanded already announces the state. */}
                <span className="shrink-0 text-xl text-accent-text" aria-hidden data-no-translate>
                  {open ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden" inert={!open}>
                <p className={`max-w-[680px] pb-6 text-[15px] leading-[1.65] ${dark ? 'text-night-ink-2' : 'text-ink-2'}`}>
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
