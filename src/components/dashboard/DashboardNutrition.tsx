import React, { useState, useEffect } from 'react';
import { Utensils, RefreshCw, Flame, Zap, Droplets, Search } from 'lucide-react';
import { nutritionApi } from '../../services/api';
import { Meal } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

type Goal = 'perte-de-poids' | 'prise-de-masse' | 'maintenance';
type PortionSize = 'petite' | 'normale' | 'grande';

const goalTargets: Record<Goal, { calories: number; proteins: number; label: string }> = {
  'perte-de-poids': { calories: 1600, proteins: 100, label: 'Perte de poids' },
  'prise-de-masse': { calories: 2800, proteins: 160, label: 'Prise de masse' },
  'maintenance': { calories: 2200, proteins: 130, label: 'Maintenance' },
};

const MealCard: React.FC<{ meal: Meal; portion: PortionSize; onChangePortion: (s: PortionSize) => void }> = ({ meal, portion, onChangePortion }) => {
  const portions = Array.isArray(meal.portions) && meal.portions.length > 0
    ? meal.portions
    : [{ size: 'petite' as PortionSize, label: 'Petite', multiplier: 0.7 }, { size: 'normale' as PortionSize, label: 'Normale', multiplier: 1 }, { size: 'grande' as PortionSize, label: 'Grande', multiplier: 1.3 }];
  const mult = portions.find(p => p.size === portion)?.multiplier ?? 1;
  const cal = Math.round(meal.calories * mult);
  const prot = Math.round(meal.proteins * mult);
  const img = meal.image || 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80';

  return (
    <div className="bg-dark-800/40 border border-dark-700 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all">
      <div className="relative h-40">
        <img src={img} alt={meal.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="font-semibold text-white text-sm">{meal.name}</h4>
          <div className="flex gap-2 mt-1 flex-wrap">
            {(meal.tags || []).slice(0, 3).map(t => <Badge key={t} size="sm" variant="gray">{t}</Badge>)}
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-dark-400 text-xs mb-3">{meal.description}</p>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5"><Flame size={12} className="text-orange-400" /><span className="text-white text-sm font-semibold">{cal} kcal</span></div>
          <div className="flex items-center gap-1.5"><Zap size={12} className="text-blue-400" /><span className="text-dark-300 text-xs">{prot}g prot.</span></div>
          <div className="flex items-center gap-1.5"><Droplets size={12} className="text-emerald-400" /><span className="text-dark-300 text-xs">{Math.round(meal.carbs * mult)}g glucides</span></div>
        </div>
        <div className="flex gap-2">
          {portions.map(p => (
            <button key={p.size} onClick={() => onChangePortion(p.size as PortionSize)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                portion === p.size ? 'bg-primary-500/15 border-primary-500/50 text-primary-400' : 'border-dark-600 text-dark-400 hover:border-dark-500'
              }`}>
              {p.size.charAt(0).toUpperCase() + p.size.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardNutrition: React.FC = () => {
  const [goal, setGoal] = useState<Goal>('maintenance');
  const [portions, setPortions] = useState<Record<string, PortionSize>>({});
  const [meals, setMeals] = useState<Meal[]>([]);
  const [menuMeals, setMenuMeals] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    nutritionApi.getMeals({ search }).then(res => {
      setMeals(res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [search]);

  const mealsByCategory = {
    breakfast: meals.filter(m => m.category === 'petit-dejeuner'),
    lunch: meals.filter(m => m.category === 'dejeuner'),
    dinner: meals.filter(m => m.category === 'diner'),
  };

  const getPortionMult = (meal: Meal, portion: PortionSize) => {
    const p = (meal.portions || []).find(p => p.size === portion);
    return p?.multiplier ?? 1;
  };

  const currentMeals = {
    breakfast: mealsByCategory.breakfast[menuMeals.breakfast % Math.max(1, mealsByCategory.breakfast.length)],
    lunch: mealsByCategory.lunch[menuMeals.lunch % Math.max(1, mealsByCategory.lunch.length)],
    dinner: mealsByCategory.dinner[menuMeals.dinner % Math.max(1, mealsByCategory.dinner.length)],
  };

  const totalCalories = Object.entries(currentMeals).reduce((acc, [key, m]) => {
    if (!m) return acc;
    const portion = portions[m.id] || 'normale';
    return acc + Math.round(m.calories * getPortionMult(m, portion));
  }, 0);

  const totalProteins = Object.entries(currentMeals).reduce((acc, [key, m]) => {
    if (!m) return acc;
    const portion = portions[m.id] || 'normale';
    return acc + Math.round(m.proteins * getPortionMult(m, portion));
  }, 0);

  const target = goalTargets[goal];
  const calPercent = Math.min(100, Math.round((totalCalories / target.calories) * 100));

  const shuffle = (key: keyof typeof menuMeals) => {
    setMenuMeals(prev => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const saveMenu = async () => {
    const meals = Object.values(currentMeals).filter(Boolean);
    if (meals.length === 0) return;
    setSaving(true);
    try {
      await nutritionApi.createMenu({
        date: new Date().toISOString().split('T')[0],
        goal,
        breakfastId: currentMeals.breakfast?.id,
        lunchId: currentMeals.lunch?.id,
        dinnerId: currentMeals.dinner?.id,
        calorieTarget: target.calories,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  const sections = [
    { key: 'breakfast' as const, label: '🌅 Petit-déjeuner', meal: currentMeals.breakfast },
    { key: 'lunch' as const, label: '☀️ Déjeuner', meal: currentMeals.lunch },
    { key: 'dinner' as const, label: '🌙 Dîner', meal: currentMeals.dinner },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Goal selector */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Utensils size={16} className="text-primary-400" />
          <h3 className="font-semibold text-white">Mon objectif nutritionnel</h3>
        </div>
        <div className="flex gap-3 flex-wrap">
          {(Object.keys(goalTargets) as Goal[]).map(g => (
            <button key={g} onClick={() => setGoal(g)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                goal === g ? 'bg-primary-500/15 border-primary-500 text-primary-400' : 'bg-dark-800/40 border-dark-600 text-dark-400 hover:border-dark-500'
              }`}>
              {goalTargets[g].label}
            </button>
          ))}
        </div>

        {/* Calorie tracker */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-300">Calories du menu : <span className="text-white font-semibold">{totalCalories} kcal</span></span>
            <span className="text-sm text-dark-400">Objectif : {target.calories} kcal</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all ${calPercent > 100 ? 'bg-red-500' : 'bg-primary-500'}`} style={{ width: `${calPercent}%` }} />
          </div>
          <div className="flex justify-between text-xs text-dark-500 mt-1.5">
            <span>{calPercent}% de l'objectif · {totalProteins}g protéines</span>
            <span className={calPercent > 100 ? 'text-red-400' : 'text-emerald-400'}>
              {calPercent > 100 ? `+${totalCalories - target.calories} kcal` : `−${target.calories - totalCalories} kcal`}
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un repas..."
          className="w-full bg-dark-800/60 border border-dark-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50" />
      </div>

      {/* Meals grid */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        sections.map(({ key, label, meal }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{label}</h3>
              <button onClick={() => shuffle(key)} className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 transition-colors">
                <RefreshCw size={12} /> Changer
              </button>
            </div>
            {meal ? (
              <MealCard
                meal={meal}
                portion={portions[meal.id] || 'normale'}
                onChangePortion={s => setPortions(prev => ({ ...prev, [meal.id]: s }))}
              />
            ) : (
              <div className="h-20 flex items-center justify-center text-dark-500 text-sm bg-dark-800/30 rounded-xl border border-dark-700">
                Aucun repas disponible dans cette catégorie
              </div>
            )}
          </div>
        ))
      )}

      {/* Save menu button */}
      <div className="flex justify-end">
        <Button onClick={saveMenu} loading={saving} disabled={saved}>
          {saved ? '✓ Menu enregistré !' : 'Enregistrer ce menu'}
        </Button>
      </div>
    </div>
  );
};

export default DashboardNutrition;
