import Image from 'next/image';

type LogoProps = {
  dark?: boolean;
  className?: string;
};

/**
 * The real Aroha emblem — the same artwork the app ships (copied from the
 * frontend repo into /public/brand), not a redrawn approximation.
 *
 * The emblem is a filled disc rather than a transparent glyph, so the variant
 * has to contrast with the surface *behind* it: night sections get the cream
 * disc, the light paper surface gets the navy one. Swapping these makes the
 * mark sink into its own background.
 */
export function Logo({ dark = false, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} data-no-translate>
      <Image
        src={dark ? '/brand/aroha-logo-cream.png' : '/brand/aroha-logo-navy.png'}
        // Decorative: the adjacent "Aroha" wordmark already names the brand,
        // and each call site wraps this in an aria-labelled link.
        alt=""
        width={34}
        height={34}
        // The light variant is the navbar mark, which is above the fold;
        // the dark one only ever renders down in the footer.
        priority={!dark}
        className="h-[34px] w-[34px]"
      />
      <span className={`font-display text-xl font-medium ${dark ? 'text-night-ink' : 'text-ink'}`}>
        Aroha
      </span>
    </span>
  );
}
