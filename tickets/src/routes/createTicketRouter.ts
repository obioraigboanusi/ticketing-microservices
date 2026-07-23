import express, { type Request, type Response } from 'express';
import { requireAuth, validateRequest } from '@cwertlinks/common';
import { body } from 'express-validator';

const createTicketRouter = express.Router();

const ticketValidationSchema = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];

createTicketRouter.post(
  '/api/tickets',
  requireAuth,
  ticketValidationSchema,
  validateRequest,
  async (req: Request, res: Response) => {
    res.sendStatus(200);
  },
);

export { createTicketRouter };
