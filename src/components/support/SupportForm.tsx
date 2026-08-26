'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  { value: 'billing', label: 'Billing' },
  { value: 'chart_accuracy', label: 'Chart accuracy' },
  { value: 'technical_issue', label: 'Technical issue' },
  { value: 'other', label: 'Other' },
] as const;

const inputClass =
  'w-full rounded-xl border border-ink/20 bg-paper px-3.5 py-2.5 text-ink placeholder:text-ink-2/60 outline-none transition-colors focus:border-accent';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function SupportForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0].value);
  const [message, setMessage] = useState('');
  // Honeypot — never shown to a real visitor. A filled value marks the
  // submission as spam server-side; see api/support/route.ts and the
  // backend's createPublicTicketRoute handler.
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setError(null);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, category, message, website }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        if (res.status === 429) {
          setError(
            "You've sent a few requests already — please wait a bit before trying again, or email us directly.",
          );
        } else {
          setError(data?.error?.message ?? 'Something went wrong. Please try again or email us directly.');
        }
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setError('Could not reach the support service. Please try again or email us directly.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-ink-2">
        Thanks — we&apos;ve got your message and will reply by email within a day or two.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="support-name" className="mb-1 block text-sm text-ink-2">
          Name
        </label>
        <input
          id="support-name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="support-email" className="mb-1 block text-sm text-ink-2">
          Email
        </label>
        <input
          id="support-email"
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="support-category" className="mb-1 block text-sm text-ink-2">
          Category
        </label>
        <select
          id="support-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="support-message" className="mb-1 block text-sm text-ink-2">
          Message
        </label>
        <textarea
          id="support-message"
          required
          minLength={1}
          maxLength={5000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Honeypot — visually hidden via sr-only, not display:none/hidden
          (some simple bots skip fields the browser computes as
          non-rendered). Real users never tab to it. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="support-website">Website</label>
        <input
          id="support-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" variant="solid" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
