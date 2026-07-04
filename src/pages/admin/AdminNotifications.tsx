import React, { useState, useEffect } from 'react';
import { Send, Users } from 'lucide-react';
import { adminNotificationsApi, adminUsersApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const TYPES = ['training','meal','motivation','badge','challenge','order','system'];
const ICONS: Record<string,string> = { training:'🏋️', meal:'🥗', motivation:'💪', badge:'🏅', challenge:'⚡', order:'📦', system:'🔔' };

const AdminNotifications: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ userId:'', type:'motivation', title:'', message:'', icon:'💪' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [broadcast, setBroadcast] = useState(false);

  useEffect(() => { adminUsersApi.findAll(1,100).then(r=>setUsers(r.data||[])).catch(()=>{}); }, []);

  const send = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    try {
      if (broadcast) { await Promise.all(users.map(u => adminNotificationsApi.send({...form, userId:u.id}))); }
      else { if (!form.userId) return; await adminNotificationsApi.send(form); }
      setSent(true);
      setForm(f=>({...f,title:'',message:''}));
      setTimeout(()=>setSent(false),3000);
    } catch {} finally { setSending(false); }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div><h2 className="font-display text-2xl text-white">Envoyer des notifications</h2><p className="text-dark-400 text-sm mt-1">Envoyez des messages à un ou tous les utilisateurs</p></div>
      <div className="card">
        <div className="flex items-center justify-between mb-6 p-3 bg-dark-800/40 rounded-xl border border-dark-700">
          <div className="flex items-center gap-2"><Users size={16} className="text-dark-400"/><span className="text-sm text-dark-300">Envoyer à tous les utilisateurs ({users.length})</span></div>
          <div onClick={()=>setBroadcast(b=>!b)} className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${broadcast?'bg-red-500':'bg-dark-600'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${broadcast?'translate-x-5':'translate-x-0.5'}`}/></div>
        </div>
        {!broadcast && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-300 mb-2">Destinataire</label>
            <select value={form.userId} onChange={e=>setForm(f=>({...f,userId:e.target.value}))} className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50">
              <option value="">Sélectionner un utilisateur...</option>
              {users.map(u=><option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-dark-300 mb-2">Type</label>
          <div className="grid grid-cols-4 gap-2">
            {TYPES.map(t=>(
              <button key={t} onClick={()=>setForm(f=>({...f,type:t,icon:ICONS[t]||'🔔'}))}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs transition-all ${form.type===t?'bg-red-500/15 border-red-500/50 text-red-400':'border-dark-600 text-dark-400 hover:border-dark-500'}`}>
                <span className="text-lg">{ICONS[t]}</span><span>{t}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Titre" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="ex: Nouvelle séance disponible !"/>
          <div><label className="block text-sm font-medium text-dark-300 mb-2">Message</label><textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} rows={4} placeholder="Contenu de la notification..." className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-red-500/50 resize-none"/></div>
        </div>
        {sent && <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center text-emerald-400 text-sm">✅ Notification{broadcast?'s envoyées':' envoyée'} avec succès !</div>}
        <Button onClick={send} loading={sending} fullWidth className="mt-5" disabled={!form.title||!form.message||(!broadcast&&!form.userId)}>
          <Send size={14}/> {broadcast?`Envoyer à ${users.length} utilisateurs`:'Envoyer'}
        </Button>
      </div>
      {(form.title||form.message) && (
        <div className="card border-dark-600">
          <p className="text-dark-400 text-xs mb-3">Aperçu</p>
          <div className="flex gap-3 p-3 bg-dark-800/50 rounded-xl border border-dark-700">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-lg shrink-0">{form.icon}</div>
            <div><p className="text-white text-sm font-medium">{form.title||'Titre...'}</p><p className="text-dark-400 text-xs mt-0.5">{form.message||'Message...'}</p></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminNotifications;
