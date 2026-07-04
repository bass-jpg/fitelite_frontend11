import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Twitter, MessageSquare, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const ContactPage: React.FC = () => {
    const navigate = useNavigate();

    const socials = [
    {
        name: 'Instagram',
        handle: '@FitElite',
        icon: Instagram,
        color: 'hover:text-pink-500',
        link: 'https://instagram.com/mouhamed__bachir__',
        desc: 'Suivez nos conseils quotidiens et story motivation.'
    },
    {
        name: 'X (Twitter)',
        handle: '@FitElite',
        icon: Twitter,
        color: 'hover:text-blue-400',
        link: 'https://x.com/BachirS06564925',
        desc: 'Actualités en direct et échanges avec la communauté.'
    },
    {
        name: 'WhatsApp',
        handle: 'Support FitElite',
        icon: MessageSquare,
        color: 'hover:text-green-500',
        link: 'https://wa.me/774129075',
        desc: 'Besoin d\'aide ? Discutez en direct avec un conseiller.'
    }
    ];

    return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
        <div className="max-w-4xl mx-auto px-4 py-20 w-full">
        <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-12 text-dark-400 hover:text-white"
        >
            <ArrowLeft size={18} /> Retour
        </Button>

        <div className="text-center mb-16">
            <Badge variant="orange" size="md">Contact</Badge>
            <h1 className="font-display text-5xl md:text-7xl mt-6 mb-4">REJOIGNEZ <br/><span className="text-gradient">L'ÉQUIPE</span></h1>
            <p className="text-dark-400 text-lg">Choisissez votre plateforme préférée pour échanger avec nous.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socials.map((social) => (
            <a 
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`stat-card group block p-8 transition-all duration-300 border border-dark-700 hover:border-primary-500/50`}
            >
                <div className={`w-14 h-14 bg-dark-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${social.color}`}>
                <social.icon size={32} />
                </div>
                <h3 className="font-display text-xl mb-1">{social.name}</h3>
                <p className="text-primary-400 text-sm mb-4">{social.handle}</p>
                <p className="text-dark-400 text-sm leading-relaxed">
                {social.desc}
                </p>
            </a>
            ))}
        </div>
        </div>
    </div>
    );
};

export default ContactPage;