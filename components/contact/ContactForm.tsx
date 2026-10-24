'use client';

import { useState } from 'react';
import type { ContactConfig } from '@/types/siteConfig';
import { cn } from '@/lib/cn';

export interface ContactFormLabels {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  submit: string;
  hint: string;
  subject: string;
  required: string;
}

export interface ContactFormProps {
  contact: Pick<ContactConfig, 'email'>;
  labels: ContactFormLabels;
}

const FIELD_CLASS =
  'w-full rounded-lg border border-line bg-page/60 px-4 py-3 text-title placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40';

/** 纯静态联系表单：组装 mailto 预填邮件（无后端） */
export function ContactForm({ contact, labels }: ContactFormProps) {
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    const budget = String(data.get('budget') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !message) {
      setError(labels.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(labels.required);
      return;
    }

    setError(null);

    const body = [
      `${labels.name}: ${name}`,
      `${labels.email}: ${email}`,
      ...(company ? [`${labels.company}: ${company}`] : []),
      ...(budget ? [`${labels.budget}: ${budget}`] : []),
      '',
      `${labels.message}:`,
      message,
    ].join('\n');

    const href = `mailto:${contact.email}?subject=${encodeURIComponent(
      `${labels.subject} - ${name}`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-soft">
            {labels.name} <span className="text-primary">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-soft">
            {labels.email} <span className="text-primary">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-company" className="mb-2 block text-sm font-medium text-soft">
            {labels.company}
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="contact-budget" className="mb-2 block text-sm font-medium text-soft">
            {labels.budget}
          </label>
          <input id="contact-budget" name="budget" type="text" className={FIELD_CLASS} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-soft">
          {labels.message} <span className="text-primary">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          className={cn(FIELD_CLASS, 'resize-y')}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-8 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-band sm:w-auto"
      >
        {labels.submit}
      </button>

      <p className="text-sm text-muted">{labels.hint}</p>
    </form>
  );
}
