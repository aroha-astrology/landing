import { Eyebrow } from './Eyebrow';

/**
 * Shared section header: an eyebrow over a Newsreader display headline.
 * Reveals once on scroll-into-view (CSS `.reveal`, see globals.css) so every
 * section opens the same way — and is fully visible in the server HTML.
 * Pass `dark` inside a night-tone Section; `as="h1"` only for page heroes.
 */
type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  // The design sets every section heading flush left against a 640px
  // measure — centred headings were the previous art direction.
  align = 'left',
  as = 'h2',
  className = '',
}: SectionHeadingProps) {
  const Heading = as;
  return (
    <div className={`reveal ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <Heading className="font-display text-3xl font-medium leading-[1.15] text-balance sm:text-4xl md:text-5xl">
        {title}
      </Heading>
      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg ${dark ? 'text-night-ink-2' : 'text-ink-2'} ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
