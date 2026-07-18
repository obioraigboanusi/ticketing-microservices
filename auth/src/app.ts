import express from 'express';
import { signinRouter } from './routes/signin.js';
import { signoutRouter } from './routes/signout.js';
import { currentUserRouter } from './routes/current-user.js';
import { signupRouter } from './routes/signup.js';
import { errorHandler } from './middleware/error-handler.js';
import { NotFoundError } from './errors/not-found-error.js';
import cookieSession from 'cookie-session';

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

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.all('/{*splat}', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
