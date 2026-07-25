import type { Message } from "node-nats-streaming";
import { BaseListener } from "../../base-listener.js";
import { Subjects } from "../../utils.js";
import type { TicketCreatedEvent, TicketUpdatedEvent } from "./types.js";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queryGroupName = "payment-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event received: ", data);

    msg.ack();
  }
}

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queryGroupName = "payment-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event received: ", data);

    msg.ack();
  }
}
