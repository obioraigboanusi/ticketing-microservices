'use client';

import TicketForm from '@/components/TicketForm';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/endpoints';
import type { Ticket } from '@/lib/types';
import type { TicketFormValues } from '@/lib/validation';

export default function EditTicketForm({ ticket }: { ticket: Ticket }) {
  async function updateTicket(values: TicketFormValues) {
    const { data } = await api.put<Ticket>(
      API_ENDPOINTS.tickets.ticketById(ticket.id),
      values,
    );
    return data.id;
  }

  return (
    <TicketForm
      title="Edit ticket"
      submitLabel="Update"
      initialValues={{ title: ticket.title, price: ticket.price }}
      onSubmit={updateTicket}
    />
  );
}
