import { OrderCreatedListener } from './events/listeners/order-created-lister.js';
import { natsWrapper } from './nats.js';

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
  } catch (err) {
    console.error(err);
  }
};

start();
