import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket.model.js';
import { natsWrapper } from '../../../nats.js';
import { OrderCancelledListener } from '../order-cancelled-listener.js';
import { OrderStatus, type OrderCancelledEvent } from '@cwertlinks/common';
import { jest } from '@jest/globals';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  const orderId = new mongoose.Types.ObjectId().toHexString();

  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-expect-error we only need to implement the ack function for this test
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

describe('Order Cancelled Listener', () => {
  it('finds, nulls the orderId, saves the ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    expect(ticket.orderId).toBeDefined();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toBeUndefined();
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

    expect(ticketUpdatedData.orderId).toBeUndefined();
  });
});
