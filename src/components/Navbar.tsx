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
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { cart, totalItems, selectedCity, setSelectedCity, setIsCartOpen, activeView, setActiveView } = useCart();
  const { user, setIsAuthModalOpen, logout } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const cities = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Patna', 'Lucknow', 'Jaipur', 'Hyderabad'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F14]/90 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black font-extrabold text-[12px] py-1 px-4 text-center tracking-wider flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 fill-black" />
        <span>Ghar Tak Special Offer: Get 10% Flat Cashback on First Booking | Use Code: <span className="underline">GHARTAK10</span></span>
        <Sparkles className="w-3.5 h-3.5 fill-black" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div onClick={() => setActiveView('home')}>
            <GharTakLogo size="md" />
          </div>

          {/* Location Selector & Search Input */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-4">
            
            {/* City Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-2 bg-[#1A1A26] border border-amber-500/30 hover:border-amber-500 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-inner"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="truncate max-w-[100px]">{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-[#181824] border border-amber-500/30 rounded-xl shadow-2xl py-2 z-50">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-amber-500/20 hover:text-amber-400 transition-colors ${selectedCity === city ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-300'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Electrician, Plumber, False Ceiling, Cement..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full bg-[#161622] border border-slate-700/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Navigation Links & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Nav View Buttons */}
            <button
              onClick={() => setActiveView('raw_material')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeView === 'raw_material' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-[#181824] text-slate-300 hover:text-amber-400 hover:bg-[#202030]'}`}
            >
              <Package className="w-4 h-4" />
              <span>Raw Material Depot</span>
            </button>

            <button
              onClick={() => setActiveView('building_calculator')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeView === 'building_calculator' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-[#181824] text-slate-300 hover:text-amber-400 hover:bg-[#202030]'}`}
            >
              <Building2 className="w-4 h-4" />
              <span>Building Repair</span>
            </button>

            <button
              onClick={() => setActiveView('partner_hub')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border border-amber-500/40 ${activeView === 'partner_hub' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black' : 'bg-[#1D1A10] text-amber-400 hover:bg-amber-500/20'}`}
            >
              <HardHat className="w-4 h-4 text-amber-400" />
              <span>Partner Lead Hub</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-all`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin</span>
            </button>

            {/* My Bookings Trigger */}
            <button
              onClick={() => setActiveView('my_bookings')}
              className="p-2.5 rounded-xl bg-[#181824] hover:bg-[#202030] text-slate-300 hover:text-amber-400 transition-all border border-slate-700/40"
              title="My Bookings"
            >
              <CalendarCheck className="w-4.5 h-4.5" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-lg shadow-amber-500/25 hover:scale-105 transition-all"
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0F0F14] animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center text-xs">
                  {user.fullName.charAt(0)}
                </div>
                <div className="hidden md:block text-left text-[11px]">
                  <p className="font-bold text-slate-200 leading-tight">{user.fullName}</p>
                  <button onClick={logout} className="text-amber-400 hover:underline text-[10px]">Logout</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all"
              >
                <UserIcon className="w-4 h-4 text-amber-400" />
                <span>Login</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Electrician, Plumber, False Ceiling, Cement..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full bg-[#161622] border border-slate-700 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
