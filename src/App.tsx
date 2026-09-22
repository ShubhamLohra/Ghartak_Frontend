import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { BuildingRepairCalculator } from './components/BuildingRepairCalculator';
import { RawMaterialMarketplace } from './components/RawMaterialMarketplace';
import { DiagnosticServicesSection } from './components/DiagnosticServicesSection';
import { ServiceModal } from './components/ServiceModal';
import { CartDrawer } from './components/CartDrawer';
import { BookingTracker } from './components/BookingTracker';
import { PartnerLeadHub } from './components/PartnerLeadHub';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { HelpSection } from './components/HelpSection';
import { ProfileSection } from './components/ProfileSection';
import { Footer } from './components/Footer';
import { ServiceCategory } from './types';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const { activeView, setActiveView } = useCart();
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = currentUser && (currentUser.role === 'ADMIN' || (currentUser.email && currentUser.email.toLowerCase().includes('admin')));

  useEffect(() => {
    // For Admin users, default their primary view to the Admin Portal
    if (isAdmin && activeView === 'home') {
      setActiveView('admin');
    }
  }, [isAdmin, activeView, setActiveView]);

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectCategoryByCode = (code: string) => {
    const found = categories.find((c) => c.code === code);
    if (found) {
      setSelectedCategory(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      {/* Navigation Header & Bottom Bar */}
      <Navbar onSearch={handleSearch} />

      {/* Main Content Views */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroBanner
              onSelectCategory={handleSelectCategoryByCode}
              onSearchSubmit={handleSearch}
            />

            {/* Core Categories Grid & Sections */}
            <CategoryGrid
              categories={categories}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </>
        )}

        {activeView === 'raw_material' && <RawMaterialMarketplace />}
        {activeView === 'building_calculator' && <BuildingRepairCalculator />}
        {activeView === 'partner_hub' && <PartnerLeadHub />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'my_bookings' && <BookingTracker />}
        {activeView === 'help' && <HelpSection />}
        {activeView === 'profile' && <ProfileSection />}
      </main>

      {/* Interactive Service Detail Modal */}
      {selectedCategory && (
        <ServiceModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}

      {/* Multi-step Cart & Checkout Drawer */}
      <CartDrawer />

      {/* User Login & Registration Modal */}
      <AuthModal />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
