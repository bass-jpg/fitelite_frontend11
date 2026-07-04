import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react';
import { adminNutritionApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CATEGORIES = [
  { value: 'petit-dejeuner', label: '🌅 Petit-déjeuner' },
  { value: 'dejeuner', label: '☀️ Déjeuner' },
  { value: 'diner', label: '🌙 Dîner' },
  { value: 'collation', label: '🍎 Collation' },
];

const emptyForm = { name: '', category: 'dejeuner', calories: '', proteins: '', carbs: '', fats: '', image: '', description: '' };

const AdminNutrition: React.FC = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminNutritionApi.findAll();
      setMeals(res.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (m: any) => {
    setEditing(m);
    setForm({
      name: m.name, category: m.category,
      calories: String(m.calories), proteins: String(m.proteins),
      carbs: String(m.carbs), fats: String(m.fats),
      image: m.image || '', description: m.description || '',
    });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        calories: Number(form.calories),
        proteins: Number(form.proteins),
        carbs: Number(form.carbs),
        fats: Number(form.fats),
      };
      if (editing) {
        const updated = await adminNutritionApi.update(editing.id, data);
        setMeals(prev => prev.map(m => m.id === editing.id ? updated : m));
      } else {
        const created = await adminNutritionApi.create(data);
        setMeals(prev => [created, ...prev]);
      }
      setModal(false);
    } catch { } finally { setSaving(false); }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    try {
      await adminNutritionApi.remove(id);
      setMeals(prev => prev.filter(m => m.id !== id));
    } catch { }
  };

  const filtered = meals.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.category?.toLowerCase().includes(search.toLowerCase())
  );

  const catLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat;

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-white">Gestion de la nutrition</h2>
          <p className="text-dark-400 text-sm mt-1">{meals.length} repas dans le catalogue</p>
        </div>
        <Button onClick={openCreate}><Plus size={14} /> Nouveau repas</Button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un repas..."
          className="w-full bg-dark-800/60 border border-dark-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-red-500/50" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left text-xs font-semibold text-dark-400 px-5 py-3">Repas</th>
                <th className="text-left text-xs font-semibold text-dark-400 px-5 py-3">Catégorie</th>
                <th className="text-left text-xs font-semibold text-dark-400 px-5 py-3">Calories</th>
                <th className="text-left text-xs font-semibold text-dark-400 px-5 py-3">Protéines</th>
                <th className="text-left text-xs font-semibold text-dark-400 px-5 py-3">Glucides</th>
                <th className="text-left text-xs font-semibold text-dark-400 px-5 py-3">Lipides</th>
                <th className="text-left text-xs font-semibold text-dark-400 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-dark-500 text-sm">Aucun repas trouvé</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-dark-700 overflow-hidden shrink-0">
                        {m.image
                          ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{m.name}</p>
                        <p className="text-dark-500 text-xs line-clamp-1">{m.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-dark-300 text-xs">{catLabel(m.category)}</td>
                  <td className="px-5 py-3 text-orange-400 text-sm font-semibold">{m.calories} kcal</td>
                  <td className="px-5 py-3 text-blue-400 text-xs">{m.proteins}g</td>
                  <td className="px-5 py-3 text-emerald-400 text-xs">{m.carbs}g</td>
                  <td className="px-5 py-3 text-yellow-400 text-xs">{m.fats}g</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-all"><Pencil size={13} /></button>
                      <button onClick={() => remove(m.id, m.name)} className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80" onClick={() => setModal(false)} />
          <div className="relative w-full max-w-lg bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-display text-lg text-white">{editing ? 'Modifier le repas' : 'Nouveau repas'}</h3>
              <button onClick={() => setModal(false)} className="text-dark-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <Input label="Nom du repas" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ex: Thiéboudienne" />
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Catégorie</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Calories (kcal)" type="number" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} />
                <Input label="Protéines (g)" type="number" value={form.proteins} onChange={e => setForm(f => ({ ...f, proteins: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Glucides (g)" type="number" value={form.carbs} onChange={e => setForm(f => ({ ...f, carbs: e.target.value }))} />
                <Input label="Lipides (g)" type="number" value={form.fats} onChange={e => setForm(f => ({ ...f, fats: e.target.value }))} />
              </div>
              <Input label="URL de l'image" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="flex gap-3 p-5 border-t border-dark-700">
              <Button variant="ghost" onClick={() => setModal(false)} className="flex-1">Annuler</Button>
              <Button onClick={save} loading={saving} className="flex-1"><Save size={14} /> Enregistrer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNutrition;
