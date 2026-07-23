import request from 'supertest';
import { app } from '../../app.js';
import { ticketsEndpoint } from '../../tests/endpoints.js';

it('returns empty array if no tickets are found', async () => {
  const response = await request(app).get(ticketsEndpoint).send({});
  expect(response.status).toBe(200);
  expect(response.body).toEqual([]);
});

const createTicket = async () => {
  return await request(app).post(ticketsEndpoint).set('Cookie', global.signin()).send({
    title: 'test',
    price: 10,
  });
};

it('returns a list of tickets if tickets are found', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get(ticketsEndpoint).send({});
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(3);
});
