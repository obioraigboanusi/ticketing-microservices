'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import type { ObjectSchema } from 'yup';
import { extractApiErrors, type ApiFieldError } from '@/lib/api';

interface AuthFormProps {
  title: string;
  submitLabel: string;
  schema: ObjectSchema<{ email: string; password: string }>;
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  altPrompt: string;
  altHref: string;
  altLabel: string;
}

export default function AuthForm({
  title,
  submitLabel,
  schema,
  onSubmit,
  altPrompt,
  altHref,
  altLabel,
}: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormErrors([]);

    let values: { email: string; password: string };
    try {
      values = await schema.validate(
        { email, password },
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
      await onSubmit(values);
      router.push('/');
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
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={
                submitLabel.toLowerCase().includes('up')
                  ? 'new-password'
                  : 'current-password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.password}
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

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {altPrompt}{' '}
          <Link
            href={altHref}
            className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
          >
            {altLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
