import Image from 'next/image';

/**
 * A real app screenshot in a quiet phone frame. Screenshots live in
 * /public/vastu as 560×1014 WebP (cropped above the app's bottom nav), so the
 * frame fixes that aspect ratio and next/image never has to guess.
 */
export function PhoneShot({
  src,
  alt,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border-[6px] border-[#1c1a22] bg-[#0f0e13] shadow-[0_24px_60px_-24px_rgba(20,16,8,0.45)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={560}
        height={1014}
        sizes="(min-width: 1024px) 300px, (min-width: 640px) 40vw, 72vw"
        priority={priority}
        className="block h-auto w-full"
      />
    </div>
  );
}
