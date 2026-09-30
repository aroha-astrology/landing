import Image from 'next/image';

/**
 * Real screens from Aroha products, supplied by the Aroha team (see
 * public/assets/LICENSES.md). Each carries its product status in the
 * caption so a preview of something in development never reads as shipped.
 */
export type AppShotEntry = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export const VASTU_INTERIORS_SHOTS = {
  floorPlan3d: {
    src: '/assets/vastu/aroha-vastu-interiors-3d-floor-plan.webp',
    width: 1080,
    height: 1920,
    alt: 'A phone screen showing a home floor plan in 3D, each zone tagged with its direction (N, NE, E, SE, S, SW, W, NW and the Centre), with 2D, 3D and Walk view buttons',
    caption: 'A floor plan in 3D, every zone tagged with its direction. Preview of Aroha Vastu, in development.',
  },
  bedScore: {
    src: '/assets/vastu/aroha-vastu-interiors-bed-vastu-score.webp',
    width: 1080,
    height: 1920,
    alt: 'A 3D double bed inside a bedroom with a direction ring around it and a card reading Double bed 15/100, under the words Is your home Vastu-right?',
    caption: 'Furniture placement scored against Vastu: here a bed at 15/100. Preview of Aroha Vastu, in development.',
  },
  livingRoom3d: {
    src: '/assets/vastu/aroha-vastu-interiors-3d-living-room.webp',
    width: 1920,
    height: 1080,
    alt: 'A furnished 3D living room with terracotta walls, a patterned green feature wall and a green sofa, beside the line Your home in 3D, before you change a thing',
    caption: 'A furnished room rendered in 3D. Preview of Aroha Vastu, in development.',
  },
} satisfies Record<string, AppShotEntry>;

type AppShotProps = {
  shot: AppShotEntry;
  sizes: string;
  tone?: 'paper' | 'sand' | 'dark';
  className?: string;
  priority?: boolean;
};

export function AppShot({ shot, sizes, tone = 'paper', className = '', priority = false }: AppShotProps) {
  const captionTone = tone === 'dark' ? 'text-night-ink-2' : tone === 'sand' ? 'text-vastu-ink-2' : 'text-ink-muted';
  return (
    <figure className={`not-prose ${className}`}>
      <Image
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full rounded-2xl border border-black/10 bg-night shadow-[0_30px_70px_-35px_rgba(20,19,16,0.55)]"
      />
      <figcaption className={`mt-3 text-sm leading-snug ${captionTone}`}>{shot.caption}</figcaption>
    </figure>
  );
}
