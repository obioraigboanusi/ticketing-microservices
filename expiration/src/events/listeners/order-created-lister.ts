import { BaseListener, Subjects, type OrderCreatedEvent } from '@cwertlinks/common';
import { queueGroupName } from './queue-group-name.js';
import type { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue.js';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage(data: OrderCreatedEvent['data'], msg: Message): void {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    expirationQueue.add(
      { orderId: data.id },
      {
        delay,
      },
    );

    msg.ack();
  }
}
