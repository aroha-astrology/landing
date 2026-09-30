/**
 * Vertical (9:16) product films. `preload="none"` + a poster keeps them off
 * the critical path: nothing but the ~50KB poster downloads until someone
 * presses play. Files are 720p H.264 with faststart, 1.4–1.7 MB each.
 */
export type PromoVideoEntry = {
  slug: string;
  title: string;
  description: string;
  /** Defaults to /videos/aroha-<slug>.mp4 (the three launch films). */
  src?: string;
  poster?: string;
  /** Plain-text account of what the film shows, for screen readers and search. */
  transcript?: string;
};

export const PROMO_VIDEOS: readonly PromoVideoEntry[] = [
  {
    slug: 'the-sky-remembers',
    title: 'The sky remembers',
    description: 'Your Kundli, the Vedic Astrologer chat and 14 reports, in 26 seconds.',
  },
  {
    slug: 'app-tour',
    title: 'A quick tour of the app',
    description: 'From birth details to Panchang, chat in Hindi, reports and every tool.',
  },
  {
    slug: 'by-the-numbers',
    title: 'By the numbers',
    description: '9 grahas, 27 nakshatras, 54 yogas, 14 reports, 7 languages.',
  },
];

/** Feature films recorded from the app, placed next to the feature they show. */
export const FEATURE_VIDEOS = {
  dailyPanchang: {
    slug: 'daily-panchang',
    title: 'Is today the right day?',
    description: 'Today’s Panchang in the Aroha Astrology app: Tithi, Rahu Kaal, Abhijit Muhurta and hour-by-hour Choghadiya for your city.',
    src: '/assets/video/aroha-daily-panchang.mp4',
    poster: '/assets/video/aroha-daily-panchang.jpg',
    transcript:
      'Is today the right day? The app shows the five limbs of the day (Tithi, Vaar, Nakshatra, Yoga and Karana), today’s Tithi (Shukla Chaturdashi, ending at 23:08 before Purnima), when to wait and when to begin with Rahu Kaal and Abhijit Muhurta, and every hour of the day rated in the Choghadiya. Aroha Astrology: today’s Panchang, for your city. Free on Android.',
  },
  vastuPlanner: {
    slug: 'vastu-planner',
    title: 'Vastu, room by room',
    description: 'The Vastu planner in the Aroha Astrology app: draw your home, see each room judged by direction, and watch the score change as you fix it.',
    src: '/assets/video/aroha-vastu-planner.mp4',
    poster: '/assets/video/aroha-vastu-planner.jpg',
    transcript:
      'Eight directions, one right corner. In the Aroha Astrology app’s Vastu planner you draw your home room by room and each room is judged by its direction. A kitchen in the north scores 70 and is marked as needing work; moved to the south-east, the traditional fire corner, the score rises to 88. Questions about the plan can be asked in the app’s chat. Aroha Astrology: Vastu, room by room. Free on Android.',
  },
} satisfies Record<string, PromoVideoEntry>;

/** Stable pick per blog slug, so each post always shows the same video but posts vary. */
export function promoVideoForSlug(slug: string): PromoVideoEntry {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return PROMO_VIDEOS[hash % PROMO_VIDEOS.length];
}

type PromoVideoProps = {
  video: PromoVideoEntry;
  className?: string;
};

export function PromoVideo({ video, className = '' }: PromoVideoProps) {
  return (
    <video
      className={`aspect-[9/16] w-full rounded-2xl border border-rule bg-night object-cover ${className}`}
      src={video.src ?? `/videos/aroha-${video.slug}.mp4`}
      poster={video.poster ?? `/videos/aroha-${video.slug}.jpg`}
      controls
      playsInline
      preload="none"
      aria-label={`Aroha video: ${video.title}`}
    />
  );
}

/**
 * A film with its caption and an expandable transcript: the transcript keeps
 * what the video shows available to screen readers, search engines and
 * anyone who can't play it.
 */
export function FeatureVideo({ video, tone = 'paper', className = '' }: { video: PromoVideoEntry; tone?: 'paper' | 'sand' | 'dark'; className?: string }) {
  const dark = tone === 'dark';
  const sand = tone === 'sand';
  return (
    <figure className={`not-prose ${className}`}>
      <PromoVideo video={video} className={dark ? 'border-night-rule shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]' : 'shadow-[0_30px_70px_-35px_rgba(20,19,16,0.55)]'} />
      <figcaption className={`mt-3 text-sm leading-snug ${dark ? 'text-night-ink-2' : sand ? 'text-vastu-ink-2' : 'text-ink-muted'}`}>
        <span className={`font-semibold ${dark ? 'text-night-ink' : sand ? 'text-vastu-ink' : 'text-ink'}`}>{video.title}{/[.?!]$/.test(video.title) ? '' : '.'}</span> {video.description}
        {video.transcript && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em]">What the video shows</summary>
            <p className="mt-2 text-[13px] leading-relaxed">{video.transcript}</p>
          </details>
        )}
      </figcaption>
    </figure>
  );
}
