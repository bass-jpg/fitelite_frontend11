import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const goals = ['Perte de poids', 'Prise de masse', 'Cardio & endurance', 'Tonification', 'Force maximale', 'Remise en forme'];
const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nom requis';
    if (!email.includes('@')) e.email = 'Email invalide';
    if (password.length < 6) e.password = 'Au moins 6 caractères';
    if (password !== confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !level) { setErrors({ goal: 'Sélectionnez un objectif et un niveau' }); return; }
    setLoading(true);
    setApiError('');
    try {
      const ok = await register(name, email, password, goal, level);
      if (ok) navigate('/dashboard');
      else setApiError('Erreur lors de la création du compte. Cet email existe peut-être déjà.');
    } catch {
      setApiError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="REJOIGNEZ-NOUS !" subtitle="Créez votre compte et commencez votre transformation"
      imageSrc="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&q=80">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${step >= s ? 'bg-primary-500 text-white' : 'bg-dark-800 border border-dark-600 text-dark-400'}`}>
              {step > s ? <Check size={14} /> : s}
            </div>
            {s < 2 && <div className={`flex-1 h-px transition-all ${step > s ? 'bg-primary-500' : 'bg-dark-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 ? (
        <div className="flex flex-col gap-5">
          <Input label="Nom complet" placeholder="Jean Dupont" value={name} onChange={e => setName(e.target.value)}
            icon={<User size={16} />} error={errors.name} />
          <Input label="Adresse email" type="email" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)}
            icon={<Mail size={16} />} error={errors.email} />
          <Input label="Mot de passe" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            icon={<Lock size={16} />} error={errors.password}
            rightIcon={<button type="button" onClick={() => setShowPass(!showPass)} className="hover:text-white transition-colors">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
          />
          <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)}
            icon={<Lock size={16} />} error={errors.confirm} />
          <Button fullWidth size="lg" onClick={handleNext} className="mt-1">Continuer <ArrowRight size={16} /></Button>
          <p className="text-center text-dark-400 text-sm">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Se connecter</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{apiError}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-3">Quel est votre objectif principal ?</label>
            <div className="grid grid-cols-2 gap-2">
              {goals.map(g => (
                <button key={g} type="button" onClick={() => setGoal(g)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all text-left
                    ${goal === g ? 'bg-primary-500/15 border-primary-500 text-primary-400' : 'bg-dark-800/40 border-dark-600 text-dark-300 hover:border-dark-500'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-3">Votre niveau actuel</label>
            <div className="flex gap-3">
              {levels.map(l => (
                <button key={l} type="button" onClick={() => setLevel(l)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                    ${level === l ? 'bg-primary-500/15 border-primary-500 text-primary-400' : 'bg-dark-800/40 border-dark-600 text-dark-300 hover:border-dark-500'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {errors.goal && <p className="text-red-400 text-xs">{errors.goal}</p>}
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">Retour</Button>
            <Button type="submit" loading={loading} className="flex-1">Créer mon compte <ArrowRight size={16} /></Button>
          </div>
          <p className="text-center text-dark-500 text-xs">
            En créant un compte, vous acceptez nos{' '}
            <a href="#" className="text-primary-400 hover:underline">CGU</a> et{' '}
            <a href="#" className="text-primary-400 hover:underline">Politique de confidentialité</a>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
