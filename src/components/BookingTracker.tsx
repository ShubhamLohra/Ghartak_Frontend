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
  Download,
  AlertCircle
} from 'lucide-react';

export const BookingTracker: React.FC = () => {
  const { activeBooking, setActiveBooking } = useCart();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.getUserBookings(2)
      .then((data) => {
        setUserBookings(data);
        if (data.length > 0 && !activeBooking) {
          setActiveBooking(data[0]);
        }
      })
      .catch((err) => console.error('Failed to load user bookings', err));
  }, []);

  const booking = activeBooking || (userBookings.length > 0 ? userBookings[0] : null);

  if (!booking) {
    return (
      <div className="py-20 text-center text-slate-400 bg-[#0F0F14] min-h-[60vh] flex flex-col items-center justify-center">
        <CalendarCheck className="w-16 h-16 text-amber-500/40 mb-3" />
        <h3 className="text-xl font-bold text-white mb-1">No Active Bookings Found</h3>
        <p className="text-xs text-slate-400">Book any service or hardware solution to track live progress here.</p>
      </div>
    );
  }

  const steps = [
    { label: 'Booked', status: 'BOOKED', done: true },
    { label: 'Provider Assigned', status: 'PROVIDER_ASSIGNED', done: true },
    { label: 'On The Way', status: 'EN_ROUTE', done: booking.status === 'EN_ROUTE' || booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED' },
    { label: 'Work In Progress', status: 'IN_PROGRESS', done: booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED' },
    { label: 'Completed', status: 'COMPLETED', done: booking.status === 'COMPLETED' },
  ];

  return (
    <section className="py-12 bg-[#0F0F14] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Live Service Tracking</h3>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Booking #{booking.bookingCode}
            </h2>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase">
            {booking.status.replace('_', ' ')}
          </span>
        </div>

        {/* Progress Stepper Bar */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 border border-amber-500/20">
          <div className="grid grid-cols-5 gap-2 relative">
            {steps.map((st, idx) => (
              <div key={st.label} className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${st.done ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                  {st.done ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                </div>
                <span className={`text-[10px] sm:text-xs font-bold ${st.done ? 'text-amber-300' : 'text-slate-500'}`}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details & Assigned Provider Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Assigned Technician / Provider Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>Assigned Ghar Tak Technician</span>
            </h3>

            {booking.provider ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-400 font-extrabold text-xl flex items-center justify-center">
                    {booking.provider.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{booking.provider.fullName}</h4>
                    <p className="text-xs text-slate-400">{booking.provider.profession || 'Verified Specialist'}</p>
                    <p className="text-xs text-amber-400 font-bold mt-1">★ {booking.provider.rating || '4.9'} Star Partner</p>
                  </div>
                </div>

                <a
                  href={`tel:${booking.provider.phone}`}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Partner ({booking.provider.phone})</span>
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#1A1A28] border border-slate-800 text-slate-300 text-xs">
                Auto-allocating nearest verified technician in your pincode area...
              </div>
            )}
          </div>

          {/* Job Summary & Address Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Service Location & Scheduled Slot</span>
            </h3>

            <div className="text-xs space-y-2 text-slate-300">
              <p><span className="text-slate-500 font-semibold">Category:</span> <span className="font-bold text-white">{booking.serviceCategoryName}</span></p>
              <p><span className="text-slate-500 font-semibold">Time Slot:</span> <span className="font-bold text-amber-300">{booking.scheduledTimeSlot}</span></p>
              <p><span className="text-slate-500 font-semibold">Address:</span> {booking.address}, {booking.city} - {booking.pincode}</p>
              <p><span className="text-slate-500 font-semibold">Total Paid:</span> <span className="font-bold text-gold-gradient text-sm">₹{booking.totalAmount} ({booking.paymentMethod})</span></p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Ghar Tak Shield Protected</span>
              <button onClick={() => alert(`Invoice downloaded for Booking #${booking.bookingCode}`)} className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
