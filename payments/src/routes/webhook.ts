import crypto from 'crypto';
import express from 'express';

export const paystackWebhookRouter = express.Router();

paystackWebhookRouter.post('/api/payments/webhook', (req, res) => {
  const signature = req.headers['x-paystack-signature'] as string;

  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== signature) {
    return res.sendStatus(401);
  }

  const event = req.body;

  if (event.event === 'charge.success') {
    const payment = event.data;

    console.log('Payment successful:', payment.reference);

    // 1. Find order by payment.reference
    // 2. Check payment hasn't already been processed
    // 3. Verify amount
    // 4. Mark order as PAID
    // 5. Fulfill order
  }

  return res.sendStatus(200);
});
