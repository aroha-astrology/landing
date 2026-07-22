// Historical UTC-offset lookup for a birth date/place. A fixed offset would
// be wrong for half the year in any DST-observing zone (US/EU) — and the
// Moon moves ~13°/day, so an hour of error can flip the computed sign or
// nakshatra near a boundary. This must be resolved per the *birth date*,
// not "today".

/**
 * Returns the UTC offset, in minutes, that `timeZone` observed on the
 * calendar date `dateStr` (any instant that falls on that date in that zone
 * gives the same answer, except right at the DST transition instant itself —
 * out of scope here). Positive = east of UTC (e.g. India = +330).
 */
export function getUtcOffsetMinutes(timeZone: string, dateStr: string): number {
  // Noon UTC is a safe anchor: it is never a different calendar day in any
  // real-world zone, so it's guaranteed to land on `dateStr` locally.
  const probe = new Date(`${dateStr}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  }).formatToParts(probe);
  const raw = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+00:00';
  // raw looks like "GMT+05:30", "GMT-05:00", or bare "GMT"
  const match = raw.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1].startsWith('-') ? -1 : 1;
  const hours = Math.abs(Number(match[1]));
  const minutes = Number(match[2] ?? 0);
  return sign * (hours * 60 + minutes);
}
