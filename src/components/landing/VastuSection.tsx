'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PhoneShot } from '@/components/ui/PhoneShot';

const SHOTS = [
  {
    src: '/vastu/studio-2d.webp',
    alt: 'Aroha Vastu Studio: a floor plan on the 8-direction compass with a live Vastu score of 78',
    caption: 'Draw your home on the compass',
  },
  {
    src: '/vastu/fix-this.webp',
    alt: 'Vastu Lens showing where a bathroom belongs, with a suggested move from East to West',
    caption: 'See what to fix, and where',
  },
  {
    src: '/vastu/3d-vastu.webp',
    alt: 'The same home in 3D with each room coloured by its Vastu rating',
    caption: 'Walk round it in 3D',
  },
];

/**
 * Home-page teaser for Vastu Studio — three real screenshots and a link to
 * the full /vastu page, which carries the detail and the FAQ.
 */
export function VastuSection() {
  return (
    <Section tone="sunk" id="vastu">
      <SectionHeading
        eyebrow="New · Vastu Studio"
        title="Check your home’s Vastu in minutes"
        subtitle="Draw your floor plan, point it north, and every room gets a direction and a Vastu rating as you go. Tap any room to see why, and where it would sit better — no rebuilding, no guesswork."
      />

      <ul className="-mx-[clamp(20px,4vw,56px)] mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(20px,4vw,56px)] pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
        {SHOTS.map((shot, i) => (
          <motion.li
            key={shot.src}
            className="w-[64vw] max-w-[280px] flex-none snap-center md:w-auto md:max-w-[300px]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <PhoneShot src={shot.src} alt={shot.alt} />
            <p className="mt-4 font-display text-lg text-ink">{shot.caption}</p>
          </motion.li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <a
          href="/vastu"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-accent-ink transition-colors hover:bg-accent-hover"
        >
          Explore Vastu Studio →
        </a>
        <a href="/blog/vastu-for-home-room-directions" className="text-sm font-medium text-link hover:text-accent">
          Read: Vastu for your home, room by room
        </a>
      </div>
    </Section>
  );
}
