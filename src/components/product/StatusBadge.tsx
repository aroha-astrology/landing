import type { ProductStatus } from '@/lib/brand';
import { statusLabel } from '@/lib/brand';

/** "Available now" / "Coming soon" — always real text, never only colour. */
export function StatusBadge({ status, tone = 'paper', className = '' }: { status: ProductStatus; tone?: 'paper' | 'dark'; className?: string }) {
  const available = status === 'available';
  const dark = tone === 'dark';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${
        available
          ? dark
            ? 'bg-[#1F3B2A] text-[#A8E0B8]'
            : 'bg-[#E3F1E6] text-[#23633A]'
          : dark
            ? 'border border-night-rule text-night-ink-2'
            : 'border border-rule-strong text-ink-2'
      } ${className}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-current' : 'bg-accent'}`} />
      {statusLabel(status)}
    </span>
  );
}
