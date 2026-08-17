import mongoose from 'mongoose';

import { app } from './app.js';
import { natsWrapper } from './nats.js';
import { OrderCreatedListener } from './events/listeners/order-created-listener.js';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener.js';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const NATS_URL = process.env.NATS_URL!;
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID!;
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID!;

const start = async () => {
  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
    console.log('NATS Connection success');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    const cleanup = () => natsWrapper.client.close();

    process.on('SIGINT', cleanup);
    process.on('SIGBREAK', cleanup); // Windows
    process.on('SIGTERM', cleanup); // Linux/macOS; harmless on Windows

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

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
