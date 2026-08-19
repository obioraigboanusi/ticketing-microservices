import {
  BaseListener,
  OrderStatus,
  Subjects,
  type ExpirationCompleteEvent,
} from '@cwertlinks/common';
import { queueGroupName } from './queue-group-name.js';
import type { Message } from 'node-nats-streaming';
import { Order } from '../../models/order.model.js';
import { OrderCancelledPublisher } from '../order.events.js';

export class ExpirationCompleteListener extends BaseListener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
