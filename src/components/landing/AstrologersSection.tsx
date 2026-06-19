'use client';

import { motion } from 'framer-motion';
import { TiltCard } from '@/components/ui/TiltCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * The Connect section. A responsive grid of astrologer cards — golden-ringed
 * avatar, a pulsing green "online" dot, name + specialization, and a Connect
 * Now CTA that lights up on hover. Names stay untranslated; specializations
 * translate via the dictionary.
 */

const ASTROLOGERS = [
  { name: 'Acharya Vivek', specialization: 'Vedic Expert', initial: 'V', hue: 'from-amber-500/40 to-yellow-700/30' },
  { name: 'Priya Sharma', specialization: 'Tarot Reader', initial: 'P', hue: 'from-fuchsia-500/40 to-purple-700/30' },
  { name: 'Rohan Mehta', specialization: 'Numerologist', initial: 'R', hue: 'from-sky-500/40 to-indigo-700/30' },
  { name: 'Devi Nair', specialization: 'Palmistry', initial: 'D', hue: 'from-rose-500/40 to-red-700/30' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function AstrologersSection() {
  return (
    <section className="relative px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Connect Live" title="Speak with our astrologers" className="mb-12" />

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {ASTROLOGERS.map((a) => (
            <motion.div key={a.name} variants={card}>
            <TiltCard className="flex flex-col items-center p-6 text-center">
              {/* Avatar with golden ring + live dot. */}
              <div className="relative mb-4">
                <div className="rounded-full p-[2px] [background:linear-gradient(135deg,#F2CA50,#A67C00)]">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${a.hue} font-cinzel text-2xl text-text`}
                    data-no-translate
                  >
                    {a.initial}
                  </div>
                </div>
                {/* Pulsing live indicator. */}
                <span className="absolute bottom-1 right-1 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-[#0a0616] bg-green-400" />
                </span>
              </div>

              <h3 className="font-cinzel text-lg text-text" data-no-translate>
                {a.name}
              </h3>
              <p className="mt-1 font-cormorant text-sm uppercase tracking-[0.2em] text-primary/80">
                {a.specialization}
              </p>

              <p className="mt-2 flex items-center gap-1.5 text-xs text-green-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                Online
              </p>

              <GoldButton variant="outline" className="mt-5 w-full px-4 py-2.5 text-xs">
                Connect Now
              </GoldButton>
            </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
