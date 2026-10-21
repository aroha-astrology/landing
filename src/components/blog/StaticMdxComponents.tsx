import type { AnchorHTMLAttributes } from 'react';
import { mdxComponents } from './MdxComponents';
import { VASTU_INTERIORS_SHOTS } from '@/components/ui/AppShot';

/**
 * The article components for a translated article that is rendered to a plain HTML string (see
 * app/blog-i18n). Same markup as MdxComponents, except where that uses next/image or the client-side
 * app picker, which cannot be rendered outside a React page: images become plain <img> tags
 * and the Play Store link a plain link.
 */

function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-8">
      <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl border border-rule bg-paper-sunk">
        <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-8" />
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-ink-muted">{caption}</figcaption>}
    </figure>
  );
}

function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-10">
      <div className="mx-auto w-[64%] max-w-[280px] overflow-hidden rounded-[26px] border-[6px] border-[#1c1a22] bg-[#0f0e13]">
        <img src={src} alt={alt} width={560} height={1014} loading="lazy" className="block h-auto w-full" />
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-ink-muted">{caption}</figcaption>}
    </figure>
  );
}

function AppScreen({ name }: { name: keyof typeof VASTU_INTERIORS_SHOTS }) {
  const shot = VASTU_INTERIORS_SHOTS[name];
  if (!shot) return null;
  const portrait = shot.height > shot.width;
  return (
    <figure className={`not-prose mx-auto my-10 w-full ${portrait ? 'max-w-[300px]' : ''}`}>
      <img
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        loading="lazy"
        className="h-auto w-full rounded-2xl border border-black/10 bg-night shadow-[0_30px_70px_-35px_rgba(20,19,16,0.55)]"
      />
      <figcaption className="mt-3 text-sm leading-snug text-ink-muted">{shot.caption}</figcaption>
    </figure>
  );
}

export const staticMdxComponents = {
  ...mdxComponents,
  Figure,
  Screenshot,
  AppScreen,
  a: ({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
};
