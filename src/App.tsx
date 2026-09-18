import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
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
import { Footer } from './components/Footer';
import { ServiceCategory, ServiceItem } from './types';
import { api } from './services/api';

// Ghar Tak - "A to Z Solution in One Tap" - Production Deployment
const AppContent: React.FC = () => {
  const { activeView } = useCart();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="min-h-screen flex flex-col bg-[#0F0F14] text-white selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <Navbar onSearch={handleSearch} />

      {/* Main Content Views */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroBanner
              onSelectCategory={handleSelectCategoryByCode}
              onSearchSubmit={handleSearch}
            />

            {/* Core Categories Grid (11 Services) */}
            <CategoryGrid
              categories={categories}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Specialized Building Repair Component */}
            <BuildingRepairCalculator />

            {/* Raw Material Supply Store */}
            <RawMaterialMarketplace />

            {/* Diagnostic Services Section */}
            <DiagnosticServicesSection />
          </>
        )}

        {activeView === 'raw_material' && <RawMaterialMarketplace />}
        {activeView === 'building_calculator' && <BuildingRepairCalculator />}
        {activeView === 'partner_hub' && <PartnerLeadHub />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'my_bookings' && <BookingTracker />}
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
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
