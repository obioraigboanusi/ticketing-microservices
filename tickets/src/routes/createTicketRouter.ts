import express, { type Request, type Response } from 'express';

const createTicketRouter = express.Router();

createTicketRouter.post('/api/tickets', (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { createTicketRouter };
