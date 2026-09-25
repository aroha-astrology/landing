/**
 * The three vertical (9:16) launch videos, served from /public/videos.
 * `preload="none"` + a poster keeps them off the critical path: nothing but
 * the ~30KB poster downloads until someone presses play.
 */
export type PromoVideoEntry = {
  slug: string;
  title: string;
  description: string;
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
      src={`/videos/aroha-${video.slug}.mp4`}
      poster={`/videos/aroha-${video.slug}.jpg`}
      controls
      playsInline
      preload="none"
      aria-label={`Aroha Astrology video: ${video.title}`}
    />
  );
}
