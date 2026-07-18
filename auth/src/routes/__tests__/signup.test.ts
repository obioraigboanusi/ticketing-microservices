import request from 'supertest';
import { app } from '../../app.js';

describe('Signup', () => {
  it('should successfully signup a user with valid credentials', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
  });

  it('should return a 400 with an invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test',
        password: 'password',
      })
      .expect(400);
  });

  it('should return a 400 with an invalid password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'p',
      })
      .expect(400);
  });

  it('should return a 400 with missing email and password', async () => {
    return request(app).post('/api/users/signup').send({}).expect(400);
  });

  it('should return a 400 with an email that is already in use', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });
  it('should set a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
