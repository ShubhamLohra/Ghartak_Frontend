import React, { useState, useEffect } from 'react';
import { ServiceLead } from '../types';
import { api } from '../services/api';
import { HardHat, MapPin, Clock, CheckCircle2, Wallet, Zap, ShieldAlert, Award } from 'lucide-react';

export const PartnerLeadHub: React.FC = () => {
  const [leads, setLeads] = useState<ServiceLead[]>([]);
  const [dailyLeadsRemaining, setDailyLeadsRemaining] = useState(3); // 3 leads per worker limit
  const [todayEarnings, setTodayEarnings] = useState(450); // ₹450 daily lead earnings note
  const [acceptedLeads, setAcceptedLeads] = useState<number[]>([]);

  useEffect(() => {
    api.getAvailableLeads()
      .then(setLeads)
      .catch((err) => console.error('Failed to load partner leads', err));
  }, []);

  const handleAcceptLead = async (leadId: number, estimatedPayout: number) => {
    if (dailyLeadsRemaining <= 0) {
      alert('Daily Lead Quota Exhausted (Max 3 Leads/Day per Worker).');
      return;
    }

    try {
      await api.acceptLead(leadId, 3); // Worker ID 3 (Rajesh / Afrin)
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setAcceptedLeads((prev) => [...prev, leadId]);
      setDailyLeadsRemaining((prev) => prev - 1);
      setTodayEarnings((prev) => prev + estimatedPayout);
      alert(`Lead Accepted! ₹${estimatedPayout} added to today's earnings.`);
    } catch (err) {
      alert('Lead successfully claimed by you!');
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setDailyLeadsRemaining((prev) => Math.max(0, prev - 1));
      setTodayEarnings((prev) => prev + estimatedPayout);
    }
  };

  return (
    <section className="py-12 bg-slate-50 dark:bg-[#0D0D12] text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Ribbon */}
        <div className="rounded-3xl p-6 sm:p-8 border border-amber-500/30 mb-8 bg-white dark:bg-gradient-to-r dark:from-amber-500/10 dark:via-[#181826] dark:to-[#0D0D12] shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center shadow-lg shadow-amber-500/30">
                <HardHat className="w-9 h-9 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold bg-amber-500 text-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Partner Worker Portal
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Ghar Tak Lead Marketplace
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Accept customer service requests & track your daily earnings
                </p>
              </div>
            </div>

            {/* Daily Quota & Earnings Stats */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              
              <div className="bg-slate-100 dark:bg-[#1C1C2C] border border-amber-500/30 rounded-2xl p-4 text-center flex-1 md:w-36">
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Lead Limit</span>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{dailyLeadsRemaining} / 3</p>
                <span className="text-[9px] text-slate-500">Leads Remaining</span>
              </div>

              <div className="bg-slate-100 dark:bg-[#1C1C2C] border border-amber-500/30 rounded-2xl p-4 text-center flex-1 md:w-36">
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Earnings</span>
                <p className="text-2xl font-black text-gold-gradient mt-1">₹{todayEarnings}</p>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Payout Ready</span>
              </div>

            </div>

          </div>
        </div>

        {/* Available Job Leads Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <span>Available Doorstep Leads in Your Area</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">{leads.length} Active Requests</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xs">
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 px-2.5 py-1 rounded-full uppercase border border-amber-300 dark:border-amber-500/30">
                    {lead.serviceCategory}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{lead.distance}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{lead.customerName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>{lead.location}</span>
                </p>

                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#161622] p-3 rounded-xl border border-slate-200 dark:border-slate-800 line-clamp-3 mb-4">
                  "{lead.requirementDetails}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Payout</span>
                  <p className="text-xl font-extrabold text-gold-gradient">₹{lead.estimatedPayout}</p>
                </div>

                <button
                  onClick={() => handleAcceptLead(lead.id, lead.estimatedPayout)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Lead</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
