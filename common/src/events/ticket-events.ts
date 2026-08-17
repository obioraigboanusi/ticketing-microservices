import type { Message } from "node-nats-streaming";
import { BaseListener } from "./base-listener.js";
import { Subjects, type Event } from "./utils.js";

interface TicketEvent extends Event {
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string;
  };
}

export interface TicketCreatedEvent extends TicketEvent {
  subject: Subjects.TicketCreated;
}

export interface TicketUpdatedEvent extends TicketEvent {
  subject: Subjects.TicketUpdated;
}
