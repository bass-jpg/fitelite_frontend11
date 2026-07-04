import React, { useState } from 'react';
import { Bell, X, Check, Dumbbell, Utensils, Zap, Trophy, Lightbulb, ShoppingBag, Info } from 'lucide-react';
import { useNotif } from '../context/NotifContext';
import { AppNotification } from '../types';

const typeIcon: Record<AppNotification['type'], React.ReactNode> = {
  training: <Dumbbell size={14} />,
  meal: <Utensils size={14} />,
  motivation: <Lightbulb size={14} />,
  badge: <Trophy size={14} />,
  challenge: <Zap size={14} />,
  order: <ShoppingBag size={14} />,
  system: <Info size={14} />,
};

const typeColor: Record<AppNotification['type'], string> = {
  training: 'text-primary-400 bg-primary-500/10',
  meal: 'text-emerald-400 bg-emerald-500/10',
  motivation: 'text-yellow-400 bg-yellow-500/10',
  badge: 'text-purple-400 bg-purple-500/10',
  challenge: 'text-blue-400 bg-blue-500/10',
  order: 'text-orange-400 bg-orange-500/10',
  system: 'text-dark-400 bg-dark-700/50',
};

const NotificationCenter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotif();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-300 hover:text-white hover:border-dark-600 transition-all"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-40 w-80 bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-dark-700">
              <div>
                <p className="font-semibold text-white text-sm">Notifications</p>
                {unreadCount > 0 && <p className="text-dark-400 text-xs">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                    <Check size={11} /> Tout lire
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-dark-400 hover:text-white"><X size={14} /></button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <div className="p-6 text-center text-dark-500 text-sm">Aucune notification</div>
              )}
              {notifications.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)}
                  className={`flex gap-3 p-4 border-b border-dark-800 cursor-pointer hover:bg-dark-800/50 transition-all ${!n.read ? 'bg-dark-800/30' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColor[n.type] || typeColor.system}`}>
                    {typeIcon[n.type] || typeIcon.system}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-xs font-medium">{n.title}</p>
                      {!n.read && <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shrink-0" />}
                    </div>
                    <p className="text-dark-400 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-dark-600 text-xs mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
