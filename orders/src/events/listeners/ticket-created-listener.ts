import type { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name.js';
import { BaseListener, Subjects, type TicketCreatedEvent } from '@cwertlinks/common';
import { Ticket } from '../../models/ticket.model.js';

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
    const existingTicket = await Ticket.findById(data.id);
    if (existingTicket) {
      console.log(`Ticket ${data.id} already exists. Skipping creation.`);
      msg.ack();
      return;
    }

    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: data.price,
    });

    ticket.version = data.version;
    await ticket.save();

    msg.ack();
  }
}
