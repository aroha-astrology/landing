import { LOCALE_LOADERS } from './locales';
import { ALL_LANGUAGES } from './languages';

type Locale = Record<string, string>;

const cache = new Map<string, Locale>();
const pending = new Map<string, Promise<Locale | null>>();

/** Languages a visitor can pick right now: English plus every imported file. */
export const AVAILABLE_LANGUAGES = ALL_LANGUAGES.filter((l) => l.code === 'en' || l.code in LOCALE_LOADERS);

export function isAvailable(code: string): boolean {
  return AVAILABLE_LANGUAGES.some((l) => l.code === code);
}

export function normalise(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Fetches one language's strings (a separate chunk, so English visitors never download it). */
export function loadLocale(code: string): Promise<Locale | null> {
  const hit = cache.get(code);
  if (hit) return Promise.resolve(hit);
  const loader = LOCALE_LOADERS[code];
  if (!loader) return Promise.resolve(null);
  let p = pending.get(code);
  if (!p) {
    p = loader()
      .then((m) => (cache.set(code, m), m))
      .catch(() => null)
      .finally(() => pending.delete(code));
    pending.set(code, p);
  }
  return p;
}

/** Synchronous lookup; call after loadLocale has resolved. */
export function lookup(text: string, code: string): string | undefined {
  const key = normalise(text);
  return cache.get(code)?.[key];
}
