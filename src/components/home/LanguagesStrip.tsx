'use client';

import { useStore } from '@/store/useStore';
import { ALL_LANGUAGES } from '@/lib/i18n/languages';

/** Tells visitors which languages the site is available in; each name switches the site to it. */
export function LanguagesStrip() {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);

  return (
    <section aria-labelledby="languages-title" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(48px,6vw,80px)] text-center">
      <div className="reveal mx-auto max-w-4xl">
        <h2 id="languages-title" className="font-display text-[clamp(26px,3.4vw,40px)] font-medium leading-tight text-ink">
          Read Aroha in your own language
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          This site is available in {ALL_LANGUAGES.length} languages. Pick yours and the whole page changes.
        </p>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-2.5" data-no-translate>
          {ALL_LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                onClick={() => setLanguage(l.code)}
                aria-pressed={language === l.code}
                lang={l.code}
                className={`rounded-full border px-4 py-1.5 text-[14px] transition-colors ${
                  language === l.code
                    ? 'border-accent bg-accent/10 text-accent-text'
                    : 'border-ink/15 text-ink hover:border-accent hover:text-accent-text'
                }`}
              >
                {l.native}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
