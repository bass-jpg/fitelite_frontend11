import React, { useEffect, useState } from 'react';
import { Search, UserX, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { adminUsersApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';

const roleColors: Record<string, string> = {
  admin: 'text-red-400 bg-red-500/10 border-red-500/30',
  coach: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  user: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminUsersApi.findAll(page, 15);
      setUsers(res.data || []);
      setMeta(res.meta || { total: 0, page: 1, totalPages: 1 });
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const changeRole = async (id: string, role: string) => {
    setActionId(id);
    try {
      await adminUsersApi.updateRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    } catch { } finally { setActionId(null); }
  };

  const deactivate = async (id: string) => {
    if (!confirm('Désactiver ce compte utilisateur ?')) return;
    setActionId(id);
    try {
      await adminUsersApi.deactivate(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { } finally { setActionId(null); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-white">Gestion des utilisateurs</h2>
          <p className="text-dark-400 text-sm mt-1">{meta.total} utilisateurs au total</p>
        </div>
        <Button variant="ghost" onClick={() => load(meta.page)}><RefreshCw size={14} /> Actualiser</Button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom ou email..."
          className="w-full bg-dark-800/60 border border-dark-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-red-500/50" />
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                {['Utilisateur','Email','Niveau','Rôle','Séances','Points','Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-dark-400 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-dark-500 text-sm">Aucun utilisateur trouvé</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xs shrink-0">
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-white text-sm font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-dark-400 text-xs">{u.email}</td>
                  <td className="px-5 py-3 text-dark-300 text-xs">{u.level || '—'}</td>
                  <td className="px-5 py-3">
                    <select value={u.role || 'user'} onChange={e => changeRole(u.id, e.target.value)}
                      disabled={actionId === u.id}
                      className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${roleColors[u.role] || roleColors.user}`}>
                      <option value="user">user</option>
                      <option value="coach">coach</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-dark-300 text-xs">{u.totalSessions || 0}</td>
                  <td className="px-5 py-3 text-yellow-400 text-xs font-semibold">{(u.totalPoints || 0).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => deactivate(u.id)} disabled={actionId === u.id}
                      className="flex items-center gap-1.5 text-xs text-dark-500 hover:text-red-400 transition-colors disabled:opacity-50">
                      <UserX size={13} /> Désactiver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-dark-700">
            <span className="text-dark-400 text-xs">Page {meta.page} / {meta.totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => load(meta.page - 1)} disabled={meta.page <= 1} className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 disabled:opacity-30"><ChevronLeft size={14} /></button>
              <button onClick={() => load(meta.page + 1)} disabled={meta.page >= meta.totalPages} className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 disabled:opacity-30"><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
