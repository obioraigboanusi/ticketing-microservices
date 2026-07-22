'use client';

import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/lib/auth-context';
import { signinSchema } from '@/lib/validation';

export default function SignInPage() {
  const { signin } = useAuth();

  return (
    <AuthForm
      title="Welcome back"
      submitLabel="Sign in"
      schema={signinSchema}
      onSubmit={signin}
      altPrompt="Need an account?"
      altHref="/auth/signup"
      altLabel="Sign up"
    />
  );
}
