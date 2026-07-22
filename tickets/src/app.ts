import express from 'express';
import { currentUser, errorHandler, NotFoundError } from '@cwertlinks/common';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/createTicketRouter.js';

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

app.use(createTicketRouter);

app.all('/{*splat}', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
