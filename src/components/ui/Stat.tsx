type StatProps = {
  value: string;
  label: string;
  dark?: boolean;
};

/**
 * A single number+label, e.g. in the hero trust strip.
 *
 * The numeral is italic Newsreader in amber rather than the tabular
 * `font-data` treatment used for chart readouts — these are display figures
 * in a headline role, not data a reader scans and compares, and the design
 * sets them the same way in both the hero and the Precision section.
 * Left-aligned to sit in a flex row under the hero's hairline.
 */
export function Stat({ value, label, dark = false }: StatProps) {
  return (
    <div>
      <p
        className={`font-display text-[36px] italic leading-none ${
          dark ? 'text-night-accent' : 'text-accent'
        }`}
        data-no-translate
      >
        {value}
      </p>
      <p className={`mt-1 text-[13px] ${dark ? 'text-night-ink-2' : 'text-ink-muted'}`}>
        {label}
      </p>
    </div>
  );
}
