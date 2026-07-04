import React, { useEffect, useState } from 'react';
import { Plus, Trophy, Zap, X, Save } from 'lucide-react';
import { adminGamificationApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminGamification: React.FC = () => {
  const [badges, setBadges] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [tab, setTab] = useState<'badges'|'challenges'>('badges');
  const [modal, setModal] = useState<'badge'|'challenge'|null>(null);
  const [saving, setSaving] = useState(false);
  const [bf, setBf] = useState({ label:'', icon:'🏅', description:'', pointsRequired:'0', triggerType:'sessions', triggerValue:'1' });
  const [cf, setCf] = useState({ title:'', description:'', points:'50', icon:'⚡', type:'daily' });

  useEffect(() => {
    adminGamificationApi.getBadges().then(setBadges).catch(()=>{});
    adminGamificationApi.getChallenges().then(setChallenges).catch(()=>{});
  }, []);

  const saveBadge = async () => {
    setSaving(true);
    try {
      const c = await adminGamificationApi.createBadge({...bf, pointsRequired:Number(bf.pointsRequired), triggerValue:Number(bf.triggerValue)});
      setBadges(prev=>[...prev,c]); setModal(null);
    } catch {} finally { setSaving(false); }
  };

  const saveChallenge = async () => {
    setSaving(true);
    try {
      const c = await adminGamificationApi.createChallenge({...cf, points:Number(cf.points)});
      setChallenges(prev=>[...prev,c]); setModal(null);
    } catch {} finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl text-white">Gamification</h2><p className="text-dark-400 text-sm mt-1">Gérez les badges et défis</p></div>
        <Button onClick={()=>setModal(tab==='badges'?'badge':'challenge')}><Plus size={14}/> {tab==='badges'?'Nouveau badge':'Nouveau défi'}</Button>
      </div>
      <div className="flex gap-2 border-b border-dark-700">
        {[{key:'badges',icon:<Trophy size={14}/>,label:`Badges (${badges.length})`},{key:'challenges',icon:<Zap size={14}/>,label:`Défis (${challenges.length})`}].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key as typeof tab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${tab===t.key?'border-red-500 text-red-400':'border-transparent text-dark-400 hover:text-white'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      {tab==='badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map(b=>(
            <div key={b.id} className="flex items-center gap-3 p-4 bg-dark-800/40 border border-dark-700 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl shrink-0">{b.icon}</div>
              <div className="flex-1"><p className="text-white text-sm font-medium">{b.label}</p><p className="text-dark-500 text-xs mt-0.5">{b.description}</p>{b.pointsRequired>0&&<p className="text-yellow-500 text-xs mt-0.5">{b.pointsRequired} pts requis</p>}</div>
            </div>
          ))}
          {badges.length===0&&<p className="text-dark-500 text-sm text-center col-span-2 py-8">Aucun badge</p>}
        </div>
      )}
      {tab==='challenges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challenges.map(c=>(
            <div key={c.id} className="flex items-center gap-3 p-4 bg-dark-800/40 border border-dark-700 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl shrink-0">{c.icon}</div>
              <div className="flex-1"><p className="text-white text-sm font-medium">{c.title}</p><p className="text-dark-500 text-xs mt-0.5">{c.description}</p>
                <div className="flex gap-2 mt-1"><span className="text-yellow-400 text-xs font-semibold">+{c.points} pts</span><span className="text-dark-600 text-xs">{c.type}</span></div>
              </div>
            </div>
          ))}
          {challenges.length===0&&<p className="text-dark-500 text-sm text-center col-span-2 py-8">Aucun défi</p>}
        </div>
      )}
      {modal==='badge' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80" onClick={()=>setModal(null)}/>
          <div className="relative w-full max-w-md bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-dark-700"><h3 className="font-display text-lg text-white">Nouveau badge</h3><button onClick={()=>setModal(null)} className="text-dark-400 hover:text-white"><X size={18}/></button></div>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3"><Input label="Nom" value={bf.label} onChange={e=>setBf(f=>({...f,label:e.target.value}))}/><Input label="Icône (emoji)" value={bf.icon} onChange={e=>setBf(f=>({...f,icon:e.target.value}))}/></div>
              <Input label="Description" value={bf.description} onChange={e=>setBf(f=>({...f,description:e.target.value}))}/>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-dark-300 mb-2">Déclencheur</label><select value={bf.triggerType} onChange={e=>setBf(f=>({...f,triggerType:e.target.value}))} className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"><option value="sessions">Séances</option><option value="streak">Streak</option><option value="points">Points</option></select></div>
                <Input label="Valeur" type="number" value={bf.triggerValue} onChange={e=>setBf(f=>({...f,triggerValue:e.target.value}))}/>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-dark-700"><Button variant="ghost" onClick={()=>setModal(null)} className="flex-1">Annuler</Button><Button onClick={saveBadge} loading={saving} className="flex-1"><Save size={14}/>Créer</Button></div>
          </div>
        </div>
      )}
      {modal==='challenge' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80" onClick={()=>setModal(null)}/>
          <div className="relative w-full max-w-md bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-dark-700"><h3 className="font-display text-lg text-white">Nouveau défi</h3><button onClick={()=>setModal(null)} className="text-dark-400 hover:text-white"><X size={18}/></button></div>
            <div className="p-5 flex flex-col gap-4">
              <Input label="Titre" value={cf.title} onChange={e=>setCf(f=>({...f,title:e.target.value}))}/>
              <Input label="Description" value={cf.description} onChange={e=>setCf(f=>({...f,description:e.target.value}))}/>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Points" type="number" value={cf.points} onChange={e=>setCf(f=>({...f,points:e.target.value}))}/>
                <Input label="Icône" value={cf.icon} onChange={e=>setCf(f=>({...f,icon:e.target.value}))}/>
                <div><label className="block text-sm font-medium text-dark-300 mb-2">Type</label><select value={cf.type} onChange={e=>setCf(f=>({...f,type:e.target.value}))} className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"><option value="daily">Quotidien</option><option value="weekly">Hebdomadaire</option></select></div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-dark-700"><Button variant="ghost" onClick={()=>setModal(null)} className="flex-1">Annuler</Button><Button onClick={saveChallenge} loading={saving} className="flex-1"><Save size={14}/>Créer</Button></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminGamification;
