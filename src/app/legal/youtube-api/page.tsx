import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';

/**
 * Notice for the YouTube API Services client Aroha uses to upload its own videos.
 *
 * Kept as its own page, not a section of /legal/privacy: that document is stamped on
 * every user's consent record and a new version re-prompts every user, while this
 * notice concerns a private publishing tool and processes no app user's data. The
 * Privacy Policy still governs the app.
 */

const UPDATED = '18 October 2026';
const GOOGLE_PRIVACY = 'http://www.google.com/policies/privacy';
const YOUTUBE_TERMS = 'https://www.youtube.com/t/terms';
const REVOKE_1 = 'https://security.google.com/settings/security/permissions';
const REVOKE_2 = 'https://myaccount.google.com/permissions';

export const metadata: Metadata = {
  title: 'YouTube API Services Notice',
  description:
    'How Aroha Astrology uses YouTube API Services to upload its own videos, what data is involved, and how access is revoked.',
  alternates: { canonical: '/legal/youtube-api' },
  // Reachable without a login for reviewers, like the other legal pages, but not a search result.
  robots: { index: false, follow: true },
};

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-accent-text hover:underline" target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default function YouTubeApiNotice() {
  return (
    <Section tone="paper">
      <article className="mx-auto max-w-3xl" data-no-translate>
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.1em] text-ink-muted">Legal</p>
          <h1 className="font-display mt-3 text-3xl font-medium leading-[1.15] text-ink sm:text-4xl md:text-5xl">
            YouTube API Services Notice
          </h1>
          <p className="mt-4 text-sm text-ink-muted">Last updated {UPDATED}</p>
        </header>

        <p className="text-lg leading-relaxed text-ink-2">
          Aroha Astrology uses YouTube API Services to upload its own videos to its own YouTube channel,
          Aroha Astro (@arohaastrology). This page explains that use. The{' '}
          <Link href="/legal/privacy" className="text-accent-text hover:underline">
            Privacy Policy
          </Link>{' '}
          continues to govern the Aroha Astrology app.
        </p>

        <div className="mt-10 space-y-9">
          <section>
            <h2 className="font-display text-xl font-medium text-ink">1. What we use the YouTube API for</h2>
            <div className="mt-3 space-y-3">
              <p className="leading-relaxed text-ink-2">
                A small internal tool prepares short educational videos about Vedic astrology. After a person at
                Aroha approves a video, the tool uploads it to the Aroha Astro channel with a title, description and
                tags. The tool has one user, the owner of the channel, and no public sign-in.
              </p>
              <p className="leading-relaxed text-ink-2">
                It uses two permissions from the owner&apos;s Google account: <em>youtube.upload</em> to upload
                videos, and <em>youtube.readonly</em> to read the channel&apos;s name and its list of videos.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">2. What data is involved</h2>
            <div className="mt-3 space-y-3">
              <p className="leading-relaxed text-ink-2">
                The only data we keep from Google is the authorisation (a refresh token) for the channel
                owner&apos;s account, held in a private file on our server that only the service can read. We read
                the channel&apos;s own name and video list. We do not collect, store or process any viewer,
                subscriber or comment data, and we do not receive any information about Aroha app users through
                YouTube.
              </p>
              <p className="leading-relaxed text-ink-2">
                We do not sell or share YouTube API data, and we do not use it for advertising.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">3. Google and YouTube terms</h2>
            <div className="mt-3 space-y-3">
              <p className="leading-relaxed text-ink-2">
                By using this tool you are also bound by the{' '}
                <A href={YOUTUBE_TERMS}>YouTube Terms of Service</A>. Google&apos;s handling of data is described in
                the <A href={GOOGLE_PRIVACY}>Google Privacy Policy</A>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">4. Revoking access and deleting data</h2>
            <div className="mt-3 space-y-3">
              <p className="leading-relaxed text-ink-2">
                The channel owner can revoke the tool&apos;s access to the Google account at any time in the{' '}
                <A href={REVOKE_1}>Google security settings</A> (also reachable at{' '}
                <A href={REVOKE_2}>myaccount.google.com/permissions</A>). Revoking stops all API access
                immediately. We delete the stored authorisation when access is revoked or when you ask us to.
              </p>
              <p className="leading-relaxed text-ink-2">
                To ask for deletion, or with any question about this notice, write to the Grievance Officer,
                Subir Dutta, at{' '}
                <a href="mailto:subir@arohaastrology.in" className="text-accent-text hover:underline">
                  subir@arohaastrology.in
                </a>
                .
              </p>
            </div>
          </section>
        </div>

        <nav className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6 text-sm">
          <Link href="/legal/privacy" className="text-accent-text hover:underline">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="text-accent-text hover:underline">
            Terms of Service
          </Link>
        </nav>
      </article>
    </Section>
  );
}
