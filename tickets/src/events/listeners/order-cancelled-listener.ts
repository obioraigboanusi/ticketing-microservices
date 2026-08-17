import { BaseListener, type OrderCancelledEvent, Subjects } from '@cwertlinks/common';
import { queryGroupName } from './query-group-name.js';
import { Ticket } from '../../models/ticket.model.js';
import type { Message } from 'node-nats-streaming';
import { TicketUpdatedPublisher } from '../ticket.event.js';

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queryGroupName = queryGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
