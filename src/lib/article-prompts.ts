import type { CategoryKey } from './categories';

/**
 * The "try it on your own chart / home" prompt shown under an article's
 * heading and again in a one-time pop-up. One catchy line per article, tied
 * to what that article explains, plus one sentence on what the app does with
 * it. Only describes features that exist (see features.ts). Articles without
 * an entry fall back to their category's default.
 */
export type ArticlePrompt = { line: string; sub: string };

const KUNDLI = 'Enter your birth details and see your own chart in under a minute. Free on Android and the web.';
const VASTU = 'Draw your floor plan and see each room checked against the eight directions, with a Vastu score.';

export const DEFAULT_PROMPTS: Record<CategoryKey, ArticlePrompt> = {
  astrology: { line: 'Read about it here. Check it on your own chart.', sub: KUNDLI },
  vastu: { line: 'Find out what your own home says.', sub: VASTU },
  puja: { line: 'Plan the day with your own Panchang.', sub: 'See today’s Tithi, Nakshatra and Rahu Kaal for your city, free in the app.' },
};

const p = (line: string, sub: string): ArticlePrompt => ({ line, sub });

export const ARTICLE_PROMPTS: Record<string, ArticlePrompt> = {
  // Astrology
  'what-is-vedic-astrology': p('Enough theory. See what the sky looked like when you were born.', KUNDLI),
  'what-is-kundli-birth-chart': p('Your Kundli takes a minute to make. Go and look at yours.', KUNDLI),
  'how-to-read-birth-chart-vedic-astrology': p('Learn on the chart that matters: yours.', 'Your houses, signs and all nine grahas, laid out so you can follow along with the steps above.'),
  'what-is-lagna-ascendant': p('Your Lagna is already calculated. Want to know what it is?', 'Enter your birth time and place and see your ascendant and the house each planet sits in.'),
  'what-is-a-moon-sign': p('Find your Moon sign in ten seconds.', 'Your Chandra Rashi and Nakshatra from your birth details, free.'),
  'what-is-a-nakshatra': p('Which of the 27 is yours?', 'Your birth Nakshatra and its pada, worked out from your Moon’s exact position.'),
  '27-nakshatras-list': p('You have read all 27. Now find your own.', 'Enter your birth details and see your Nakshatra, its ruling planet and its deity.'),
  'rashi-vs-nakshatra': p('Your Rashi and your Nakshatra are both waiting in your chart.', 'See both side by side for your birth details, free.'),
  'rashi-vs-sun-sign': p('Your Vedic sign may not be the one you grew up with. Check.', 'Find your Rashi in a minute and compare it with your Sun sign.'),
  'vimshottari-dasha-guide': p('Which Dasha are you in right now?', 'Your Mahadasha, Antardasha and Pratyantardasha, with dates, from your own Moon Nakshatra.'),
  'mahadasha-antardasha-pratyantar-dasha-explained': p('Stop guessing which period you are in.', 'Your full Dasha timeline, down to the Pratyantardasha, inside the app.'),
  '12-houses-vedic-astrology': p('See which house each of your planets sits in.', 'Your chart, house by house, with every graha placed for you.'),
  'navagraha-nine-planets-vedic-astrology': p('Nine planets, one chart. Where did yours land?', 'See all nine grahas by sign, house and Nakshatra for your birth details.'),
  'planetary-aspects-drishti-vedic-astrology': p('Who is looking at whom in your chart?', 'Open your Kundli and see how your planets sit in relation to each other.'),
  'planetary-transits-gochar-vedic-astrology': p('The planets are moving today. See what that means for your Moon sign.', 'Daily, weekly and monthly Rashifal read from your Moon sign and the current transits.'),
  'sade-sati-saturn-transit': p('Is Sade Sati on for you? Check in a minute.', 'See where Saturn is relative to your Moon sign, and when each phase starts and ends.'),
  'exalted-debilitated-planets': p('Is any planet of yours exalted or debilitated?', 'Your chart shows every planet’s dignity, so you can stop wondering.'),
  'neecha-bhanga-raja-yoga-explained': p('A debilitated planet is not the end of the story. See if yours has a cancellation.', 'The app checks 54 yogas against your own placements and explains each one.'),
  'raj-yoga-vedic-astrology': p('Does your chart have a Raj Yoga?', '54 yogas checked against your own placements, each one explained.'),
  'dhan-yoga-wealth-vedic-astrology': p('Look for the wealth combinations in your own chart.', 'The app checks your Kundli for Dhan Yogas and explains what it found.'),
  'vedic-astrology-yoga-planetary-combinations': p('54 yogas, checked against your chart automatically.', 'You get the ones you actually have, each with a plain explanation.'),
  'doshas-in-kundli-vedic-astrology': p('Do you really have the dosha you heard about? Check before you worry.', '7 doshas checked against your chart, with the exceptions and cancellations shown.'),
  'manglik-dosha-explained': p('Manglik or not? Your chart can answer that in a minute.', 'A Manglik check for you and for a partner’s chart, free in the app.'),
  'guna-milan-ashtakoota-compatibility': p('Get your 36-point match score in a minute.', 'Enter two sets of birth details and see the Guna Milan, kuta by kuta, plus a Manglik check.'),
  'marriage-timing-vedic-astrology': p('See the marriage indicators in your own chart.', 'A marriage report built from your 7th house, Dasha and transits.'),
  'career-in-vedic-astrology-kundli': p('Your 10th house is in your Kundli. Go and read it.', 'A career report built from your own chart, not a generic sign description.'),
  'combust-planets-vedic-astrology': p('Is a planet of yours combust? Find out.', 'Your chart flags combust and retrograde planets so you can read them in context.'),
  'retrograde-planets-vedic-astrology': p('Do you have a retrograde planet at birth?', 'See every planet’s motion in your Kundli, free.'),
  'atmakaraka-vedic-astrology-explained': p('Look at the degrees in your own chart.', 'Your Kundli lists every planet’s sign, house and degree, so you can find your highest one yourself.'),
  'divisional-charts-navamsa-guide': p('See your Navamsa (D9) next to your birth chart.', 'Divisional charts for your birth details, so you can compare them with the Rasi chart.'),
  'how-to-find-ishta-devata-vedic-astrology': p('Start from your real chart, not a list.', 'Generate your Kundli and follow the steps above with your own houses and planets in front of you.'),
  'how-to-find-unknown-birth-time': p('No birth time? You can still start.', 'Try a few likely times in the app and see which parts of your chart stay the same.'),
  'vedic-astrology-gemstones-guide': p('Before you buy a gemstone, see what your own chart says.', 'Gemstone suggestions based on your actual planetary placements.'),
  'vedic-astrology-remedies-explained': p('See which remedies your chart actually suggests.', 'Gemstone and Lal Kitab remedies based on your own planetary placements.'),
  'kp-astrology-krishnamurti-paddhati-explained': p('See your chart the KP way.', 'The KP report in the app shows your cusps, sub lords and timing.'),
  'what-is-panchang': p('Today’s Panchang is one tap away.', 'Tithi, Nakshatra, Yoga, Karana, sunrise, sunset and Rahu Kaal for your city.'),
  'rahu-kaal-abhijit-muhurta-explained': p('Know today’s Rahu Kaal for your city.', 'Exact Rahu Kaal and Abhijit Muhurta, calculated for where you are.'),

  // Vastu
  'what-is-vastu-shastra': p('Find out how your home scores on Vastu.', VASTU),
  'vastu-directions-explained': p('Which way does your front door really face?', 'Draw your plan in the app and see each room mapped to the eight directions and the centre.'),
  'main-entrance-vastu': p('Check your main door against the plan you just read about.', 'Mark your entrance on your floor plan and the app tells you its direction and how it scores.'),
  'bedroom-vastu': p('Is your bed in the right corner? Check your plan.', 'Place your bedroom on a floor plan and see its direction and score.'),
  'kitchen-vastu': p('Check where your stove sits.', 'Mark your kitchen on your floor plan and see how it scores against the directions.'),
  'living-room-vastu': p('See how your living room scores.', VASTU),
  'pooja-room-vastu': p('Is your pooja room in a good spot? Check your plan.', 'See its direction against the eight directions, with a Vastu score for the whole home.'),
  'vastu-for-flats-apartments': p('Check a flat before you pay for it.', 'Draw the floor plan from the brochure and see how it scores before you decide.'),
  'vastu-for-home-room-directions': p('Every room, checked in one go.', VASTU),
  'how-to-read-floor-plan-vastu': p('Skip the manual reading. Draw it and let the app check it.', VASTU),
  'common-vastu-mistakes': p('Which of these does your home have?', 'Draw your plan and see which rooms lose points and which ones are fine.'),

  // Puja
  'what-is-puja': p('Pick a good day for it with today’s Panchang.', 'Tithi, Nakshatra and Rahu Kaal for your city, free in the app.'),
  'how-to-do-puja-at-home': p('Avoid Rahu Kaal on the day you plan to sit down.', 'Check the day’s timings for your city before you start.'),
  'how-to-book-pandit-for-puja-at-home': p('Aroha Puja is on its way. Meanwhile, check your Panchang.', 'Aroha Puja will let you book a pandit at home. Today you can already check timings and Muhurat in the app.'),
  'griha-pravesh-puja': p('Check the Panchang for your Griha Pravesh date.', 'Tithi, Nakshatra and Rahu Kaal for your city, and a Vastu score for the home you are entering.'),
  'vastu-shanti-puja': p('See what your floor plan says before you plan a puja.', VASTU),
  'vahan-puja-new-vehicle': p('Picking a day for the new vehicle? Check the Panchang.', 'Tithi, Nakshatra and Rahu Kaal for your city, free in the app.'),
  'business-opening-puja': p('Choose your opening day with the Panchang open.', 'Rahu Kaal and Abhijit Muhurta for your city, calculated daily.'),
  'puja-samagri-list': p('Planning a puja? Check the day first.', 'Today’s Panchang for your city, free in the app.'),
  'mantra-shloka-stotra-aarti-difference': p('Hear the shlokas, do not just read about them.', 'A chanting library with audio, and all 701 verses of the Gita, inside the app.'),
  'samskaras-life-milestone-pujas': p('Find an auspicious day for the milestone.', 'Daily Panchang for your city, free in the app.'),
};

export function promptFor(slug: string, category: CategoryKey): ArticlePrompt {
  const custom = ARTICLE_PROMPTS[slug];
  return custom && custom.line ? custom : DEFAULT_PROMPTS[category];
}
