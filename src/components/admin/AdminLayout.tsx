import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingBag, Dumbbell,
  Utensils, Trophy, Bell, LogOut, ChevronLeft,
  ChevronRight, Shield, BarChart2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: "Vue d'ensemble", end: true },
  { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { to: '/admin/products', icon: ShoppingBag, label: 'Boutique' },
  { to: '/admin/programs', icon: Dumbbell, label: 'Programmes' },
  { to: '/admin/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/admin/gamification', icon: Trophy, label: 'Gamification' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/stats', icon: BarChart2, label: 'Statistiques' },
];

const AdminLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-dark-900 border-r border-dark-700 flex flex-col h-screen sticky top-0 shrink-0`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 h-16 border-b border-dark-700`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="font-display text-lg text-white">FitTrack</span>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg">ADMIN</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-all">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'text-dark-400 hover:text-white hover:bg-dark-800'}
                ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-dark-700 flex flex-col gap-2">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <Shield size={14} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-red-400">Administrateur</p>
              </div>
            </div>
          )}
          <button onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-dark-400 hover:text-white hover:bg-dark-800 transition-all ${collapsed ? 'justify-center' : ''}`}>
            <LayoutDashboard size={16} />
            {!collapsed && <span>Tableau de bord</span>}
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={16} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-red-400" />
            {title && <h1 className="text-lg font-semibold text-white">{title}</h1>}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-medium">Mode Administrateur</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
