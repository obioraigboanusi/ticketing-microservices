import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';

import { app } from './app.js';
import { natsWrapper } from './nats.js';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const NATS_URI = process.env.NATS_URI!;
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID!;

const start = async () => {
  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, randomBytes(4).toString('hex'), NATS_URI);
    console.log('NATS Connection success');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    const cleanup = () => natsWrapper.client.close();

    process.on('SIGINT', cleanup);
    process.on('SIGBREAK', cleanup); // Windows
    process.on('SIGTERM', cleanup); // Linux/macOS; harmless on Windows

    await mongoose.connect(MONGO_URI!);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

start();
