'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLAY_STORE_URL } from '@/lib/links';

/**
 * Every "get the app" CTA on the site opens this instead of linking straight
 * into the web app — there's no App Store listing yet, so Android gets the
 * real Play Store link and iOS is marked Coming soon rather than dead-ending.
 * Visually a drop-in replacement for Button (same base/variant classes);
 * `align` controls which edge the popover hangs from, since this gets used
 * both in tight corners (Navbar) and centered contexts (Hero, Footer). The
 * popover is then nudged back inside the viewport, because on phones a button
 * near the left edge would otherwise push a centered popover off-screen.
 */
type Variant = 'solid' | 'outline';
type Align = 'center' | 'right';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper';

const VARIANTS: Record<Variant, string> = {
  // Ink on amber, not white — the accent is a light surface, so white text
  // sits around 2.3:1 against it.
  solid: 'bg-accent text-accent-ink hover:bg-accent-hover',
  outline: 'border border-ink/25 text-ink hover:border-accent hover:text-accent',
};

// Minimum gap between the popover and either side of the viewport.
const VIEWPORT_GUTTER = 16;

export function AppCTA({
  variant = 'solid',
  align = 'center',
  className = '',
  children,
}: {
  variant?: Variant;
  align?: Align;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState<number>();
  const ref = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Position in px relative to the button, before paint, so there's no jump.
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const anchor = ref.current;
      const popover = popoverRef.current;
      if (!anchor || !popover) return;
      const box = anchor.getBoundingClientRect();
      const width = popover.offsetWidth;
      const preferred = align === 'right' ? box.width - width : (box.width - width) / 2;
      const min = VIEWPORT_GUTTER - box.left;
      const max = document.documentElement.clientWidth - VIEWPORT_GUTTER - width - box.left;
      setLeft(Math.max(min, Math.min(preferred, max)));
    }
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, align]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${BASE} ${VARIANTS[variant]} ${className}`}
      >
        {children}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popoverRef}
            style={{ left }}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-rule bg-paper-raised p-1.5 text-left shadow-[0_18px_40px_rgba(20,20,24,0.18)]`}
            data-no-translate
          >
            <div className="j-eyebrow border-b border-rule px-2.5 py-1.5 text-[10px] font-bold">
              Get the app
            </div>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 transition-colors hover:bg-paper-sunk"
            >
              <span className="text-[13px] font-semibold text-ink">Android</span>
              <span className="text-[10px] uppercase tracking-wide text-ink-muted">Play Store</span>
            </a>
            <div className="flex w-full cursor-not-allowed items-center justify-between rounded-lg px-2.5 py-2.5 opacity-50">
              <span className="text-[13px] font-semibold text-ink">iOS</span>
              <span className="text-[10px] uppercase tracking-wide text-ink-muted">Coming soon</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
