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
  ShieldAlert
} from 'lucide-react';

interface CategoryGridProps {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  const getIcon = (code: string) => {
    switch (code) {
      case 'ELECTRIC': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'CARPENTER': return <Hammer className="w-6 h-6 text-amber-400" />;
      case 'VEHICLE_REPAIR': return <Wrench className="w-6 h-6 text-amber-400" />;
      case 'PAINT': return <Paintbrush className="w-6 h-6 text-amber-400" />;
      case 'BUILDING_REPAIR': return <Building2 className="w-6 h-6 text-amber-400" />;
      case 'CCTV_COMPUTER': return <Camera className="w-6 h-6 text-amber-400" />;
      case 'RAW_MATERIAL': return <Package className="w-6 h-6 text-amber-400" />;
      case 'PLUMBER': return <Droplet className="w-6 h-6 text-amber-400" />;
      case 'WASHROOM_CLEANING': return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'FALSE_CEILING': return <Layout className="w-6 h-6 text-amber-400" />;
      case 'DIAGNOSTIC': return <Activity className="w-6 h-6 text-amber-400" />;
      default: return <Wrench className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section className="py-12 bg-[#0F0F14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">All Solutions in One Tap</h3>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Explore Core Services & Hardware Categories
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-2 md:mt-0">
            Select a service to view rates, technician availability, and instant booking
          </p>
        </div>

        {/* 11 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer relative group flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-xl bg-[#252536] border border-amber-500/30 group-hover:bg-amber-500 group-hover:border-amber-400 transition-all duration-300">
                    {React.cloneElement(getIcon(cat.code), {
                      className: 'w-6 h-6 text-amber-400 group-hover:text-black transition-colors'
                    })}
                  </div>
                  
                  {cat.badgeText && (
                    <span className="text-[10px] font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {cat.badgeText}
                    </span>
                  )}
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-1.5">
                  {cat.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              {/* Sub-services Count & Arrow */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  {cat.services ? `${cat.services.length} Sub-services` : 'Explore Options'}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  Book Now
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
