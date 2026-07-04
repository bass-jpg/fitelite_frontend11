import React, { useState, useEffect } from 'react';
import { MapPin, Star, Phone, Clock, Navigation, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockGyms } from '../../utils/mockData';
import { GymLocation } from '../../types';
import Badge from '../ui/Badge';
import { coachesApi } from '../../services/api';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createIcon = (color: string, emoji: string) =>
  L.divIcon({
    html: `<div style="background: ${color}; width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;"><span style="transform: rotate(45deg); font-size: 16px; display: block; text-align: center; line-height: 30px;">${emoji}</span></div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

const salleIcon = createIcon('#f97316', '🏋️');
const coachIcon = createIcon('#3b82f6', '👤');
const userIcon = L.divIcon({
  html: `<div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(16,185,129,0.3);"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const FlyToLocation: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 15, { duration: 1.2 }); }, [lat, lng]);
  return null;
};

type FilterType = 'all' | 'salle' | 'coach';

const DashboardMap: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selected, setSelected] = useState<GymLocation | null>(null);
  const [search, setSearch] = useState('');
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [gyms, setGyms] = useState<GymLocation[]>(mockGyms);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserPos({ lat: 14.6937, lng: -17.4441 }),
    );
  }, []);

  useEffect(() => {
    coachesApi.findAll().then(res => {
      const apiCoaches: GymLocation[] = (res.data || []).map((c: any) => ({
        id: c.id, name: c.name, type: 'coach' as const,
        address: c.locationAddress || 'Dakar', city: 'Dakar',
        lat: c.locationLat || 14.6937 + (Math.random() - 0.5) * 0.05,
        lng: c.locationLng || -17.4441 + (Math.random() - 0.5) * 0.05,
        rating: Number(c.rating) || 4.5, phone: c.phone,
        specialties: c.certifications || [c.specialty], image: c.image,
      }));
      const sallesOnly = mockGyms.filter(g => g.type === 'salle');
      setGyms([...sallesOnly, ...apiCoaches]);
    }).catch(() => {});
  }, []);

  const filtered = gyms.filter(g => {
    const matchType = filter === 'all' || g.type === filter;
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.city.toLowerCase().includes(search.toLowerCase()) || g.address.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleSelect = (gym: GymLocation) => {
    setSelected(gym);
    setFlyTo({ lat: gym.lat, lng: gym.lng });
  };

  const centerLat = userPos?.lat || 14.6937;
  const centerLng = userPos?.lng || -17.4441;

  return (
    <div className="flex flex-col gap-5 max-w-5xl">
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><MapPin size={18} /></div>
          <div>
            <h2 className="font-semibold text-white">Salles & Coachs proches</h2>
            <p className="text-dark-400 text-xs flex items-center gap-1">
              <Navigation size={10} className="text-emerald-400" />
              {userPos ? 'Position GPS détectée' : 'Dakar, Sénégal (par défaut)'}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 w-full" placeholder="Rechercher par nom ou quartier..." />
          </div>
          <div className="flex gap-2">
            {(['all', 'salle', 'coach'] as FilterType[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${filter === f ? 'bg-primary-500/15 border-primary-500/50 text-primary-400' : 'border-dark-600 text-dark-400 hover:border-dark-500'}`}>
                {f === 'all' ? 'Tout' : f === 'salle' ? '🏋️ Salles' : '👤 Coachs'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-dark-700 shadow-xl" style={{ height: '420px' }}>
        <MapContainer center={[centerLat, centerLng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {flyTo && <FlyToLocation lat={flyTo.lat} lng={flyTo.lng} />}
          {userPos && (
            <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
              <Popup><div className="text-center font-semibold text-sm">📍 Vous êtes ici</div></Popup>
            </Marker>
          )}
          {filtered.map(gym => (
            <Marker key={gym.id} position={[gym.lat, gym.lng]} icon={gym.type === 'salle' ? salleIcon : coachIcon} eventHandlers={{ click: () => handleSelect(gym) }}>
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-bold text-sm mb-1">{gym.name}</p>
                  <p className="text-xs text-gray-600 mb-1">📍 {gym.address}</p>
                  <div className="flex items-center gap-1 mb-1"><span className="text-yellow-500">★</span><span className="text-xs font-semibold">{gym.rating}</span></div>
                  {gym.phone && <p className="text-xs text-gray-600">📞 {gym.phone}</p>}
                  {gym.hours && <p className="text-xs text-gray-600">🕐 {gym.hours}</p>}
                  {gym.specialties && <p className="text-xs text-blue-600 mt-1">{gym.specialties.join(', ')}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex items-center gap-4 text-xs text-dark-400">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary-500" /> Salle de sport</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" /> Coach</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-400" /> Votre position</div>
      </div>

      {selected && (
        <div className="card border-primary-500/20">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-dark-700 flex items-center justify-center text-3xl shrink-0">{selected.type === 'salle' ? '🏋️' : '👤'}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant={selected.type === 'salle' ? 'orange' : 'blue'} size="sm">{selected.type === 'salle' ? 'Salle de sport' : 'Coach personnel'}</Badge>
                  <h3 className="font-semibold text-white mt-1">{selected.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1"><MapPin size={11} className="text-dark-400" /><span className="text-dark-400 text-xs">{selected.address}, {selected.city}</span></div>
                </div>
                <div className="flex items-center gap-1 shrink-0"><Star size={12} className="text-yellow-400 fill-yellow-400" /><span className="text-white text-sm font-semibold">{selected.rating}</span></div>
              </div>
              <div className="flex gap-4 mt-3 flex-wrap">
                {selected.phone && <div className="flex items-center gap-1.5"><Phone size={12} className="text-dark-400" /><span className="text-dark-300 text-xs">{selected.phone}</span></div>}
                {selected.hours && <div className="flex items-center gap-1.5"><Clock size={12} className="text-dark-400" /><span className="text-dark-300 text-xs">{selected.hours}</span></div>}
              </div>
              {selected.specialties && selected.specialties.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">{selected.specialties.map(s => <Badge key={s} variant="gray" size="sm">{s}</Badge>)}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-white mb-4">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(gym => (
            <button key={gym.id} onClick={() => handleSelect(gym)} className={`text-left p-4 rounded-2xl border transition-all hover:border-primary-500/40 ${selected?.id === gym.id ? 'bg-primary-500/5 border-primary-500/40' : 'bg-dark-800/40 border-dark-700'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center text-xl shrink-0">{gym.type === 'salle' ? '🏋️' : '👤'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-white text-sm truncate">{gym.name}</p>
                    <div className="flex items-center gap-0.5 shrink-0"><Star size={10} className="text-yellow-400 fill-yellow-400" /><span className="text-xs text-white">{gym.rating}</span></div>
                  </div>
                  <p className="text-dark-400 text-xs mt-0.5 truncate">{gym.address}</p>
                  <Badge variant={gym.type === 'salle' ? 'orange' : 'blue'} size="sm" className="mt-1.5">{gym.type === 'salle' ? '🏋️ Salle' : '👤 Coach'}</Badge>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMap;