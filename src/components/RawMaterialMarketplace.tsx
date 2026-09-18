import React, { useState, useEffect } from 'react';
import { RawMaterialProduct } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { Package, Truck, ShieldCheck, Star, ShoppingCart, Plus, Filter } from 'lucide-react';

export const RawMaterialMarketplace: React.FC = () => {
  const { addToCart } = useCart();
  const [materials, setMaterials] = useState<RawMaterialProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    api.getRawMaterials()
      .then(setMaterials)
      .catch((err) => console.error('Failed to load raw materials', err));
  }, []);

  const categories = ['ALL', 'Cement', 'Steel TMT', 'Sand', 'Bricks'];

  const filteredMaterials = selectedCategory === 'ALL' 
    ? materials 
    : materials.filter((m) => m.category === selectedCategory || m.name.includes(selectedCategory));

  return (
    <section className="py-12 bg-[#0F0F14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Ghar Tak Hardware Supply Depot</h3>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Raw Construction Materials Store
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Direct store owner supply for Cement, TMT Steel, Sand, Bricks & Hardware
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25' : 'bg-[#181824] text-slate-300 hover:bg-[#222232] border border-slate-700/60'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              
              <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-slate-800">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
                    {item.supplierName}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-400">{item.category}</span>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{item.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-gold-gradient">₹{item.price}</span>
                  <span className="text-xs text-slate-400 ml-1">/ {item.unit}</span>
                </div>

                <button
                  onClick={() => addToCart({
                    id: 1000 + item.id,
                    title: item.name,
                    description: item.description,
                    price: item.price,
                    duration: 'Same Day Delivery',
                    rating: item.rating,
                    reviewCount: 150,
                    imageUrl: item.imageUrl,
                    unitType: item.unit,
                    isPopular: true
                  })}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
