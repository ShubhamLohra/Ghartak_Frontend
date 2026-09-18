import React from 'react';
import { GharTakLogo } from './GharTakLogo';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0E] border-t border-amber-500/20 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <GharTakLogo size="md" />
            <p className="text-slate-400 leading-relaxed text-xs">
              Ghar Tak is India's leading on-demand hardware & home solutions platform. Verified Electricians, Plumbers, Carpenters, Building Repair Workers & POP False Ceiling Specialists in one tap.
            </p>
          </div>

          {/* Core Hardware & Home Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Hardware & Repairs
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li>⚡ Electrician Services (House Wiring, MCB)</li>
              <li>🔨 Carpenter Services (Doors, Modular)</li>
              <li>🚰 Plumbing Services (Tap Leaks, Tanks)</li>
              <li>🎨 Painting & Waterproofing</li>
              <li>📹 CCTV Camera & Computer Services</li>
            </ul>
          </div>

          {/* Construction & Specialized Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Construction & Health
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li>🏗️ Building Repair (Labour, Mistry, Contractor, Engineer)</li>
              <li>🏠 Interior Work & POP False Ceiling</li>
              <li>🧱 Raw Material Store (Cement, Steel, Bricks)</li>
              <li>🧹 Washroom & Bathroom Cleaning</li>
              <li>🩸 Diagnostic Services (At-Home Tests)</li>
            </ul>
          </div>

          {/* Support & Helpline */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Customer Support
            </h4>
            <div className="space-y-3 text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">1800-123-GHARTAK</span> (Toll Free)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>support@ghartak.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Delhi NCR • Mumbai • Bengaluru • Patna</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Ghar Tak Hardware App. All rights reserved. “A to Z Solution in One Tap”</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Partner Registration</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
