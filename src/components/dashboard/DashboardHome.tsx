import React, { useEffect, useState } from 'react';
import { Flame, Target, Dumbbell, TrendingUp, Zap, Trophy, Clock, BarChart2, CloudSun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sessionsApi, gamificationApi, weatherApi } from '../../services/api';
import Badge from '../ui/Badge';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { ProgressData, DailyChallenge } from '../../types';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    sessionsApi.getProgress(6).then(setProgress).catch(() => {});
    gamificationApi.getChallenges(today).then(data => setChallenges(
      (data || []).map((c: any) => ({
        id: c.id, title: c.title, description: c.description,
        points: c.points, completed: !!c.completed, icon: c.icon,
        userChallengeId: c.userChallengeId,
      }))
    )).catch(() => {});
    sessionsApi.findAll({ completed: true, limit: 100 }).then(res => {
      const sessions = res.data || [];
      const weekCal = sessions.slice(0, 4).reduce((a: number, s: any) => a + (s.calories || 0), 0);
      setStats({ totalSessions: sessions.length, weekCalories: weekCal });
    }).catch(() => {});
    // Weather for Dakar by default
    weatherApi.getCurrent('Dakar').then(setWeather).catch(() => {});
  }, []);

  const completeChallenge = async (c: DailyChallenge) => {
    if (c.completed || completing) return;
    setCompleting(c.id);
    try {
      await gamificationApi.completeChallenge(c.id, today);
      setChallenges(prev => prev.map(ch =>
        ch.id === c.id ? { ...ch, completed: true } : ch
      ));
    } catch { /* ignore */ } finally {
      setCompleting(null);
    }
  };

  const todayChallenges = challenges.filter(c => c.completed).length;
  const miniData = progress.slice(-6);

  const statCards = [
    { icon: <Flame size={20} />, label: 'Streak actuel', value: `${user?.streak ?? 0} jours`, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { icon: <Target size={20} />, label: 'Poids actuel', value: `${user?.weight ?? '–'} kg`, sub: user?.targetWeight ? `Objectif : ${user.targetWeight} kg` : undefined, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: <Flame size={20} />, label: 'Calories (semaine)', value: `${(stats?.weekCalories ?? 0).toLocaleString()} kcal`, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { icon: <Dumbbell size={20} />, label: 'Séances totales', value: String(stats?.totalSessions ?? user?.totalSessions ?? 0), color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Welcome */}
      <div className="card flex items-center justify-between gap-4">
        <div>
          <p className="text-dark-400 text-sm mb-1">Bonjour 👋</p>
          <h2 className="font-display text-3xl text-white">{user?.name}</h2>
          <p className="text-dark-300 text-sm mt-1">{user?.goal} · {user?.level}</p>
        </div>
        <div className="flex items-center gap-3">
          {weather && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <CloudSun size={16} className="text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">{weather.temperature}°C</span>
              <span className="text-dark-400 text-xs hidden sm:block">{weather.city}</span>
            </div>
          )}
          <Badge variant="orange"><Flame size={12} className="mr-1" />{user?.streak ?? 0} jours consécutifs</Badge>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className={`stat-card border ${s.border}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color} mb-3`}>{s.icon}</div>
            <p className={`font-display text-xl ${s.color}`}>{s.value}</p>
            <p className="text-dark-400 text-xs mt-0.5">{s.label}</p>
            {s.sub && <p className="text-dark-500 text-xs mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mini chart */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-primary-400" />
            <h3 className="font-semibold text-white text-sm">Calories (6 dernières semaines)</h3>
          </div>
          {miniData.length > 0 ? (
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={miniData}>
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: 12 }} formatter={(v: number) => [`${v} kcal`]} />
                <Area type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} fill="url(#calGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-24 flex items-center justify-center text-dark-500 text-sm">
              Aucune donnée — commencez votre première séance !
            </div>
          )}
        </div>

        {/* Daily challenges */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <h3 className="font-semibold text-white text-sm">Défis du jour</h3>
            </div>
            <Badge variant="green">{todayChallenges}/{challenges.length} complétés</Badge>
          </div>
          <div className="flex flex-col gap-2">
            {challenges.length === 0 && (
              <p className="text-dark-500 text-xs text-center py-4">Chargement des défis...</p>
            )}
            {challenges.map(c => (
              <button
                key={c.id}
                onClick={() => completeChallenge(c)}
                disabled={c.completed || completing === c.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left w-full ${
                  c.completed
                    ? 'bg-emerald-500/5 border-emerald-500/20 cursor-default'
                    : 'bg-dark-800/30 border-dark-700 hover:border-primary-500/40 cursor-pointer'
                }`}
              >
                <span className="text-lg">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${c.completed ? 'text-white line-through opacity-60' : 'text-white'}`}>{c.title}</p>
                </div>
                <Badge variant={c.completed ? 'green' : 'gray'} size="sm">+{c.points}pts</Badge>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Points total */}
      <div className="card border-primary-500/20">
        <div className="flex items-center gap-3 mb-2">
          <Trophy size={16} className="text-yellow-400" />
          <h3 className="font-semibold text-white text-sm">Points & Progression</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-3xl text-yellow-400">{(user?.totalPoints ?? 0).toLocaleString()}</p>
            <p className="text-dark-400 text-sm mt-1">Points totaux accumulés</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center px-4 py-2 bg-dark-800/50 rounded-xl">
              <p className="font-display text-xl text-white">{user?.streak ?? 0}</p>
              <p className="text-dark-500 text-xs">Jours de suite</p>
            </div>
            <div className="text-center px-4 py-2 bg-dark-800/50 rounded-xl">
              <p className="font-display text-xl text-white">{user?.totalSessions ?? 0}</p>
              <p className="text-dark-500 text-xs">Séances</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weight progression */}
      {user?.weight && user?.targetWeight && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-emerald-400" />
            <h3 className="font-semibold text-white text-sm">Progression du poids</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-2xl text-white">{user.weight} kg</p>
              <p className="text-dark-400 text-xs">Poids actuel</p>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-dark-400 mb-1">
                <span>Actuel: {user.weight} kg</span>
                <span>Objectif: {user.targetWeight} kg</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, ((user.weight - user.targetWeight) / (user.weight - user.targetWeight + 5)) * 100))}%` }}
                />
              </div>
              <p className="text-emerald-400 text-xs mt-1">Objectif : {user.targetWeight} kg</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
