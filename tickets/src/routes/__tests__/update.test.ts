import request from 'supertest';
import { app } from '../../app.js';
import { ticketByIdEndpoint, ticketsEndpoint } from '../../tests/endpoints.js';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats.js';
import { Ticket } from '../../models/ticket.model.js';

describe('Update Ticket', () => {
  it('returns 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app).put(ticketByIdEndpoint(id)).send({});

    expect(response.status).toBe(401);
  });

  it('returns 400 if the title or price is not provided or is invalid', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(ticketByIdEndpoint(id))
      .set('Cookie', global.signin())
      .send({})
      .expect(400);

    await request(app)
      .put(ticketByIdEndpoint(id))
      .set('Cookie', global.signin())
      .send({ title: '', price: 10 })
      .expect(400);

    await request(app)
      .put(ticketByIdEndpoint(id))
      .set('Cookie', global.signin())
      .send({ title: 'test', price: -10 })
      .expect(400);
  });

  it('returns 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(ticketByIdEndpoint(id))
      .set('Cookie', global.signin())
      .send({
        title: 'test',
        price: 10,
      })
      .expect(404);
  });

  it('returns 401 if the ticket is not owned by the user', async () => {
    const response = await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', global.signin())
      .send({
        title: 'test',
        price: 10,
      })
      .expect(201);

    await request(app)
      .put(ticketByIdEndpoint(response.body.id))
      .set('Cookie', global.signin())
      .send({
        title: 'test',
        price: 10,
      })
      .expect(401);
  });

  it('returns 200 if the ticket is updated successfully', async () => {
    const cookie = global.signin();

    const response = await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', cookie)
      .send({
        title: 'test',
        price: 10,
      })
      .expect(201);

    const payload = {
      title: 'test2',
      price: 20,
    };

    await request(app)
      .put(ticketByIdEndpoint(response.body.id))
      .set('Cookie', cookie)
      .send(payload)
      .expect(200);

    const ticket = await request(app).get(ticketByIdEndpoint(response.body.id)).send().expect(200);

    expect(ticket.body.title).toBe(payload.title);
    expect(ticket.body.price).toBe(payload.price);
  });

  it('Should publish NATS Message', async () => {
    const cookie = global.signin();

    const response = await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', cookie)
      .send({
        title: 'test',
        price: 10,
      })
      .expect(201);

    const payload = {
      title: 'test2',
      price: 20,
    };

    await request(app)
      .put(ticketByIdEndpoint(response.body.id))
      .set('Cookie', cookie)
      .send(payload)
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  it('Should reject updates if the ticket is reserved', async () => {
    const cookie = global.signin();

    const response = await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', cookie)
      .send({
        title: 'test',
        price: 10,
      })
      .expect(201);

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    const payload = {
      title: 'test2',
      price: 20,
    };

    await request(app)
      .put(ticketByIdEndpoint(response.body.id))
      .set('Cookie', cookie)
      .send(payload)
      .expect(400);
  });
});
