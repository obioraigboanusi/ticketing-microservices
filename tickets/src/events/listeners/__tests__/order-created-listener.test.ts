import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket.model.js';
import { natsWrapper } from '../../../nats.js';
import { OrderCreatedListener } from '../order-created-listener.js';
import { OrderStatus, type OrderCreatedEvent } from '@cwertlinks/common';
import { jest } from '@jest/globals';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-expect-error we only need to implement the ack function for this test
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

describe('Order created Listener', () => {
  it('sets the orderId of the ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    expect(ticket.orderId).toBeUndefined();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
  });

  it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it('publishes a ticket updated event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1] as string,
    );

    expect(ticketUpdatedData.orderId).toEqual(data.id);
  });
});
