import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { getTicket } from '@/lib/tickets-server';

interface TicketPageProps {
  params: Promise<{ ticketId: string }>;
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  const headersList = await headers();
  const [ticket, currentUser] = await Promise.all([
    getTicket(ticketId, headersList),
    getCurrentUser(headersList),
  ]);

  if (!ticket) {
    notFound();
  }

  const isOwner = currentUser?.id === ticket.userId;

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-10">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {ticket.title}
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300">
          ${ticket.price.toFixed(2)}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/tickets"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Back to tickets
          </Link>
          {isOwner && (
            <Link
              href={`/tickets/${ticket.id}/edit`}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
