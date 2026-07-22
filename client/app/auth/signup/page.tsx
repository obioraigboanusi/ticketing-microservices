'use client';

import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/lib/auth-context';
import { signupSchema } from '@/lib/validation';

export default function SignUpPage() {
  const { signup } = useAuth();

  return (
    <AuthForm
      title="Create your account"
      submitLabel="Sign up"
      schema={signupSchema}
      onSubmit={signup}
      altPrompt="Already have an account?"
      altHref="/auth/signin"
      altLabel="Sign in"
    />
  );
}
