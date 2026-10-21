import Link from 'next/link';
import { AppStoreBadges } from '@/components/ui/AppStoreBadges';
import { Logo } from '@/components/ui/Logo';
import { BRAND, PRODUCTS, PRODUCT_ORDER, statusLabel } from '@/lib/brand';
import { LINKS } from '@/lib/links';

type FooterLink = { href: string; label: string; note?: string };

const EXPLORE: FooterLink[] = [
  { href: '/blog', label: 'Knowledge Hub' },
  { href: '/blog/astrology', label: 'Astrology articles' },
  { href: '/blog/vastu', label: 'Vastu articles' },
  { href: '/blog/puja', label: 'Puja articles' },
  { href: '/kundli', label: 'Free Kundli' },
  { href: '/panchang', label: 'Today’s Panchang' },
  { href: '/moon-sign', label: 'Moon sign calculator' },
];

const COMPANY: FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/editorial-standards', label: 'Editorial standards' },
  { href: LINKS.support, label: 'Contact & support' },
  { href: LINKS.privacy, label: 'Privacy' },
  { href: LINKS.terms, label: 'Terms' },
  { href: LINKS.disclaimer, label: 'Disclaimer' },
  { href: LINKS.deleteAccount, label: 'Delete account' },
];

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-night-ink-2">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-night-ink-2 transition-colors hover:text-night-ink">
              {l.label}
              {l.note && <span className="ml-1.5 text-night-ink-2/70">· {l.note}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Closing dark band. Lists the ecosystem with each product's real status,
 * so the footer on every page answers "what is Aroha and what's available"
 * in plain, crawlable links. Social links are omitted until official
 * accounts exist — the Play Store listing is the only official channel.
 */
export function Footer() {
  const products: FooterLink[] = PRODUCT_ORDER.map((k) => ({
    href: PRODUCTS[k].path,
    label: PRODUCTS[k].name,
    note: PRODUCTS[k].status === 'available' ? undefined : statusLabel(PRODUCTS[k].status),
  }));
  return (
    <footer className="bg-night px-[clamp(20px,4vw,56px)] pb-8 pt-[clamp(56px,7vw,88px)] text-night-ink">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-12 border-b border-night-rule pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Aroha home">
              <Logo dark />
            </Link>
            <p className="font-display mt-5 text-2xl text-night-ink">{BRAND.tagline}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-night-ink-2">
              {`Aroha brings Vedic astrology, Vastu and puja together. ${PRODUCTS.astrology.name} is available now on Android and the web.`}
            </p>
            <AppStoreBadges align="start" className="mt-6" location="footer" />
          </div>
          <Column title="Products" links={products} />
          <Column title="Explore" links={EXPLORE} />
          <Column title="Company" links={COMPANY} />
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-night-ink-2 sm:flex-row sm:items-center sm:justify-between">
          <span data-no-translate>
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.city}, India
          </span>
          <span>Astrology, Vastu and puja are traditional practices. Use our guidance for reflection, and ask a professional for advice.</span>
        </div>
      </div>
    </footer>
  );
}
