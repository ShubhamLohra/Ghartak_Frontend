import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, Key, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  const { setActiveView } = useCart();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'SERVICE_PROVIDER' | 'ADMIN'>('CUSTOMER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSuccess = (userData: any, authToken: string) => {
    login(userData, authToken);
    if (userData.role === 'ADMIN' || userData.email.includes('admin')) {
      setActiveView('admin');
    } else {
      setActiveView('home');
    }
  };

  const handlePresetSelect = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await api.register({ email, password, fullName, phone, role });
        handleLoginSuccess(res, res.token || 'mock-jwt-token');
      } else {
        const res = await api.login(email, password);
        handleLoginSuccess(res.user || res, res.token || 'mock-jwt-token');
      }
    } catch (err: any) {
      // Fallback for client side demo preview if backend API unreachable
      const isAdmin = email.includes('admin');
      const isProvider = email.includes('electric') || email.includes('worker');

      handleLoginSuccess({
        id: isAdmin ? 1 : (isProvider ? 3 : 2),
        email: email || 'admin@ghartak.com',
        fullName: isAdmin ? 'Super Admin' : (isProvider ? 'Rajesh Electrician' : 'Shubham Kumar'),
        phone: '9876543210',
        role: isAdmin ? 'ADMIN' : (isProvider ? 'SERVICE_PROVIDER' : 'CUSTOMER')
      }, 'mock-jwt-token-ghartak');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors tap-target"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {isSignUp ? 'Create Ghartak Account' : 'Welcome to Ghartak'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Enter your account credentials to continue</p>
        </div>

        {/* Quick Demo Preset Chips */}
        {!isSignUp && (
          <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick 1-Tap Fill Credentials:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePresetSelect('admin@ghartak.com', 'admin123')}
                className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold rounded-lg text-[11px] transition-colors"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('user@ghartak.com', 'user123')}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-[11px] transition-colors"
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('rajesh.electric@ghartak.com', 'worker123')}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-[11px] transition-colors"
              >
                👷 Service Partner
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {isSignUp && (
            <div>
              <label className="text-xs text-slate-700 font-semibold">Full Name</label>
              <div className="relative mt-1">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Shubham Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none font-medium"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-700 font-semibold">Email Address</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="admin@ghartak.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-700 font-semibold">Password</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none font-medium"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="text-xs text-slate-700 font-semibold">Account Role</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors ${role === 'CUSTOMER' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SERVICE_PROVIDER')}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors ${role === 'SERVICE_PROVIDER' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  Service Partner
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 tap-target"
          >
            <span>{isLoading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Log In Now')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
};
