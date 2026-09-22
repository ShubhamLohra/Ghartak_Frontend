import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { 
  CalendarCheck, 
  MapPin, 
  Clock, 
  User as UserIcon, 
  PhoneCall, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronDown,
  ChevronUp,
  XCircle,
  MessageSquare
} from 'lucide-react';

export const BookingTracker: React.FC = () => {
  const { activeBooking, setActiveView } = useCart();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(null);

  useEffect(() => {
    api.getUserBookings(1)
      .then((data) => {
        setUserBookings(data);
        if (data.length > 0 && activeBooking) {
          setExpandedBookingId(activeBooking.id);
        }
      })
      .catch((err) => {
        console.error('Failed to load user bookings', err);
        // Fallback default sample booking if backend unavailable
        setUserBookings([
          {
            id: 101,
            bookingCode: 'GT-482910',
            serviceCategoryName: 'Electrician Service',
            scheduledDate: 'Today',
            scheduledTimeSlot: '2:00 PM – 4:00 PM',
            address: 'House 42, Circular Road',
            city: 'Hazaribagh',
            pincode: '825301',
            contactPhone: '9876543210',
            totalAmount: 298,
            taxesAndFee: 49,
            paymentMethod: 'Cash on Service',
            paymentStatus: 'PENDING',
            status: 'PROVIDER_ASSIGNED',
            items: [{ title: 'Switch & Socket Repair', price: 149, quantity: 1 }, { title: 'Fan Regulator Repair', price: 100, quantity: 1 }],
            provider: {
              id: 5,
              email: 'rahul@ghartak.com',
              fullName: 'Rahul Kumar',
              phone: '9876543210',
              role: 'SERVICE_PROVIDER',
              profession: 'Electrician',
              rating: 4.8,
              completedJobs: 324
            }
          }
        ]);
      });
  }, [activeBooking]);

  const filteredBookings = userBookings.filter((b) => {
    if (activeTab === 'UPCOMING') return b.status === 'BOOKED' || b.status === 'PROVIDER_ASSIGNED' || b.status === 'EN_ROUTE' || b.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return { label: 'Confirmed', bg: 'bg-blue-100 text-blue-800' };
      case 'PROVIDER_ASSIGNED':
        return { label: 'Professional Assigned', bg: 'bg-indigo-100 text-indigo-800' };
      case 'EN_ROUTE':
        return { label: 'On the Way', bg: 'bg-amber-100 text-amber-800' };
      case 'IN_PROGRESS':
        return { label: 'Service in Progress', bg: 'bg-purple-100 text-purple-800' };
      case 'COMPLETED':
        return { label: 'Completed', bg: 'bg-emerald-100 text-emerald-800' };
      case 'CANCELLED':
        return { label: 'Cancelled', bg: 'bg-red-100 text-red-800' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-800' };
    }
  };

  const handleCancelBooking = (bookingId: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setUserBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mb-24">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Your Bookings</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Track live status of your home service requests</p>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-6">
        {[
          { key: 'UPCOMING', label: 'Upcoming' },
          { key: 'COMPLETED', label: 'Completed' },
          { key: 'CANCELLED', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px tap-target ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List or Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No bookings yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">Your upcoming services will appear here.</p>
          <button
            onClick={() => setActiveView('home')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm tap-target"
          >
            Book a service
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const badge = getStatusBadge(b.status);
            const isExpanded = expandedBookingId === b.id;

            return (
              <div key={b.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all">
                
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-400">ID: #{b.bookingCode}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">{b.serviceCategoryName}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Details Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <span>{b.scheduledDate}, {b.scheduledTimeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Total: ₹{b.totalAmount}</span>
                  </div>
                </div>

                {/* Assigned Professional Card */}
                {b.provider && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                        {b.provider.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{b.provider.fullName}</h4>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 font-semibold px-1.5 py-0.2 rounded">✓ Verified</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{b.provider.profession || 'Professional'} • ★ {b.provider.rating || 4.8} ({b.provider.completedJobs || 300}+ jobs)</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${b.provider.phone}`}
                      className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                )}

                {/* Stepper Timeline when expanded */}
                {isExpanded && (
                  <div className="my-4 p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">Live Status Tracker</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Booking Confirmed & Received</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Professional Assigned ({b.provider?.fullName || 'Rahul Kumar'})</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                        <span>On the way to your location</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                        <span>Service completion & payment</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => setExpandedBookingId(isExpanded ? null : b.id)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>Hide Tracking <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Track Booking <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg font-medium transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                    <a
                      href="https://wa.me/919999999999?text=Support%20needed%20for%20Booking%20GT-482910"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
