import express from 'express';
import { signinRouter } from './routes/signin.js';
import { signoutRouter } from './routes/signout.js';
import { currentUserRouter } from './routes/current-user.js';
import { signupRouter } from './routes/signup.js';
import { errorHandler } from './middleware/error-handler.js';
import { NotFoundError } from './errors/not-found-error.js';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: true,
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

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

start();
