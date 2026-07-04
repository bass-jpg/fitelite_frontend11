import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, BarChart2, Settings,
  LogOut, ChevronLeft, ChevronRight, Utensils,
  ShoppingBag, Trophy, MapPin, Shield,
} from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import NotificationCenter from '../NotificationCenter';

interface SidebarProps { collapsed: boolean; onToggle: () => void; }

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/dashboard/programme', icon: Dumbbell, label: 'Programme' },
  { to: '/dashboard/progression', icon: BarChart2, label: 'Progression' },
  { to: '/dashboard/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/dashboard/boutique', icon: ShoppingBag, label: 'Boutique' },
  { to: '/dashboard/gamification', icon: Trophy, label: 'Défis & Badges' },
  { to: '/dashboard/carte', icon: MapPin, label: 'Carte' },
  { to: '/dashboard/parametres', icon: Settings, label: 'Paramètres' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-dark-900 border-r border-dark-700 flex flex-col h-screen sticky top-0 shrink-0`}>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 h-16 border-b border-dark-700`}>
        {!collapsed && <Logo size="sm" />}
        <button onClick={onToggle} className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-all">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20' : 'text-dark-400 hover:text-white hover:bg-dark-800'}
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Admin button — visible only to admin users */}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mt-2 border
              ${isActive ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border-red-500/20'}
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? 'Administration' : undefined}
          >
            <Shield size={18} className="shrink-0" />
            {!collapsed && <span>Administration</span>}
          </NavLink>
        )}
      </nav>

      <div className="p-3 border-t border-dark-700">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-xs shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-dark-400 truncate">{user?.level}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-6 shrink-0">
          <div>{title && <h1 className="text-lg font-semibold text-white">{title}</h1>}</div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <NavLink to="/dashboard/boutique" className="relative p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-all">
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{totalItems}</span>
              )}
            </NavLink>
            <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
