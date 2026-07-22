type LogoProps = {
  dark?: boolean;
  className?: string;
};

/**
 * Icon mark + wordmark. The mark is the same chart-wheel motif as the
 * favicon (src/app/icon.svg) drawn inline instead of filled/backgrounded,
 * so it sits transparently on either the light navbar or the dark footer —
 * `dark` swaps the ring/spoke stroke color; the center dot stays accent
 * indigo either way since that reads fine on both surfaces.
 */
export function Logo({ dark = false, className = '' }: LogoProps) {
  const stroke = dark ? 'var(--night-ink)' : 'var(--ink)';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} data-no-translate>
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
        <circle cx="16" cy="16" r="12" fill="none" stroke={stroke} strokeWidth="2.25" />
        <path
          d="M16 5 L16 27 M5 16 L27 16 M8.5 8.5 L23.5 23.5 M23.5 8.5 L8.5 23.5"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="3.25" fill="var(--accent)" />
      </svg>
      <span className={`font-display text-xl font-medium ${dark ? 'text-night-ink' : 'text-ink'}`}>
        Aroha
      </span>
    </span>
  );
}
