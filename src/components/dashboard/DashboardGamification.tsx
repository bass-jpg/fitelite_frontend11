import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Users, Star } from 'lucide-react';
import { gamificationApi } from '../../services/api';
import { DailyChallenge, BadgeItem, LeaderboardEntry } from '../../types';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

const DashboardGamification: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'defis' | 'badges' | 'classement'>('defis');
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [myBadgeIds, setMyBadgeIds] = useState<Set<string>>(new Set());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const load = async () => {
      try {
        const [ch, allB, myB, lb] = await Promise.all([
          gamificationApi.getChallenges(today),
          gamificationApi.getBadges(),
          gamificationApi.getMyBadges(),
          gamificationApi.getLeaderboard(),
        ]);
        setChallenges((ch || []).map((c: any) => ({
          id: c.id, title: c.title, description: c.description,
          points: c.points, completed: !!c.completed, icon: c.icon,
        })));
        setAllBadges(allB || []);
        setMyBadgeIds(new Set((myB || []).map((ub: any) => ub.badgeId || ub.badge?.id)));
        setLeaderboard((lb || []).map((e: any, i: number) => ({
          rank: i + 1, name: e.name, avatar: e.avatar || '💪',
          sessions: e.totalSessions || 0, streak: e.streak || 0,
          points: e.points || e.totalPoints || 0,
          isCurrentUser: e.id === user?.id,
        })));
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const completeChallenge = async (c: DailyChallenge) => {
    if (c.completed || completing) return;
    setCompleting(c.id);
    try {
      const res = await gamificationApi.completeChallenge(c.id, today);
      setChallenges(prev => prev.map(ch => ch.id === c.id ? { ...ch, completed: true } : ch));
    } catch { /* ignore */ } finally { setCompleting(null); }
  };

  const completedPoints = challenges.filter(c => c.completed).reduce((s, c) => s + c.points, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-white">Gamification</h2>
            <p className="text-dark-400 text-sm mt-1">Défis, badges et classement</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="font-display text-2xl text-yellow-400">{completedPoints}</p>
              <p className="text-xs text-dark-400">Points aujourd'hui</p>
            </div>
            <div className="text-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <p className="font-display text-2xl text-primary-400">{(user?.totalPoints ?? 0).toLocaleString()}</p>
              <p className="text-xs text-dark-400">Points totaux</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-700 pb-0">
        {[
          { key: 'defis', icon: <Zap size={14} />, label: 'Défis du jour' },
          { key: 'badges', icon: <Star size={14} />, label: `Badges (${myBadgeIds.size}/${allBadges.length})` },
          { key: 'classement', icon: <Users size={14} />, label: 'Classement' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
              tab === t.key ? 'border-primary-500 text-primary-400' : 'border-transparent text-dark-400 hover:text-white'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Défis */}
      {tab === 'defis' && (
        <div className="flex flex-col gap-3">
          {challenges.length === 0 && <p className="text-dark-500 text-center py-8">Aucun défi disponible</p>}
          {challenges.map(c => (
            <div key={c.id} onClick={() => completeChallenge(c)}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                c.completed
                  ? 'bg-emerald-500/5 border-emerald-500/20 cursor-default'
                  : 'bg-dark-800/40 border-dark-700 hover:border-primary-500/40 cursor-pointer'
              }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                c.completed ? 'bg-emerald-500/15' : 'bg-dark-700'
              }`}>{c.icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${c.completed ? 'text-dark-400 line-through' : 'text-white'}`}>{c.title}</p>
                <p className="text-dark-500 text-xs mt-0.5">{c.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={c.completed ? 'green' : 'gray'}>
                  {c.completed ? '✓ Complété' : `+${c.points} pts`}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Badges */}
      {tab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allBadges.map(b => {
            const earned = myBadgeIds.has(b.id);
            return (
              <div key={b.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                earned ? 'bg-primary-500/5 border-primary-500/20' : 'bg-dark-800/30 border-dark-700 opacity-50'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  earned ? 'bg-primary-500/15' : 'bg-dark-700'
                }`}>{b.icon}</div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${earned ? 'text-white' : 'text-dark-400'}`}>{b.label}</p>
                  <p className="text-xs text-dark-500 mt-0.5">{b.description}</p>
                  {b.pointsRequired > 0 && <p className="text-xs text-yellow-500 mt-0.5">{b.pointsRequired} points</p>}
                </div>
                {earned && <Badge variant="orange" size="sm">✓</Badge>}
              </div>
            );
          })}
        </div>
      )}

      {/* Classement */}
      {tab === 'classement' && (
        <div className="card">
          <div className="flex flex-col gap-2">
            {leaderboard.map(entry => (
              <div key={entry.rank} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                entry.isCurrentUser ? 'bg-primary-500/10 border border-primary-500/30' : 'hover:bg-dark-800/40'
              }`}>
                <div className={`w-8 text-center font-display text-lg ${
                  entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-gray-400' : entry.rank === 3 ? 'text-amber-600' : 'text-dark-500'
                }`}>{entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}</div>
                <div className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center text-lg shrink-0">
                  {typeof entry.avatar === 'string' && entry.avatar.length <= 2 ? entry.avatar : '💪'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${entry.isCurrentUser ? 'text-primary-400' : 'text-white'}`}>
                    {entry.name} {entry.isCurrentUser && '(moi)'}
                  </p>
                  <p className="text-xs text-dark-500">{entry.sessions} séances · {entry.streak}j streak</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-semibold text-sm">{(entry.points || 0).toLocaleString()}</p>
                  <p className="text-dark-500 text-xs">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardGamification;
