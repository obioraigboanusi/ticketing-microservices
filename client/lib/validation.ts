import * as yup from 'yup';

export const signupSchema = yup.object({
  email: yup.string().trim().required('Email is required').email('Email must be valid'),
  password: yup
    .string()
    .required('Password is required')
    .min(4, 'Password must be between 4 and 20 characters')
    .max(20, 'Password must be between 4 and 20 characters'),
});

export const signinSchema = yup.object({
  email: yup.string().trim().required('Email is required').email('Email must be valid'),
  password: yup.string().required('Password is required'),
});

export type AuthFormValues = yup.InferType<typeof signupSchema>;

export const ticketSchema = yup.object({
  title: yup.string().trim().required('Title is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .moreThan(0, 'Price must be greater than 0'),
});

export type TicketFormValues = yup.InferType<typeof ticketSchema>;
