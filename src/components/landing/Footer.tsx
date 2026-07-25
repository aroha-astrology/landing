import { AppStoreBadges } from '@/components/ui/AppStoreBadges';
import { Logo } from '@/components/ui/Logo';
import { LINKS } from '@/lib/links';

const PRODUCT_LINKS: { href: string; label: string }[] = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#navagraha', label: 'Navagraha' },
  { href: '#precision', label: 'Our method' },
  { href: '#moon-sign', label: 'Moon sign tool' },
  { href: '#languages', label: 'Languages' },
  { href: '#faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
];

const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: LINKS.privacy, label: 'Privacy' },
  { href: LINKS.terms, label: 'Terms' },
  { href: LINKS.disclaimer, label: 'Disclaimer' },
];

/**
 * Closing dark band. Deliberately doesn't re-embed LanguageSwitcher (it's
 * styled for the light navbar) — just points people back up to the nav for it.
 */
export function Footer() {
  return (
    <footer className="bg-night px-[clamp(20px,4vw,56px)] pb-8 pt-[clamp(56px,7vw,80px)] text-night-ink">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-night-rule pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <a href="/" aria-label="Aroha home">
              <Logo dark />
            </a>
            <p className="mt-3 max-w-xs text-sm text-night-ink-2">
              Vedic astrology backed by Swiss Ephemeris precision, explained in plain language.
              You can change your language any time from the switcher in the navigation bar above.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-night-ink-2">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-night-ink-2 transition-colors hover:text-night-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-night-ink-2">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-night-ink-2 transition-colors hover:text-night-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-night-ink-2">
              Get started
            </h3>
            <p className="mt-4 max-w-xs text-sm text-night-ink-2">
              Your chart takes a minute to generate, no cost to see it.
            </p>
            <AppStoreBadges align="start" className="mt-4" />
          </div>
        </div>

        <div className="pt-6 text-xs text-night-ink-2">
          <span data-no-translate>© {new Date().getFullYear()} Aroha Astrology</span>
        </div>
      </div>
    </footer>
  );
}
