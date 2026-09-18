import React from 'react';
import { Activity, ShieldCheck, Clock, CheckCircle2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const DiagnosticServicesSection: React.FC = () => {
  const { addToCart } = useCart();

  const packages = [
    {
      id: 8801,
      title: 'Full Body Comprehensive Health Checkup',
      description: '63 Essential Tests including Lipid Profile, Kidney Function, Liver Function & Blood Sugar',
      price: 799,
      originalPrice: 1999,
      duration: 'Morning Doorstep Visit',
      rating: 4.95,
      reviewCount: 890,
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
      unitType: 'per person',
      isPopular: true
    },
    {
      id: 8802,
      title: 'HbA1c & Fasting Diabetes Monitor Panel',
      description: 'Accurate glycated hemoglobin test with NABL certified lab report in 12 hours',
      price: 349,
      originalPrice: 599,
      duration: '30 mins Visit',
      rating: 4.9,
      reviewCount: 450,
      imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80',
      unitType: 'per sample',
      isPopular: false
    }
  ];

  return (
    <section className="py-12 bg-[#0F0F14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Doorstep Health Services</h3>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Diagnostic Related Services (Home Sample Collection)
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mb-8">
            Book NABL certified lab technicians for blood sample collection directly at your home. Digital reports delivered within 12-24 hours.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-[#181824] border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full uppercase border border-amber-500/30">
                      NABL Accredited Lab
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{pkg.duration}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{pkg.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{pkg.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-gold-gradient">₹{pkg.price}</span>
                    <span className="text-xs text-slate-500 line-through ml-2">₹{pkg.originalPrice}</span>
                  </div>

                  <button
                    onClick={() => addToCart(pkg)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Book Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
