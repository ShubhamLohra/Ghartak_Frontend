import React from 'react';
import { ServiceCategory } from '../types';
import { 
  Zap, 
  Hammer, 
  Wrench, 
  Paintbrush, 
  Building2, 
  Camera, 
  Package, 
  Droplet, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ThumbsUp,
  ChevronRight,
  Sparkle,
  Bug,
  HomeIcon,
  CalendarCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CategoryGridProps {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  const { setActiveView } = useCart();

  const getCategoryIcon = (code: string) => {
    switch (code) {
      case 'ELECTRIC':
        return <Zap className="w-7 h-7 text-amber-500" />;
      case 'WASHROOM_CLEANING':
      case 'CLEANING':
        return <Sparkles className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />;
      case 'PLUMBER':
        return <Droplet className="w-7 h-7 text-sky-500" />;
      case 'CARPENTER':
        return <Hammer className="w-7 h-7 text-orange-500" />;
      case 'APPLIANCE':
      case 'VEHICLE_REPAIR':
        return <Wrench className="w-7 h-7 text-purple-500 dark:text-purple-400" />;
      case 'PAINT':
        return <Paintbrush className="w-7 h-7 text-rose-500" />;
      case 'PEST_CONTROL':
        return <Bug className="w-7 h-7 text-emerald-500" />;
      case 'BUILDING_REPAIR':
        return <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />;
      case 'RAW_MATERIAL':
        return <Package className="w-7 h-7 text-teal-600 dark:text-teal-400" />;
      default:
        return <Wrench className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const sampleRecentBookings = [
    { id: 1, name: 'Switch & Socket Repair', categoryCode: 'ELECTRIC', price: 149, date: 'Booked 2 weeks ago' },
    { id: 2, name: 'Bathroom Deep Cleaning', categoryCode: 'WASHROOM_CLEANING', price: 499, date: 'Booked 1 month ago' }
  ];

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 mb-20 transition-colors">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Section 1: Popular Services */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Popular Services</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Select a category to book a verified professional</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className="consumer-card-interactive p-4 sm:p-5 text-left flex flex-col justify-between group tap-target bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              >
                <div className="p-3 bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 rounded-2xl w-fit mb-3 transition-colors">
                  {getCategoryIcon(cat.code)}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    Starting @ ₹{cat.services && cat.services.length > 0 ? cat.services[0].price : 149}
                  </p>
                </div>
              </button>
            ))}

            {/* Specialized Building Calculator Card */}
            <button
              onClick={() => setActiveView('building_calculator')}
              className="consumer-card-interactive p-4 sm:p-5 text-left flex flex-col justify-between group bg-gradient-to-br from-indigo-50/50 to-amber-50/50 dark:from-indigo-950/40 dark:to-amber-950/40 border-indigo-200 dark:border-indigo-800"
            >
              <div className="p-3 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-2xl w-fit mb-3">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Building & Repair Calculator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Estimate construction & repair costs</p>
              </div>
            </button>
          </div>
        </div>

        {/* Section 2: Book Again */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Book Again
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sampleRecentBookings.map((b) => {
              const matchedCat = categories.find((c) => c.code === b.categoryCode) || categories[0];
              return (
                <div key={b.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between shadow-xs">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{b.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{b.date} • ₹{b.price}</p>
                  </div>
                  <button
                    onClick={() => onSelectCategory(matchedCat)}
                    className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-xl transition-colors tap-target"
                  >
                    Book again
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: How Ghartak Works */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-12 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 text-center mb-6">
            How Ghartak Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-lg mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">Choose a service</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Select from electrical, plumbing, cleaning, or repairs.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-lg mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">Pick a time</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Select a convenient date and 2-hour time slot.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-lg mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">A professional comes</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">A verified professional arrives at your doorstep.</p>
            </div>

          </div>
        </div>

        {/* Section 4: Why Choose Ghartak? */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 text-center sm:text-left">
            Why choose Ghartak?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center sm:text-left">
              <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto sm:mx-0 mb-2" />
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">Verified professionals</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Background checked</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center sm:text-left">
              <ThumbsUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto sm:mx-0 mb-2" />
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">Transparent pricing</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">No hidden surprises</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center sm:text-left">
              <CalendarCheck className="w-6 h-6 text-amber-500 mx-auto sm:mx-0 mb-2" />
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">Easy booking</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Book in under 1 min</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center sm:text-left">
              <HomeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto sm:mx-0 mb-2" />
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">At your doorstep</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Hassle-free service</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
