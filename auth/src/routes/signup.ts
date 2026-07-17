import express, { type Request, type Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user.model.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { validateRequest } from '../middleware/validate-request.js';

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
];

router.post(
  '/api/users/signup',
  loginValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

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

    res.status(201).send(user);
  },
);

export { router as signupRouter };
