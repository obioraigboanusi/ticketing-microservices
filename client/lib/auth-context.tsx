'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { api } from './api';
import { API_ENDPOINTS } from './endpoints';
import type { CurrentUser } from './types';

export type { CurrentUser };

interface Credentials {
  email: string;
  password: string;
}

interface AuthContextValue {
  currentUser: CurrentUser | null;
  signup: (credentials: Credentials) => Promise<void>;
  signin: (credentials: Credentials) => Promise<void>;
  signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: CurrentUser | null;
}) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(initialUser);
  const [prevInitialUser, setPrevInitialUser] = useState<CurrentUser | null>(initialUser);

  // Sync after router.refresh() re-runs the server layout fetch.
  // Adjusting state during render when a prop changes (React-recommended).
  if (initialUser !== prevInitialUser) {
    setPrevInitialUser(initialUser);
    setCurrentUser(initialUser);
  }

  const signup = async (credentials: Credentials) => {
    const { data } = await api.post<CurrentUser>(
      API_ENDPOINTS.users.signup,
      credentials,
    );
    setCurrentUser({ id: data.id, email: data.email });
  };

  const signin = async (credentials: Credentials) => {
    const { data } = await api.post<CurrentUser>(
      API_ENDPOINTS.users.signin,
      credentials,
    );
    setCurrentUser({ id: data.id, email: data.email });
  };

  const signout = async () => {
    await api.post(API_ENDPOINTS.users.signout);
    setCurrentUser(null);
  };

  const value = useMemo(() => ({ currentUser, signup, signin, signout }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
