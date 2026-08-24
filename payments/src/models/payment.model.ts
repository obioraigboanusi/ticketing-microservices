import mongoose, { Document, Schema } from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  paystackId: string;
}

export interface PaymentDoc extends Document {
  orderId: string;
  paystackId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const orderSchema = new Schema<PaymentDoc>(
  {
    orderId: {
      type: String,
      required: true,
    },
    paystackId: {
      type: String,
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
        return ret;
      },
    },
  },
);

orderSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

export const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', orderSchema);
