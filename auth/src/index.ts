import express from 'express';
import { signinRouter } from './routes/signin.js';
import { signoutRouter } from './routes/signout.js';
import { currentUserRouter } from './routes/current-user.js';
import { signupRouter } from './routes/signup.js';
import { errorHandler } from './middleware/error-handler.js';
import { NotFoundError } from './errors/not-found-error.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.all('/{*splat}', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
