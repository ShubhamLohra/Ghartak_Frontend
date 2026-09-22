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
    xl: 'h-24 w-24'
  }[size];

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* Icon Mark */}
      <div className={`relative ${dimensions} shrink-0 transition-transform duration-200 group-hover:scale-105`}>
        <img
          src="/logo.svg"
          alt="Ghar Tak Icon"
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 leading-none">
          <span className="font-black text-2xl tracking-tight font-sans text-slate-900 dark:text-slate-100">
            Ghar<span className="text-indigo-600 dark:text-indigo-400">Tak</span>
          </span>
          <span className="text-[10px] bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase shadow-xs">
            A TO Z APP
          </span>
        </div>

        {showBadge && (
          <p className="text-[11px] text-indigo-600 font-semibold tracking-wide flex items-center gap-1.5 mt-1">
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
