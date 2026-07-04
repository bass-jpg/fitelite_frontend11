import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Badge from '../ui/Badge';
import { sessionsApi, gamificationApi } from '../../services/api';
import { ProgressData } from '../../types';
import { TrendingUp, Award, Flame, Clock, Dumbbell } from 'lucide-react';

type Metric = 'calories' | 'sessions' | 'duration';

const DashboardProgress: React.FC = () => {
  const [metric, setMetric] = useState<Metric>('calories');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sessionsApi.getProgress(8),
      sessionsApi.findAll({ completed: true, limit: 100 }),
      gamificationApi.getMyBadges(),
    ]).then(([prog, sessRes, myBadges]) => {
      setProgressData(prog || []);
      setSessions(sessRes?.data || []);
      setBadges(myBadges || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const metricConfig: Record<Metric, { label: string; color: string; unit: string }> = {
    calories: { label: 'Calories', color: '#f97316', unit: 'kcal' },
    sessions: { label: 'Séances', color: '#3b82f6', unit: '' },
    duration: { label: 'Durée', color: '#8b5cf6', unit: 'min' },
  };

  const totalCalories = sessions.reduce((a: number, b: any) => a + (b.calories || 0), 0);
  const totalDuration = sessions.reduce((a: number, b: any) => a + (b.duration || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Semaines actives', value: String(progressData.length) },
          { label: 'Séances totales', value: String(sessions.length) },
          { label: 'Calories totales', value: `${totalCalories.toLocaleString()} kcal` },
          { label: 'Temps total', value: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}min` },
        ].map(s => (
          <div key={s.label} className="stat-card text-center">
            <p className="font-display text-2xl text-white mb-1">{s.value}</p>
            <p className="text-dark-400 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-semibold text-white">Évolution sur {progressData.length} semaines</h3>
          <div className="flex gap-2">
            {(Object.keys(metricConfig) as Metric[]).map(m => (
              <button key={m} onClick={() => setMetric(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  metric === m
                    ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                    : 'text-dark-400 hover:text-white border border-transparent'
                }`}
              >{metricConfig[m].label}</button>
            ))}
          </div>
        </div>
        {progressData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricConfig[metric].color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={metricConfig[metric].color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                formatter={(v: number) => [`${v} ${metricConfig[metric].unit}`, metricConfig[metric].label]}
              />
              <Area type="monotone" dataKey={metric} stroke={metricConfig[metric].color} strokeWidth={2}
                fill="url(#metricGrad)" dot={{ r: 3, fill: metricConfig[metric].color }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center gap-2 text-dark-500">
            <Dumbbell size={32} className="opacity-30" />
            <p className="text-sm">Complétez vos premières séances pour voir vos progrès</p>
          </div>
        )}
      </div>

      {/* Bar chart sessions */}
      {progressData.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-white mb-6">Séances par semaine</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={progressData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                formatter={(v: number) => [v, 'Séances']} cursor={{ fill: 'rgba(249,115,22,0.05)' }} />
              <Bar dataKey="sessions" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* My badges from API */}
      <div className="card">
        <h3 className="font-semibold text-white mb-4">Badges débloqués ({badges.length})</h3>
        {badges.length === 0 ? (
          <p className="text-dark-500 text-sm text-center py-4">
            Complétez des séances et des défis pour débloquer des badges !
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((ub: any) => {
              const b = ub.badge || ub;
              return (
                <div key={ub.id} className="flex items-center gap-3 p-4 rounded-xl border bg-primary-500/5 border-primary-500/20">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary-500/15 text-2xl">
                    {b.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{b.label}</p>
                    <p className="text-xs text-dark-500 mt-0.5">{b.description}</p>
                  </div>
                  <Badge variant="orange" size="sm">✓</Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardProgress;
