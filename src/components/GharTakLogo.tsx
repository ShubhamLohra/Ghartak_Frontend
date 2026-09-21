import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const GharTakLogo: React.FC<LogoProps> = ({ size = 'md', showBadge = true }) => {
  const dimensions = {
    sm: 'h-8 w-8',
    md: 'h-11 w-11',
    lg: 'h-16 w-16',
    xl: 'h-28 w-28'
  }[size];

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div className={`relative ${dimensions} transition-all duration-300 group-hover:scale-105 group-hover:rotate-1`}>
        {/* Glow halo in Website Brand Indigo */}
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md group-hover:bg-indigo-600/30 transition-all duration-300"></div>
        <img
          src="/logo.svg"
          alt="Ghar Tak Logo"
          className="relative z-10 w-full h-full drop-shadow-[0_4px_14px_rgba(79,70,229,0.3)]"
        />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-sans">
            Ghar<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 font-black">Tak</span>
          </span>
          <span className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold tracking-widest uppercase shadow-xs">
            A to Z APP
          </span>
        </div>
        {showBadge && (
          <p className="text-[11px] text-indigo-600 font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            A to Z Solution in One Tap
          </p>
        )}
      </div>
    </div>
  );
};
