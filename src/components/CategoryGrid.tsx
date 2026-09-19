import React from 'react';
import { ServiceCategory } from '../types';
import { 
  Zap, 
  Hammer, 
  Wrench, 
  Paintbrush, 
  Building2, 
  Camera, 
  Package, 
  Droplet, 
  Sparkles, 
  Layout, 
  Activity, 
  ArrowRight,
  Star
} from 'lucide-react';

interface CategoryGridProps {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  const getCategoryStyle = (code: string) => {
    switch (code) {
      case 'ELECTRIC': 
        return { icon: <Zap className="w-6 h-6 text-amber-400 stroke-[2.2]" />, bg: 'bg-amber-500/10 border-amber-500/30' };
      case 'CARPENTER': 
        return { icon: <Hammer className="w-6 h-6 text-orange-400 stroke-[2.2]" />, bg: 'bg-orange-500/10 border-orange-500/30' };
      case 'VEHICLE_REPAIR': 
        return { icon: <Wrench className="w-6 h-6 text-yellow-400 stroke-[2.2]" />, bg: 'bg-yellow-500/10 border-yellow-500/30' };
      case 'PAINT': 
        return { icon: <Paintbrush className="w-6 h-6 text-rose-400 stroke-[2.2]" />, bg: 'bg-rose-500/10 border-rose-500/30' };
      case 'BUILDING_REPAIR': 
        return { icon: <Building2 className="w-6 h-6 text-indigo-400 stroke-[2.2]" />, bg: 'bg-indigo-500/10 border-indigo-500/30' };
      case 'CCTV_COMPUTER': 
        return { icon: <Camera className="w-6 h-6 text-cyan-400 stroke-[2.2]" />, bg: 'bg-cyan-500/10 border-cyan-500/30' };
      case 'RAW_MATERIAL': 
        return { icon: <Package className="w-6 h-6 text-emerald-400 stroke-[2.2]" />, bg: 'bg-emerald-500/10 border-emerald-500/30' };
      case 'PLUMBER': 
        return { icon: <Droplet className="w-6 h-6 text-sky-400 stroke-[2.2]" />, bg: 'bg-sky-500/10 border-sky-500/30' };
      case 'WASHROOM_CLEANING': 
        return { icon: <Sparkles className="w-6 h-6 text-teal-400 stroke-[2.2]" />, bg: 'bg-teal-500/10 border-teal-500/30' };
      case 'FALSE_CEILING': 
        return { icon: <Layout className="w-6 h-6 text-purple-400 stroke-[2.2]" />, bg: 'bg-purple-500/10 border-purple-500/30' };
      case 'DIAGNOSTIC': 
        return { icon: <Activity className="w-6 h-6 text-pink-400 stroke-[2.2]" />, bg: 'bg-pink-500/10 border-pink-500/30' };
      default: 
        return { icon: <Wrench className="w-6 h-6 text-indigo-400 stroke-[2.2]" />, bg: 'bg-indigo-500/10 border-indigo-500/30' };
    }
  };

  return (
    <section className="py-16 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">A to Z Solutions in One Tap</h3>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Explore Home Services & Hardware Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 md:mt-0 font-medium">
            Select a service to view upfront rates, technician availability & instant booking
          </p>
        </div>

        {/* 11 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const style = getCategoryStyle(cat.code);
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className="rounded-2xl p-6 cursor-pointer relative group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 border border-slate-800 hover:border-indigo-500/60 hover:shadow-[0_16px_40px_rgba(99,102,241,0.2)] bg-[#151D2A]"
              >
                {/* Subtle top accent border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

                <div>
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3.5 rounded-2xl border ${style.bg} transition-all duration-300 shadow-md`}>
                      {style.icon}
                    </div>
                    
                    {cat.badgeText && (
                      <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {cat.badgeText}
                      </span>
                    )}
                  </div>

                  {/* Category Name */}
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-5 font-medium">
                    {cat.description}
                  </p>
                </div>

                {/* Rating & Arrow Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">4.8</span>
                    <span className="text-[11px] text-slate-400">({cat.services ? cat.services.length : 4}+ options)</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-black text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Explore
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
