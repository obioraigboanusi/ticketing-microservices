import express, { type Request, type Response } from 'express';
import { Ticket } from '../models/ticket.model.js';
import { NotAuthorizedError, requireAuth } from '@cwertlinks/common';
import { ticketValidationSchema } from '../validators/ticket.validator.js';
import { NotFoundError, validateRequest } from '@cwertlinks/common';
import { TicketUpdatedPublisher } from '../events/ticket.event.js';
import { natsWrapper } from '../nats.js';

export const updateRouter = express.Router();

updateRouter.put(
  '/api/tickets/:id',
  requireAuth,
  ticketValidationSchema,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    console.log('Published edit');

    res.status(200).send(ticket);
  },
);
