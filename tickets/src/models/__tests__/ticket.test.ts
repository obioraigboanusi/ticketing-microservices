import { Ticket } from '../ticket.model.js';

describe('Ticket Model', () => {
  it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 75,
      userId: 'cvxdsfds',
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    await expect(secondInstance!.save()).rejects.toThrow();
  });

  it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 75,
      userId: 'cvxdsfds',
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    ticket.set('price', 80);
    await ticket.save();
    expect(ticket.version).toEqual(1);

    ticket.set('title', 'updated concert');
    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});
