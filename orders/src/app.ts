import express from 'express';
import { currentUser, errorHandler, NotFoundError } from '@cwertlinks/common';
import cookieSession from 'cookie-session';
import { newOrderRouter } from './routes/new.js';
import { showOrderRouter } from './routes/show.js';
import { indexRouter } from './routes/index.js';
import { deleteOrderRouter } from './routes/delete.js';

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

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexRouter);
app.use(deleteOrderRouter);

app.all('/{*splat}', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
