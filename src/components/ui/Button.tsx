'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

/**
 * The one interactive control on the page. `solid` is the indigo-fill
 * primary CTA; `outline` is the quieter secondary; `ghost` is for inline nav
 * links. Renders an anchor when given `href` (external links get
 * target=_blank automatically), otherwise a button.
 */
type Variant = 'solid' | 'outline' | 'ghost';

type CommonProps = {
  variant?: Variant;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<HTMLMotionProps<'button'>, 'href'> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  Omit<HTMLMotionProps<'a'>, 'href'> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper';

const VARIANTS: Record<Variant, string> = {
  // Ink on amber, not white — the accent is a light surface, so white text
  // sits around 2.3:1 against it.
  solid: 'bg-accent text-accent-ink hover:bg-accent-hover',
  outline: 'border border-ink/25 text-ink hover:border-accent hover:text-accent',
  ghost: 'px-2 py-1 text-ink-2 hover:text-accent',
};

export function Button({ variant = 'solid', className = '', children, ...props }: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsAnchor;
    const isExternal = /^https?:\/\//.test(href);
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={classes}
      {...(props as ButtonAsButton)}
    >
      {children}
    </motion.button>
  );
}
