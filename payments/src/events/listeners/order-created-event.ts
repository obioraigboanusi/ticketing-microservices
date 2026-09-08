import { BaseListener, Subjects, type OrderCreatedEvent } from '@cwertlinks/common';
import { queueGroupName } from './queue-group-name.js';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order.model.js';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.OrderCreated;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      version: data.version,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price,
    });

    order.version = data.version;

    await order.save();

    msg.ack();
  }
}
