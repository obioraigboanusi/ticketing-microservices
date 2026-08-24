import { OrderStatus, type OrderCancelledEvent } from '@cwertlinks/common';
import { natsWrapper } from '../../../nats.js';
import mongoose from 'mongoose';
import { Order } from '../../../models/order.model.js';
import { jest } from '@jest/globals';
import { OrderCancelledListener } from '../order-cancelled-event.js';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: 'sdfsdfds',
    status: OrderStatus.Created,
    price: 10,
  });

  order.version = 0;
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: 'gfdfdgfd',
    },
  };

  // @ts-expect-error only need to call the act method
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

describe('Order Cancelled event', () => {
  it('Updates the status of the order', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Order.findOne({ _id: data.id, version: data.version });

    expect(ticket?.status).toEqual(OrderStatus.Cancelled);
  });

  it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
