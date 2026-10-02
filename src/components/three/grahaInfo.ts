/**
 * What each graha in the hero armillary stands for, shown when a visitor
 * clicks it. Wording follows the Navagraha article
 * (content/blog/navagraha-nine-planets-vedic-astrology.mdx) so the two agree.
 */
export type GrahaInfo = {
  sanskrit: string;
  /** Short significations, shown as chips. */
  governs: string[];
  blurb: string;
  day: string;
};

export const GRAHA_INFO: Record<string, GrahaInfo> = {
  Sun: {
    sanskrit: 'Surya',
    governs: ['Soul & self', 'Father', 'Authority', 'Vitality', 'Leadership'],
    blurb: 'Your core sense of self. The Sun shows confidence, recognition and how you carry authority.',
    day: 'Sunday',
  },
  Moon: {
    sanskrit: 'Chandra',
    governs: ['Mind', 'Emotions', 'Mother', 'Comfort', 'Memory'],
    blurb: 'Your inner world: how you feel and react moment to moment. In Vedic astrology your Moon sign matters most.',
    day: 'Monday',
  },
  Mars: {
    sanskrit: 'Mangal',
    governs: ['Courage', 'Energy', 'Siblings', 'Property', 'Competition'],
    blurb: 'The planet of drive: the willingness to push forward, act decisively and take on a fight.',
    day: 'Tuesday',
  },
  Mercury: {
    sanskrit: 'Budha',
    governs: ['Intellect', 'Speech', 'Business', 'Learning', 'Analysis'],
    blurb: 'How you think, speak and process information, and your head for trade and numbers.',
    day: 'Wednesday',
  },
  Jupiter: {
    sanskrit: 'Guru',
    governs: ['Wisdom', 'Teachers', 'Children', 'Wealth', 'Fortune'],
    blurb: 'The most benefic of the nine: growth, higher learning, dharma and good fortune.',
    day: 'Thursday',
  },
  Venus: {
    sanskrit: 'Shukra',
    governs: ['Love', 'Marriage', 'Beauty', 'Arts', 'Luxury'],
    blurb: 'Relationships and pleasure: attraction, aesthetics, comfort and creativity.',
    day: 'Friday',
  },
  Saturn: {
    sanskrit: 'Shani',
    governs: ['Discipline', 'Karma', 'Hard work', 'Delays', 'Longevity'],
    blurb: 'Astrology’s “hard teacher”: structure, patience and long-term results earned through steady effort.',
    day: 'Saturday',
  },
  Rahu: {
    sanskrit: 'North node',
    governs: ['Ambition', 'Desire', 'Foreign lands', 'Technology', 'Illusion'],
    blurb: 'A shadow point that intensifies whatever it touches, often pulling you outside convention.',
    day: 'Saturday',
  },
  Ketu: {
    sanskrit: 'South node',
    governs: ['Detachment', 'Spirituality', 'Intuition', 'Past karma', 'Moksha'],
    blurb: 'Rahu’s opposite: release, inward focus and matters beyond the material.',
    day: 'Tuesday',
  },
};
