import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import { natsWrapper } from '../nats.js';

declare global {
  var signin: () => string[];
}

type PublishFn = (
  subject: string,
  data: string,
  callback: (err?: Error | null, guid?: string) => void,
) => void;

let mongod: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'test-jwt-key';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (natsWrapper as any)._client = {
    publish: jest
      .fn<PublishFn>()
      .mockImplementation(
        (
          _subject: string,
          _data: string,
          callback: (err?: Error | null, guid?: string) => void,
        ) => {
          callback(null, 'test-guid');
        },
      ),
  };

  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log(`Test db connected successfully on ${uri}`);
}, 60000);

beforeEach(async () => {
  jest.clearAllMocks();
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

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const base64Token = Buffer.from(JSON.stringify({ jwt: token })).toString('base64');

  return [`session=${base64Token}`];
};
