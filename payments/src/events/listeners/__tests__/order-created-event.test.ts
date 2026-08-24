import { OrderStatus, type OrderCreatedEvent } from '@cwertlinks/common';
import { natsWrapper } from '../../../nats.js';
import { OrderCreatedListener } from '../order-created-event.js';
import mongoose from 'mongoose';
import { Order } from '../../../models/order.model.js';
import { jest } from '@jest/globals';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'dfsfsd',
    userId: 'sdfsdfds',
    status: OrderStatus.Created,
    ticket: {
      id: 'dsfsdfsd',
      price: 10,
    },
  };

  // @ts-expect-error only need to call the act method
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe('Order created event', () => {
  it('Replicates the order info', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Order.findOne({ _id: data.id, version: data.version });

    expect(ticket?.price).toEqual(data.ticket.price);
  });

  it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
