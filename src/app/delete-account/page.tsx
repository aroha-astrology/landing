import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { PLAY_STORE_URL } from '@/lib/links';

/**
 * Google Play requires an account-deletion request URL that is reachable
 * WITHOUT installing the app — in-app deletion alone does not satisfy it,
 * because someone who has already uninstalled must still be able to ask.
 * This page is that URL; it is also the manual channel referenced by
 * Privacy Policy §6 for erasing the retained account shell.
 *
 * Deliberately static: no form, no backend. An instructions page plus a
 * working request channel is what the requirement asks for, and a bespoke
 * deletion-request pipeline would be a second, less-tested path into the
 * same operation the app already performs correctly.
 *
 * The description of what is deleted MUST stay in step with Privacy Policy
 * §6 (frontend/lib/legal-content.ts). If you change one, change both.
 */

const GRIEVANCE_EMAIL = 'subir@arohaastrology.in';

export const metadata: Metadata = {
  title: 'Delete Your Account — Aroha Astrology',
  description:
    'How to delete your Aroha Astrology account and what happens to your data when you do.',
  alternates: { canonical: '/delete-account' },
};

export default function DeleteAccountPage() {
  return (
    <Section tone="paper">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.1em] text-ink-muted">
            Your data
          </p>
          <h1 className="font-display mt-3 text-3xl font-medium leading-[1.15] text-ink sm:text-4xl md:text-5xl">
            Delete your account
          </h1>
          <p className="mt-4 text-lg text-ink-2">
            You can delete your Aroha Astrology account and its data at any time. You do not need
            to contact us first, and you do not need to give a reason.
          </p>
        </header>

        <div className="space-y-9">
          <section>
            <h2 className="font-display text-xl font-medium text-ink">From inside the app</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-ink-2">
              <li>Open Aroha Astrology and sign in.</li>
              <li>
                Go to <strong className="font-medium text-ink">Settings</strong>.
              </li>
              <li>
                Tap <strong className="font-medium text-ink">Delete Account</strong> and confirm.
              </li>
            </ol>
            <p className="mt-3 leading-relaxed text-ink-2">
              This submits a deletion request, which we review before acting on it — normally
              within three to seven business days. Nothing is erased until then, so your account
              keeps working, though we stop sending you notifications and stop generating new
              readings from the moment you ask. You can also request a copy of everything we hold
              on you first — write to the Grievance Officer before confirming deletion.
            </p>
            <p className="mt-4">
              <Link href={PLAY_STORE_URL} className="text-accent hover:underline">
                Open the app
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">
              If you no longer have the app
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Email our Grievance Officer at{' '}
              <a href={`mailto:${GRIEVANCE_EMAIL}`} className="text-accent hover:underline">
                {GRIEVANCE_EMAIL}
              </a>{' '}
              from the address on your account, or include the mobile number you signed up with, and
              we will delete the account for you. We acknowledge every request within 24 hours and
              action it within 15 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">What gets deleted</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Your name, gender, email, date, time and place of birth, gotra, current location,
              relationship status, and every other identifying field on your profile are
              irreversibly overwritten as part of the request — along with the same fields on any
              birth profile you created for someone else.
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">
              Your palm photographs, chat transcripts, saved AI memory, and feedback are destroyed
              outright rather than overwritten. Push notification tokens for your devices are
              revoked.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">What is retained, and why</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Your mobile number and authentication identifier stay on the emptied account shell.
              This is a security and anti-abuse measure rather than a use of your data. Mobile
              numbers in India are recycled to new subscribers, and keeping the shell is what
              guarantees that whoever is issued your number next gets a blank, freshly-onboardable
              account instead of inheriting anything of yours. It also means the one-time sign-up
              credit cannot be claimed again and again by deleting and re-registering the same
              number. If you sign in on that number later you return to the same emptied account —
              we will say so, and you will need to enter your details afresh.
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">
              The consent audit log keeps a skeleton record — which consent, which document version,
              and when — because the DPDP Act requires us to be able to evidence the lawful basis on
              which we processed data. The IP address and device string on those records are scrubbed
              with everything else. Payment and tax records are kept for the period Indian law
              requires.
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">
              If you want the retained shell and consent skeleton removed as well, say so in an email
              to the Grievance Officer above and we will action it manually.
            </p>
          </section>
        </div>

        <nav className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6 text-sm">
          <Link href="/legal/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="text-accent hover:underline">
            Terms of Service
          </Link>
        </nav>
      </article>
    </Section>
  );
}
