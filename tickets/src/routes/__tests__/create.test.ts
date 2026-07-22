import request from 'supertest';
import { app } from '../../app.js';

describe('create ticket', () => {
  it('has a route listening to /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toBe(404);
  });
});
