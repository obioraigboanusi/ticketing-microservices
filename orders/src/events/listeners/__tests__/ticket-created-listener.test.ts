import mongoose from 'mongoose';
import type { Message } from 'node-nats-streaming';
import type { TicketCreatedEvent } from '@cwertlinks/common';
import { jest } from '@jest/globals';
import { natsWrapper } from '../../../nats.js';
import { TicketCreatedListener } from '../ticket-created-listener.js';
import { Ticket } from '../../../models/ticket.model.js';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-expect-error we only need to implement the ack function for this test
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe('Ticket Created Listener', () => {
  it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
  });

  it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
