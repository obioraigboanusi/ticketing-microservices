import request from 'supertest';
import { app } from '../../app.js';

describe('Current user', () => {
  it('responds with details about the current user', async () => {
    const cookie = await global.signin();

    const currentUserResponse = await request(app)
      .get('/api/users/current-user')
      .set('Cookie', cookie)
      .expect(200);

    expect(currentUserResponse.body.currentUser.email).toEqual('test@test.com');
  });

  it('responds with null if not authenticated', async () => {
    const response = await request(app).get('/api/users/current-user').send().expect(200);
    expect(response.body.currentUser).toEqual(null);
  });
});
