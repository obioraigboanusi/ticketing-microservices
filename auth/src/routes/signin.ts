import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate-request.js';
import type { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

router.post(
  '/api/users/signin',
  loginValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  },
);

export { router as signinRouter };
