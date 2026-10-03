'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { loadLocale, lookup } from './locale';

/**
 * Translation helper for strings the DOM-walking TranslationProvider can't
 * reach: element attributes like input `placeholder` and `aria-label`
 * (the provider only swaps visible text nodes and skips INPUT tags).
 *
 * For visible JSX text, just write English; the provider translates it live.
 *
 *   const t = useT();
 *   <input placeholder={t('Select date')} />
 */
export function useT() {
  const language = useStore((s) => s.language);
  const [, setLoaded] = useState(0);
  useEffect(() => {
    if (language !== 'en') loadLocale(language).then(() => setLoaded((n) => n + 1));
  }, [language]);
  return (en: string): string => (language === 'en' ? en : lookup(en, language) ?? en);
}
