import { Subjects, type Event } from '../../utils.js';

export enum OrderStatus {
  // When the order has been created, but the ticket it is trying to order has not been reserved
  Created = 'created',
  // The ticket the order is trying to reserve has already been reserved, or when the user has cancelled the order
  Cancelled = 'cancelled',
  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',
  // The order has reserved the ticket and the user has provided payment successfully
  Completed = 'completed',
}

export interface OrderCreatedEvent extends Event {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}

export interface OrderCancelledEvent extends Event {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
