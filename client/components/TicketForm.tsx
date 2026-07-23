'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { extractApiErrors, type ApiFieldError } from '@/lib/api';
import { ticketSchema, type TicketFormValues } from '@/lib/validation';

interface TicketFormProps {
  title: string;
  submitLabel: string;
  initialValues?: Partial<TicketFormValues>;
  onSubmit: (values: TicketFormValues) => Promise<string>;
}

export default function TicketForm({
  title,
  submitLabel,
  initialValues,
  onSubmit,
}: TicketFormProps) {
  const router = useRouter();
  const [ticketTitle, setTicketTitle] = useState(initialValues?.title ?? '');
  const [price, setPrice] = useState(
    initialValues?.price !== undefined ? String(initialValues.price) : '',
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormErrors([]);

    let values: TicketFormValues;
    try {
      values = await ticketSchema.validate(
        { title: ticketTitle, price },
        { abortEarly: false },
      );
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const nextErrors: Record<string, string> = {};
        for (const inner of err.inner) {
          if (inner.path && !nextErrors[inner.path]) {
            nextErrors[inner.path] = inner.message;
          }
        }
        setFieldErrors(nextErrors);
      }
      return;
    }

    setSubmitting(true);
    try {
      const ticketId = await onSubmit(values);
      router.push(`/tickets/${ticketId}`);
      router.refresh();
    } catch (err) {
      const apiErrors = extractApiErrors(err);
      const nextFieldErrors: Record<string, string> = {};
      const nextFormErrors: string[] = [];
      apiErrors.forEach((e: ApiFieldError) => {
        if (e.field) {
          nextFieldErrors[e.field] = e.message;
        } else {
          nextFormErrors.push(e.message);
        }
      });
      setFieldErrors(nextFieldErrors);
      setFormErrors(nextFormErrors);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Price
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            />
            {fieldErrors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.price}
              </p>
            )}
          </div>

          {formErrors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
              <ul className="list-inside list-disc text-sm text-red-700 dark:text-red-400">
                {formErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? 'Please wait…' : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
