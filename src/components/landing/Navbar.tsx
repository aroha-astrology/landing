import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AppCTA } from '@/components/ui/AppCTA';
import { Logo } from '@/components/ui/Logo';

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#moon-sign', label: 'Moon sign tool' },
  { href: '#languages', label: 'Languages' },
  { href: '#faq', label: 'FAQ' },
];

/**
 * Sticky top navigation on the light paper surface. A single hairline keeps
 * it grounded — no scroll-state JS needed for a bar this simple.
 */
export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <a href="/" aria-label="Aroha home">
          <Logo />
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-2 transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <AppCTA variant="solid" align="right" className="hidden sm:inline-flex">
            Get my free chart
          </AppCTA>
        </div>
      </div>
    </nav>
  );
}
