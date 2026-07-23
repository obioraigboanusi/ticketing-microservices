import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { getTicket } from '@/lib/tickets-server';
import EditTicketForm from './EditTicketForm';

interface EditTicketPageProps {
  params: Promise<{ ticketId: string }>;
}

export default async function EditTicketPage({ params }: EditTicketPageProps) {
  const { ticketId } = await params;
  const headersList = await headers();
  const [ticket, currentUser] = await Promise.all([
    getTicket(ticketId, headersList),
    getCurrentUser(headersList),
  ]);

  if (!currentUser) {
    redirect('/auth/signin');
  }

  if (!ticket) {
    notFound();
  }

  if (ticket.userId !== currentUser.id) {
    redirect(`/tickets/${ticket.id}`);
  }

  return <EditTicketForm ticket={ticket} />;
}
