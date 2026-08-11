import mongoose, { Document, Schema } from 'mongoose';
import type { TicketDoc } from './ticket.model.js';
import { OrderStatus } from '@cwertlinks/common';

export { OrderStatus };

export interface OrderDoc extends Document {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema<OrderDoc>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(_doc: Document, ret: any): any {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  },
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
