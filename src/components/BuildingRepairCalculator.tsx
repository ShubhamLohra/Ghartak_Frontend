import React, { useState } from 'react';
import { Building2, Users, HardHat, ShieldCheck, CheckCircle2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const BuildingRepairCalculator: React.FC = () => {
  const { addToCart } = useCart();

  const [labourQty, setLabourQty] = useState(2); // Default 02 as noted
  const [mistryQty, setMistryQty] = useState(2); // Default 02 as noted
  const [contractorQty, setContractorQty] = useState(1); // Default 01 as noted
  const [engineerQty, setEngineerQty] = useState(4); // Default 04 as noted

  const labourRate = 850;
  const mistryRate = 1450;
  const contractorRate = 2500;
  const engineerRate = 3499;

  const totalEstimate = 
    (labourQty * labourRate) + 
    (mistryQty * mistryRate) + 
    (contractorQty * contractorRate) + 
    (engineerQty * engineerRate);

  const handleBookTeam = () => {
    addToCart({
      id: 9901,
      title: `Custom Building Repair Team (${labourQty} Labour, ${mistryQty} Mistry, ${contractorQty} Contractor, ${engineerQty} Engineer)`,
      description: 'Verified construction personnel & engineering consultants for project execution',
      price: totalEstimate,
      duration: 'Per Day / Visit',
      rating: 4.9,
      reviewCount: 310,
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
      unitType: 'custom team',
      isPopular: true
    });
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#0D0D12] via-[#14141E] to-[#0D0D12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-amber-500/30 relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
                <Building2 className="w-4 h-4" />
                <span>Building Repair & Construction Specialist</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                Select Construction Professionals
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                As per your notebook requirements, hire verified **Labour (02)**, **Master Mistry (02)**, **Contractor (01)**, and **Civil Engineers (04)** for structural repairs, masonry, and safety certification.
              </p>
            </div>

            {/* Total Box */}
            <div className="w-full lg:w-80 bg-[#1A1A28] border border-amber-500/40 rounded-2xl p-6 text-center shadow-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Estimated Team Payout</span>
              <p className="text-3xl font-extrabold text-gold-gradient my-2">₹{totalEstimate.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-400 mb-4">Includes 100% verified workers & site inspection report</p>
              <button
                onClick={handleBookTeam}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
              >
                <span>Book This Team</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* 4 Professional Type Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800">
            
            {/* 1. Labour (02) */}
            <div className="bg-[#181824] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Labour (02)</span>
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-lg font-bold text-white">Daily Helper Labour</p>
              <p className="text-xs text-slate-400 my-2">Heavy lifting, material movement, site cleanup</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-extrabold text-amber-300">₹{labourRate} / worker</span>
                <div className="flex items-center gap-2 bg-[#222232] rounded-lg p-1 border border-slate-700">
                  <button onClick={() => setLabourQty(Math.max(0, labourQty - 1))} className="p-1 hover:text-amber-400"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="text-xs font-bold w-4 text-center">{labourQty}</span>
                  <button onClick={() => setLabourQty(labourQty + 1)} className="p-1 hover:text-amber-400"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>

            {/* 2. Mistry (02) */}
            <div className="bg-[#181824] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Mistry (02)</span>
                <HardHat className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-lg font-bold text-white">Master Mason</p>
              <p className="text-xs text-slate-400 my-2">Plastering, brickwork, tile fixing & masonry</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-extrabold text-amber-300">₹{mistryRate} / mason</span>
                <div className="flex items-center gap-2 bg-[#222232] rounded-lg p-1 border border-slate-700">
                  <button onClick={() => setMistryQty(Math.max(0, mistryQty - 1))} className="p-1 hover:text-amber-400"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="text-xs font-bold w-4 text-center">{mistryQty}</span>
                  <button onClick={() => setMistryQty(mistryQty + 1)} className="p-1 hover:text-amber-400"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>

            {/* 3. Contractor (01) */}
            <div className="bg-[#181824] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Contractor (01)</span>
                <ShieldCheck className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-lg font-bold text-white">General Contractor</p>
              <p className="text-xs text-slate-400 my-2">Site supervision & material procurement</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-extrabold text-amber-300">₹{contractorRate} / visit</span>
                <div className="flex items-center gap-2 bg-[#222232] rounded-lg p-1 border border-slate-700">
                  <button onClick={() => setContractorQty(Math.max(0, contractorQty - 1))} className="p-1 hover:text-amber-400"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="text-xs font-bold w-4 text-center">{contractorQty}</span>
                  <button onClick={() => setContractorQty(contractorQty + 1)} className="p-1 hover:text-amber-400"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>

            {/* 4. Engineer (04) */}
            <div className="bg-[#181824] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Engineer (04)</span>
                <CheckCircle2 className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-lg font-bold text-white">Civil Engineer</p>
              <p className="text-xs text-slate-400 my-2">Structural audit & load safety review</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-extrabold text-amber-300">₹{engineerRate} / proj</span>
                <div className="flex items-center gap-2 bg-[#222232] rounded-lg p-1 border border-slate-700">
                  <button onClick={() => setEngineerQty(Math.max(0, engineerQty - 1))} className="p-1 hover:text-amber-400"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="text-xs font-bold w-4 text-center">{engineerQty}</span>
                  <button onClick={() => setEngineerQty(engineerQty + 1)} className="p-1 hover:text-amber-400"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
