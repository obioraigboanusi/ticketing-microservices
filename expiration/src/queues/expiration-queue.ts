import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher.js';
import { natsWrapper } from '../nats.js';

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: process.env.REDIS_HOST,
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});
