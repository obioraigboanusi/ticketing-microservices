'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const { currentUser, signout } = useAuth();
  const router = useRouter();

  async function handleSignout() {
    await signout();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Ticketing
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/tickets"
            className="rounded-lg px-3 py-1.5 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Tickets
          </Link>
          {currentUser ? (
            <>
              <Link
                href="/tickets/new"
                className="rounded-lg px-3 py-1.5 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Sell
              </Link>
              <span className="hidden text-zinc-500 sm:inline dark:text-zinc-400">
                {currentUser.email}
              </span>
              <button
                type="button"
                onClick={handleSignout}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-lg px-3 py-1.5 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
