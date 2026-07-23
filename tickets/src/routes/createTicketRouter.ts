import express, { type Request, type Response } from 'express';
import { requireAuth, validateRequest } from '@cwertlinks/common';
import { Ticket } from '../models/ticket.model.js';
import { ticketValidationSchema } from '../validators/ticket.validator.js';

export const createTicketRouter = express.Router();

createTicketRouter.post(
  '/api/tickets',
  requireAuth,
  ticketValidationSchema,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = new Ticket({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    res.status(201).send(ticket);
  },
);
