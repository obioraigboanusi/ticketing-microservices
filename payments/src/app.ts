import express from 'express';
import { currentUser, errorHandler, NotFoundError } from '@cwertlinks/common';
import cookieSession from 'cookie-session';
import { paystackWebhookRouter } from './routes/webhook.js';
import { newRouter } from './routes/new.js';

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
    httpOnly: true,
  }),
);

app.use(currentUser);

app.use(paystackWebhookRouter);
app.use(newRouter);

app.all('/{*splat}', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
