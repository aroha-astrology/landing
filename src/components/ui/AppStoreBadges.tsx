'use client';

import Image from 'next/image';
import { Globe } from 'lucide-react';

import { track } from '@/lib/analytics';
import { PLAY_STORE_URL, WEB_APP_URL } from '@/lib/links';

/**
 * The three ways into the app, as one row of badges: Google Play, the web
 * app, and the App Store.
 *
 * The two store badges are the vendors' own artwork, served locally from
 * /public/brand — Google's "Get it on Google Play" PNG and Apple's "Download
 * on the App Store" SVG, both pulled from the vendors' own badge endpoints.
 * These are trademarked marks: don't recolour, stretch, relabel or re-typeset
 * them.
 *
 * Google ships its PNG with ~1/4-height transparent clear space baked in,
 * which would render it visibly smaller than Apple's edge-to-edge SVG at the
 * same CSS height. The padding was cropped off so the two share one optical
 * height, and the clear space Google's guidelines require is reproduced with
 * the flex `gap` instead.
 *
 * The Web badge is ours, drawn to sit beside them as an equal: the same
 * height, the same black plate and thin grey outline the store badges have,
 * an icon on the left and the two-line label. It used to be a flat dark box,
 * which on the dark sections read as a caption rather than something to tap.
 *
 * There is no iOS listing yet (see links.ts). Until there is, an iPhone
 * visitor's way in is the web app, so the App Store badge opens that, says so
 * on its tag, and the line under the row says it in words. (Owner's call,
 * 2026-10-09. When the listing goes live: point the badge at it, drop the tag
 * and the line.)
 */

// Intrinsic aspect ratios of the cropped artwork, so the widths below stay
// correct if the shared height changes.
const BADGE_H = 44;
const PLAY_W = Math.round((564 / 168) * BADGE_H);
const APPLE_W = Math.round((119.66407 / 40) * BADGE_H);

/** Hover and press feedback shared by all three, so they answer a tap the same way. */
const PRESSABLE =
  'inline-flex rounded-lg transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';

export function AppStoreBadges({
  align = 'center',
  className = '',
  location = 'badges',
}: {
  align?: 'center' | 'start';
  className?: string;
  /** Where on the site this row sits, for the click event: "app_experience", "footer". */
  location?: string;
}) {
  const clicked = (store: 'google_play' | 'web' | 'ios_web') => () => track('app_store_click', { store, location });

  return (
    // No `data-no-translate` here: the brand wordmarks are baked into the
    // images (so the DOM walker can't touch them anyway), while the Web label,
    // the tag and the iPhone line below are real copy that should localise.
    <div className={`flex flex-col gap-3 ${align === 'center' ? 'items-center' : 'items-start'} ${className}`}>
      {/* gap-y is wider than gap-x: the App Store badge's tag sits above its top edge, and
          on a phone that badge wraps onto a second row under the other two. */}
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-6 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
        <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={clicked('google_play')} className={PRESSABLE}>
          <Image
            src="/brand/google-play-badge.png"
            alt="Get it on Google Play"
            width={PLAY_W}
            height={BADGE_H}
            style={{ height: BADGE_H, width: 'auto' }}
          />
        </a>

        <a
          href={WEB_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={clicked('web')}
          style={{ height: BADGE_H }}
          // Fixed black and white, not theme tokens: it has to match the store
          // badges beside it, which look the same on a light and a dark section.
          className={`${PRESSABLE} items-center gap-2.5 border border-[#a6a6a6] bg-black pl-3 pr-4 text-left text-white`}
        >
          <Globe size={24} strokeWidth={1.6} aria-hidden className="shrink-0" />
          <span className="flex flex-col leading-none">
            <span className="text-[9.5px] uppercase tracking-wide opacity-90">Use on the</span>
            <span className="mt-0.5 text-[18px] font-medium tracking-tight">Web</span>
          </span>
        </a>

        <a
          href={WEB_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={clicked('ios_web')}
          aria-label="iPhone and iPad: use the web version for now"
          className={`${PRESSABLE} relative`}
        >
          <Image
            src="/brand/app-store-badge.svg"
            alt=""
            width={APPLE_W}
            height={BADGE_H}
            // Next's optimiser refuses SVG unless the global dangerouslyAllowSVG
            // escape hatch is on; serving this one file as-is is safer than
            // loosening the rule for every remote image on the site.
            unoptimized
            style={{ height: BADGE_H, width: 'auto' }}
          />
          {/* Above the badge, not over it: at this length a corner tag would cover Apple's own lettering. */}
          <span className="absolute -right-2 -top-3.5 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent-ink">
            Use web for now
          </span>
        </a>
      </div>

      <a
        href={WEB_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={clicked('ios_web')}
        className="text-[13px] underline decoration-current/40 underline-offset-4 opacity-80 transition-opacity hover:opacity-100"
      >
        On iPhone? Use the web version for now
      </a>
    </div>
  );
}
