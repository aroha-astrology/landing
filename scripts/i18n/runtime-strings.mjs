// Strings the prerendered HTML never contains: text that only appears after
// a visitor does something (submits a form, clicks a planet) or that depends
// on the device. Add a string here when you add one of those to a component.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Never translated: text built around a live number or date, and names that
// stay in Latin letters in every language.
export const IGNORE = [
  /^\d+ articles$/,
  /^\d+ of \d+ articles$/,
  /^\d{1,2} [A-Z][a-z]+ \d{4}$/,
  /^\S+@\S+\.\S+$/,
  /^Aroha( Astrology| Vastu| Puja)?$/,
  /^(Android|iOS)$/,
];

const FORMS = [
  // KundliSection, MoonSignSection
  'Calculating…',
  'Select a city from the list.',
  'Timezone:',
  'Check your birth details and try again.',
  'Too many requests — try again in a minute.',
  'Something went wrong. Please try again.',
  "Couldn't locate that city. Try a nearby major city instead.",
  'Your Chandra Rashi',
  'See your full chart →',
  'Ascendant (Lagna)',
  'See houses, dashas & full reading →',
  // SupportForm
  'Sending…',
  "You've sent a few requests already — please wait a bit before trying again, or email us directly.",
  'Something went wrong. Please try again or email us directly.',
  'Could not reach the support service. Please try again or email us directly.',
  "Thanks — we've got your message and will reply by email within a day or two.",
  // AppDownloadBanner (phones only)
  'Get the app — faster & offline',
  'iPhone app — coming soon',
  // KnowledgeHubSearch
  'No articles match that yet. Try a broader word, or clear the filter.',
  // PanchangSection, when the backend is unreachable
  'Panchang is temporarily unavailable — check it in the app.',
  'Open Panchang in the app →',
  // HeroVisual planet card
  'Click any planet to see what it governs',
  'Graha ·',
  'Responsible for',
  'Read about all nine grahas',
];

// Planet names as /api/kundli returns them (the result grid labels).
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

/** Arguments of t('…') calls: placeholders and labels translated through useT. */
function tCalls(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry.name) && entry.name !== 'useT.ts') {
        const src = fs.readFileSync(full, 'utf8');
        for (const m of src.matchAll(/\bt\(\s*(['"])((?:(?!\1).)+)\1\s*\)/g)) out.push(m[2]);
      }
    }
  };
  walk(path.join(root, 'src'));
  return out;
}

export async function runtimeStrings(root) {
  const { GRAHA_INFO } = await import(pathToFileURL(path.join(root, 'src/components/three/grahaInfo.ts')).href);
  const graha = Object.entries(GRAHA_INFO).flatMap(([name, g]) => [name, g.sanskrit, g.day, g.blurb, ...g.governs]);
  return [
    ...tCalls(root).map((text) => ({ text, hint: 'form field' })),
    ...FORMS.map((text) => ({ text })),
    ...PLANETS.map((text) => ({ text, hint: 'planet name' })),
    ...graha.map((text) => ({ text })),
  ];
}
