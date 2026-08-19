import mongoose, { Document, Schema } from 'mongoose';
import { Order, OrderStatus } from './order.model.js';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends Document {
  id: string;
  version: number;
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new Schema<TicketDoc>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(_doc: Document, ret: any): any {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = async (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1, // previous version of the ticket should be one less than the current version
  });
};

ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: { $in: [OrderStatus.Created, OrderStatus.Completed, OrderStatus.AwaitingPayment] },
  });

  return !!existingOrder;
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
