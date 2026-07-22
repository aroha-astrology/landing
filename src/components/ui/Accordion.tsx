'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type AccordionItem = {
  question: string;
  answer: string;
};

/** Single-open FAQ accordion. Render its `items` alongside a matching FAQPage JSON-LD block. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.question} className="border-b border-rule">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="font-display flex w-full items-center justify-between gap-4 py-[22px] text-left text-lg text-ink"
              >
                {item.question}
                {/* A plain +/- rather than a chevron, per the design. It's
                    decorative: aria-expanded already announces the state. */}
                <span className="shrink-0 text-xl text-accent" aria-hidden data-no-translate>
                  {open ? '−' : '+'}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[640px] pb-6 text-[15px] leading-[1.65] text-ink-2">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
