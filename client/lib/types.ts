export interface CurrentUser {
  id: string;
  email: string;
}

export interface Ticket {
  id: string;
  title: string;
  price: number;
  userId: string;
}
