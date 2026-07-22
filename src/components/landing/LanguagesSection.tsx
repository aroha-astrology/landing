'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LANGUAGES } from '@/components/LanguageSwitcher';

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function LanguagesSection() {
  return (
    <Section tone="sunk" id="languages">
      <SectionHeading eyebrow="However you think" title={`Available in ${LANGUAGES.length} languages`} />

      <motion.div
        className="mt-12 flex flex-wrap justify-center gap-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={listVariants}
      >
        {LANGUAGES.map((l) => (
          <motion.div
            key={l.code}
            variants={itemVariants}
            className="flex items-center gap-2 rounded-full border border-rule bg-paper-raised px-4 py-2"
          >
            <span className="text-sm font-medium text-ink" data-no-translate>
              {l.native}
            </span>
            <span className="text-xs text-ink-muted">{l.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
