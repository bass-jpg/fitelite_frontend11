import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'orange' | 'green' | 'blue' | 'gray' | 'red';
  size?: 'sm' | 'md';
  className?: string; // <--- AJOUTÉ : permet de passer des classes CSS/Tailwind externes
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'orange', 
  size = 'sm', 
  className = '' // <--- AJOUTÉ : valeur par défaut vide
}) => {
  const variants = {
    orange: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    gray: 'bg-dark-700 text-dark-300 border-dark-600',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;