import express, { type Request, type Response } from 'express';
import { Ticket } from '../models/ticket.model.js';
import { NotAuthorizedError, requireAuth } from '@cwertlinks/common';
import { ticketValidationSchema } from '../validators/ticket.validator.js';
import { NotFoundError, validateRequest } from '@cwertlinks/common';

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

    res.status(200).send(ticket);
  },
);
