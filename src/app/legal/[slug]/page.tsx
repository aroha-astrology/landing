import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { LEGAL_DOCS, LEGAL_UPDATED, LEGAL_VERSION, type LegalDoc } from '@/lib/legal-content';

/**
 * Public home of the Terms, Privacy Policy and Astrology & AI Disclaimer.
 *
 * These URLs are what the Play Store listing's privacy-policy field and the
 * backend's GET /legal/current point at, and they must resolve without a
 * login: a reviewer will not install the app to read the policy, and a DPDP
 * §5 notice has to be available to someone who is not a user. Until this
 * route existed, arohaastrology.in/legal/* 404'd while the same documents
 * rendered fine inside the app.
 *
 * Statically generated — the text is a build-time constant, so there is no
 * reason for a legal page to depend on the API being up.
 */

type PageProps = { params: Promise<{ slug: string }> };

const SLUGS = Object.keys(LEGAL_DOCS) as LegalDoc['slug'][];

const DESCRIPTIONS: Record<LegalDoc['slug'], string> = {
  terms: 'The terms governing your use of Aroha Astrology.',
  privacy:
    'How Aroha Astrology collects, uses, and protects your personal data, under the Digital Personal Data Protection Act, 2023.',
  disclaimer:
    'What astrology and AI-generated readings on Aroha Astrology are — and what they are not.',
};

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug as LegalDoc['slug']];
  if (!doc) return {};

  const title = `${doc.title} — Aroha Astrology`;
  const description = DESCRIPTIONS[doc.slug];

  return {
    title,
    description,
    alternates: { canonical: `/legal/${doc.slug}` },
    openGraph: { type: 'article', title, description, url: `/legal/${doc.slug}` },
  };
}

export default async function LegalDocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug as LegalDoc['slug']];
  if (!doc) notFound();

  const others = SLUGS.filter((s) => s !== doc.slug);

  return (
    <Section tone="paper">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.1em] text-ink-muted">Legal</p>
          <h1 className="font-display mt-3 text-3xl font-medium leading-[1.15] text-ink sm:text-4xl md:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Version {LEGAL_VERSION} · Last updated {LEGAL_UPDATED}
          </p>
        </header>

        <p className="text-lg leading-relaxed text-ink-2">{doc.intro}</p>

        <div className="mt-10 space-y-9">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-medium text-ink">{section.heading}</h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="leading-relaxed text-ink-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <nav className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6 text-sm">
          {others.map((s) => (
            <Link key={s} href={`/legal/${s}`} className="text-accent hover:underline">
              {LEGAL_DOCS[s].title}
            </Link>
          ))}
          <Link href="/delete-account" className="text-accent hover:underline">
            Delete your account
          </Link>
        </nav>
      </article>
    </Section>
  );
}
