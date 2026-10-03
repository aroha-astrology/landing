'use client';

import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LANGUAGES } from '@/components/LanguageSwitcher';


export function LanguagesSection() {
  return (
    <Section tone="sunk" id="languages">
      <SectionHeading eyebrow="However you think" title={`This site is available in ${LANGUAGES.length} languages`} />

      <div
        className="mt-12 flex flex-wrap justify-center gap-3"
      >
        {LANGUAGES.map((l) => (
          <div
            key={l.code}
            className="flex items-center gap-2 rounded-full border border-rule-strong px-5 py-2.5"
          >
            <span className="text-sm font-semibold text-ink">{l.label}</span>
            <span className="text-xs text-ink-muted" data-no-translate>
              {l.native}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
