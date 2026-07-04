import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) navigate('/dashboard');
      else setError('Email ou mot de passe incorrect.');
    } catch {
      setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 3000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="BIENVENUE !" subtitle="Connectez-vous pour accéder à votre espace d'entraînement"
      imageSrc="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&q=80">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          {['Google', 'Apple'].map(p => (
            <button key={p} type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dark-600 hover:border-dark-500 bg-dark-800/40 text-sm text-dark-300 hover:text-white transition-all">
              {p === 'Google' ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.79.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              )}
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-dark-700" />
          <span className="text-dark-500 text-xs">ou avec email</span>
          <div className="flex-1 h-px bg-dark-700" />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
        )}

        {/* Demo accounts hint */}
        <div className="bg-dark-800/60 border border-dark-700 rounded-xl p-3 text-xs text-dark-400">
          <p className="font-medium text-dark-300 mb-1">Comptes de démonstration :</p>
          <p>👤 aminata@fittrack.com / fittrack2024</p>
          <p>🔑 admin@fittrack.com / fittrack2024</p>
        </div>

        <Input label="Adresse email" type="email" placeholder="vous@exemple.com" value={email}
          onChange={e => setEmail(e.target.value)} icon={<Mail size={16} />} autoComplete="email" />

        <Input label="Mot de passe" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
          onChange={e => setPassword(e.target.value)} icon={<Lock size={16} />}
          rightIcon={
            <button type="button" onClick={() => setShowPass(!showPass)} className="hover:text-white transition-colors">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          } autoComplete="current-password" />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-dark-400 cursor-pointer">
            <input type="checkbox" className="rounded border-dark-600 bg-dark-800" />
            Se souvenir de moi
          </label>
          <Link to="/reset-password" className="text-primary-400 hover:text-primary-300 transition-colors">
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg" className="mt-1">
          Se connecter <ArrowRight size={16} />
        </Button>

        <p className="text-center text-dark-400 text-sm">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Créer un compte
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
