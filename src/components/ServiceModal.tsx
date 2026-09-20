import React, { useState } from 'react';
import { ServiceCategory, ServiceItem } from '../types';
import { useCart } from '../context/CartContext';
import { X, Star, Clock, Plus, Check, ShieldCheck, Camera, MessageSquare, ArrowRight } from 'lucide-react';

interface ServiceModalProps {
  category: ServiceCategory | null;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ category, onClose }) => {
  const { cart, addToCart, setIsCartOpen } = useCart();
  const [problemDescription, setProblemDescription] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!category) return null;

  const handleContinue = () => {
    onClose();
    setIsCartOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setSelectedPhoto(fileName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1 inline-block">
              {category.badgeText || 'Verified Service'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{category.name}</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {category.description || `Get ${category.name.toLowerCase()} work done at home`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 transition-colors tap-target"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Sub-services List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Services Needed
          </h3>

          {category.services && category.services.length > 0 ? (
            category.services.map((item) => {
              const isInCart = cart.some((c) => c.service.id === item.id);

              return (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      {item.isPopular && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">{item.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {item.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <span className="text-base sm:text-lg font-bold text-slate-900">₹{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors tap-target ${
                        isInCart
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isInCart ? (
                        <>
                          <Check className="w-4 h-4" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 py-4">Standard inspection service will be booked.</p>
          )}

          {/* Not Sure What You Need Section */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Not sure what you need? Describe your problem
            </h4>
            <textarea
              rows={2}
              placeholder="E.g. The bedroom switchboard is sparking and kitchen light is flickering..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors"
            />
            
            <div className="mt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 hover:text-indigo-600">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>{selectedPhoto ? `Photo attached: ${selectedPhoto}` : '+ Attach photo of broken item (optional)'}</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer with Single Obvious Primary CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900">{cart.length} item(s)</span> selected
          </div>

          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-md transition-colors tap-target"
          >
            <span>Continue to Booking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
