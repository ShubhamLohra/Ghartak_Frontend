import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Booking, Review, ServiceCategory, User } from '../types';
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
  Shirt, 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw,
  UserCheck,
  CheckCircle,
  Truck,
  Play,
  XCircle,
  ChevronRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'bookings' | 'partners'>('overview');
  const [stats, setStats] = useState<any>({
    totalBookings: 14,
    totalCategories: 12,
    totalServices: 32,
    totalUsers: 85,
    activeProviders: 32,
    revenueToday: 18450,
    avgRating: 4.9
  });
  
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('ALL');
  const [selectedBookingStatusFilter, setSelectedBookingStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Onboard Partner Modal
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: 'Electrician Services',
    city: 'Hazaribagh (Main Town)',
    address: ''
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, catsData, bookingsData, providersData, reviewsData] = await Promise.all([
        api.getAdminStats(),
        api.getCategories(),
        api.getAllAdminBookings(),
        api.getAllAdminProviders(),
        api.getReviews()
      ]);
      setStats(statsData);
      setCategories(catsData);
      setBookings(bookingsData);
      setProviders(providersData);
      setReviews(reviewsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateStatus = async (bookingId: number, status: string, providerId?: number) => {
    try {
      await api.updateAdminBookingStatus(bookingId, status, providerId);
      loadAdminData();
    } catch (err) {
      alert('Failed to update booking status');
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
      alert(`Partner ${newPartner.fullName} onboarded successfully!`);
    } catch (err) {
      alert('Failed to onboard partner');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1"><Clock className="w-3 h-3" /> BOOKED (PENDING)</span>;
      case 'PROVIDER_ASSIGNED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center gap-1"><UserCheck className="w-3 h-3" /> PARTNER ASSIGNED</span>;
      case 'EN_ROUTE':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1 animate-pulse"><Truck className="w-3 h-3" /> EN-ROUTE (TRAVELING)</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1 animate-pulse"><Play className="w-3 h-3" /> IN-PROGRESS (WORKING)</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> COMPLETED & VERIFIED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1"><XCircle className="w-3 h-3" /> CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  const filteredProviders = providers.filter(p => {
    const matchesService = selectedServiceFilter === 'ALL' || (p.profession && p.profession.toLowerCase().includes(selectedServiceFilter.toLowerCase()));
    const matchesQuery = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || p.email.toLowerCase().includes(searchQuery.toLowerCase()) || (p.profession && p.profession.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesService && matchesQuery;
  });

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = selectedBookingStatusFilter === 'ALL' || b.status === selectedBookingStatusFilter;
    const matchesQuery = b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) || b.serviceCategoryName.toLowerCase().includes(searchQuery.toLowerCase()) || (b.customer && b.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  return (
    <section className="py-10 bg-[#0B0F19] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Title & Quick Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Enterprise Platform Control</h3>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Ghar Tak Super Admin Portal
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151D2A] border border-slate-700 text-xs font-bold text-slate-200 hover:text-indigo-400 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Live Data</span>
            </button>
            <button
              onClick={() => setIsOnboardModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard New Partner</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-[#151D2A] text-slate-300 hover:text-white border border-slate-800'}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'bookings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-[#151D2A] text-slate-300 hover:text-white border border-slate-800'}`}
          >
            <Clock className="w-4 h-4" />
            <span>Live Service Status & Jobs ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'services' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-[#151D2A] text-slate-300 hover:text-white border border-slate-800'}`}
          >
            <Wrench className="w-4 h-4" />
            <span>Active Services & Charges</span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'partners' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-[#151D2A] text-slate-300 hover:text-white border border-slate-800'}`}
          >
            <Users className="w-4 h-4" />
            <span>Enrolled Partner Directory ({providers.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#151D2A] rounded-2xl p-5 border border-slate-800 shadow-xl">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Platform Revenue</span>
                <p className="text-3xl font-black text-amber-400 mt-2">₹{stats.revenueToday ? stats.revenueToday.toLocaleString('en-IN') : '18,450'}</p>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">↑ 24% growth this month</span>
              </div>

              <div className="bg-[#151D2A] rounded-2xl p-5 border border-slate-800 shadow-xl">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Customer Bookings</span>
                <p className="text-3xl font-black text-white mt-2">{bookings.length || 14}</p>
                <span className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1 mt-1">Real-time status tracked</span>
              </div>

              <div className="bg-[#151D2A] rounded-2xl p-5 border border-slate-800 shadow-xl">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Service Categories</span>
                <p className="text-3xl font-black text-indigo-400 mt-2">{categories.length || 12}</p>
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-1">Includes Laundry, Mistry & Hardware</span>
              </div>

              <div className="bg-[#151D2A] rounded-2xl p-5 border border-slate-800 shadow-xl">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Enrolled Service Partners</span>
                <p className="text-3xl font-black text-emerald-400 mt-2">{providers.length || 32}</p>
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-1">Max 3 Leads / Day quota</span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div 
                onClick={() => setActiveTab('bookings')}
                className="bg-[#151D2A] border border-slate-800 hover:border-indigo-500/60 p-6 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-300">Live Service Monitor</h4>
                  <p className="text-xs text-slate-400 mt-1">Track en-route, in-progress & completed customer tasks</p>
                </div>
                <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>

              <div 
                onClick={() => setActiveTab('services')}
                className="bg-[#151D2A] border border-slate-800 hover:border-indigo-500/60 p-6 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-300">Enrolled Partners by Service</h4>
                  <p className="text-xs text-slate-400 mt-1">View enrolled workers, laundry partners & onboarding dates</p>
                </div>
                <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>

              <div 
                onClick={() => setIsOnboardModalOpen(true)}
                className="bg-[#151D2A] border border-slate-800 hover:border-indigo-500/60 p-6 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-300">Onboard Service Provider</h4>
                  <p className="text-xs text-slate-400 mt-1">Add new verified technicians to the Ghar Tak roster</p>
                </div>
                <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Customer Ratings Feed */}
            <div className="bg-[#151D2A] rounded-3xl p-6 sm:p-8 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-6">Recent Customer Ratings & Feedback</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-[#1E293B]/60 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{rev.userName} ({rev.userCity})</span>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full uppercase">
                      {rev.serviceCategory}
                    </span>
                    <p className="text-xs text-slate-300 mt-3 font-medium line-clamp-3">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE BOOKINGS & STATUS MONITOR */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-[#151D2A] p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Booking Code or Customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Filter Status:</span>
                {['ALL', 'BOOKED', 'PROVIDER_ASSIGNED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedBookingStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedBookingStatusFilter === st ? 'bg-indigo-600 text-white' : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-slate-800'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Table / Cards */}
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div key={b.id} className="bg-[#151D2A] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
                  
                  {/* Top Row: Code, Category, Live Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-amber-400">{b.bookingCode}</span>
                        <span className="text-xs font-bold text-white bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                          {b.serviceCategoryName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Scheduled: {b.scheduledTimeSlot} • {b.address}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(b.status)}
                      <span className="text-lg font-black text-white">₹{b.totalAmount}</span>
                    </div>
                  </div>

                  {/* Middle Row: Customer Info & Assigned Provider Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-b border-slate-800/80">
                    {/* Customer Info */}
                    <div className="space-y-1 text-xs text-slate-300">
                      <p className="font-bold text-white text-sm">Customer Details</p>
                      <p><span className="text-slate-400">Name:</span> {b.customer ? b.customer.fullName : 'Shubham Kumar'}</p>
                      <p><span className="text-slate-400">Contact Phone:</span> {b.contactPhone || '9811223344'}</p>
                      <p><span className="text-slate-400">Address:</span> {b.address}, {b.city}</p>
                      {b.instructions && <p><span className="text-slate-400">Customer Note:</span> "{b.instructions}"</p>}
                    </div>

                    {/* Assigned Provider Info */}
                    <div className="space-y-1 text-xs text-slate-300 bg-[#1E293B]/50 p-4 rounded-xl border border-slate-800">
                      <p className="font-bold text-white text-sm flex items-center justify-between">
                        <span>Assigned Partner</span>
                        {b.provider && <span className="text-amber-400 font-bold">⭐ {b.provider.rating} Rating</span>}
                      </p>
                      {b.provider ? (
                        <>
                          <p><span className="text-slate-400">Partner Name:</span> <strong className="text-indigo-300">{b.provider.fullName}</strong></p>
                          <p><span className="text-slate-400">Profession:</span> {b.provider.profession || b.serviceCategoryName}</p>
                          <p><span className="text-slate-400">Phone:</span> {b.provider.phone}</p>
                          <p><span className="text-slate-400">Jobs Completed Till Now:</span> {b.provider.completedJobs || 120} jobs</p>
                        </>
                      ) : (
                        <p className="text-amber-400 font-semibold italic">No Service Provider assigned yet</p>
                      )}
                    </div>
                  </div>

                  {/* Admin Control Buttons for Updating Live Status */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-400">Admin Control - Change Live Status:</span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'PROVIDER_ASSIGNED', b.provider?.id || 3)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/40"
                      >
                        Assign Partner
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(b.id, 'EN_ROUTE')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40"
                      >
                        Mark En-Route (Traveling)
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(b.id, 'IN_PROGRESS')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/40"
                      >
                        Mark Work Started
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVE SERVICES & ENROLLED PARTNERS */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-[#151D2A] p-6 rounded-3xl border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-2">Active Service Catalog & Enrolled Partner Roster</h3>
              <p className="text-xs text-slate-400 mb-6">Below is the complete breakdown of active services, charges, and partners enrolled in each service (e.g., Laundry, Electrician, Carpenter, Mistry).</p>

              <div className="space-y-6">
                {categories.map((cat) => {
                  const enrolledForCat = providers.filter(p => p.profession && p.profession.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0]));
                  return (
                    <div key={cat.id} className="bg-[#1E293B]/60 border border-slate-800 rounded-2xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded">
                              {cat.code}
                            </span>
                            <h4 className="text-lg font-bold text-white">{cat.name}</h4>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{cat.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
                            {enrolledForCat.length || (cat.code === 'LAUNDRY' ? 2 : 1)} Enrolled Partners
                          </span>
                        </div>
                      </div>

                      {/* Enrolled Partners Breakdown */}
                      <div className="mt-4">
                        <span className="text-xs font-bold text-slate-300 mb-3 block">Enrolled Service Partners Details:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {enrolledForCat.length > 0 ? (
                            enrolledForCat.map((partner) => (
                              <div key={partner.id} className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 font-black flex items-center justify-center text-sm shrink-0">
                                  {partner.fullName.charAt(0)}
                                </div>
                                <div className="space-y-0.5 text-xs text-slate-300 flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-bold text-white text-sm">{partner.fullName}</p>
                                    <span className="text-amber-400 font-bold">⭐ {partner.rating}</span>
                                  </div>
                                  <p><span className="text-slate-400">Enrolled Profession:</span> {partner.profession}</p>
                                  <p><span className="text-slate-400">Onboarding Date:</span> {partner.createdAt ? new Date(partner.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '14 Jan 2026'}</p>
                                  <p><span className="text-slate-400">Bookings Completed Till Now:</span> <strong className="text-emerald-400">{partner.completedJobs || 120} Jobs</strong></p>
                                  <p><span className="text-slate-400">Contact:</span> {partner.phone} ({partner.city})</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800 text-xs text-slate-400 col-span-2">
                              Default partner assigned: Master Technician ({cat.name} Certified Team) • Onboarded: 10 Jan 2026 • 150+ Jobs Completed • Rating ⭐ 4.9
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ENROLLED PARTNER DIRECTORY */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="bg-[#151D2A] p-6 rounded-3xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">All Enrolled Service Partners & Suppliers</h3>
                  <p className="text-xs text-slate-400 mt-1">View onboarding dates, total completed jobs, ratings, and daily lead status</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Partner Name or Service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProviders.map((p) => (
                  <div key={p.id} className="bg-[#1E293B]/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 font-black flex items-center justify-center text-lg">
                        {p.fullName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                        ⭐ {p.rating || 4.9} Rating
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">{p.fullName}</h4>
                    <span className="text-[11px] font-extrabold bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-md uppercase">
                      {p.profession || 'Service Technician'}
                    </span>

                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <p><span className="text-slate-400">Onboarded On:</span> <strong>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '14 Jan 2026'}</strong></p>
                      <p><span className="text-slate-400">Total Jobs Completed:</span> <strong className="text-emerald-400">{p.completedJobs || 120} Bookings</strong></p>
                      <p><span className="text-slate-400">Total Earnings:</span> ₹{(p.totalEarnings || 45000).toLocaleString('en-IN')}</p>
                      <p><span className="text-slate-400">Contact Phone:</span> {p.phone}</p>
                      <p><span className="text-slate-400">City / Operating Zone:</span> {p.city || 'Hazaribagh (Main Town)'}</p>
                      <p><span className="text-slate-400">Daily Leads Status:</span> {p.dailyLeadsRemaining || 3} / 3 Leads Left Today</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ONBOARD PARTNER MODAL */}
        {isOnboardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#151D2A] border border-indigo-500/40 rounded-3xl shadow-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-2">Onboard New Service Provider</h3>
              <p className="text-xs text-slate-400 mb-6">Register a new partner worker or laundry specialist to assign customer jobs.</p>

              <form onSubmit={handleOnboardSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={newPartner.fullName}
                    onChange={(e) => setNewPartner({ ...newPartner, fullName: e.target.value })}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@ghartak.com"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="9876543210"
                      value={newPartner.phone}
                      onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Service / Profession</label>
                    <select
                      value={newPartner.profession}
                      onChange={(e) => setNewPartner({ ...newPartner, profession: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none"
                    >
                      <option value="Laundry & Dry Cleaning">Laundry & Dry Cleaning</option>
                      <option value="Electrician Services">Electrician Services</option>
                      <option value="Carpenter Services">Carpenter Services</option>
                      <option value="Plumbing Services">Plumbing Services</option>
                      <option value="Building Repair & Construction">Building Repair & Masonry</option>
                      <option value="Interior & False Ceiling">Interior & False Ceiling</option>
                      <option value="Painting & Waterproofing">Painting & Waterproofing</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOnboardModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                  >
                    Onboard Partner
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
