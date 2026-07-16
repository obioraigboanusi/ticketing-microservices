import express, { type Request, type Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error.js';

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
];

router.post('/api/users/signup', loginValidation, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  res.send('Signup successful');
});

export { router as signupRouter };
