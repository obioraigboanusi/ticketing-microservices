import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus } from '@cwertlinks/common';

export { OrderStatus };

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

export interface OrderDoc extends Document {
  id: string;
  userId: string;
  status: string;
  version: number;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(attrs: { id: string; version: number }): Promise<OrderDoc>;
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
    price: {
      type: Number,
      required: true,
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({ ...attrs, _id: attrs.id });
};

orderSchema.statics.findByEvent = async (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1, // previous version of the Order should be one less than the current version
  });
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
