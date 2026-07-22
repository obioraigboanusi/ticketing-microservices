import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-server';
import { headers } from 'next/headers';

export default async function Home() {
  const headersList = await headers();
  const currentUser = await getCurrentUser(headersList);
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-4 font-sans dark:bg-black">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
        Welcome to the ticketing app
      </h1>

      {currentUser ? (
        <p className="text-zinc-600 dark:text-zinc-300">
          You are signed in as{' '}
          <span className="font-medium text-zinc-900 dark:text-zinc-50">{currentUser.email}</span>.
        </p>
      ) : (
        <p className="text-zinc-600 dark:text-zinc-300">
          You are not signed in.{' '}
          <Link
            href="/auth/signin"
            className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
          >
            Sign in
          </Link>{' '}
          or{' '}
          <Link
            href="/auth/signup"
            className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
          >
            create an account
          </Link>
          .
        </p>
      )}
    </div>
  );
}
