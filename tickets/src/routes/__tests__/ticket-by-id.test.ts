import request from 'supertest';
import { app } from '../../app.js';
import { ticketsEndpoint, ticketByIdEndpoint } from '../../tests/endpoints.js';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).get(ticketByIdEndpoint(id)).send({});

  expect(response.status).toBe(404);
});

it('returns the ticket if the ticket is found', async () => {
  const payload = {
    title: 'test',
    price: 10,
  };

  const response = await request(app)
    .post(ticketsEndpoint)
    .set('Cookie', global.signin())
    .send(payload)
    .expect(201);

  const singleTicketResponse = await request(app)
    .get(ticketByIdEndpoint(response.body.id))
    .expect(200);

  expect(singleTicketResponse.body.id).toBe(response.body.id);
  expect(singleTicketResponse.body.title).toBe(payload.title);
  expect(singleTicketResponse.body.price).toBe(payload.price);
});
