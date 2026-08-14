import type { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name.js';
import { BaseListener, Subjects, type TicketUpdatedEvent } from '@cwertlinks/common';
import { Ticket } from '../../models/ticket.model.js';

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queryGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title: data.title, price: data.price });
    await ticket.save();

    msg.ack();
  }
}
