'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export type AccordionItem = {
  question: string;
  answer: string;
};

/** Single-open FAQ accordion. Render its `items` alongside a matching FAQPage JSON-LD block. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium text-ink sm:text-lg"
              >
                {item.question}
                <ChevronDown
                  className={`shrink-0 text-ink-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                  size={20}
                  strokeWidth={1.75}
                  aria-hidden
                />
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
                  <p className="pb-5 text-sm text-ink-2 sm:text-base">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
