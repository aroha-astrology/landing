type StatProps = {
  value: string;
  label: string;
  dark?: boolean;
};

/** A single number+label, e.g. in a hero trust strip. Value renders in brass tabular numerals. */
export function Stat({ value, label, dark = false }: StatProps) {
  return (
    <div className="text-center">
      <p className="font-data text-2xl font-semibold sm:text-3xl" data-no-translate>
        {value}
      </p>
      <p className={`mt-1 text-xs uppercase tracking-wide ${dark ? 'text-night-ink-2' : 'text-ink-muted'}`}>
        {label}
      </p>
    </div>
  );
}
