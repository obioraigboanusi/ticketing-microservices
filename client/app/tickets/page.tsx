import Link from 'next/link';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/auth-server';
import { getTickets } from '@/lib/tickets-server';

export default async function TicketsPage() {
  const headersList = await headers();
  const [tickets, currentUser] = await Promise.all([
    getTickets(headersList),
    getCurrentUser(headersList),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Tickets
        </h1>
        {currentUser && (
          <Link
            href="/tickets/new"
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sell a ticket
          </Link>
        )}
      </div>

      {tickets.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No tickets yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link
                href={`/tickets/${ticket.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {ticket.title}
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  ${ticket.price.toFixed(2)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
