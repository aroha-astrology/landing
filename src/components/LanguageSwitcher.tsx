'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

type LangOption = { code: string; label: string; native: string };

// Only languages with full LANDING_DICT coverage for the current homepage copy
// belong here — bn/ta/te/mr/gu/kn/ml/pa/de were listed but silently no-op on
// this page (their dictionary entries are either missing or leftover from an
// older redesign), which read as a broken switcher rather than an untranslated
// one. Re-add a code here only once its LANDING_DICT block covers this page's
// actual strings (see src/lib/i18n/dictionary.ts's "2026-07-22 redesign
// additions" sections for hi/es/fr as the template).
export const LANGUAGES: LangOption[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
];

export function LanguageSwitcher() {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-paper px-3 text-ink transition-colors hover:border-accent hover:text-accent"
        aria-label="Change language"
        data-no-translate
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-wider">{current.code}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-11 z-50 max-h-[60vh] w-52 overflow-y-auto rounded-2xl border border-rule bg-paper-raised p-1.5 shadow-[0_18px_40px_rgba(20,20,24,0.18)]"
            style={{ transformOrigin: 'top right' }}
            data-no-translate
          >
            <div className="j-eyebrow border-b border-rule px-2.5 py-1.5 text-[10px] font-bold">
              Language
            </div>
            {LANGUAGES.map((l) => {
              const active = l.code === language;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg border-none bg-transparent px-2.5 py-1.5 text-left transition-colors hover:bg-paper-sunk ${
                    active ? 'text-accent' : 'text-ink'
                  }`}
                >
                  <span className="text-[12px] font-semibold">{l.native}</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-ink-muted">
                    {active ? '✓' : l.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
