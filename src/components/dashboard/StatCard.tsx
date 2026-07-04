import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: 'orange' | 'green' | 'blue' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, unit, icon, trend, trendLabel, color = 'orange'
}) => {
  const colors = {
    orange: { bg: 'bg-primary-500/10', border: 'border-primary-500/20', text: 'text-primary-400', icon: 'text-primary-400' },
    green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400' },
    purple: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', icon: 'text-violet-400' },
  };

  const c = colors[color];
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;

  return (
    <div className={`stat-card`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center ${c.icon}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendPositive ? 'text-emerald-400' : trendNegative ? 'text-red-400' : 'text-dark-400'}`}>
            {trendPositive ? <TrendingUp size={12} /> : trendNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="flex items-end gap-1 mb-1">
        <span className="font-display text-3xl text-white">{value}</span>
        {unit && <span className="text-dark-400 text-sm mb-1">{unit}</span>}
      </div>
      <p className="text-dark-400 text-sm">{title}</p>
      {trendLabel && <p className="text-dark-500 text-xs mt-1">{trendLabel}</p>}
    </div>
  );
};

export default StatCard;
