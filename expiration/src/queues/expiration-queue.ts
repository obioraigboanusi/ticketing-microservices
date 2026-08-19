import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher.js';
import { natsWrapper } from '../nats.js';

interface Payload {
  orderId: string;
}

console.log('Redis host:', process.env.REDIS_HOST);

export const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
  console.log('Processed expiration complete Job');
});
