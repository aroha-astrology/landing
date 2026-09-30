'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AppCTA } from '@/components/ui/AppCTA';
import { Logo } from '@/components/ui/Logo';
import { PRODUCTS, PRODUCT_ORDER } from '@/lib/brand';

type NavItem = { href: string; label: string; soon?: boolean };

const NAV: NavItem[] = [
  ...PRODUCT_ORDER.map((k) => ({ href: PRODUCTS[k].path, label: PRODUCTS[k].short, soon: PRODUCTS[k].status === 'coming-soon' })),
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sticky top navigation. Five destinations, no mega-menu: the three
 * products (with their real status), the Knowledge Hub and About. On small
 * screens the same links live in a disclosure panel — the previous nav hid
 * them entirely below `lg`.
 *
 * There is no web login (the product is the mobile app), so the right-hand
 * action is "Get the app" rather than Login / Sign up.
 */
export function Navbar() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky z-50 border-b border-rule bg-paper/90 backdrop-blur-md" style={{ top: 'var(--app-banner-h, 0px)' }}>
      <nav aria-label="Main" className="mx-auto flex max-w-[1280px] items-center justify-between gap-5 px-[clamp(16px,4vw,56px)] py-3.5">
        <Link href="/" aria-label="Aroha home" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2 rounded-pill px-3.5 py-2 text-[14.5px] font-medium transition-colors ${
                    active ? 'bg-paper-sunk text-ink' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {item.label}
                  {item.soon && <span className="rounded-pill border border-rule-strong px-1.5 py-px text-[9.5px] font-bold uppercase tracking-[0.08em] text-ink-muted">Soon</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <div className="hidden sm:block">
            <AppCTA variant="solid" align="right" location="navbar" className="whitespace-nowrap !px-5 !py-2.5">
              Get the app
            </AppCTA>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div id="mobile-nav" hidden={!open} className="border-t border-rule bg-paper lg:hidden">
        <ul className="mx-auto flex max-w-[1280px] flex-col px-[clamp(16px,4vw,56px)] py-3">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                className="flex items-center justify-between border-b border-rule py-4 font-display text-2xl text-ink last:border-0"
              >
                {item.label}
                {item.soon && <span className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-ink-muted">Coming soon</span>}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,56px)] pb-6 sm:hidden">
          <AppCTA variant="solid" location="mobile_nav" className="w-full">
            Get the app
          </AppCTA>
        </div>
      </div>
    </header>
  );
}
