import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, json } from './api';
import type { AIStatus, User } from '../types';

type AuthContextValue = {
  user: User | null;
  ai: AIStatus | null;
  loading: boolean;
  enter: (username: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ai, setAI] = useState<AIStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const result = await api<{ user: User; ai: AIStatus }>('/api/auth/me');
      setUser(result.user);
      setAI(result.ai);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const enter = async (username: string, displayName?: string) => {
    const result = await api<{ user: User }>('/api/auth/enter', { method: 'POST', body: json({ username, displayName }) });
    setUser(result.user);
    await refresh();
  };

  const logout = async () => {
    try { await api('/api/auth/logout', { method: 'POST' }); } finally {
      setUser(null);
      setAI(null);
    }
  };

  return <AuthContext.Provider value={{ user, ai, loading, enter, logout, refresh, setUser }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
