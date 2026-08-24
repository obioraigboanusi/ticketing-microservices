import { Subjects, type Event } from './utils.js';

export interface PaymentCreatedEvent extends Event {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    paystackId: string;
  };
}
