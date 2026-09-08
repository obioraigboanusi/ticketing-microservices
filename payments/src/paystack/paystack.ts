import axios from 'axios';

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface InitializeTransactionParams {
  email: string;
  amount: number;
  reference: string;
  currency?: string;
}

export const initializeTransaction = async ({
  email,
  amount,
  reference,
  currency = 'NGN',
}: InitializeTransactionParams) => {
  const response = await paystack.post('/transaction/initialize', {
    email,
    amount,
    reference,
    currency,
  });

  return response.data;
};

export const verifyTransaction = async (reference: string) => {
  const response = await paystack.get(`/transaction/verify/${encodeURIComponent(reference)}`);

  return response.data;
};
