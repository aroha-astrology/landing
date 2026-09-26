import type { ImgHTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';

/**
 * An inline illustrated figure for a post body — `<Figure src="/planets/mars.png"
 * alt="..." caption="..." />` inside an .mdx file. Distinct from the post
 * hero: this is for a mid-article image breaking up a long explanation,
 * not the header art.
 */
function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-8">
      <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl border border-rule bg-paper-sunk">
        <Image src={src} alt={alt} fill sizes="384px" className="object-contain p-8" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-ink-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

/**
 * A phone screenshot from the app inside a post — `<Screenshot
 * src="/vastu/fix-this.webp" alt="..." caption="..." />`. Figure's 4:3
 * contain box would shrink a tall 9:19 screenshot to a thumbnail, so this
 * sizes by width instead (560×1014 WebP, see components/ui/PhoneShot).
 */
function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-10">
      <div className="mx-auto w-[64%] max-w-[280px] overflow-hidden rounded-[26px] border-[6px] border-[#1c1a22] bg-[#0f0e13]">
        <Image src={src} alt={alt} width={560} height={1014} sizes="280px" className="block h-auto w-full" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-ink-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

/**
 * A boxed aside for the "different traditions disagree here" / "this is not
 * a deterministic prediction" notes that already appear as plain paragraphs
 * throughout the blog's house voice (see docs/superpowers/plans/2026-08-31-
 * blog-content-expansion.md's accuracy guardrails) — gives them visual
 * weight without changing what they say. `tone="note"` (default) is neutral;
 * `tone="caution"` for the "don't take this as a deterministic outcome"
 * style callouts.
 */
function Callout({
  children,
  tone = 'note',
}: {
  children: ReactNode;
  tone?: 'note' | 'caution';
}) {
  const toneClasses =
    tone === 'caution'
      ? 'border-accent/40 bg-accent-soft'
      : 'border-rule bg-paper-sunk';
  return (
    <div className={`my-6 rounded-xl border px-5 py-4 text-[15px] leading-relaxed text-ink-2 ${toneClasses}`}>
      {children}
    </div>
  );
}

// Typed structurally against MDXRemote's own `components` prop
// (React.ComponentProps<typeof MDXProvider>['components']) at the call site
// in blog/[slug]/page.tsx, rather than importing a separate types package.
export const mdxComponents = {
  Figure,
  Screenshot,
  Callout,
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt is required on MDX ! [alt](src) syntax and passed through in props
    <span className="my-8 block">
      {/* next/image needs known dimensions or `fill`; MDX's plain
          ![]() syntax gives neither, so this stays a plain <img> with
          native lazy-loading rather than fighting the API for a rare
          case — use <Figure> from within a post for a sized, styled image. */}
      <img {...props} loading="lazy" className="mx-auto max-w-full rounded-2xl border border-rule" />
    </span>
  ),
};
