import { Ticket } from '../../models/ticket.model.js';
import { app } from '../../app.js';
import request from 'supertest';

describe('show order route', () => {
  it('returns an error if user does not own the order', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
    });
    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(401);
  });
  it('fetches the order by id', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
    });
    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: fetchedOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
  });
});
