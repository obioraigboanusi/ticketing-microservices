import 'server-only';

import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';
import type { Ticket } from './types';

const API_BASE_URL = process.env.AUTH_INTERNAL_URL;

function requestHeaders(headers: Headers): Record<string, string> {
  return Object.fromEntries(headers.entries()) as Record<string, string>;
}

export async function getTickets(headers: Headers): Promise<Ticket[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.tickets.tickets}`, {
      headers: requestHeaders(headers),
    });

    if (res.status !== 200) {
      return [];
    }

    return res.data as Ticket[];
  } catch {
    return [];
  }
}

export async function getTicket(
  id: string,
  headers: Headers,
): Promise<Ticket | null> {
  try {
    const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.tickets.ticketById(id)}`, {
      headers: requestHeaders(headers),
    });

    if (res.status !== 200) {
      return null;
    }

    return res.data as Ticket;
  } catch {
    return null;
  }
}
