import request from 'supertest';
import { app } from '../../app.js';

describe('Current user', () => {
  it('responds with details about the current user', async () => {
    const signupResponse = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    const cookie = signupResponse.get('Set-Cookie');

    if (!cookie) {
      throw new Error('Expected cookie but got undefined.');
    }

    const currentUserResponse = await request(app)
      .get('/api/users/current-user')
      .set('Cookie', cookie)
      .expect(200);

    expect(currentUserResponse.body.currentUser.email).toEqual('test@test.com');
  });

  it('responds with null if not authenticated', async () => {
    const response = await request(app).get('/api/users/current-user').expect(200);
    expect(response.body.currentUser).toEqual(null);
  });
});
