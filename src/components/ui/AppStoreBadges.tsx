import { PLAY_STORE_URL } from '@/lib/links';

/**
 * Real, always-visible download badges (not a hidden dropdown) — Android
 * links to the live Play Store listing; iOS has no store listing yet, so
 * it's shown at reduced opacity with a "Coming soon" tag rather than as a
 * dead link. Icons are clean custom marks (not the exact trademarked
 * artwork) styled to read the same way the official badges do.
 */
const BADGE_BASE =
  'flex h-14 items-center gap-3 rounded-xl bg-[#111114] px-4 text-left transition-opacity';

export function AppStoreBadges({
  align = 'center',
  className = '',
}: {
  align?: 'center' | 'start';
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${align === 'center' ? 'justify-center' : 'justify-start'} ${className}`}
      data-no-translate
    >
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BADGE_BASE} hover:opacity-90`}
      >
        <svg width="26" height="26" viewBox="0 0 22 24" aria-hidden>
          <defs>
            <linearGradient id="play-badge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D08A" />
              <stop offset="50%" stopColor="#FFCE00" />
              <stop offset="100%" stopColor="#EF4141" />
            </linearGradient>
          </defs>
          <path d="M4 2 L19 12 L4 22 Z" fill="url(#play-badge-grad)" />
        </svg>
        <span className="leading-tight">
          <span className="block text-[10px] uppercase tracking-wide text-white/70">Get it on</span>
          <span className="block text-base font-semibold text-white">Google Play</span>
        </span>
      </a>

      <div className={`${BADGE_BASE} relative opacity-60`} aria-disabled="true">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#FFFFFF"
            transform="translate(0 -2) scale(0.85)"
          />
          <rect x="11" y="1" width="2" height="4" rx="1" fill="#FFFFFF" />
        </svg>
        <span className="leading-tight">
          <span className="block text-[10px] uppercase tracking-wide text-white/70">Download on the</span>
          <span className="block text-base font-semibold text-white">App Store</span>
        </span>
        <span className="absolute -top-2 -right-2 rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
          Coming soon
        </span>
      </div>
    </div>
  );
}
