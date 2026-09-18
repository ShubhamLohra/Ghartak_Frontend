import React from 'react';
import { ServiceCategory, ServiceItem } from '../types';
import { useCart } from '../context/CartContext';
import { X, Star, Clock, Plus, Check, ShieldCheck, Zap } from 'lucide-react';

interface ServiceModalProps {
  category: ServiceCategory | null;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ category, onClose }) => {
  const { cart, addToCart } = useCart();

  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#14141E] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500/20 via-[#181826] to-[#14141E] border-b border-amber-500/20 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold bg-amber-500 text-black px-2 py-0.5 rounded uppercase">
                {category.badgeText || 'Verified Partner Service'}
              </span>
              <span className="text-xs text-amber-400 font-semibold">{category.categoryGroup}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">{category.name}</h2>
            <p className="text-xs text-slate-300 mt-1">{category.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Services List Scrollable */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {category.services && category.services.length > 0 ? (
            category.services.map((item) => {
              const isInCart = cart.some((c) => c.service.id === item.id);

              return (
                <div
                  key={item.id}
                  className="bg-[#1A1A28] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      {item.isPopular && (
                        <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/40">
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-2.5 leading-relaxed">{item.description}</p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.rating}</span>
                        <span className="text-slate-500 font-normal">({item.reviewCount})</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Add Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-800">
                    <div className="mb-2 text-left sm:text-right">
                      <span className="text-xl font-extrabold text-gold-gradient">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-500 line-through ml-2">₹{item.originalPrice}</span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${isInCart ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400'}`}
                    >
                      {isInCart ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add to Booking</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400">
              No sub-services listed for this category.
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-[#101017] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Ghar Tak 30-Day Workmanship Guarantee Included</span>
          </div>
          <button onClick={onClose} className="text-amber-400 font-bold hover:underline">Done</button>
        </div>

      </div>
    </div>
  );
};
