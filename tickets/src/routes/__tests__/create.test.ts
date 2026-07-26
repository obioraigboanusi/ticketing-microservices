import request from 'supertest';
import { app } from '../../app.js';
import { Ticket } from '../../models/ticket.model.js';
import { ticketsEndpoint } from '../../tests/endpoints.js';
import { natsWrapper } from '../../nats.js';

describe('create ticket', () => {
  it('has a route listening to /api/tickets for post requests', async () => {
    const response = await request(app).post(ticketsEndpoint).send({});

    expect(response.status).not.toBe(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    const response = await request(app).post(ticketsEndpoint).send({});

    expect(response.status).toBe(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', global.signin())
      .send({});

    expect(response.status).not.toBe(401);
  });

  it('returns an error if an invalid title is provided', async () => {
    await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', global.signin())
      .send({
        title: '',
        price: 10,
      })
      .expect(400);

    await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', global.signin())
      .send({
        price: 10,
      })
      .expect(400);
  });

  it('returns an error if an invalid price is provided', async () => {
    await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', global.signin())
      .send({
        title: 'test',
        price: -10,
      })
      .expect(400);

    await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', global.signin())
      .send({
        title: 'test',
      })
      .expect(400);
  });

  it('creates a ticket with valid inputs', async () => {
    const tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const payload = {
      title: 'test',
      price: 10,
    };

    await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', global.signin())
      .send(payload)
      .expect(201);

    const ticket = await Ticket.find({});
    expect(ticket.length).toEqual(1);
    expect(ticket[0].title).toEqual(payload.title);
    expect(ticket[0].price).toEqual(payload.price);
    expect(ticket[0].userId).toBeDefined();
    expect(ticket[0].id).toBeDefined();
  });

  it('should send NATS message', async () => {
    const payload = {
      title: 'test',
      price: 10,
    };

    await request(app)
      .post(ticketsEndpoint)
      .set('Cookie', global.signin())
      .send(payload)
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
