import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  imageSrc?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  imageSrc = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=80',
}) => (
  <div className="min-h-screen bg-dark-950 flex">
    {/* Left panel – image */}
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <img src={imageSrc} alt="auth bg" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-950/80 via-dark-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />

      {/* Orb */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary-500/15 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <Link to="/">
          <Logo size="md" />
        </Link>
        <div>
          <blockquote className="text-2xl font-display text-white leading-tight mb-4">
            "LE SEUL MAUVAIS<br />
            <span className="text-primary-400">ENTRAÎNEMENT</span><br />
            EST CELUI QU'ON<br />N'A PAS FAIT."
          </blockquote>
          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-2">
              {['photo-1567013127542-490d757e51fc', 'photo-1548690312-e3b507d8c110', 'photo-1518611012118-696072aa579a'].map(id => (
                <img key={id} src={`https://images.unsplash.com/${id}?w=40&q=80`} className="w-8 h-8 rounded-full border-2 border-dark-950 object-cover" />
              ))}
            </div>
            <p className="text-dark-300 text-sm">+12 000 athlètes nous font confiance</p>
          </div>
        </div>
      </div>
    </div>

    {/* Right panel – form */}
    <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/"><Logo size="md" /></Link>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-4xl mb-2">{title}</h1>
          <p className="text-dark-400">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
