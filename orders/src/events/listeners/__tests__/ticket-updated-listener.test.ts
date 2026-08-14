import mongoose from 'mongoose';
import type { Message } from 'node-nats-streaming';
import type { TicketUpdatedEvent } from '@cwertlinks/common';
import { jest } from '@jest/globals';
import { natsWrapper } from '../../../nats.js';
import { Ticket } from '../../../models/ticket.model.js';
import { TicketUpdatedListener } from '../ticket-updated-listener.js';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const newTicket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });

  await newTicket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: newTicket.id,
    version: newTicket.version + 1,
    title: 'concert 12',
    price: 22,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-expect-error we only need to implement the ack function for this test
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, newTicket };
};

describe('Ticket Updated Listener', () => {
  it('finds, updates and saves a ticket', async () => {
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

  it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup();

    data.version = data.version + 10;

    await expect(listener.onMessage(data, msg)).rejects.toThrow();

    expect(msg.ack).not.toHaveBeenCalled();
  });
});
