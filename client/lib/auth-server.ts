import 'server-only';

import { API_ENDPOINTS } from './endpoints';
import type { CurrentUser } from './types';
import axios from 'axios';

const AUTH_BASE_URL = process.env.AUTH_INTERNAL_URL;

export async function getCurrentUser(requestHeaders: Headers): Promise<CurrentUser | null> {
  try {
    const res = await axios.get(`${AUTH_BASE_URL}${API_ENDPOINTS.users.currentUser}`, {
      headers: Object.fromEntries(requestHeaders.entries()) as Record<string, string>,
    });

    if (res.status !== 200) {
      return null;
    }

    const data = res.data as { currentUser: CurrentUser | null };
    return data.currentUser;
  } catch {
    return null;
  }
}
