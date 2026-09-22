import React, { useState } from 'react';
import { GharTakLogo } from './GharTakLogo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  MapPin, 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  CalendarCheck,
  ChevronDown,
  Home,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { cart, totalItems, selectedCity, setSelectedCity, setIsCartOpen, activeView, setActiveView } = useCart();
  const { currentUser, openAuthModal } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const isAdmin = currentUser && (currentUser.role === 'ADMIN' || (currentUser.email && currentUser.email.toLowerCase().includes('admin')));

  const cities = [
    'Hazaribagh (Main Town)',
    'Korrah, Hazaribagh',
    'Matwari & Lake Road',
    'Boddom Bazar',
    'Canary Hill Road',
    'Call Babu Chowk',
    'Pagmil, Hazaribagh',
    'Pelawal, Hazaribagh',
    'Demotand Zone'
  ];

  return (
    <>
      {/* Top Banner Ribbon */}
      <div className="bg-indigo-600 text-white font-medium text-xs py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
        <span>Ghar Tak Trust Guarantee: Verified Local Professionals Delivered to Your Doorstep</span>
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          {/* Logo & Location Dropdown */}
          <div className="flex items-center gap-3">
            <div onClick={() => setActiveView(isAdmin ? 'admin' : 'home')} className="cursor-pointer">
              <GharTakLogo size="md" showBadge={false} />
            </div>

            {/* City / Location Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 transition-all tap-target"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate max-w-[130px] sm:max-w-[180px]">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Your Area
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors ${
                        selectedCity === city ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/60 dark:bg-indigo-950/80' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            
            {/* Prominent Admin Portal Button / Customer Preview Toggle for Admin Users */}
            {isAdmin && (
              <button
                onClick={() => setActiveView(activeView === 'admin' ? 'home' : 'admin')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl transition-all shadow-sm border tap-target ${
                  activeView === 'admin' 
                    ? 'bg-slate-800 hover:bg-slate-900 text-white border-slate-700' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 border-amber-400/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{activeView === 'admin' ? 'Preview Customer App' : 'Admin Portal'}</span>
              </button>
            )}

            {/* Night / Day Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-300 transition-all tap-target flex items-center justify-center"
              title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
              aria-label="Toggle Night Mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all tap-target"
              title="Cart Summary"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile / Login */}
            {currentUser ? (
              <button
                onClick={() => setActiveView('profile')}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Profile'}
                </span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm tap-target"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Persistent Mobile & Tablet Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1.5 transition-colors">
        <div className="max-w-md mx-auto flex items-center justify-around">
          
          <button
            onClick={() => setActiveView(isAdmin ? 'admin' : 'home')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors tap-target ${
              (isAdmin ? activeView === 'admin' : activeView === 'home') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            {isAdmin ? (
              <LayoutDashboard className={`w-5 h-5 mb-0.5 ${(isAdmin ? activeView === 'admin' : activeView === 'home') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            ) : (
              <Home className={`w-5 h-5 mb-0.5 ${(isAdmin ? activeView === 'admin' : activeView === 'home') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            )}
            <span className="text-[11px]">{isAdmin ? 'Admin' : 'Home'}</span>
          </button>

          <button
            onClick={() => setActiveView('my_bookings')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors tap-target ${
              activeView === 'my_bookings' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            <CalendarCheck className={`w-5 h-5 mb-0.5 ${activeView === 'my_bookings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px]">Bookings</span>
          </button>

          <button
            onClick={() => setActiveView('help')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors tap-target ${
              activeView === 'help' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            <HelpCircle className={`w-5 h-5 mb-0.5 ${activeView === 'help' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px]">Help</span>
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors tap-target ${
              activeView === 'profile' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            <UserIcon className={`w-5 h-5 mb-0.5 ${activeView === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px]">Profile</span>
          </button>

        </div>
      </nav>
    </>
  );
};
