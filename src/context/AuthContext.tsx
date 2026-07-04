import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authApi, usersApi, saveTokens, clearTokens, getAccessToken } from '../services/api';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const token = getAccessToken();
      const stored = localStorage.getItem('fittrack_user');
      if (token && stored) {
        setUser(JSON.parse(stored));
        // Re-fetch fresh profile in background
        try {
          const fresh = await authApi.me();
          setUser(fresh);
          localStorage.setItem('fittrack_user', JSON.stringify(fresh));
        } catch {
          clearTokens();
          setUser(null);
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authApi.login(email, password);
      saveTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      localStorage.setItem('fittrack_user', JSON.stringify(res.user));
      return true;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, goal?: string, level?: string): Promise<boolean> => {
    try {
      const res = await authApi.register(name, email, password, goal, level);
      saveTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      localStorage.setItem('fittrack_user', JSON.stringify(res.user));
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearTokens();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const updated = await usersApi.update(user.id, updates);
      setUser(updated);
      localStorage.setItem('fittrack_user', JSON.stringify(updated));
    } catch {
      // Fallback: update locally
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('fittrack_user', JSON.stringify(updated));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
