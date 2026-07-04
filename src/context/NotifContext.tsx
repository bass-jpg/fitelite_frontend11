import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppNotification } from '../types';
import { notificationsApi } from '../services/api';
import { useAuth } from './AuthContext';

interface NotifContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (n: Omit<AppNotification, 'id'>) => void;
  refresh: () => void;
}

const NotifContext = createContext<NotifContextType | null>(null);

// Map backend type to frontend AppNotification
function mapNotif(n: any): AppNotification {
  return {
    id: n.id,
    type: n.type as AppNotification['type'],
    title: n.title,
    message: n.message,
    time: formatTime(n.createdAt),
    read: n.read,
    icon: n.icon || '🔔',
  };
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return `Il y a ${Math.floor(diff / 86400)} jour(s)`;
}

export const NotifProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refresh = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationsApi.findAll();
      setNotifications((res.data || []).map(mapNotif));
    } catch { /* ignore */ }
  };

  useEffect(() => {
    refresh();
    // Poll every 60 seconds
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const markRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { /* ignore */ }
  };

  const addNotification = (n: Omit<AppNotification, 'id'>) => {
    setNotifications(prev => [{ ...n, id: Date.now().toString() }, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, markAllRead, markRead, addNotification, refresh }}>
      {children}
    </NotifContext.Provider>
  );
};

export const useNotif = () => {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotif must be used within NotifProvider');
  return ctx;
};
