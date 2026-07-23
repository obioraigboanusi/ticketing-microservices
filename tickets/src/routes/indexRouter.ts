import express, { type Request, type Response } from 'express';
import { Ticket } from '../models/ticket.model.js';

export const indexRouter = express.Router();

indexRouter.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.send(tickets);
});
