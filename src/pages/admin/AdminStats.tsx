import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { adminStatsApi } from '../../services/adminApi';
import { TrendingUp, Trophy, ShoppingBag } from 'lucide-react';

const COLORS = ['#f97316','#3b82f6','#10b981','#8b5cf6','#f43f5e'];

const AdminStats: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminStatsApi.getLeaderboard(), adminStatsApi.getOrders()])
      .then(([lb,ord]) => { setLeaderboard(lb||[]); setOrders(ord?.data||[]); })
      .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const ordersByStatus = orders.reduce((acc:any,o:any) => { acc[o.status]=(acc[o.status]||0)+1; return acc; }, {});
  const pieData = Object.entries(ordersByStatus).map(([name,value])=>({name,value}));
  const revenueByDay = Array.from({length:7},(_,i) => {
    const d = new Date(); d.setDate(d.getDate()-(6-i));
    const ds = d.toISOString().split('T')[0];
    const dayOrders = orders.filter(o=>o.createdAt?.split('T')[0]===ds);
    return { day:d.toLocaleDateString('fr-FR',{weekday:'short'}), revenue:Math.round(dayOrders.reduce((s:number,o:any)=>s+Number(o.totalAmount||0),0)), commandes:dayOrders.length };
  });
  const totalRevenue = orders.reduce((s,o)=>s+Number(o.totalAmount||0),0);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div><h2 className="font-display text-2xl text-white">Statistiques</h2><p className="text-dark-400 text-sm mt-1">Vue d'ensemble des performances</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Revenu total', value:`${totalRevenue.toLocaleString()} FCFA`, icon:<TrendingUp size={18}/>, color:'text-emerald-400' },
          { label:'Commandes totales', value:orders.length, icon:<ShoppingBag size={18}/>, color:'text-primary-400' },
          { label:'Utilisateurs classés', value:leaderboard.length, icon:<Trophy size={18}/>, color:'text-yellow-400' },
        ].map(s=>(
          <div key={s.label} className="stat-card text-center">
            <div className={`${s.color} mb-2 flex justify-center`}>{s.icon}</div>
            <p className={`font-display text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-dark-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="font-semibold text-white mb-5">Revenus des 7 derniers jours</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueByDay} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
            <XAxis dataKey="day" tick={{fill:'#64748b',fontSize:12}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:'#64748b',fontSize:12}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px',color:'#fff'}} formatter={(v:number)=>[`${v.toLocaleString()} FCFA`,'Revenu']}/>
            <Bar dataKey="revenue" fill="#f97316" radius={[6,6,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-white mb-5">Commandes par statut</h3>
          {pieData.length>0?(
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie><Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px',color:'#fff'}}/><Legend wrapperStyle={{color:'#94a3b8',fontSize:12}}/></PieChart>
            </ResponsiveContainer>
          ):<div className="h-48 flex items-center justify-center text-dark-500 text-sm">Aucune commande</div>}
        </div>
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Top utilisateurs</h3>
          <div className="flex flex-col gap-2">
            {leaderboard.slice(0,8).map((u,i)=>(
              <div key={u.id||i} className="flex items-center gap-3">
                <span className="text-sm w-5 text-center text-dark-500">{i+1}</span>
                <div className="w-7 h-7 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-bold shrink-0">{u.name?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-xs font-medium truncate">{u.name}</p>
                    <p className="text-yellow-400 text-xs font-semibold shrink-0">{(u.points||u.totalPoints||0).toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-1 mt-1">
                    <div className="bg-primary-500 h-1 rounded-full" style={{width:`${Math.min(100,((u.points||u.totalPoints||0)/(leaderboard[0]?.points||leaderboard[0]?.totalPoints||1))*100)}%`}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminStats;
