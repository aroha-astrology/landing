import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AppCTA } from '@/components/ui/AppCTA';
import { PROMO_VIDEOS, PromoVideo } from '@/components/ui/PromoVideo';

/**
 * The three launch videos side by side on desktop; a horizontal snap
 * carousel on phones so a 9:16 video never fills more than one screen.
 */
export function VideoSection() {
  return (
    <Section tone="night" id="videos">
      <SectionHeading
        dark
        eyebrow="See it in action"
        title="Aroha in under 30 seconds"
        subtitle="Three short films of the app. Pick one and press play."
      />
      <ul className="-mx-[clamp(20px,4vw,56px)] mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(20px,4vw,56px)] pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
        {PROMO_VIDEOS.map((video) => (
          <li key={video.slug} className="w-[72vw] max-w-[320px] flex-none snap-center md:w-auto md:max-w-none">
            <PromoVideo video={video} className="border-night-rule" />
            <h3 className="mt-4 font-display text-xl text-night-ink">{video.title}</h3>
            <p className="mt-1 text-sm text-night-ink-2">{video.description}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <AppCTA>Get the App</AppCTA>
      </div>
    </Section>
  );
}
