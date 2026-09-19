import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const GharTakLogo: React.FC<LogoProps> = ({ size = 'md', showBadge = true }) => {
  const dimensions = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
    xl: 'h-36 w-36'
  }[size];

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      <div className={`relative ${dimensions} transition-all duration-300 group-hover:scale-105 group-hover:rotate-1`}>
        {/* Glow halo */}
        <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-md group-hover:bg-amber-400/50 transition-all duration-300"></div>
        <img src="/logo.svg" alt="Ghar Tak Logo" className="relative z-10 w-full h-full drop-shadow-[0_4px_20px_rgba(245,158,11,0.5)]" />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="font-black text-2xl tracking-tight text-white font-sans drop-shadow-sm">
            Ghar<span className="text-gold-gradient font-black">Tak</span>
          </span>
          <span className="text-[9px] bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black px-2 py-0.5 rounded-full font-black tracking-widest uppercase shadow-md shadow-amber-500/20">
            A to Z APP
          </span>
        </div>
        {showBadge && (
          <p className="text-[11px] text-amber-400 font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            A to Z Solution in One Tap
          </p>
        )}
      </div>
    </div>
  );
};
