import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Zap, Droplets, Sparkle, Hammer, Cpu, Wrench, Paintbrush, Bug, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeroProps {
  onSelectCategory: (code: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const HeroBanner: React.FC<HeroProps> = ({ onSelectCategory, onSearchSubmit }) => {
  const { setActiveView } = useCart();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const quickServices = [
    { label: 'Electrician', code: 'ELECTRIC', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { label: 'Cleaning', code: 'CLEANING', icon: <Sparkle className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> },
    { label: 'Plumber', code: 'PLUMBER', icon: <Droplets className="w-4 h-4 text-sky-500" /> },
    { label: 'Carpenter', code: 'CARPENTER', icon: <Hammer className="w-4 h-4 text-emerald-500" /> },
    { label: 'AC Repair', code: 'APPLIANCE', icon: <Wrench className="w-4 h-4 text-purple-500 dark:text-purple-400" /> },
    { label: 'Painting', code: 'PAINTING', icon: <Paintbrush className="w-4 h-4 text-rose-500" /> },
  ];

  const searchDatabase = [
    { keyword: 'fan', title: 'Fan Installation & Repair', categoryCode: 'ELECTRIC' },
    { keyword: 'fan', title: 'Ceiling Fan Wiring Issue', categoryCode: 'ELECTRIC' },
    { keyword: 'water', title: 'Plumbing & Water Leakage Repair', categoryCode: 'PLUMBER' },
    { keyword: 'water', title: 'Tap & Tank Leakage Repair', categoryCode: 'PLUMBER' },
    { keyword: 'clean', title: 'Full Home Deep Cleaning', categoryCode: 'CLEANING' },
    { keyword: 'clean', title: 'Bathroom & Toilet Deep Cleaning', categoryCode: 'CLEANING' },
    { keyword: 'clean', title: 'Kitchen Cleaning & Degreasing', categoryCode: 'CLEANING' },
    { keyword: 'ac', title: 'AC Service & Gas Refill', categoryCode: 'APPLIANCE' },
    { keyword: 'light', title: 'Light & LED Fitting Work', categoryCode: 'ELECTRIC' },
    { keyword: 'switch', title: 'Switch, Socket & MCB Repair', categoryCode: 'ELECTRIC' },
    { keyword: 'door', title: 'Door & Lock Repair (Carpenter)', categoryCode: 'CARPENTER' },
    { keyword: 'paint', title: 'Wall Painting & Waterproofing', categoryCode: 'PAINTING' },
    { keyword: 'pest', title: 'Termite & Cockroach Control', categoryCode: 'PEST_CONTROL' },
  ];

  const filteredSuggestions = query.trim()
    ? searchDatabase.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.keyword.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query);
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 dark:from-indigo-950/50 dark:via-slate-900 dark:to-slate-950 pt-8 pb-10 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        {/* Warm Greeting Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Doorstep Home Services in Hazaribagh</span>
        </div>

        {/* Core Question Headline */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
          What service do you need?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-lg mx-auto mb-6">
          Book trusted professionals for home repairs, cleaning, plumbing, electrical work, and more.
        </p>

        {/* Prominent Search Bar with Auto-suggest */}
        <div ref={dropdownRef} className="relative max-w-2xl mx-auto mb-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 focus-within:border-indigo-600 dark:focus-within:border-indigo-500 rounded-2xl shadow-md p-2 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search for electrician, cleaning, plumber..."
                value={query}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsFocused(true);
                }}
                className="w-full bg-transparent border-none text-slate-900 dark:text-slate-100 text-sm sm:text-base placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2 outline-none font-medium"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all shrink-0 tap-target flex items-center gap-1"
              >
                <span>Search</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Forgiving Search Auto-suggestions Dropdown */}
          {isFocused && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-left max-h-64 overflow-y-auto">
              <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Suggested Services
              </div>
              {filteredSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(item.title);
                    onSelectCategory(item.categoryCode);
                    setIsFocused(false);
                  }}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between transition-colors border-b border-slate-50 dark:border-slate-800 last:border-none"
                >
                  <span className="font-medium">{item.title}</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold">
                    View
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Popular Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Popular:</span>
          {quickServices.map((service, idx) => (
            <button
              key={idx}
              onClick={() => onSelectCategory(service.code)}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all shadow-xs flex items-center gap-1.5 tap-target"
            >
              {service.icon}
              <span>{service.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
