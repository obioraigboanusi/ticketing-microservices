import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app.js';
import { Ticket } from '../../models/ticket.model.js';
import { OrderStatus } from '../../models/order.model.js';
import { natsWrapper } from '../../nats.js';

describe('Delete order route', () => {
  it('Returns 404 if the order does not exist', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .delete(`/api/orders/${orderId}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404);
  });

  it('Should return 401 if user does not own the order', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
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
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(401);
  });

  it('marks the order as cancelled', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
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

    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

    const { body: cancelledOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(200);

    expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
  });

  it('emits an order cancelled event', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
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

    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
