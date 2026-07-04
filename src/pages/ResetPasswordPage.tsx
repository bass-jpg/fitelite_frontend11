import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout
      title={sent ? 'EMAIL ENVOYÉ !' : 'MOT DE PASSE\nOUBLIÉ ?'}
      subtitle={sent ? 'Vérifiez votre boîte mail' : 'Saisissez votre email pour recevoir un lien de réinitialisation'}
      imageSrc="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1000&q=80"
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center">
            <CheckCircle size={40} className="text-primary-400" />
          </div>
          <div>
            <p className="text-dark-300 mb-2">Un lien de réinitialisation a été envoyé à :</p>
            <p className="text-white font-semibold">{email}</p>
          </div>
          <p className="text-dark-400 text-sm">
            Vérifiez également vos spams. Le lien expire dans 24 heures.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Button fullWidth onClick={() => setSent(false)} variant="ghost">
              Renvoyer l'email
            </Button>
            <Link to="/login">
              <Button fullWidth>
                <ArrowLeft size={16} /> Retour à la connexion
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Adresse email"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            autoComplete="email"
          />

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Envoyer le lien <ArrowRight size={16} />
          </Button>

          <Link to="/login" className="flex items-center justify-center gap-2 text-dark-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Retour à la connexion
          </Link>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
