import { createContext, useEffect, useState, type ReactNode } from 'react';
import { authApi } from '@/api/services';
import type { AuthSession, SessionUser } from '@/types/api';

const STORAGE_KEY = 'tripstay.session';

interface AuthContextValue {
  user: SessionUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string; role?: 'customer' | 'admin' | 'hotel_owner' | 'hotel_staff' }) => Promise<void>;
  register: (payload: { fullName: string; email: string; phoneNumber?: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  setSession: (session: AuthSession | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(() => readStoredSession());
  const [isLoading, setIsLoading] = useState(true);

  const setSession = (nextSession: AuthSession | null) => {
    setSessionState(nextSession);

    if (nextSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const refreshSession = async () => {
    if (!session?.token) {
      setIsLoading(false);
      return;
    }

    try {
      const nextSession = await authApi.me(session.token);
      setSession({ ...nextSession, token: session.token });
    } catch {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        isLoading,
        isAuthenticated: Boolean(session?.token),
        login: async (payload) => {
          const nextSession = await authApi.login(payload);
          setSession(nextSession);
        },
        register: async (payload) => {
          const nextSession = await authApi.register(payload);
          setSession(nextSession);
        },
        logout: () => setSession(null),
        refreshSession,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
