'use client';

import { useStore } from '@/store/useStore';
import { lookupDict } from './dictionary';

/**
 * Translation helper for strings the DOM-walking TranslationProvider can't
 * reach — chiefly element attributes like input `placeholder` and `aria-label`
 * (the provider only swaps visible text nodes and skips INPUT tags).
 *
 * For visible JSX text, just write English; the provider translates it live.
 *
 *   const t = useT();
 *   <input placeholder={t('Select date')} />
 */
export function useT() {
  const language = useStore((s) => s.language);
  return (en: string): string =>
    language === 'en' ? en : lookupDict(en, language) ?? en;
}
