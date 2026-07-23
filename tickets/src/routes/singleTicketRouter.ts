import { Ticket } from './../models/ticket.model.js';
import express from 'express';
import { type Request, type Response } from 'express';
import { NotFoundError } from '@cwertlinks/common';
import { validateIdParam } from '../middlewares/validateIdParam.js';
export const singleTicketRouter = express.Router();

singleTicketRouter.get('/api/tickets/:id', validateIdParam, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});
