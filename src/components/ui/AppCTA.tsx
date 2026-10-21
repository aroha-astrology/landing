"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PLAY_STORE_URL, WEB_APP_URL } from "@/lib/links";
import { track } from "@/lib/analytics";

/**
 * Every "get the app" CTA on the site opens this picker: Android (Play Store),
 * Web (the app in a browser) and iOS, marked Coming soon since there's no App
 * Store listing yet.
 * Visually a drop-in replacement for Button (same base/variant classes);
 * `align` controls which edge the popover hangs from, since this gets used
 * both in tight corners (Navbar) and centered contexts (Hero, Footer). The
 * popover is then nudged back inside the viewport, because on phones a button
 * near the left edge would otherwise push a centered popover off-screen.
 *
 * The popover is portalled to <body> with fixed positioning: heroes and
 * section wrappers use overflow-hidden for their backgrounds, and an
 * absolutely positioned child would be clipped by them.
 */
type Variant = "solid" | "outline" | "link";
type Align = "center" | "right";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

// "link" reads as a text link inside article prose, so it skips BASE.
const LINK_CLASS =
  "cursor-pointer text-link underline underline-offset-4 hover:text-accent-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const VARIANTS: Record<Variant, string> = {
  link: "",
  // Ink on amber, not white — the accent is a light surface, so white text
  // sits around 2.3:1 against it.
  solid: "bg-accent text-accent-ink hover:bg-accent-hover",
  outline:
    "border border-ink/25 text-ink hover:border-accent hover:text-accent-text",
};

// Minimum gap between the popover and either side of the viewport.
const VIEWPORT_GUTTER = 16;

export function AppCTA({
  variant = "solid",
  align = "center",
  className = "",
  location = "unknown",
  children,
}: {
  variant?: Variant;
  align?: Align;
  className?: string;
  /** Where on the site this CTA sits, for the app_store_click event. */
  location?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number }>();
  const ref = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  // A <div> inside article prose (<p>) is invalid HTML and breaks hydration.
  const Wrapper = (variant === "link" ? "span" : "div") as "div";

  // Position in viewport px, before paint, so there's no jump; follows the
  // button on scroll and resize while open.
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const anchor = ref.current;
      const popover = popoverRef.current;
      if (!anchor || !popover) return;
      const box = anchor.getBoundingClientRect();
      const width = popover.offsetWidth;
      const preferred =
        align === "right"
          ? box.right - width
          : box.left + (box.width - width) / 2;
      const max =
        document.documentElement.clientWidth - VIEWPORT_GUTTER - width;
      setPos({
        left: Math.max(VIEWPORT_GUTTER, Math.min(preferred, max)),
        top: box.bottom + 8,
      });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    };
  }, [open, align]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (ref.current?.contains(t) || popoverRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <Wrapper className="relative inline-block" ref={ref}>
      {variant === "link" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`${LINK_CLASS} ${className}`}
        >
          {children}
        </button>
      ) : (
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`${BASE} ${VARIANTS[variant]} ${className}`}
        >
          {children}
        </motion.button>
      )}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={popoverRef}
                style={{ left: pos?.left ?? -9999, top: pos?.top ?? -9999 }}
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed z-[80] w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-rule bg-paper-raised p-1.5 text-left shadow-[0_18px_40px_rgba(20,20,24,0.18)]`}
                data-no-translate
              >
                <div className="j-eyebrow border-b border-rule px-2.5 py-1.5 text-[10px] font-bold">
                  Get the app
                </div>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("app_store_click", { store: "google_play", location })
                  }
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 transition-colors hover:bg-paper-sunk"
                >
                  <span className="text-[13px] font-semibold text-ink">
                    Android
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-ink-muted">
                    Play Store
                  </span>
                </a>
                <a
                  href={WEB_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("app_store_click", { store: "web", location })}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 transition-colors hover:bg-paper-sunk"
                >
                  <span className="text-[13px] font-semibold text-ink">Web</span>
                  <span className="text-[10px] uppercase tracking-wide text-ink-muted">
                    Open in browser
                  </span>
                </a>
                {/* No iOS listing yet (see links.ts): an iPhone visitor is sent to the web app. */}
                <a
                  href={WEB_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("app_store_click", { store: "ios_web", location })}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 transition-colors hover:bg-paper-sunk"
                >
                  <span className="text-[13px] font-semibold text-ink">
                    iOS
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-ink-muted">
                    Use web for now
                  </span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </Wrapper>
  );
}
