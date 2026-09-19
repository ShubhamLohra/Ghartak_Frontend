import React, { useState } from 'react';
import { Search, ShieldCheck, Star, Zap, Clock, ThumbsUp, Wrench, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeroProps {
  onSelectCategory: (code: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const HeroBanner: React.FC<HeroProps> = ({ onSelectCategory, onSearchSubmit }) => {
  const { setActiveView } = useCart();
  const [query, setQuery] = useState('');

  const quickPills = [
    { label: '⚡ Electrician', code: 'ELECTRIC' },
    { label: '🔨 Carpenter', code: 'CARPENTER' },
    { label: '🚰 Plumber', code: 'PLUMBER' },
    { label: '🏗️ Building Repair', code: 'BUILDING_REPAIR' },
    { label: '🏠 False Ceiling', code: 'FALSE_CEILING' },
    { label: '🧱 Raw Material Depot', action: () => setActiveView('raw_material') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0F0F16] via-[#14141F] to-[#0D0D12] pt-8 pb-16 border-b border-amber-500/10">
      
      {/* Decorative Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* Top Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 backdrop-blur-md mb-6 shadow-lg shadow-amber-500/10">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
              Official Hardware & Home Solutions App
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight font-sans">
            Ghar<span className="text-gold-gradient">Tak</span>
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-amber-400 tracking-wide mb-8">
            “A to Z Solution in One Tap”
          </p>


          {/* Search Box Card */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative mb-8">
            <div className="relative flex items-center bg-[#181826] border-2 border-amber-500/40 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/20 rounded-2xl shadow-2xl p-2 transition-all">
              <Search className="w-6 h-6 text-amber-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="What service or hardware material do you need today?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white text-sm sm:text-base placeholder-slate-400 px-4 py-3 outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/30 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Find Service</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </form>

          {/* Quick Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-12">
            <span className="text-xs text-slate-400 font-semibold mr-1">Trending:</span>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (pill.action) pill.action();
                  else if (pill.code) onSelectCategory(pill.code);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#1D1D2C] hover:bg-amber-500/20 border border-slate-700/60 hover:border-amber-500/50 text-slate-200 hover:text-amber-400 text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[#161622]/60 border border-slate-800">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">100% Verified</p>
                <p className="text-[10px] text-slate-400">Background Checked</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[#161622]/60 border border-slate-800">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">4.9 Star Rated</p>
                <p className="text-[10px] text-slate-400">50,000+ Bookings</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[#161622]/60 border border-slate-800">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">30 Min Arrival</p>
                <p className="text-[10px] text-slate-400">Doorstep Speed</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[#161622]/60 border border-slate-800">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Standard Pricing</p>
                <p className="text-[10px] text-slate-400">No Hidden Costs</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
