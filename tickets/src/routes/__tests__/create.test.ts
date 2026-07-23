import request from 'supertest';
import { app } from '../../app.js';

describe('create ticket', () => {
  it('has a route listening to /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toBe(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).toBe(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({});

    expect(response.status).not.toBe(401);
  });
});
