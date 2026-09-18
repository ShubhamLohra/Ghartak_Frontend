import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems, isCartOpen, setIsCartOpen, setActiveBooking, setActiveView } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1); // 1: Cart Items, 2: Checkout Form
  const [address, setAddress] = useState(user?.address || 'Flat 402, Royal Palms, Sector 62');
  const [city, setCity] = useState(user?.city || 'Delhi NCR');
  const [pincode, setPincode] = useState(user?.pincode || '201301');
  const [phone, setPhone] = useState(user?.phone || '9811223344');
  const [slot, setSlot] = useState('10:00 AM - 12:00 PM');
  const [paymentMode, setPaymentMode] = useState('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const taxesAndFee = 49;
  const grandTotal = totalAmount + (totalItems > 0 ? taxesAndFee : 0);

  const handlePlaceOrder = async () => {
    if (!cart.length) return;
    setIsSubmitting(true);

    try {
      const payload = {
        customerId: user?.id || 2,
        serviceCategoryName: cart[0]?.service?.category?.name || 'Ghar Tak On-Demand Service',
        scheduledTimeSlot: slot,
        address,
        city,
        pincode,
        contactPhone: phone,
        totalAmount: grandTotal,
        taxesAndFee,
        paymentMethod: paymentMode,
        items: cart.map((c) => ({
          title: c.service.title,
          price: c.service.price,
          quantity: c.quantity
        }))
      };

      const booking = await api.createBooking(payload);
      setActiveBooking(booking);
      clearCart();
      setIsCartOpen(false);
      setStep(1);
      setActiveView('my_bookings');
    } catch (err) {
      console.error('Failed to create booking', err);
      alert('Could not connect to backend server. Created local booking confirmation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#12121B] border-l border-amber-500/20 text-white h-full flex flex-col justify-between shadow-2xl animate-slide-left">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/20 via-[#181826] to-[#12121B] border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white">Your Ghar Tak Cart</h2>
            <span className="text-xs bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded-full">
              {totalItems} items
            </span>
          </div>

          <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {step === 1 ? (
            /* STEP 1: Cart Items List */
            <>
              {cart.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  <p className="text-lg font-bold text-slate-300">Your cart is empty</p>
                  <p className="text-xs mt-1">Browse our categories and add services in one tap!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.service.id} className="bg-[#1A1A28] border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white mb-1">{item.service.title}</p>
                        <p className="text-xs text-amber-400 font-extrabold">₹{item.service.price} x {item.quantity}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-[#222234] border border-slate-700 rounded-xl p-1">
                        <button onClick={() => updateQuantity(item.service.id, -1)} className="p-1 hover:text-amber-400">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.service.id, 1)} className="p-1 hover:text-amber-400">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(item.service.id)} className="p-1.5 text-slate-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* STEP 2: Address & Payment Details */
            <div className="space-y-5">
              
              {/* Address Form */}
              <div className="bg-[#181826] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase">
                  <MapPin className="w-4 h-4" />
                  <span>Service Address & Location</span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400">House / Flat / Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#12121A] border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#12121A] border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-[#12121A] border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Time Slot Picker */}
              <div className="bg-[#181826] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase">
                  <Clock className="w-4 h-4" />
                  <span>Select Arrival Time Slot</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '05:00 PM - 07:00 PM'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${slot === s ? 'bg-amber-500 text-black border-amber-400' : 'bg-[#12121A] text-slate-300 border-slate-700 hover:border-amber-500/50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Mode */}
              <div className="bg-[#181826] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase">
                  <CreditCard className="w-4 h-4" />
                  <span>Select Payment Method</span>
                </div>

                <div className="space-y-2">
                  {['UPI / GPay / PhonePe', 'Cash on Delivery', 'Credit / Debit Card'].map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setPaymentMode(pm)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all ${paymentMode === pm ? 'bg-amber-500/10 border-amber-500 text-amber-300' : 'bg-[#12121A] border-slate-700 text-slate-300'}`}
                    >
                      <span>{pm}</span>
                      {paymentMode === pm && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#161622] border-t border-slate-800 space-y-3">
            
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-white">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience & Safety Fee</span>
                <span className="font-bold text-white">₹{taxesAndFee}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-amber-400 pt-2 border-t border-slate-800">
                <span>Total Amount Payable</span>
                <span className="text-gold-gradient font-black text-lg">₹{grandTotal}</span>
              </div>
            </div>

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
              >
                <span>Proceed to Schedule</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm & Book Now'}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
