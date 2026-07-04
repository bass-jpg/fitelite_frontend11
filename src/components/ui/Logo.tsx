import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { text: 'text-xl', icon: 'w-6 h-6' },
    md: { text: 'text-2xl', icon: 'w-8 h-8' },
    lg: { text: 'text-4xl', icon: 'w-10 h-10' },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes[size].icon} bg-primary-500 rounded-lg flex items-center justify-center glow-orange`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-4/5 h-4/5">
          <path d="M6 12H18M6 12C6 12 4 10.5 4 9C4 7.5 5 6 6.5 6C8 6 9 7 9 8.5C9 10 8 11 6 12ZM18 12C18 12 20 10.5 20 9C20 7.5 19 6 17.5 6C16 6 15 7 15 8.5C15 10 16 11 18 12ZM6 12C6 12 4 13.5 4 15C4 16.5 5 18 6.5 18C8 18 9 17 9 15.5C9 14 8 13 6 12ZM18 12C18 12 20 13.5 20 15C20 16.5 19 18 17.5 18C16 18 15 17 15 15.5C15 14 16 13 18 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <span className={`font-display tracking-wider ${sizes[size].text}`}>
        FIT<span className="text-primary-500">ELITE</span>
      </span>
    </div>
  );
};

export default Logo;
