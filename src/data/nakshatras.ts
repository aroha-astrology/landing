/**
 * The 27 Nakshatras in order from 0° sidereal Aries, each spanning 13°20'.
 * `lord` is the Vimshottari Dasha ruler (the Ketu → Mercury sequence repeats
 * three times); `deity` is the presiding deity most commonly given in
 * classical lists — some texts vary.
 */
export type Nakshatra = { name: string; lord: string; deity: string; signs: string };

export const NAKSHATRAS: Nakshatra[] = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', signs: 'Aries' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama', signs: 'Aries' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni', signs: 'Aries / Taurus' },
  { name: 'Rohini', lord: 'Moon', deity: 'Prajapati (Brahma)', signs: 'Taurus' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma', signs: 'Taurus / Gemini' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', signs: 'Gemini' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', signs: 'Gemini / Cancer' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', signs: 'Cancer' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas (Sarpas)', signs: 'Cancer' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris (ancestors)', signs: 'Leo' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', signs: 'Leo' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', signs: 'Leo / Virgo' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitr', signs: 'Virgo' },
  { name: 'Chitra', lord: 'Mars', deity: 'Tvashtr (Vishvakarma)', signs: 'Virgo / Libra' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu', signs: 'Libra' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indra and Agni', signs: 'Libra / Scorpio' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', signs: 'Scorpio' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', signs: 'Scorpio' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti', signs: 'Sagittarius' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas (waters)', signs: 'Sagittarius' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvedevas', signs: 'Sagittarius / Capricorn' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu', signs: 'Capricorn' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Eight Vasus', signs: 'Capricorn / Aquarius' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', signs: 'Aquarius' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', signs: 'Aquarius / Pisces' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', signs: 'Pisces' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan', signs: 'Pisces' },
];

/** Vimshottari Dasha periods, in sequence, in years (total 120). */
export const DASHA_SEQUENCE = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 },
] as const;
