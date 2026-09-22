import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Booking, Review, ServiceCategory, ServiceItem, User, AdminNotification } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Wrench, 
  DollarSign, 
  Star, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw,
  UserCheck,
  CheckCircle,
  Truck,
  Play,
  XCircle,
  ChevronRight,
  Bell,
  PieChart,
  AlertTriangle,
  UserPlus,
  Sliders,
  X,
  Pencil,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'analytics' | 'catalog' | 'providers' | 'dispatch' | 'insights' | 'cancellations'>('analytics');
  
  // Analytics State
  const [analyticsRange, setAnalyticsRange] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [analyticsData, setAnalyticsData] = useState<any>({
    totalBookings: 14,
    totalMoney: 48500,
    totalCommission: 7275,
    totalPayout: 41225
  });

  // Main Data States
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [leastBookedData, setLeastBookedData] = useState<any>({ leastBookedServices: [], leastBookedProviders: [] });
  const [cancellationData, setCancellationData] = useState<any>({ totalCancelled: 0, stageBreakdown: {}, cancelledOrders: [] });
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Panels
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

  // Reassignment Target State
  const [selectedBookingForReassign, setSelectedBookingForReassign] = useState<Booking | null>(null);
  const [reassignProviderId, setReassignProviderId] = useState<number | null>(null);
  const [reassignReason, setReassignReason] = useState('');

  // New Provider State (Admin-Only Onboarding)
  const [newPartner, setNewPartner] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: 'Electrician Services',
    city: 'Hazaribagh (Main Town)',
    address: ''
  });

  // Custom Confirmation & Toast States
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [toastNotice, setToastNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastNotice({ message, type });
    setTimeout(() => {
      setToastNotice(null);
    }, 4000);
  };

  // Service Management State (Add & Edit)
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    code: '',
    iconName: 'Wrench',
    description: '',
    baseCharge: 149,
    commissionRate: 15,
    commissionType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED'
  });

  // Individual Service Options Management State
  const [selectedCategoryForItems, setSelectedCategoryForItems] = useState<ServiceCategory | null>(null);
  const [isServiceItemsModalOpen, setIsServiceItemsModalOpen] = useState(false);
  const [categoryServiceItems, setCategoryServiceItems] = useState<ServiceItem[]>([]);
  const [editingServiceItem, setEditingServiceItem] = useState<ServiceItem | null>(null);
  const [isServiceItemFormOpen, setIsServiceItemFormOpen] = useState(false);
  const [newServiceItem, setNewServiceItem] = useState<{
    title: string;
    description: string;
    price: number | string;
    originalPrice: number | string;
    unitType: string;
    duration: string;
    isPopular: boolean;
  }>({
    title: '',
    description: '',
    price: 80,
    originalPrice: 100,
    unitType: 'per kg',
    duration: '24 Hours',
    isPopular: false
  });

  const handleOpenAddServiceItem = () => {
    setEditingServiceItem(null);
    setNewServiceItem({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      unitType: 'per kg',
      duration: '24 Hours',
      isPopular: false
    });
    setIsServiceItemFormOpen(true);
  };

  const handleOpenEditServiceItem = (item: ServiceItem) => {
    setEditingServiceItem(item);
    setNewServiceItem({
      title: item.title,
      description: item.description || '',
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      unitType: item.unitType || 'per kg',
      duration: item.duration || '24 Hours',
      isPopular: item.isPopular || false
    });
    setIsServiceItemFormOpen(true);
  };

  const handleSaveInlineServiceOption = async () => {
    if (!newServiceItem.title.trim()) {
      showToast('Please enter an option title', 'error');
      return;
    }

    const payload = {
      ...newServiceItem,
      price: newServiceItem.price === '' ? 0 : parseFloat(String(newServiceItem.price)) || 0,
      originalPrice: newServiceItem.originalPrice === '' ? 0 : parseFloat(String(newServiceItem.originalPrice)) || 0
    };

    if (editingCategory && editingCategory.id) {
      try {
        if (editingServiceItem && editingServiceItem.id) {
          await api.updateServiceItem(editingServiceItem.id, payload);
          showToast('Service option updated!', 'success');
        } else {
          await api.saveServiceItem(editingCategory.id, payload);
          showToast('Service option added!', 'success');
        }
        const updated = await api.getServicesByCategory(editingCategory.id);
        setCategoryServiceItems(updated);
        setIsServiceItemFormOpen(false);
        setEditingServiceItem(null);
      } catch (err) {
        showToast('Failed to save service option', 'error');
      }
    } else {
      if (editingServiceItem) {
        setCategoryServiceItems(prev => prev.map(item => item === editingServiceItem ? { ...item, ...payload } as ServiceItem : item));
      } else {
        setCategoryServiceItems(prev => [...prev, { ...payload, id: Date.now() } as ServiceItem]);
      }
      setIsServiceItemFormOpen(false);
      setEditingServiceItem(null);
      showToast('Option added to list', 'success');
    }
  };

  const handleDeleteServiceItem = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this service option?')) return;
    if (editingCategory && editingCategory.id && itemId > 1000) {
      try {
        await api.deleteServiceItem(itemId);
        showToast('Service option deleted', 'success');
        const updated = await api.getServicesByCategory(editingCategory.id);
        setCategoryServiceItems(updated);
      } catch (err) {
        showToast('Failed to delete service option', 'error');
      }
    } else {
      setCategoryServiceItems(prev => prev.filter(item => item.id !== itemId));
      showToast('Option removed', 'success');
    }
  };

  const handleOpenAddCategoryModal = () => {
    setEditingCategory(null);
    setNewCategory({
      name: '',
      code: '',
      iconName: 'Wrench',
      description: '',
      baseCharge: 149,
      commissionRate: 15,
      commissionType: 'PERCENTAGE'
    });
    setCategoryServiceItems([]);
    setIsServiceItemFormOpen(false);
    setIsAddCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = async (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setNewCategory({
      name: cat.name || '',
      code: cat.code || '',
      iconName: cat.iconName || 'Wrench',
      description: cat.description || '',
      baseCharge: cat.baseCharge || 149,
      commissionRate: cat.commissionRate || 15,
      commissionType: (cat.commissionType as 'PERCENTAGE' | 'FIXED') || 'PERCENTAGE'
    });
    setCategoryServiceItems([]);
    setIsServiceItemFormOpen(false);
    setIsAddCategoryModalOpen(true);
    try {
      const items = await api.getServicesByCategory(cat.id);
      setCategoryServiceItems(items);
    } catch (err) {
      setCategoryServiceItems([]);
    }
  };

  const handleDeleteCategoryPrompt = (cat: ServiceCategory) => {
    setCategoryToDelete(cat);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeletingCategory(true);
    try {
      await api.deleteCategory(categoryToDelete.id);
      showToast(`Service "${categoryToDelete.name}" deleted successfully!`, 'success');
      setCategoryToDelete(null);
      loadAdminData();
    } catch (err) {
      showToast('Failed to delete service', 'error');
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, catsRes, bookingsRes, providersRes, leastRes, cancelRes, notifRes, reviewsRes] = await Promise.all([
        api.getFinancialAnalytics(analyticsRange),
        api.getCategories(),
        api.getAllAdminBookings(),
        api.getAllAdminProviders(),
        api.getLeastBookedInsights(),
        api.getCancellationAnalysis(),
        api.getAdminNotifications(),
        api.getReviews()
      ]);

      setAnalyticsData(analyticsRes);
      setCategories(catsRes);
      setBookings(bookingsRes);
      setProviders(providersRes);
      setLeastBookedData(leastRes);
      setCancellationData(cancelRes);
      setNotifications(notifRes);
      setReviews(reviewsRes);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [analyticsRange]);

  const handleUpdateStatus = async (bookingId: number, status: string, providerId?: number) => {
    try {
      await api.updateAdminBookingStatus(bookingId, status, providerId);
      showToast(`Booking status updated to ${status}`);
      loadAdminData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleReassignBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReassign || !reassignProviderId) return;

    try {
      await api.reassignBooking(selectedBookingForReassign.id, reassignProviderId, reassignReason);
      setIsReassignModalOpen(false);
      setSelectedBookingForReassign(null);
      setReassignReason('');
      loadAdminData();
      showToast('Booking successfully reassigned to new provider!');
    } catch (err) {
      showToast('Failed to reassign booking', 'error');
    }
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.onboardProvider({
        ...newPartner,
        password: 'worker123',
        rating: 4.9,
        completedJobs: 0,
        totalEarnings: 0.0,
        dailyLeadsRemaining: 3
      });
      setIsOnboardModalOpen(false);
      setNewPartner({ fullName: '', email: '', phone: '', profession: 'Electrician Services', city: 'Hazaribagh (Main Town)', address: '' });
      loadAdminData();
      showToast(`Partner ${newPartner.fullName} onboarded successfully!`);
    } catch (err) {
      showToast('Failed to onboard provider', 'error');
    }
  };

  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newCategory,
        baseCharge: newCategory.baseCharge === '' ? 0 : parseFloat(String(newCategory.baseCharge)) || 0,
        commissionRate: newCategory.commissionRate === '' ? 0 : parseFloat(String(newCategory.commissionRate)) || 0,
        code: newCategory.code || newCategory.name.toUpperCase().replace(/\s+/g, '_'),
        badgeText: '01 Verified',
        bgGradient: 'from-[#4F46E5] to-[#3730A3]'
      };

      if (editingCategory && editingCategory.id) {
        await api.updateCategory(editingCategory.id, payload);
        showToast(`Service "${newCategory.name}" updated successfully!`);
      } else {
        await api.saveCategory(payload);
        showToast(`New Service "${newCategory.name}" added successfully!`);
      }

      setIsAddCategoryModalOpen(false);
      setEditingCategory(null);
      loadAdminData();
    } catch (err) {
      showToast('Failed to save service', 'error');
    }
  };

  const handleMarkNotificationRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-24 transition-colors">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Ghartak Super Admin Portal</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Enterprise Operations & Scalable Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Night Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-300 transition-colors tap-target flex items-center justify-center"
            title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
            aria-label="Toggle Night Mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* In-App Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 relative transition-colors tap-target"
              title="Admin In-App Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* In-App Notifications Drawer Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    In-App Activity Notifications
                  </h4>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">{unreadNotificationsCount} unread</span>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No notifications yet.</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkNotificationRead(n.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          n.isRead ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400' : 'bg-indigo-50/70 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-slate-800 dark:text-slate-100 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{n.title}</span>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>}
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={loadAdminData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsOnboardModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors tap-target"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Provider</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200 dark:border-slate-800">
          {[
            { key: 'analytics', label: '📊 Revenue & Commission Analytics' },
            { key: 'catalog', label: '🛠️ Service Catalog & Charges Config' },
            { key: 'providers', label: '👷 Admin Provider Onboarding' },
            { key: 'dispatch', label: '📅 Live Dispatch & Manual Re-assign' },
            { key: 'insights', label: '📉 Least Booked Insights' },
            { key: 'cancellations', label: '❌ Cancellation Analysis' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap tap-target ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: FINANCIAL & COMMISSION ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Timeframe Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Analytics Timeframe:</span>
              <div className="flex items-center gap-2">
                {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map(r => (
                  <button
                    key={r}
                    onClick={() => setAnalyticsRange(r as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      analyticsRange === r ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Bookings</span>
                <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">{analyticsData.totalBookings || 14}</p>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">In selected {analyticsRange.toLowerCase()} timeframe</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Sales</span>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹{(analyticsData.totalMoney || 48500).toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">Total customer transactions</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Admin Earnings</span>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">₹{(analyticsData.totalCommission || 7275).toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">Platform Net Revenue (15% Avg)</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Partner Payouts</span>
                <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">₹{(analyticsData.totalPayout || 41225).toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1 block">After commission deduction</span>
              </div>
            </div>

            {/* Service Commission Rules Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Service Category Base Charges & Commission Rates</h3>
                <button
                  onClick={handleOpenAddCategoryModal}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  + Add Service Category
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Service Category Name</th>
                      <th className="p-3">Base Price</th>
                      <th className="p-3">Commission Rate</th>
                      <th className="p-3">Commission Type</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categories.map(c => (
                      <tr key={c.id} className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{c.name}</td>
                        <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">₹{c.baseCharge || 149}</td>
                        <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                          {c.commissionType === 'FIXED' ? `₹${c.commissionRate || 150}` : `${c.commissionRate || 15}%`}
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-md ${
                            c.commissionType === 'FIXED' 
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
                              : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                          }`}>
                            {c.commissionType === 'FIXED' ? 'FIXED AMOUNT (₹)' : 'PERCENTAGE (%)'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditCategoryModal(c)}
                              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Edit Service, Commission & Options"
                            >
                              <Pencil className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCategoryPrompt(c)}
                              className="px-2.5 py-1 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Delete Service"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICE CATALOG & CHARGES CONFIGURATOR */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Service Category Catalog & Pricing Manager</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Configure base prices and admin commission</p>
                </div>
                <button
                  onClick={handleOpenAddCategoryModal}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
                >
                  + Add Service Category
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">{c.code}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditCategoryModal(c)}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
                          title="Edit Service"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategoryPrompt(c)}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{c.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{c.description || 'Verified Home Service'}</p>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-700 dark:text-slate-300">
                      <span>Base Price: <strong className="text-slate-900 dark:text-slate-100 font-bold">₹{c.baseCharge || 149}</strong></span>
                      <span>Commission: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{c.commissionType === 'FIXED' ? `₹${c.commissionRate || 150}` : `${c.commissionRate || 15}%`}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN PROVIDER ONBOARDING */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Enrolled Service Professionals</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Admin-only provider creation, category assignment, and net payout overview</p>
                </div>
                <button
                  onClick={() => setIsOnboardModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <UserPlus className="w-4 h-4" /> Onboard New Partner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {providers.map(p => (
                  <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{p.fullName}</h4>
                      <span className="text-amber-500 font-bold">★ {p.rating || 4.9}</span>
                    </div>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{p.profession || 'Service Provider'}</p>
                    <p className="text-slate-500 dark:text-slate-400">📍 {p.city || 'Hazaribagh'} • 📞 {p.phone}</p>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-slate-700 dark:text-slate-300">
                      <span>Jobs: <strong className="text-slate-900 dark:text-slate-100 font-bold">{p.completedJobs || 120}</strong></span>
                      <span>Net Payout: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">₹{((p.totalEarnings || 45000) * 0.85).toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE DISPATCH & MANUAL RE-ASSIGNMENT */}
        {activeTab === 'dispatch' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Search Booking Code or Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none w-72 font-medium"
              />
              <div className="flex items-center gap-2">
                {['ALL', 'BOOKED', 'PROVIDER_ASSIGNED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${statusFilter === st ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {bookings.filter(b => (statusFilter === 'ALL' || b.status === statusFilter) && b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())).map(b => (
                <div key={b.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">#{b.bookingCode}</span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{b.serviceCategoryName}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold rounded-full">
                        {b.status}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-base">₹{b.totalAmount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
                    <div>
                      <p>👤 Customer: <strong className="text-slate-900 dark:text-slate-100">{b.customer?.fullName || 'Shubham Kumar'}</strong></p>
                      <p>📍 Address: {b.address}</p>
                      <p>📅 Time Slot: {b.scheduledTimeSlot}</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-500 dark:text-slate-400">Assigned Partner:</p>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{b.provider ? b.provider.fullName : 'None (Unassigned)'}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedBookingForReassign(b);
                          setIsReassignModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                      >
                        Re-assign Partner
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LEAST BOOKED INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Least Booked Services Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leastBookedData.leastBookedServices?.slice(0, 6).map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.categoryName}</h4>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">Low demand category</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold rounded-lg border border-amber-200 dark:border-amber-800">
                      {item.bookingCount} Bookings
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CANCELLATION ANALYSIS */}
        {activeTab === 'cancellations' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Cancellation Stage Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-xs">
                {Object.entries(cancellationData.stageBreakdown || {}).map(([stage, count]: any) => (
                  <div key={stage} className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">{stage}</span>
                    <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ONBOARD PROVIDER (ADMIN ONLY) */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Onboard New Provider (Admin Only)</h3>
              <button onClick={() => setIsOnboardModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleOnboardSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newPartner.fullName}
                  onChange={e => setNewPartner({ ...newPartner, fullName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newPartner.email}
                  onChange={e => setNewPartner({ ...newPartner, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 outline-none font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={newPartner.phone}
                    onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Profession</label>
                  <select
                    value={newPartner.profession}
                    onChange={e => setNewPartner({ ...newPartner, profession: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 outline-none font-medium"
                  >
                    <option value="Electrician Services">Electrician Services</option>
                    <option value="Plumbing Services">Plumbing Services</option>
                    <option value="Carpenter Services">Carpenter Services</option>
                    <option value="Laundry & Dry Cleaning">Laundry & Dry Cleaning</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsOnboardModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all">Save & Onboard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SERVICE WITH COMMISSION & SERVICE OPTIONS */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingCategory ? 'Edit Service Category' : 'Add New Service Category'}
              </h3>
              <button onClick={() => { setIsAddCategoryModalOpen(false); setEditingCategory(null); }} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveCategorySubmit} className="space-y-3.5 text-xs overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Service Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laundry & Dry Cleaning"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCategory.baseCharge}
                    onChange={e => setNewCategory({ ...newCategory, baseCharge: e.target.value === '' ? '' : (parseFloat(e.target.value) || '') })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {newCategory.commissionType === 'PERCENTAGE' ? 'Commission Rate (%)' : 'Commission Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={newCategory.commissionType === 'PERCENTAGE' ? '15' : '150'}
                    value={newCategory.commissionRate}
                    onChange={e => setNewCategory({ ...newCategory, commissionRate: e.target.value === '' ? '' : (parseFloat(e.target.value) || '') })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Commission Calculation Type Selector */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Commission Type Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, commissionType: 'PERCENTAGE' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      newCategory.commissionType === 'PERCENTAGE'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, commissionType: 'FIXED' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      newCategory.commissionType === 'FIXED'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Fixed Amount (₹)
                  </button>
                </div>
              </div>

              {/* Services under this Category */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-slate-800 dark:text-slate-200 font-bold text-xs">
                      Services under this Category
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Add services & pricing (e.g. Wash & Fold ₹80/kg, Wash + Iron ₹120/kg)
                    </p>
                  </div>
                  {!isServiceItemFormOpen && (
                    <button
                      type="button"
                      onClick={handleOpenAddServiceItem}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Service
                    </button>
                  )}
                </div>

                {/* List of Current Service Options */}
                {categoryServiceItems.length > 0 && (
                  <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                    {categoryServiceItems.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{item.title}</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{item.price}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-medium">
                            {item.unitType || 'per job'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditServiceItem(item)}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="Edit option"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteServiceItem(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Remove option"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Add / Edit Service Form */}
                {isServiceItemFormOpen && (
                  <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2.5 animate-fade-in text-xs">
                    <div className="flex items-center justify-between font-bold text-indigo-950 dark:text-indigo-200">
                      <span>{editingServiceItem ? 'Edit Service' : 'Add New Service'}</span>
                      <button type="button" onClick={() => setIsServiceItemFormOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold mb-0.5">Service Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Wash & Fold, Wash + Iron"
                          value={newServiceItem.title}
                          onChange={e => setNewServiceItem({ ...newServiceItem, title: e.target.value })}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold mb-0.5">Service Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newServiceItem.price}
                          onChange={e => setNewServiceItem({ ...newServiceItem, price: e.target.value === '' ? '' : (parseFloat(e.target.value) || '') })}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold mb-0.5">Unit Charge Format *</label>
                        <select
                          value={newServiceItem.unitType}
                          onChange={e => setNewServiceItem({ ...newServiceItem, unitType: e.target.value })}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 outline-none font-medium"
                        >
                          <option value="per kg">per kg (Laundry / Dry Clean)</option>
                          <option value="per piece">per piece (Dry Clean / Item)</option>
                          <option value="per job">per job (Standard Fix)</option>
                          <option value="per visit">per visit (Checkup Fee)</option>
                          <option value="per hour">per hour (Labor Charge)</option>
                          <option value="per sqft">per sqft (Painting / Tiling)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold mb-0.5">Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 24 Hours, 30 Mins"
                          value={newServiceItem.duration}
                          onChange={e => setNewServiceItem({ ...newServiceItem, duration: e.target.value })}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-1.5 pt-1">
                      <button type="button" onClick={() => setIsServiceItemFormOpen(false)} className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-[11px]">Cancel</button>
                      <button type="button" onClick={handleSaveInlineServiceOption} className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] shadow-sm">Save Service</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddCategoryModalOpen(false); setEditingCategory(null); }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  {editingCategory ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION POP-UP */}
      {toastNotice && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 animate-slide-up ${
          toastNotice.type === 'error'
            ? 'bg-red-900 text-white border-red-800'
            : 'bg-slate-900 dark:bg-slate-800 text-white border-slate-800 dark:border-slate-700'
        }`}>
          {toastNotice.type === 'error' ? <XCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span>{toastNotice.message}</span>
        </div>
      )}

    </div>
  );
};
