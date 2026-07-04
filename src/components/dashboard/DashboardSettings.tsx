import React, { useState, useRef } from 'react';
import { User, Mail, Bell, Shield, Trash2, Save, Camera, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const DashboardSettings: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [age, setAge] = useState(user?.age?.toString() ?? '');
  const [weight, setWeight] = useState(user?.weight?.toString() ?? '');
  const [targetWeight, setTargetWeight] = useState(user?.targetWeight?.toString() ?? '');
  const [height, setHeight] = useState(user?.height?.toString() ?? '');
  const [gender, setGender] = useState<'homme' | 'femme' | 'autre'>(user?.gender ?? 'homme');
  const [goal, setGoal] = useState(user?.goal ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Password change
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);

  const [notifs, setNotifs] = useState({
    email: user?.notifEmail ?? true,
    push: user?.notifPush ?? true,
    reminder: user?.notifReminder ?? true,
    weekly: user?.notifWeekly ?? false,
  });

  const handleSave = async () => {
    setSaving(true);
    await updateUser({
      name, email, phone,
      age: Number(age) || undefined,
      weight: Number(weight) || undefined,
      targetWeight: Number(targetWeight) || undefined,
      height: Number(height) || undefined,
      gender, goal, avatar,
      notifEmail: notifs.email,
      notifPush: notifs.push,
      notifReminder: notifs.reminder,
      notifWeekly: notifs.weekly,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd) return;
    if (newPwd.length < 6) { setPwdMsg('Le nouveau mot de passe doit faire au moins 6 caractères'); return; }
    setChangingPwd(true);
    try {
      await authApi.changePassword(currentPwd, newPwd);
      setPwdMsg('✓ Mot de passe modifié avec succès');
      setCurrentPwd(''); setNewPwd('');
    } catch (e: any) {
      setPwdMsg('❌ ' + (e.message || 'Erreur'));
    } finally {
      setChangingPwd(false);
    }
  };

  const goals = ['Perte de poids', 'Prise de masse', 'Cardio & endurance', 'Tonification', 'Force maximale', 'Remise en forme'];

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User size={18} className="text-primary-400" />
          <h3 className="font-semibold text-white">Informations personnelles</h3>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center overflow-hidden">
              {avatar
                ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                : <span className="text-primary-400 font-display text-3xl">{user?.name?.charAt(0).toUpperCase()}</span>
              }
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center hover:bg-primary-400 transition-colors">
              <Camera size={12} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-dark-400 text-sm">{user?.email}</p>
            <Badge variant="orange" size="sm" className="mt-1">{user?.level}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nom complet" value={name} onChange={e => setName(e.target.value)} icon={<User size={16} />} />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={16} />} />
          <Input label="Téléphone" value={phone} onChange={e => setPhone(e.target.value)} icon={<Phone size={16} />} />
          <Input label="Âge" type="number" value={age} onChange={e => setAge(e.target.value)} />
          <Input label="Poids actuel (kg)" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
          <Input label="Poids cible (kg)" type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} />
          <Input label="Taille (cm)" type="number" value={height} onChange={e => setHeight(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Genre</label>
            <div className="flex gap-2">
              {(['homme', 'femme', 'autre'] as const).map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm border transition-all capitalize ${
                    gender === g ? 'bg-primary-500/15 border-primary-500 text-primary-400' : 'bg-dark-800/40 border-dark-600 text-dark-400 hover:border-dark-500'
                  }`}>{g}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-dark-300 mb-2">Objectif</label>
          <div className="grid grid-cols-2 gap-2">
            {goals.map(g => (
              <button key={g} onClick={() => setGoal(g)}
                className={`py-2 px-3 rounded-xl text-sm border transition-all text-left ${
                  goal === g ? 'bg-primary-500/15 border-primary-500 text-primary-400' : 'bg-dark-800/40 border-dark-600 text-dark-300 hover:border-dark-500'
                }`}>{g}</button>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} loading={saving} className="mt-6" fullWidth>
          {saved ? '✓ Profil enregistré !' : <><Save size={14} /> Enregistrer les modifications</>}
        </Button>
      </div>

      {/* Password change */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Lock size={18} className="text-primary-400" />
          <h3 className="font-semibold text-white">Changer le mot de passe</h3>
        </div>
        <div className="flex flex-col gap-3">
          <Input label="Mot de passe actuel" type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} icon={<Lock size={16} />} />
          <Input label="Nouveau mot de passe" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} icon={<Lock size={16} />} />
          {pwdMsg && <p className={`text-sm ${pwdMsg.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>{pwdMsg}</p>}
          <Button onClick={handleChangePassword} loading={changingPwd} variant="ghost">Changer le mot de passe</Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Bell size={18} className="text-primary-400" />
          <h3 className="font-semibold text-white">Notifications</h3>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { key: 'email' as const, label: 'Notifications par email' },
            { key: 'push' as const, label: 'Notifications push' },
            { key: 'reminder' as const, label: 'Rappels de séance' },
            { key: 'weekly' as const, label: 'Résumé hebdomadaire' },
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between p-3 bg-dark-800/30 rounded-xl cursor-pointer hover:bg-dark-800/50 transition-all">
              <span className="text-sm text-dark-300">{item.label}</span>
              <div onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${notifs[item.key] ? 'bg-primary-500' : 'bg-dark-600'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={18} className="text-red-400" />
          <h3 className="font-semibold text-white">Zone dangereuse</h3>
        </div>
        <Button variant="ghost" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={logout} fullWidth>
          <Trash2 size={14} /> Se déconnecter
        </Button>
      </div>
    </div>
  );
};

export default DashboardSettings;
