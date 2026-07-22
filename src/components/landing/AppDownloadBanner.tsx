'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const DISMISS_KEY = 'app_banner_dismissed_until';
const DISMISS_DAYS = 7;
const APK_URL = '/downloads/aroha-astrology.apk';
const APP_PACKAGE = 'com.aroha.astrology';

type Platform = 'android' | 'ios' | null;

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'android';
  if (/iPad|iPhone|iPod/i.test(ua)) return 'ios';
  return null;
}

function shouldHide(platform: Platform): boolean {
  if (typeof window === 'undefined') return true;

  // Already inside the native app.
  if ((window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.())
    return true;

  // Running as an installed PWA in standalone mode.
  if (window.matchMedia('(display-mode: standalone)').matches) return true;

  // Desktop — no mobile app relevant here.
  if (!platform) return true;

  // User dismissed recently.
  const until = localStorage.getItem(DISMISS_KEY);
  if (until && Date.now() < Number(until)) return true;

  return false;
}

// Opens the installed app if present; falls back to the APK download.
function intentUrl(path: string) {
  const host = window.location.hostname;
  return `intent://${host}${path}#Intent;scheme=https;package=${APP_PACKAGE};S.browser_fallback_url=${encodeURIComponent(APK_URL)};end`;
}

/**
 * Fixed top banner offering the app: a real install for Android (APK, since
 * there's no Play Store listing yet), "Coming soon" for iOS. Auto-shows on
 * mobile web only — hides itself inside the Capacitor app shell or an
 * installed PWA, and desktop entirely. Sets `--app-banner-h` so the fixed
 * Navbar and page content shift down while it's visible.
 */
export function AppDownloadBanner() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const detected = detectPlatform();
    setPlatform(detected);
    if (!shouldHide(detected)) {
      setVisible(true);
      document.documentElement.style.setProperty('--app-banner-h', '56px');
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      document.documentElement.style.removeProperty('--app-banner-h');
    }
  }, [visible]);

  function dismiss() {
    const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
    setVisible(false);
  }

  if (!visible || !platform) return null;

  return (
    <div
      className="fixed top-0 inset-x-0 z-[100] flex items-center gap-3 px-3 py-2.5 border-b"
      style={{ background: 'var(--paper)', borderColor: 'var(--rule)' }}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 transition-colors"
      >
        <X size={14} />
      </button>

      {/* The real app icon, not a generic phone glyph — this banner is
          imitating an install prompt, so it should show what the store shows. */}
      <Image
        src="/brand/aroha-logo-navy.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 flex-shrink-0 rounded-xl"
      />

      <div className="flex-1 min-w-0">
        <p data-no-translate className="text-[13px] font-semibold text-ink leading-tight">
          Aroha Astrology
        </p>
        <p className="text-[11px] text-ink-muted leading-tight truncate">
          {platform === 'android' ? 'Get the app — faster & offline' : 'iPhone app — coming soon'}
        </p>
      </div>

      <div className="flex gap-1.5 flex-shrink-0" data-no-translate>
        {platform === 'android' ? (
          <>
            <a
              href={intentUrl(window.location.pathname)}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold no-underline border border-accent/50 text-accent"
            >
              Open
            </a>
            <a
              href={APK_URL}
              download
              className="px-3 py-1.5 rounded-full text-[12px] font-bold no-underline bg-accent text-white"
            >
              Install
            </a>
          </>
        ) : (
          <span className="px-3 py-1.5 rounded-full text-[12px] font-semibold border border-accent/25 text-ink-muted opacity-70">
            Coming soon
          </span>
        )}
      </div>
    </div>
  );
}
