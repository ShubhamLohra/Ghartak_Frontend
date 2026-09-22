import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User, MapPin, Phone, Mail, Shield, LogOut, ChevronRight, Calculator, HardHat, LayoutDashboard, Plus, Crown } from 'lucide-react';

export const ProfileSection: React.FC = () => {
  const { currentUser, logout, openAuthModal } = useAuth();
  const { setActiveView } = useCart();
  const [savedAddresses] = useState([
    { id: 1, title: 'Home', address: 'House 42, Circular Road, Hazaribagh', isDefault: true },
    { id: 2, title: 'Office', address: 'Plot 18, Commercial Hub, Hazaribagh', isDefault: false }
  ]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center mb-24">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome to Ghartak</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 mb-6">Log in or sign up to manage your home service bookings, saved addresses, and profile details.</p>
        <button
          onClick={openAuthModal}
          className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-colors tap-target"
        >
          Log In / Register
        </button>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'ADMIN' || (currentUser.email && currentUser.email.toLowerCase().includes('admin'));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mb-24">
      {/* Profile Card Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
          {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{currentUser.fullName || 'User'}</h1>
            {isAdmin ? (
              <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                👑 Super Admin
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1">
                ✓ Verified User
              </span>
            )}
          </div>
          <div className="mt-2 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              {currentUser.phone || '+91 98765 43210'}
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              {currentUser.email || 'customer@ghartak.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Admin Banner if Admin */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-5 shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-slate-900 rounded-xl font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Super Admin Access Active</h3>
              <p className="text-xs text-indigo-200 mt-0.5">Manage platform services, commissions, analytics & dispatching</p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('admin')}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shrink-0 tap-target"
          >
            Open Admin Portal →
          </button>
        </div>
      )}

      {/* Saved Addresses */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Saved Addresses
          </h2>
          <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
        <div className="space-y-3">
          {savedAddresses.map((addr) => (
            <div key={addr.id} className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{addr.title}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold rounded-md">Default</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{addr.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialized Tools & Services */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Explore More Tools</h2>
        <div className="space-y-2">
          {isAdmin && (
            <button
              onClick={() => setActiveView('admin')}
              className="w-full p-3.5 bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 text-slate-950 rounded-lg font-bold">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Admin Control Panel</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Financial analytics, commission engine & live dispatching</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </button>
          )}

          <button
            onClick={() => setActiveView('building_calculator')}
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-lg">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Building & Repair Cost Estimator</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Calculate construction, plastering & painting costs</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveView('partner_hub')}
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-lg">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Partner & Professional Lead Hub</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Join as an electrician, plumber, or contractor</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        className="w-full py-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors tap-target"
      >
        <LogOut className="w-5 h-5" /> Log Out
      </button>
    </div>
  );
};
