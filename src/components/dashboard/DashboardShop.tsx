import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Plus, Minus, X, Check, Search, RefreshCw } from 'lucide-react';
import { productsApi, ordersApi } from '../../services/api';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

type Category = 'all' | 'vetements' | 'accessoires' | 'complements';
const categoryLabels: Record<Category, string> = { all: 'Tout', vetements: 'Vêtements', accessoires: 'Accessoires', complements: 'Compléments' };

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, items } = useCart();
  const inCart = items.find(i => i.product.id === product.id);
  const img = product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80';

  return (
    <div className="bg-dark-800/40 border border-dark-700 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all group">
      <div className="relative h-48 overflow-hidden">
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {!product.inStock && (
          <div className="absolute inset-0 bg-dark-950/70 flex items-center justify-center">
            <Badge variant="red">Rupture de stock</Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={product.category === 'complements' ? 'blue' : product.category === 'vetements' ? 'orange' : 'green'} size="sm">
            {categoryLabels[product.category as Category]}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-white text-sm mb-1">{product.name}</h4>
        <p className="text-dark-400 text-xs mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1 mb-3">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-medium">{product.rating}</span>
          <span className="text-dark-500 text-xs">({product.reviews} avis)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg text-primary-400">{Number(product.price).toLocaleString()} FCFA</span>
          <Button size="sm" onClick={() => addToCart(product)} disabled={!product.inStock}
            className={inCart ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400' : ''}>
            {inCart ? <><Check size={12} /> Ajouté</> : <><Plus size={12} /> Ajouter</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

const DashboardShop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  useEffect(() => {
    setLoading(true);
    productsApi.findAll({
      category: category !== 'all' ? category : undefined,
      search: search || undefined,
    }).then(res => setProducts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search]);

  const handleOrder = async () => {
    if (items.length === 0) return;
    setOrdering(true);
    try {
      await ordersApi.create(items.map(i => ({ productId: i.product.id, quantity: i.quantity })));
      clearCart();
      setOrdered(true);
      setCartOpen(false);
      setTimeout(() => setOrdered(false), 4000);
    } catch { /* ignore */ } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-white">Boutique FitTrack</h2>
          <p className="text-dark-400 text-sm mt-1">Équipement, vêtements et compléments</p>
        </div>
        <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 px-4 py-2.5 bg-primary-500/15 border border-primary-500/30 text-primary-400 rounded-xl hover:bg-primary-500/20 transition-all">
          <ShoppingCart size={16} />
          <span className="text-sm font-medium">Mon panier</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{totalItems}</span>
          )}
        </button>
      </div>

      {ordered && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center text-emerald-400">
          ✅ Commande passée avec succès ! Merci pour votre achat.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..."
            className="w-full bg-dark-800/60 border border-dark-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(categoryLabels) as Category[]).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                category === c ? 'bg-primary-500/15 border-primary-500 text-primary-400' : 'bg-dark-800/40 border-dark-600 text-dark-400 hover:border-dark-500'
              }`}>{categoryLabels[c]}</button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
          {products.length === 0 && (
            <div className="col-span-3 text-center py-12 text-dark-500">Aucun produit trouvé</div>
          )}
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-dark-950/80" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-dark-900 border-l border-dark-700 h-full flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-display text-xl text-white">Mon panier ({totalItems})</h3>
              <button onClick={() => setCartOpen(false)} className="text-dark-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-dark-500 text-sm">Votre panier est vide</div>
              ) : (
                items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl border border-dark-700">
                    <img src={item.product.image || ''} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
                      <p className="text-xs text-primary-400">{Number(item.product.price).toLocaleString()} FCFA</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))} className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center text-dark-300 hover:text-white"><Minus size={12} /></button>
                      <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center text-dark-300 hover:text-white"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-dark-500 hover:text-red-400 transition-colors"><X size={14} /></button>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="p-5 border-t border-dark-700">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-dark-400">Total</span>
                  <span className="text-white font-semibold">{totalPrice.toLocaleString()} FCFA</span>
                </div>
                <Button fullWidth onClick={handleOrder} loading={ordering}>Commander maintenant</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardShop;
