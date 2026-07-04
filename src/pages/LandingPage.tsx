import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Zap, BarChart2, Users, Star, Check,
  ChevronRight, Play, Award, Target, TrendingUp, MessageCircle
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { mockPrograms, mockCoaches } from '../utils/mockData';

/* ── HERO ─────────────────────────────────────────────────── */
const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* BG */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=80"
          alt="hero"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/90 to-dark-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
      </div>

      {/* Decorative orb */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <Badge variant="orange" size="md">
            <Zap size={12} className="mr-1" /> Plateforme #1 en Afrique de l'Ouest
          </Badge>

          <h1 className="font-display text-6xl md:text-8xl mt-6 mb-6 leading-none">
            FORGE TON<br />
            <span className="text-gradient">MEILLEUR</span><br />
            CORPS
          </h1>

          <p className="text-dark-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Programmes personnalisés, coachs certifiés et suivi de progression en temps réel.
            Transforme ton corps dès aujourd'hui.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate('/register')}>
              Démarrer gratuitement <ArrowRight size={18} />
            </Button>
            
            {/* BOUTON CONTACTER AJOUTÉ */}
            <Button 
               
              size="lg" 
              className="border-primary-500/30 hover:border-primary-500/60 transition-all"
              onClick={() => navigate('/contact')}
            >
              <MessageCircle size={18} className="mr-2" /> Nous contacter
            </Button>

            <Button variant="ghost" size="lg">
              <Play size={18} className="fill-current" /> Voir la démo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-dark-700">
            {[
              { value: '12K+', label: 'Athlètes actifs' },
              { value: '48', label: 'Programmes' },
              { value: '98%', label: 'Satisfaction' },
              { value: '4.9★', label: 'Note moyenne' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display text-3xl text-primary-400">{s.value}</div>
                <div className="text-dark-400 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── FEATURES ─────────────────────────────────────────────── */
const Features: React.FC = () => {
  const features = [
    { icon: Target, title: 'Objectifs personnalisés', desc: 'Programmes adaptés à votre niveau, vos objectifs et votre emploi du temps pour des résultats optimaux.' },
    { icon: BarChart2, title: 'Suivi de progression', desc: 'Visualisez votre évolution semaine après semaine avec des graphiques détaillés et des métriques précises.' },
    { icon: Users, title: 'Coachs experts', desc: 'Accédez à une équipe de coaches certifiés, disponibles pour vous guider et motiver à chaque étape.' },
    { icon: TrendingUp, title: 'Plans nutritionnels', desc: 'Des plans alimentaires sur mesure pour compléter votre entraînement et accélérer vos résultats.' },
    { icon: Award, title: 'Certifications', desc: 'Obtenez des badges et certifications à chaque étape franchie pour valider vos accomplissements.' },
    { icon: Zap, title: 'Séances rapides', desc: 'Des entraînements HIIT efficaces de 20 à 45 minutes pour s\'adapter à votre rythme de vie.' },
  ];

  return (
    <section className="py-24 bg-dark-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="orange" size="md">Fonctionnalités</Badge>
          <h2 className="font-display text-5xl md:text-6xl mt-4 mb-4">TOUT CE QU'IL<br /><span className="text-gradient">VOUS FAUT</span></h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">Une plateforme complète pensée pour transformer votre façon de vous entraîner</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="stat-card group cursor-default">
              <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-all">
                <Icon size={22} className="text-primary-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── PROGRAMMES ───────────────────────────────────────────── */
const Programs: React.FC = () => {
  const navigate = useNavigate();
  const levelColors: Record<string, 'green' | 'orange' | 'red'> = {
    'Débutant': 'green', 'Intermédiaire': 'orange', 'Avancé': 'red',
  };

  return (
    <section id="programmes" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <Badge variant="orange" size="md">Programmes</Badge>
            <h2 className="font-display text-5xl md:text-6xl mt-4">NOS <span className="text-gradient">PROGRAMMES</span></h2>
          </div>
          <Button variant="ghost" onClick={() => navigate('/register')}>
            Voir tout <ChevronRight size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockPrograms.map(prog => (
            <div key={prog.id} className="group rounded-2xl overflow-hidden bg-dark-800/50 border border-dark-700 hover:border-primary-500/40 transition-all duration-300 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img src={prog.image} alt={prog.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant={levelColors[prog.level] ?? 'gray'}>{prog.level}</Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="gray">{prog.category}</Badge>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-white mb-1">{prog.name}</h3>
                <p className="text-dark-400 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">{prog.description}</p>
                <div className="flex items-center justify-between text-xs text-dark-400 mb-4">
                  <span>{prog.duration}</span>
                  <span>{prog.sessionsPerWeek}x / semaine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-bold">
                    {prog.coach.name.charAt(0)}
                  </div>
                  <span className="text-xs text-dark-300">{prog.coach.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── COACHES ──────────────────────────────────────────────── */
const Coaches: React.FC = () => (
  <section id="coachs" className="py-24 bg-dark-900/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <Badge variant="orange" size="md">L'équipe</Badge>
        <h2 className="font-display text-5xl md:text-6xl mt-4">NOS <span className="text-gradient">COACHS</span></h2>
        <p className="text-dark-400 text-lg mt-4 max-w-xl mx-auto">Des experts passionnés dédiés à votre transformation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockCoaches.map(coach => (
          <div key={coach.id} className="stat-card group text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img src={coach.image} alt={coach.name} className="w-full h-full object-cover rounded-2xl" />
              <div className="absolute -bottom-1 -right-1 bg-primary-500 rounded-lg px-1.5 py-0.5 text-xs font-bold flex items-center gap-0.5">
                <Star size={10} className="fill-white" /> {coach.rating}
              </div>
            </div>
            <h3 className="font-semibold text-white">{coach.name}</h3>
            <p className="text-primary-400 text-sm mb-2">{coach.specialty}</p>
            <p className="text-dark-400 text-xs mb-3 line-clamp-2">{coach.bio}</p>
            <div className="flex items-center justify-center gap-4 text-xs text-dark-400">
              <span>{coach.experience} exp.</span>
              <span>{coach.clients} clients</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── TESTIMONIALS ─────────────────────────────────────────── */
const testimonials = [
  { name: 'Fatou N.', city: 'Dakar', text: 'En 3 mois avec FitElite, j\'ai perdu 8kg et je me sens incroyablement bien.', rating: 5, goal: 'Perte de poids' },
  { name: 'Ibrahim S.', city: 'Abidjan', text: 'Le suivi personnalisé de mon coach Marcus a tout changé. Mes performances ont explosé.', rating: 5, goal: 'Force' },
  { name: 'Aïssatou D.', city: 'Bamako', text: 'Interface simple, programmes adaptés et résultats visibles. Je recommande !', rating: 5, goal: 'Cardio' },
];

const Testimonials: React.FC = () => (
  <section id="temoignages" className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <Badge variant="orange" size="md">Témoignages</Badge>
        <h2 className="font-display text-5xl md:text-6xl mt-4">ILS ONT <span className="text-gradient">TRANSFORMÉ</span><br />LEUR CORPS</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.name} className="card">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={14} className="text-primary-400 fill-primary-400" />
              ))}
            </div>
            <p className="text-dark-200 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm">{t.name}</p>
                <p className="text-dark-400 text-xs">{t.city}</p>
              </div>
              <Badge variant="orange">{t.goal}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── PRICING ──────────────────────────────────────────────── */
const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const plans = [
    {
      name: 'Starter', price: 'Gratuit', period: 'pour toujours',
      features: ['3 programmes', 'Suivi basique', 'Communauté'],
      cta: 'Commencer', highlighted: false,
    },
    {
      name: 'Pro', price: '12 900 FCFA', period: 'par mois',
      features: ['Tous les programmes', 'Coach dédié', 'Suivi avancé', 'Plan nutritionnel'],
      cta: 'Essai gratuit 7j', highlighted: true,
    },
    {
      name: 'Elite', price: '24 900 FCFA', period: 'par mois',
      features: ['Tout Pro inclus', 'Suivi 24/7', 'Diététicien', 'Bilan mensuel'],
      cta: 'Essai gratuit 7j', highlighted: false,
    },
  ];

  return (
    <section id="tarifs" className="py-24 bg-dark-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="orange" size="md">Tarifs</Badge>
          <h2 className="font-display text-5xl md:text-6xl mt-4">CHOISISSEZ <span className="text-gradient">VOTRE PLAN</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-2xl p-6 flex flex-col ${plan.highlighted ? 'bg-primary-500/10 border-2 border-primary-500 glow-orange' : 'bg-dark-800/50 border border-dark-700'}`}>
              <h3 className="font-display text-2xl mb-1">{plan.name}</h3>
              <div className="mb-6">
                <span className="font-display text-3xl text-white">{plan.price}</span>
                <span className="text-dark-400 text-sm ml-1">/ {plan.period}</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark-200">
                    <Check size={14} className="text-primary-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlighted ? 'primary' : 'ghost'} fullWidth onClick={() => navigate('/register')}>
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CTA ──────────────────────────────────────────────────── */
const CTA: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="relative bg-gradient-to-br from-primary-500/10 to-dark-800 border border-primary-500/20 rounded-3xl p-12 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-5xl md:text-7xl mb-6">PRÊT À <span className="text-gradient">CHANGER</span> ?</h2>
            <p className="text-dark-300 text-lg mb-8">Rejoignez plus de 12 000 athlètes qui ont déjà transformé leur corps avec FitElite.</p>
            <Button size="lg" onClick={() => navigate('/register')}>
              Créer mon compte gratuit <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── FOOTER ───────────────────────────────────────────────── */
const Footer: React.FC = () => (
  <footer className="border-t border-dark-700 py-12 bg-dark-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-2xl mb-3">FIT<span className="text-primary-500">ELITE</span></div>
          <p className="text-dark-400 text-sm">La plateforme de référence en Afrique de l'Ouest.</p>
        </div>
        {[
          { title: 'Produit', links: ['Programmes', 'Coachs', 'Tarifs', 'Blog'] },
          { title: 'Support', links: ['FAQ', 'Contact', 'Communauté'] },
          { title: 'Légal', links: ['Confidentialité', 'CGU', 'Cookies'] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-semibold text-white text-sm mb-3">{col.title}</h4>
            <ul className="flex flex-col gap-2">
              {col.links.map(l => (
                <li key={l}><a href="#" className="text-dark-400 hover:text-white text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-dark-700 pt-8 text-center text-dark-500 text-sm">
        © 2024 FitElite. Tous droits réservés.
      </div>
    </div>
  </footer>
);

/* ── PAGE PRINCIPALE ───────────────────────────────────────── */
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <Hero />
      <Features />
      <Programs />
      <Coaches />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;