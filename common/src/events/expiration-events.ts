import { type Event, Subjects } from './utils.js';

export interface ExpirationCompleteEvent extends Event {
  subject: Subjects.ExpirationComplete;
  data: {
    orderId: string;
  };
}
