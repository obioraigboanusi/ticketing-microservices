import express, { type Request, type Response } from 'express';
import { requireAuth } from '@cwertlinks/common';

const createTicketRouter = express.Router();

createTicketRouter.post('/api/tickets', requireAuth, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { createTicketRouter };
