import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app.js';
import request from 'supertest';

declare global {
  var signin: () => Promise<string[]>;
}

let mongod: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'test-jwt-key';

  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log(`Test db connected successfully on ${uri}`);
}, 60000);

beforeEach(async () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }
  const collections = await db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongod) {
    await mongod.stop();
    console.log('Test db disconnected successfully');
  }
});

global.signin = async () => {
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

  return cookie;
};
