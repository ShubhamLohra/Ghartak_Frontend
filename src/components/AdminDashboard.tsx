import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Booking, Review, ServiceCategory, User, AdminNotification } from '../types';
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
  Trash2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
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

  // Category Management State (Add & Edit)
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    code: '',
    iconName: 'Wrench',
    description: '',
    categoryGroup: 'Hardware & Electrical',
    baseCharge: 149,
    commissionRate: 15,
    commissionType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED'
  });

  const handleOpenAddCategoryModal = () => {
    setEditingCategory(null);
    setNewCategory({
      name: '',
      code: '',
      iconName: 'Wrench',
      description: '',
      categoryGroup: 'Hardware & Electrical',
      baseCharge: 149,
      commissionRate: 15,
      commissionType: 'PERCENTAGE'
    });
    setIsAddCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setNewCategory({
      name: cat.name || '',
      code: cat.code || '',
      iconName: cat.iconName || 'Wrench',
      description: cat.description || '',
      categoryGroup: cat.categoryGroup || 'Hardware & Electrical',
      baseCharge: cat.baseCharge || 149,
      commissionRate: cat.commissionRate || 15,
      commissionType: (cat.commissionType as 'PERCENTAGE' | 'FIXED') || 'PERCENTAGE'
    });
    setIsAddCategoryModalOpen(true);
  };

  const handleDeleteCategoryPrompt = (cat: ServiceCategory) => {
    setCategoryToDelete(cat);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeletingCategory(true);
    try {
      await api.deleteCategory(categoryToDelete.id);
      showToast(`Category "${categoryToDelete.name}" deleted successfully!`, 'success');
      setCategoryToDelete(null);
      loadAdminData();
    } catch (err) {
      showToast('Failed to delete category', 'error');
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
        code: newCategory.code || newCategory.name.toUpperCase().replace(/\s+/g, '_'),
        badgeText: '01 Verified',
        bgGradient: 'from-[#4F46E5] to-[#3730A3]'
      };

      if (editingCategory && editingCategory.id) {
        await api.updateCategory(editingCategory.id, payload);
        showToast(`Service Category "${newCategory.name}" updated successfully!`);
      } else {
        await api.saveCategory(payload);
        showToast(`New Service Category "${newCategory.name}" added successfully!`);
      }

      setIsAddCategoryModalOpen(false);
      setEditingCategory(null);
      loadAdminData();
    } catch (err) {
      showToast('Failed to save service category', 'error');
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Ghartak Super Admin Portal</h1>
            <p className="text-[11px] text-slate-500 font-medium">Enterprise Operations & Scalable Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* In-App Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 relative transition-colors tap-target"
              title="Admin In-App Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* In-App Notifications Drawer Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    In-App Activity Notifications
                  </h4>
                  <span className="text-[10px] text-indigo-600 font-bold">{unreadNotificationsCount} unread</span>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No notifications yet.</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkNotificationRead(n.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          n.isRead ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-indigo-50/70 border-indigo-200 text-slate-800 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
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
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200">
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
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 font-medium'
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
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Analytics Timeframe:</span>
              <div className="flex items-center gap-2">
                {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map(r => (
                  <button
                    key={r}
                    onClick={() => setAnalyticsRange(r as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      analyticsRange === r ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Bookings</span>
                <p className="text-3xl font-black text-slate-900 mt-1">{analyticsData.totalBookings || 14}</p>
                <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">In selected {analyticsRange.toLowerCase()} timeframe</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Gross GMV Money</span>
                <p className="text-3xl font-black text-emerald-600 mt-1">₹{(analyticsData.totalMoney || 48500).toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Total customer transactions</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Admin Net Commission</span>
                <p className="text-3xl font-black text-indigo-600 mt-1">₹{(analyticsData.totalCommission || 7275).toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Platform Net Revenue (15% Avg)</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Provider Net Payouts</span>
                <p className="text-3xl font-black text-amber-600 mt-1">₹{(analyticsData.totalPayout || 41225).toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-amber-600 font-semibold mt-1 block">After commission deduction</span>
              </div>
            </div>

            {/* Category Commission Rules Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Category Base Charges & Commission Rates</h3>
                <button
                  onClick={handleOpenAddCategoryModal}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  + Add Category
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-700">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Category Name</th>
                      <th className="p-3">Group</th>
                      <th className="p-3">Base Charge</th>
                      <th className="p-3">Commission Rate</th>
                      <th className="p-3">Commission Type</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map(c => (
                      <tr key={c.id} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3 text-slate-500">{c.categoryGroup || 'Home Care'}</td>
                        <td className="p-3 font-bold text-emerald-700">₹{c.baseCharge || 149}</td>
                        <td className="p-3 font-bold text-indigo-600">
                          {c.commissionType === 'FIXED' ? `₹${c.commissionRate || 150}` : `${c.commissionRate || 15}%`}
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-md ${
                            c.commissionType === 'FIXED' 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                              : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                          }`}>
                            {c.commissionType === 'FIXED' ? 'FIXED AMOUNT (₹)' : 'PERCENTAGE (%)'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditCategoryModal(c)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Edit Category & Commission"
                            >
                              <Pencil className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCategoryPrompt(c)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
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
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Service Catalog & Pricing Manager</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Configure base inspection charges, category groups, and admin commission</p>
                </div>
                <button
                  onClick={handleOpenAddCategoryModal}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
                >
                  + Add New Category
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div key={c.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs hover:border-indigo-300 transition-all space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 uppercase">{c.code}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">{c.categoryGroup || 'General'}</span>
                        <button
                          onClick={() => handleOpenEditCategoryModal(c)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                          title="Edit Category"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategoryPrompt(c)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{c.description || 'Verified Home Service Category'}</p>
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-700">
                      <span>Base Inspection: <strong className="text-slate-900 font-bold">₹{c.baseCharge || 149}</strong></span>
                      <span>Commission: <strong className="text-indigo-600 font-bold">{c.commissionType === 'FIXED' ? `₹${c.commissionRate || 150}` : `${c.commissionRate || 15}%`}</strong></span>
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
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Enrolled Service Professionals</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Admin-only provider creation, category assignment, and net payout overview</p>
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
                  <div key={p.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{p.fullName}</h4>
                      <span className="text-amber-500 font-bold">★ {p.rating || 4.9}</span>
                    </div>
                    <p className="text-indigo-600 font-semibold">{p.profession || 'Service Provider'}</p>
                    <p className="text-slate-500">📍 {p.city || 'Hazaribagh'} • 📞 {p.phone}</p>
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-700">
                      <span>Jobs: <strong className="text-slate-900 font-bold">{p.completedJobs || 120}</strong></span>
                      <span>Net Payout: <strong className="text-emerald-600 font-bold">₹{((p.totalEarnings || 45000) * 0.85).toLocaleString('en-IN')}</strong></span>
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
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Search Booking Code or Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none w-72 font-medium"
              />
              <div className="flex items-center gap-2">
                {['ALL', 'BOOKED', 'PROVIDER_ASSIGNED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${statusFilter === st ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {bookings.filter(b => (statusFilter === 'ALL' || b.status === statusFilter) && b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())).map(b => (
                <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-600">#{b.bookingCode}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{b.serviceCategoryName}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold rounded-full">
                        {b.status}
                      </span>
                      <span className="font-bold text-slate-900 text-base">₹{b.totalAmount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                    <div>
                      <p>👤 Customer: <strong className="text-slate-900">{b.customer?.fullName || 'Shubham Kumar'}</strong></p>
                      <p>📍 Address: {b.address}</p>
                      <p>📅 Time Slot: {b.scheduledTimeSlot}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-500">Assigned Partner:</p>
                        <p className="font-bold text-slate-900">{b.provider ? b.provider.fullName : 'None (Unassigned)'}</p>
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
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4">Least Booked Services Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leastBookedData.leastBookedServices?.slice(0, 6).map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.categoryName}</h4>
                      <p className="text-slate-500 mt-0.5">Low demand category</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-200">
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
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4">Cancellation Stage Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-xs">
                {Object.entries(cancellationData.stageBreakdown || {}).map(([stage, count]: any) => (
                  <div key={stage} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold uppercase">{stage}</span>
                    <p className="text-2xl font-black text-red-600 mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ONBOARD PROVIDER (ADMIN ONLY) */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Onboard New Provider (Admin Only)</h3>
              <button onClick={() => setIsOnboardModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleOnboardSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newPartner.fullName}
                  onChange={e => setNewPartner({ ...newPartner, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newPartner.email}
                  onChange={e => setNewPartner({ ...newPartner, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={newPartner.phone}
                    onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Profession</label>
                  <select
                    value={newPartner.profession}
                    onChange={e => setNewPartner({ ...newPartner, profession: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                  >
                    <option value="Electrician Services">Electrician Services</option>
                    <option value="Plumbing Services">Plumbing Services</option>
                    <option value="Carpenter Services">Carpenter Services</option>
                    <option value="Laundry & Dry Cleaning">Laundry & Dry Cleaning</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsOnboardModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all">Save & Onboard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY WITH COMMISSION */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Edit Service Category & Commission' : 'Add Service Category & Commission'}
              </h3>
              <button onClick={() => { setIsAddCategoryModalOpen(false); setEditingCategory(null); }} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCategorySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Appliance Repair"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Group</label>
                <select
                  value={newCategory.categoryGroup}
                  onChange={e => setNewCategory({ ...newCategory, categoryGroup: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                >
                  <option value="Hardware & Electrical">Hardware & Electrical</option>
                  <option value="Hardware & Plumbing">Hardware & Plumbing</option>
                  <option value="Hardware & Carpentry">Hardware & Carpentry</option>
                  <option value="Construction & Structural">Construction & Structural</option>
                  <option value="Home Care">Home Care</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Base Inspection (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCategory.baseCharge}
                    onChange={e => setNewCategory({ ...newCategory, baseCharge: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {newCategory.commissionType === 'PERCENTAGE' ? 'Commission Rate (%)' : 'Commission Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={newCategory.commissionType === 'PERCENTAGE' ? '15' : '150'}
                    value={newCategory.commissionRate}
                    onChange={e => setNewCategory({ ...newCategory, commissionRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Commission Calculation Type Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Commission Type Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, commissionType: 'PERCENTAGE' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      newCategory.commissionType === 'PERCENTAGE'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Fixed Amount (₹)
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddCategoryModalOpen(false); setEditingCategory(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RE-ASSIGN BOOKING */}
      {isReassignModalOpen && selectedBookingForReassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Re-assign Provider for #{selectedBookingForReassign.bookingCode}</h3>
              <button onClick={() => setIsReassignModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleReassignBookingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select New Provider</label>
                <select
                  onChange={e => setReassignProviderId(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                >
                  <option value="">Select a professional...</option>
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.profession}) - ★ {p.rating}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Re-assignment Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Previous technician bike breakdown"
                  value={reassignReason}
                  onChange={e => setReassignReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 text-slate-900 outline-none font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsReassignModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm">Confirm Re-assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM DELETE CONFIRMATION POP-UP */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setCategoryToDelete(null)} 
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon Badge */}
            <div className="w-16 h-16 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Delete Category Confirmation</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 font-bold">"{categoryToDelete.name}"</strong>? 
              This action will permanently remove it from the service catalog and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                disabled={isDeletingCategory}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingCategory ? 'Deleting...' : 'Yes, Delete Category'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION POP-UP */}
      {toastNotice && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 animate-slide-up ${
          toastNotice.type === 'error'
            ? 'bg-red-900 text-white border-red-800'
            : 'bg-slate-900 text-white border-slate-800'
        }`}>
          {toastNotice.type === 'error' ? <XCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span>{toastNotice.message}</span>
        </div>
      )}

    </div>
  );
};
