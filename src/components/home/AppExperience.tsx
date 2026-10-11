import { AppStoreBadges } from '@/components/ui/AppStoreBadges';
import { PROMO_VIDEOS, PromoVideo } from '@/components/ui/PromoVideo';
import Link from 'next/link';

/**
 * The app experience: the three real launch films (poster-only until
 * played), what's inside, and the store badges.
 */
export function AppExperience() {
  return (
    <section id="app" aria-labelledby="app-title" className="scroll-mt-20 bg-night px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,128px)] text-night-ink">
      <div className="mx-auto max-w-[1280px]">
        <div className="reveal grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-night-accent">The Aroha Astrology app</p>
            <h2 id="app-title" className="font-display mt-3 text-[clamp(34px,4.6vw,56px)] font-medium leading-[1.05] text-balance">
              Your chart, your Dasha and your questions on your phone
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-night-ink-2">
              Free Kundli, daily Panchang and horoscope, the Vedic Astrologer chat and{' '}
              <Link href="/astrology#reports" className="text-night-ink underline underline-offset-4">
                15 personalised reports
              </Link>
              , from marriage and Kundli Milan to wealth and career. Available on Android and the web; iOS is coming soon.
            </p>
          </div>
          <AppStoreBadges align="start" location="app_experience" />
        </div>
        <ul className="-mx-[clamp(20px,4vw,56px)] mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(20px,4vw,56px)] pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
          {PROMO_VIDEOS.map((video, i) => (
            <li key={video.slug} className="reveal w-[70vw] max-w-[320px] flex-none snap-center md:w-auto md:max-w-none" style={{ ['--reveal-i' as string]: i }}>
              <PromoVideo video={video} className="border-night-rule" />
              <h3 className="font-display mt-4 text-xl">{video.title}</h3>
              <p className="mt-1 text-sm text-night-ink-2">{video.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
