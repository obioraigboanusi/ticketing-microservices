import { BasePublisher } from "../../base-publisher.js";
import { Subjects } from "../../utils.js";
import type { TicketCreatedEvent, TicketUpdatedEvent } from "./types.js";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
