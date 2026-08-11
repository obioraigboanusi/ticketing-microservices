import express, { type Request, type Response } from 'express';
import { Ticket } from '../models/ticket.model.js';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  validateRequest,
  requireAuth,
} from '@cwertlinks/common';
import { Order } from '../models/order.model.js';
import mongoose from 'mongoose';
import { body } from 'express-validator';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

const bodyValidator = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided'),
];

router.post(
  '/api/orders',
  requireAuth,
  bodyValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    const order = Order.build({
      ticket,
      userId: req.currentUser!.id,
      expiresAt: expiration,
      status: OrderStatus.Created,
    });
    await order.save();

    res.status(201).send(order);
  },
);

export { router as newOrderRouter };
