import express, { type Request, type Response } from 'express';
import { requireAuth, validateRequest } from '@cwertlinks/common';
import { Ticket } from '../models/ticket.model.js';
import { ticketValidationSchema } from '../validators/ticket.validator.js';
import { natsWrapper } from '../nats.js';
import { TicketCreatedPublisher } from '../events/ticket.event.js';

export const createTicketRouter = express.Router();

createTicketRouter.post(
  '/api/tickets',
  requireAuth,
  ticketValidationSchema,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  },
);
