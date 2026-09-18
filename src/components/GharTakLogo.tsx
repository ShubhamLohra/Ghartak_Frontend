import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const GharTakLogo: React.FC<LogoProps> = ({ size = 'md', showBadge = true }) => {
  const dimensions = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-24 w-24',
    xl: 'h-44 w-44'
  }[size];

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`relative ${dimensions} transition-transform duration-300 group-hover:scale-105`}>
        <img src="/logo.svg" alt="Ghar Tak Logo" className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
            Ghar<span className="text-gold-gradient font-black">Tak</span>
          </span>
          <span className="text-[10px] bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-1.5 py-0.5 rounded font-black tracking-widest uppercase shadow-sm">
            HARDWARE APP
          </span>
        </div>
        {showBadge && (
          <p className="text-[11px] text-amber-400 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            A to Z Solution in One Tap
          </p>
        )}
      </div>
    </div>
  );
};
