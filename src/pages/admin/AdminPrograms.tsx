import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Search, Users } from 'lucide-react';
import { adminProgramsApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const LEVELS = ['Débutant','Intermédiaire','Avancé'];
const CATS = ['Force','Cardio','Perte de poids','Prise de masse','Remise en forme','Endurance','HIIT','Flexibilité'];
const empty = { name:'', description:'', duration:'8 semaines', level:'Débutant', category:'Remise en forme', sessionsPerWeek:'3', estimatedMinutes:'60', image:'' };
const lvlBadge: Record<string,any> = { 'Débutant':'green','Intermédiaire':'orange','Avancé':'red' };

const AdminPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { adminProgramsApi.findAll().then(r=>setPrograms(r.data||[])).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  const openEdit = (p: any) => { setEditing(p); setForm({ name:p.name, description:p.description, duration:p.duration, level:p.level, category:p.category, sessionsPerWeek:String(p.sessionsPerWeek), estimatedMinutes:String(p.estimatedMinutes||60), image:p.image||'' }); setModal(true); };
  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      const data = { ...form, sessionsPerWeek:Number(form.sessionsPerWeek), estimatedMinutes:Number(form.estimatedMinutes) };
      if (editing) { const u = await adminProgramsApi.update(editing.id,data); setPrograms(prev=>prev.map(p=>p.id===editing.id?u:p)); }
      else { const c = await adminProgramsApi.create(data); setPrograms(prev=>[c,...prev]); }
      setModal(false);
    } catch {} finally { setSaving(false); }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    await adminProgramsApi.remove(id).catch(()=>{});
    setPrograms(prev=>prev.filter(p=>p.id!==id));
  };

  const filtered = programs.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl text-white">Gestion des programmes</h2><p className="text-dark-400 text-sm mt-1">{programs.length} programmes</p></div>
        <Button onClick={openCreate}><Plus size={14}/> Nouveau programme</Button>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." className="w-full bg-dark-800/60 border border-dark-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-red-500/50" />
      </div>
      {loading ? <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"/></div> : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead><tr className="border-b border-dark-700">{['Programme','Niveau','Catégorie','Durée','Séances/sem','Inscrits','Actions'].map(h=><th key={h} className="text-left text-xs font-semibold text-dark-400 px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id} className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-dark-700 overflow-hidden shrink-0">{p.image?<img src={p.image} alt={p.name} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-xl">🏋️</div>}</div>
                      <div><p className="text-white text-sm font-medium">{p.name}</p><p className="text-dark-500 text-xs">{p.coach?.name||'Sans coach'}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={lvlBadge[p.level]||'gray'} size="sm">{p.level}</Badge></td>
                  <td className="px-4 py-3 text-dark-300 text-xs">{p.category}</td>
                  <td className="px-4 py-3 text-dark-300 text-xs">{p.duration}</td>
                  <td className="px-4 py-3 text-dark-300 text-xs">{p.sessionsPerWeek}x</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1 text-dark-300 text-xs"><Users size={11}/>{p.enrolledCount||0}</div></td>
                  <td className="px-4 py-3"><div className="flex gap-2">
                    <button onClick={()=>openEdit(p)} className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700"><Pencil size={13}/></button>
                    <button onClick={()=>remove(p.id,p.name)} className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={13}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80" onClick={()=>setModal(false)}/>
          <div className="relative w-full max-w-lg bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-dark-700"><h3 className="font-display text-lg text-white">{editing?'Modifier':'Nouveau programme'}</h3><button onClick={()=>setModal(false)} className="text-dark-400 hover:text-white"><X size={18}/></button></div>
            <div className="p-5 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
              <Input label="Nom" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              <div><label className="block text-sm font-medium text-dark-300 mb-2">Description</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none"/></div>
              <div className="grid grid-cols-2 gap-3"><Input label="Durée" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))}/><Input label="Séances/sem" type="number" value={form.sessionsPerWeek} onChange={e=>setForm(f=>({...f,sessionsPerWeek:e.target.value}))}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-dark-300 mb-2">Niveau</label><select value={form.level} onChange={e=>setForm(f=>({...f,level:e.target.value}))} className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">{LEVELS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-dark-300 mb-2">Catégorie</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <Input label="URL image" value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))} placeholder="https://..."/>
              <Input label="Durée estimée (min)" type="number" value={form.estimatedMinutes} onChange={e=>setForm(f=>({...f,estimatedMinutes:e.target.value}))}/>
            </div>
            <div className="flex gap-3 p-5 border-t border-dark-700"><Button variant="ghost" onClick={()=>setModal(false)} className="flex-1">Annuler</Button><Button onClick={save} loading={saving} className="flex-1"><Save size={14}/>Enregistrer</Button></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPrograms;
