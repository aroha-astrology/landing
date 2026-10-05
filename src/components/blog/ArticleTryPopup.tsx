'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { track } from '@/lib/analytics';
import { PLAY_STORE_URL, WEB_APP_URL } from '@/lib/links';
import type { ArticlePrompt } from '@/lib/article-prompts';

// A visitor sees this at most twice in total, never twice in one visit, and
// never again once they have tapped through. Stored locally; if storage is
// blocked the pop-up simply does not show.
const KEY = 'aroha_article_prompt';
const MAX_SHOWS = 2;
const TRIGGER_AT = 0.4; // fraction of the article read

type State = { shown: number; done: boolean };

function readState(): State | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as State) : { shown: 0, done: false };
  } catch {
    return null;
  }
}

function writeState(state: State) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage blocked, nothing to do */
  }
}

export function ArticleTryPopup({ slug, targetId, prompt }: { slug: string; targetId: string; prompt: ArticlePrompt }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const state = readState();
    if (!state || state.done || state.shown >= MAX_SHOWS) return;
    const el = document.getElementById(targetId);
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const read = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height));
      if (read < TRIGGER_AT) return;
      window.removeEventListener('scroll', onScroll);
      const latest = readState();
      if (!latest || latest.done || latest.shown >= MAX_SHOWS) return;
      writeState({ ...latest, shown: latest.shown + 1 });
      opener.current = document.activeElement;
      setOpen(true);
      track('article_app_prompt', { slug, action: 'shown' });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug, targetId]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function dismiss() {
    setOpen(false);
    track('article_app_prompt', { slug, action: 'dismissed' });
    if (opener.current instanceof HTMLElement) opener.current.focus();
  }

  function tappedThrough(store: 'google_play' | 'web') {
    const latest = readState();
    if (latest) writeState({ ...latest, done: true });
    track('app_store_click', { store, location: 'article_popup' });
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <div className="absolute inset-0 bg-ink/45" onClick={dismiss} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-try-title"
        className="relative w-full max-w-md rounded-3xl border border-rule bg-paper-raised p-6 shadow-[0_24px_60px_rgba(20,20,24,0.28)] sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-paper-sunk hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span aria-hidden className="text-xl leading-none">×</span>
        </button>
        <p id="article-try-title" className="font-display pr-8 text-2xl leading-snug text-ink">{prompt.line}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{prompt.sub}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={WEB_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => tappedThrough('web')}
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-accent-ink transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Open in your browser
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => tappedThrough('google_play')}
            className="inline-flex rounded-lg transition-opacity hover:opacity-85 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <Image src="/brand/google-play-badge.png" alt="Get it on Google Play" width={148} height={44} style={{ height: 44, width: 'auto' }} />
          </a>
        </div>
        <button type="button" onClick={dismiss} className="mt-5 text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
          Keep reading
        </button>
      </div>
    </div>
  );
}
