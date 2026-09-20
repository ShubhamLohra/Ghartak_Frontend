import React from 'react';
import { GharTakLogo } from './GharTakLogo';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 text-xs py-10 pb-28 sm:pb-12">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-2 md:col-span-1">
            <GharTakLogo size="md" />
            <p className="text-slate-500 text-xs leading-relaxed">
              Ghar Tak connects you with background-verified local professionals for home repairs, cleaning, plumbing, electrical work, and home maintenance.
            </p>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Home Services
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>Electrician Services</li>
              <li>Plumbing Services</li>
              <li>Home Cleaning</li>
              <li>Carpenter Services</li>
              <li>AC Repair & Service</li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Why Ghartak
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>✓ Verified Professionals</li>
              <li>✓ Upfront Transparent Pricing</li>
              <li>✓ Doorstep Service Guarantee</li>
              <li>✓ 7-Day Customer Support</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Need Help?
            </h4>
            <div className="space-y-2 text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-slate-900">1800-123-GHARTAK</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>support@ghartak.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Hazaribagh Main Town & Surrounding Areas</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Ghartak Services. All rights reserved. A to Z Solution in One Tap.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Become a Partner</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
