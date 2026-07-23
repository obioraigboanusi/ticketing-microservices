'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TicketForm from '@/components/TicketForm';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/endpoints';
import { useAuth } from '@/lib/auth-context';
import type { Ticket } from '@/lib/types';
import type { TicketFormValues } from '@/lib/validation';

export default function NewTicketPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/auth/signin');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  async function createTicket(values: TicketFormValues) {
    const { data } = await api.post<Ticket>(API_ENDPOINTS.tickets.tickets, values);
    return data.id;
  }

  return (
    <TicketForm
      title="Create a ticket"
      submitLabel="Create"
      onSubmit={createTicket}
    />
  );
}
