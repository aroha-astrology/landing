type EyebrowProps = {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
};

/** Small uppercase label above a heading. Pass `dark` inside a night-tone Section. */
export function Eyebrow({ children, dark = false, className = '' }: EyebrowProps) {
  return (
    <p
      className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${
        dark ? 'text-night-accent' : 'text-accent'
      } ${className}`}
    >
      {children}
    </p>
  );
}
