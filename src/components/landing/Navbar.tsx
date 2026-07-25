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
 * Sticky top navigation on the light paper surface. A translucent paper fill
 * plus backdrop-blur (not solid) so content scrolling underneath still reads
 * as "paper behind frosted glass" rather than a hard-edged bar.
 */
export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-rule bg-paper/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-[clamp(20px,4vw,56px)] py-4">
        <a href="/" aria-label="Aroha home">
          <Logo />
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink transition-colors hover:text-accent"
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
