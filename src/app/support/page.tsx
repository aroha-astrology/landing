import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { LINKS } from '@/lib/links';

/**
 * The App Store Connect "Support URL" field pointed at the site root, which
 * has no way to ask a question or request help — Apple rejected build 1.0(4)
 * on Guideline 1.5 Safety over exactly this (submission 43b2e0bb, 2026-08-26).
 * A full ticketing screen already exists at app/help/page.tsx, but it sits
 * behind sign-in, so a reviewer can never reach it. This page is the public,
 * unauthenticated substitute App Store Connect's Support URL should point at.
 *
 * Deliberately static: no form, no backend. A public unauthenticated ticket
 * endpoint would be a new spam surface and a second, less-tested path into
 * the support pipeline the app already runs correctly — same reasoning
 * delete-account/page.tsx used for account deletion.
 */

const SUPPORT_EMAIL = 'subir@arohaastrology.in';

const faqItems: AccordionItem[] = [
  {
    question: "I can't sign in or verify my number",
    answer:
      'Make sure you are entering the mobile number your account was created with, including the country code, and that you can receive the OTP SMS. If the OTP never arrives, wait a minute and request a new one before emailing us.',
  },
  {
    question: 'A payment or credit purchase looks wrong',
    answer:
      "Open Settings → Payment History in the app to see every transaction. If a purchase didn't go through or credits look missing, email us with the date and amount and we'll look it up.",
  },
  {
    question: 'My Kundli or a report looks incorrect',
    answer:
      "Double-check the birth date, time and place saved on the profile — small errors there (especially birth time) can shift the chart. If the details are correct and the reading still looks wrong, tell us which report and what looks off.",
  },
  {
    question: 'I need to change my birth details',
    answer: 'Birth details can be edited from your profile inside the app. Charts and readings you already generated are not recalculated automatically — regenerate them after saving the correction.',
  },
  {
    question: 'Can I use the app in my own language?',
    answer: 'Yes — Aroha supports multiple languages. Change it any time from Settings → Language.',
  },
  {
    question: 'How do I delete my account or ask about my data?',
    answer: `See our account deletion page at ${LINKS.deleteAccount}, or email the address above with a data or privacy question.`,
  },
];

export const metadata: Metadata = {
  title: 'Support — Aroha Astrology',
  description: 'Get help with your Aroha Astrology account, reports, or payments.',
  alternates: { canonical: '/support' },
};

export default function SupportPage() {
  return (
    <Section tone="paper">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.1em] text-ink-muted">
            We're here to help
          </p>
          <h1 className="font-display mt-3 text-3xl font-medium leading-[1.15] text-ink sm:text-4xl md:text-5xl">
            Support
          </h1>
          <p className="mt-4 text-lg text-ink-2">
            Questions about your account, a report, or a payment — reach us here.
          </p>
        </header>

        <div className="space-y-9">
          <section>
            <h2 className="font-display text-xl font-medium text-ink">Email us</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Write to{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent hover:underline">
                {SUPPORT_EMAIL}
              </a>{' '}
              with your registered mobile number and a description of the issue. We acknowledge
              every message within 24 hours and aim to resolve it within 15 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">From inside the app</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-ink-2">
              <li>Open Aroha Astrology and sign in.</li>
              <li>
                Go to <strong className="font-medium text-ink">Help &amp; Support</strong>.
              </li>
              <li>
                Pick a category — Billing, Chart accuracy, Technical issue, or Other — and send us
                a message.
              </li>
            </ol>
            <p className="mt-3 leading-relaxed text-ink-2">
              Your ticket status and our replies appear on that same screen, so you can track it
              without leaving the app.
            </p>
          </section>
        </div>

        <div className="mt-14">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="mx-auto mt-8 max-w-[640px]">
            <Accordion items={faqItems} />
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqItems.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            }),
          }}
        />

        <section className="mt-14 border-t border-ink/10 pt-8">
          <h2 className="font-display text-xl font-medium text-ink">Company</h2>
          <p className="mt-3 leading-relaxed text-ink-2">
            Aroha Astrology, Bengaluru, Karnataka, India. Grievance Officer: Subir Dutta,{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </section>

        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6 text-sm">
          <Link href={LINKS.privacy} className="text-accent hover:underline">
            Privacy Policy
          </Link>
          <Link href={LINKS.terms} className="text-accent hover:underline">
            Terms of Service
          </Link>
          <Link href={LINKS.deleteAccount} className="text-accent hover:underline">
            Delete account
          </Link>
        </nav>
      </article>
    </Section>
  );
}
