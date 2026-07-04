import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react';
import { adminProductsApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CATEGORIES = ['vetements', 'accessoires', 'complements'];
const empty = { name: '', description: '', price: '', category: 'accessoires', image: '', inStock: true, stockQuantity: '0' };

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { adminProductsApi.findAll().then(r => setProducts(r.data||[])).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  const openEdit = (p: any) => { setEditing(p); setForm({ name:p.name, description:p.description, price:String(p.price), category:p.category, image:p.image||'', inStock:p.inStock, stockQuantity:String(p.stockQuantity||0) }); setModal(true); };
  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity) };
      if (editing) { const u = await adminProductsApi.update(editing.id, data); setProducts(prev => prev.map(p => p.id===editing.id?u:p)); }
      else { const c = await adminProductsApi.create(data); setProducts(prev => [c,...prev]); }
      setModal(false);
    } catch {} finally { setSaving(false); }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    await adminProductsApi.remove(id).catch(()=>{});
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl text-white">Gestion de la boutique</h2><p className="text-dark-400 text-sm mt-1">{products.length} produits</p></div>
        <Button onClick={openCreate}><Plus size={14} /> Nouveau produit</Button>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." className="w-full bg-dark-800/60 border border-dark-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-red-500/50" />
      </div>
      {loading ? <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-dark-800/40 border border-dark-700 rounded-2xl overflow-hidden">
              <div className="h-40 bg-dark-700 relative">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>}
                <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${p.inStock?'bg-emerald-500/20 text-emerald-400':'bg-red-500/20 text-red-400'}`}>{p.inStock?'En stock':'Rupture'}</div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-white text-sm">{p.name}</p>
                <p className="text-dark-400 text-xs mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between mt-3"><span className="text-primary-400 font-bold">{Number(p.price).toLocaleString()} FCFA</span><span className="text-dark-500 text-xs">{p.category}</span></div>
                <div className="flex gap-2 mt-3">
                  <button onClick={()=>openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dark-600 text-dark-300 hover:text-white text-xs transition-all"><Pencil size={11}/>Modifier</button>
                  <button onClick={()=>remove(p.id,p.name)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition-all"><Trash2 size={11}/>Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80" onClick={()=>setModal(false)} />
          <div className="relative w-full max-w-lg bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-display text-lg text-white">{editing?'Modifier':'Nouveau produit'}</h3>
              <button onClick={()=>setModal(false)} className="text-dark-400 hover:text-white"><X size={18}/></button>
            </div>
            <div className="p-5 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
              <Input label="Nom" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              <div><label className="block text-sm font-medium text-dark-300 mb-2">Description</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Prix (FCFA)" type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
                <Input label="Stock" type="number" value={form.stockQuantity} onChange={e=>setForm(f=>({...f,stockQuantity:e.target.value}))} />
              </div>
              <div><label className="block text-sm font-medium text-dark-300 mb-2">Catégorie</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="w-full bg-dark-800/60 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              <Input label="URL image" value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))} placeholder="https://..." />
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={()=>setForm(f=>({...f,inStock:!f.inStock}))} className={`relative w-10 h-5 rounded-full transition-colors ${form.inStock?'bg-emerald-500':'bg-dark-600'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.inStock?'translate-x-5':'translate-x-0.5'}`}/></div>
                <span className="text-sm text-dark-300">En stock</span>
              </label>
            </div>
            <div className="flex gap-3 p-5 border-t border-dark-700">
              <Button variant="ghost" onClick={()=>setModal(false)} className="flex-1">Annuler</Button>
              <Button onClick={save} loading={saving} className="flex-1"><Save size={14}/>Enregistrer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminProducts;
