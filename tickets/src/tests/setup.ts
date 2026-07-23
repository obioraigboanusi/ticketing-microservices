import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
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

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const base64Token = Buffer.from(JSON.stringify({ jwt: token })).toString('base64');

  return [`session=${base64Token}`];
};
