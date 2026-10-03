import Image from 'next/image';

import { PLAY_STORE_URL, WEB_APP_URL } from '@/lib/links';

/**
 * The official store badges, served locally from /public/brand — Google's
 * "Get it on Google Play" PNG and Apple's "Download on the App Store" SVG,
 * both pulled from the vendors' own badge endpoints. These are trademarked
 * marks: don't recolour, stretch, relabel or re-typeset them.
 *
 * Google ships its PNG with ~1/4-height transparent clear space baked in,
 * which would render it visibly smaller than Apple's edge-to-edge SVG at the
 * same CSS height. The padding was cropped off so the two share one optical
 * height, and the clear space Google's guidelines require is reproduced with
 * the flex `gap` instead.
 *
 * Android points at the live listing, Web opens the app in a browser. There is no iOS listing yet (see
 * links.ts), so the App Store badge is deliberately inert — dimmed, not an
 * anchor, and tagged "Coming soon" so nobody taps through to a dead page.
 */

// Intrinsic aspect ratios of the cropped artwork, so the widths below stay
// correct if the shared height changes.
const BADGE_H = 44;
const PLAY_W = Math.round((564 / 168) * BADGE_H);
const APPLE_W = Math.round((119.66407 / 40) * BADGE_H);

export function AppStoreBadges({
  align = 'center',
  className = '',
}: {
  align?: 'center' | 'start';
  className?: string;
}) {
  return (
    // No `data-no-translate` here: the brand wordmarks are baked into the
    // images (so the DOM walker can't touch them anyway), while "Coming soon"
    // below is real copy that should localise.
    <div
      className={`flex flex-wrap items-center gap-4 ${
        align === 'center' ? 'justify-center' : 'justify-start'
      } ${className}`}
    >
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-lg transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
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
        style={{ height: BADGE_H }}
        className="inline-flex items-center gap-2 rounded-lg border border-ink/30 bg-ink px-4 text-left text-paper transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-wide opacity-80">Use on the</span>
          <span className="text-[15px] font-semibold">Web</span>
        </span>
      </a>

      <div className="relative inline-flex">
        <Image
          src="/brand/app-store-badge.svg"
          alt="Download on the App Store"
          width={APPLE_W}
          height={BADGE_H}
          // Next's optimiser refuses SVG unless the global dangerouslyAllowSVG
          // escape hatch is on; serving this one file as-is is safer than
          // loosening the rule for every remote image on the site.
          unoptimized
          className="opacity-50"
          style={{ height: BADGE_H, width: 'auto' }}
        />
        <span className="absolute -right-2 -top-2 rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent-ink">
          Coming soon
        </span>
      </div>
    </div>
  );
}
