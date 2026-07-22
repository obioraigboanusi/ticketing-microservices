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
