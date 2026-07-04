import React, { useEffect, useState } from 'react';
import { Users, ShoppingBag, Trophy, Package, Dumbbell, Bell, TrendingUp } from 'lucide-react';
import { adminUsersApi, adminProductsApi, adminProgramsApi, adminStatsApi } from '../../services/adminApi';
import { useNavigate } from 'react-router-dom';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalPrograms: 0, totalOrders: 0, totalRevenue: 0 });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      adminUsersApi.findAll(1, 1),
      adminProductsApi.findAll(),
      adminProgramsApi.findAll(),
      adminStatsApi.getLeaderboard(),
      adminStatsApi.getOrders(),
    ]).then(([users, products, programs, lb, orders]) => {
      const orderList = orders?.data || [];
      const revenue = orderList.reduce((s: number, o: any) => s + Number(o.totalAmount || 0), 0);
      setStats({
        totalUsers: users?.meta?.total || 0,
        totalProducts: products?.meta?.total || products?.data?.length || 0,
        totalPrograms: programs?.meta?.total || programs?.data?.length || 0,
        totalOrders: orderList.length,
        totalRevenue: revenue,
      });
      setLeaderboard((lb || []).slice(0, 5));
      setRecentOrders(orderList.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: <Users size={20} />, label: 'Utilisateurs', value: stats.totalUsers, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', link: '/admin/users' },
    { icon: <ShoppingBag size={20} />, label: 'Produits', value: stats.totalProducts, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', link: '/admin/products' },
    { icon: <Dumbbell size={20} />, label: 'Programmes', value: stats.totalPrograms, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', link: '/admin/programs' },
    { icon: <Package size={20} />, label: 'Commandes', value: stats.totalOrders, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', link: '/admin/stats' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="card border-red-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-white">Panneau d'administration</h2>
            <p className="text-dark-400 text-sm mt-1">Vue d'ensemble de la plateforme FitTrack</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl text-emerald-400">{stats.totalRevenue.toLocaleString()} FCFA</p>
            <p className="text-dark-400 text-xs mt-1">Revenu total</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <button key={s.label} onClick={() => navigate(s.link)}
            className={`stat-card border ${s.border} text-left hover:scale-105 transition-transform cursor-pointer`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color} mb-3`}>{s.icon}</div>
            <p className={`font-display text-3xl ${s.color}`}>{s.value}</p>
            <p className="text-dark-400 text-xs mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-yellow-400" />
            <h3 className="font-semibold text-white">Top 5 utilisateurs</h3>
          </div>
          <div className="flex flex-col gap-2">
            {leaderboard.length === 0 && <p className="text-dark-500 text-sm text-center py-4">Aucune donnée</p>}
            {leaderboard.map((u, i) => (
              <div key={u.id || i} className="flex items-center gap-3 p-3 bg-dark-800/40 rounded-xl">
                <span className="text-lg w-6 text-center">{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{u.name}</p>
                  <p className="text-dark-500 text-xs">{u.totalSessions || 0} séances · {u.streak || 0}j streak</p>
                </div>
                <span className="text-yellow-400 font-semibold text-sm shrink-0">{(u.points || u.totalPoints || 0).toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={16} className="text-primary-400" />
            <h3 className="font-semibold text-white">Commandes récentes</h3>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-dark-500 text-sm text-center py-4">Aucune commande</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 bg-dark-800/40 rounded-xl">
                  <div>
                    <p className="text-white text-xs font-medium">#{o.id?.slice(0,8)}...</p>
                    <p className="text-dark-500 text-xs">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 text-sm font-semibold">{Number(o.totalAmount).toLocaleString()} FCFA</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      o.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                      o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-blue-500/10 text-blue-400'}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-white mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Gérer les utilisateurs', icon: <Users size={16} />, link: '/admin/users', color: 'text-blue-400' },
            { label: 'Ajouter un produit', icon: <ShoppingBag size={16} />, link: '/admin/products', color: 'text-orange-400' },
            { label: 'Nouveau programme', icon: <Dumbbell size={16} />, link: '/admin/programs', color: 'text-purple-400' },
            { label: 'Envoyer notification', icon: <Bell size={16} />, link: '/admin/notifications', color: 'text-pink-400' },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.link)}
              className="flex flex-col items-center gap-2 p-4 bg-dark-800/40 border border-dark-700 rounded-xl hover:border-dark-600 transition-all">
              <div className={a.color}>{a.icon}</div>
              <p className="text-dark-300 text-xs text-center">{a.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
