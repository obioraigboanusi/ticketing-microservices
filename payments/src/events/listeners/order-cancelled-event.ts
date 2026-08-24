import { BaseListener, OrderStatus, Subjects, type OrderCancelledEvent } from '@cwertlinks/common';
import { queueGroupName } from './queue-group-name.js';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order.model.js';

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.OrderCancelled;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent({
      id: data.id,
      version: data.version,
    });

    if (!order) {
      throw new Error('Order not found!');
    }

    order.set({ status: OrderStatus.Cancelled, version: data.version });
    await order.save();

    msg.ack();
  }
}
