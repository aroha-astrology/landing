'use client';

import { useEffect, useState } from 'react';
import { Instagram, Youtube, Twitter } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const NAV_LINKS = ['Horoscope', 'Panchang', 'Astrologers'];

/**
 * Fixed top navigation. Transparent over the hero, then fades to a thin glass
 * bar once the user scrolls — keeps the brand + language switcher always reachable.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-[var(--app-banner-h,0px)] z-40 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-primary/20 bg-[#0a0616]/70 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Brand — never translated. */}
        <a
          href="#"
          data-no-translate
          className="font-cinzel text-2xl font-bold tracking-wide text-primary-ink"
        >
          Aroha
        </a>

        {/* Center links — visible text auto-translates via TranslationProvider. */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-sm font-medium tracking-wide text-text-2 transition-colors hover:text-primary-ink"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex" data-no-translate>
            {[Instagram, Youtube, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={Icon.displayName ?? 'social'}
                className="text-text-muted transition-colors hover:text-primary-ink"
              >
                <Icon size={18} strokeWidth={1.75} />
              </a>
            ))}
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
