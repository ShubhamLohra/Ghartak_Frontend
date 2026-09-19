import React, { useState } from 'react';
import { GharTakLogo } from './GharTakLogo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  HardHat, 
  Package, 
  Building2, 
  LayoutDashboard, 
  CalendarCheck,
  ChevronDown,
  Sparkles,
  Tag
} from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { cart, totalItems, selectedCity, setSelectedCity, setIsCartOpen, activeView, setActiveView } = useCart();
  const { user, setIsAuthModalOpen, logout } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/95 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl">
      
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 border-b border-indigo-500/30 text-indigo-200 font-semibold text-[11px] py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Ghar Tak Hazaribagh Special: Get 10% Flat Cashback on First Booking • Use Code: <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/30 tracking-wider">GHARTAK10</span></span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & City Selector */}
          <div className="flex items-center gap-4 shrink-0">
            <div onClick={() => setActiveView('home')} className="cursor-pointer">
              <GharTakLogo size="md" showBadge={true} />
            </div>

            {/* City Dropdown */}
            <div className="relative hidden xl:block">
              <button 
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#151D2A] border border-slate-700/80 hover:border-indigo-500/60 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-inner"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate max-w-[150px]">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-[#151D2A] border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 backdrop-blur-xl">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors ${selectedCity === city ? 'text-indigo-400 font-extrabold bg-indigo-500/10' : 'text-slate-300'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Electrician, Plumber, Cement, Carpenter..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full bg-[#151D2A] border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Action & Navigation Buttons */}
          <div className="flex items-center gap-2">
            
            <button
              onClick={() => setActiveView('raw_material')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeView === 'raw_material' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-[#151D2A] text-slate-200 hover:text-indigo-300 border border-slate-700/80 hover:border-indigo-500/60'}`}
            >
              <Package className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hardware Depot</span>
            </button>

            <button
              onClick={() => setActiveView('building_calculator')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeView === 'building_calculator' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-[#151D2A] text-slate-200 hover:text-indigo-300 border border-slate-700/80 hover:border-indigo-500/60'}`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Building Hiring</span>
            </button>

            <button
              onClick={() => setActiveView('partner_hub')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all border ${activeView === 'partner_hub' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-gradient-to-r from-indigo-500/10 to-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:border-indigo-400'}`}
            >
              <HardHat className="w-4 h-4 text-indigo-400" />
              <span>Partner Hub</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-all"
              title="Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            {/* My Bookings Button */}
            <button
              onClick={() => setActiveView('my_bookings')}
              className="p-2 rounded-xl bg-[#151D2A] hover:bg-[#1E293B] text-slate-300 hover:text-indigo-400 transition-all border border-slate-800 hover:border-indigo-500/40"
              title="My Bookings"
            >
              <CalendarCheck className="w-4 h-4" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
              title="Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5 stroke-[2.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B0F19] animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Login/Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 font-black flex items-center justify-center text-xs">
                  {user.fullName.charAt(0)}
                </div>
                <div className="hidden sm:block text-left text-[11px]">
                  <p className="font-bold text-slate-200 leading-tight">{user.fullName}</p>
                  <button onClick={logout} className="text-indigo-400 hover:underline text-[10px] font-semibold">Logout</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/25"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 lg:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Electrician, Plumber, Cement, Carpenter..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full bg-[#151D2A] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
