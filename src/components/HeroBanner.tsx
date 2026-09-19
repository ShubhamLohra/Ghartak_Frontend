import React, { useState } from 'react';
import { Search, ShieldCheck, Star, Zap, Clock, ThumbsUp, ChevronRight, Award, Sparkles, Building2, Package, Hammer, Droplets, Cpu } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeroProps {
  onSelectCategory: (code: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const HeroBanner: React.FC<HeroProps> = ({ onSelectCategory, onSearchSubmit }) => {
  const { setActiveView } = useCart();
  const [query, setQuery] = useState('');

  const quickPills = [
    { label: 'Electrician', code: 'ELECTRIC', icon: <Zap className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: 'Carpenter', code: 'CARPENTER', icon: <Hammer className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: 'Plumber', code: 'PLUMBER', icon: <Droplets className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: 'Building Repair', code: 'BUILDING_REPAIR', icon: <Building2 className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: 'CCTV & Computer', code: 'CCTV_COMPUTER', icon: <Cpu className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: 'Hardware Depot', action: () => setActiveView('raw_material'), icon: <Package className="w-3.5 h-3.5 text-indigo-400" /> },
  ];

  const promoCards = [
    {
      title: "Building Repair & Mistry Hiring",
      subtitle: "Book Certified Labour, Mistry, Contractor & Engineers",
      badge: "CONSTRUCTION SPECIALIST",
      cta: "DIRECT QUOTE",
      code: "BUILDING_REPAIR",
      bg: "from-[#1E1B4B]/40 via-[#151D2A] to-[#0B0F19]",
      border: "border-indigo-500/30 hover:border-indigo-400",
      icon: <Building2 className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Hardware & Raw Material Store",
      subtitle: "Order Cement, TMT Steel, Sand & Pipe Fittings Direct",
      badge: "SAME DAY DELIVERY",
      cta: "WHOLESALE RATE",
      action: () => setActiveView('raw_material'),
      bg: "from-[#0F172A]/50 via-[#151D2A] to-[#0B0F19]",
      border: "border-sky-500/30 hover:border-sky-400",
      icon: <Package className="w-6 h-6 text-sky-400" />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B0F19] via-[#0F172A] to-[#090D16] pt-8 pb-14 border-b border-slate-800/80">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-12 -right-24 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 -left-20 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid: Left Pitch & Search, Right Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-left">

            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md mb-4 shadow-md shadow-indigo-500/5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-[11px] font-extrabold text-indigo-300 tracking-wider uppercase">
                India's On-Demand Home Services & Hardware Platform
              </span>
            </div>

            {/* App Brand Name */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-2 leading-none font-sans">
              Ghar<span className="text-gold-gradient">Tak</span>
            </h1>

            {/* Slogan Quote */}
            <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 tracking-wide mb-4">
              “A to Z Solution in One Tap”
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mb-6 leading-relaxed font-medium">
              Verified Electricians, Plumbers, Carpenters, Painters, Building Contractors & Raw Material Depot — booked in seconds with upfront transparent pricing.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSubmit} className="relative mb-5 max-w-xl">
              <div className="relative flex items-center bg-[#151D2A] border-2 border-indigo-500/40 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 rounded-2xl shadow-xl p-1.5 transition-all">
                <Search className="w-5 h-5 text-indigo-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search service, repair worker or hardware item..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-white text-xs sm:text-sm placeholder-slate-400 px-3 py-2 outline-none font-medium"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-black px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1 shrink-0"
                >
                  <span>Search</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </form>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 max-w-xl">
              <span className="text-[11px] text-indigo-300 font-bold mr-1 flex items-center gap-1">
                <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                Trending:
              </span>
              {quickPills.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (pill.action) pill.action();
                    else if (pill.code) onSelectCategory(pill.code);
                  }}
                  className="px-3 py-1 rounded-xl bg-[#151D2A] hover:bg-indigo-600/20 border border-slate-700/80 hover:border-indigo-500/50 text-slate-200 hover:text-indigo-300 text-[11px] font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {pill.icon}
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Right Hero Column (Feature Cards) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            
            {promoCards.map((card, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  if (card.action) card.action();
                  else if (card.code) onSelectCategory(card.code);
                }}
                className={`p-5 rounded-2xl cursor-pointer bg-gradient-to-br ${card.bg} border ${card.border} hover:scale-[1.01] transition-all duration-300 shadow-xl relative overflow-hidden group`}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase">
                      {card.badge}
                    </span>
                    <span className="text-[10px] font-black text-white bg-indigo-600 px-2.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      {card.cta}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-300 mb-3 font-medium">
                  {card.subtitle}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore & Book Now</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            ))}

            {/* Assurance Card */}
            <div className="p-3.5 rounded-xl bg-[#151D2A]/90 border border-slate-800 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Ghar Tak Assurance Guarantee</p>
                  <p className="text-[10px] text-slate-400">Fixed Upfront Rates • 30-Day Service Warranty</p>
                </div>
              </div>
              <span className="text-[9px] font-black text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10">VERIFIED</span>
            </div>

          </div>

        </div>

        {/* Bottom Trust Metrics Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-800/80">
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151D2A]/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-white">100% Verified</p>
              <p className="text-[10px] text-slate-400 font-medium">Background Checked</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151D2A]/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-white">4.9 / 5 Rating</p>
              <p className="text-[10px] text-slate-400 font-medium">50,000+ Bookings</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151D2A]/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-white">30 Min Arrival</p>
              <p className="text-[10px] text-slate-400 font-medium">Doorstep Response</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151D2A]/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-white">Upfront Rates</p>
              <p className="text-[10px] text-slate-400 font-medium">Transparent Pricing</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
