export const API_ENDPOINTS = {
  users: {
    signup: '/api/users/signup',
    signin: '/api/users/signin',
    signout: '/api/users/signout',
    currentUser: '/api/users/current-user',
  },
  tickets: {
    tickets: '/api/tickets',
    ticketById: (id: string) => `/api/tickets/${id}`,
  },
} as const;
