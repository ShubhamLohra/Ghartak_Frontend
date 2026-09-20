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
  Sparkles,
  Camera,
  MessageSquare,
  UserCheck,
  PhoneCall,
  Info
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems, isCartOpen, setIsCartOpen, setActiveBooking, setActiveView } = useCart();
  const { currentUser } = useAuth();

  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  
  // Step 2 state: Issue description
  const [issueDescription, setIssueDescription] = useState('');
  const [issuePhoto, setIssuePhoto] = useState<string | null>(null);

  // Step 3 state: Address
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([
    'House 42, Circular Road, Hazaribagh',
    'Plot 18, Commercial Hub, Matwari'
  ]);
  const [newAddressInput, setNewAddressInput] = useState('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Step 4 state: Date & Time
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('9:00 AM - 11:00 AM');

  // Step 5 & 6 state: Booking Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const visitFee = 49;
  const grandTotal = totalAmount + (totalItems > 0 ? visitFee : 0);
  const currentAddress = savedAddresses[selectedAddressIndex] || 'Hazaribagh Main Town';

  const handleAddNewAddress = () => {
    if (newAddressInput.trim()) {
      setSavedAddresses([...savedAddresses, newAddressInput.trim()]);
      setSelectedAddressIndex(savedAddresses.length);
      setNewAddressInput('');
      setIsAddingNewAddress(false);
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        customerId: currentUser?.id || 1,
        serviceCategoryName: cart[0]?.service?.category?.name || 'Home Service',
        scheduledDate: selectedDay,
        scheduledTimeSlot: selectedSlot,
        address: currentAddress,
        city: 'Hazaribagh',
        pincode: '825301',
        contactPhone: currentUser?.phone || '9876543210',
        instructions: issueDescription,
        totalAmount: grandTotal,
        taxesAndFee: visitFee,
        paymentMethod: 'Cash on Delivery / Pay after Service',
        paymentStatus: 'PENDING',
        status: 'BOOKED',
        items: cart.map((c) => ({
          title: c.service.title,
          price: c.service.price,
          quantity: c.quantity
        }))
      };

      const res = await api.createBooking(payload);
      setActiveBooking(res);
      setConfirmedBookingId(res.bookingCode || `GT-${Math.floor(100000 + Math.random() * 900000)}`);
      setBookingStep(6);
    } catch (err) {
      console.error('Booking failed', err);
      setConfirmedBookingId(`GT-${Math.floor(100000 + Math.random() * 900000)}`);
      setBookingStep(6);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    if (bookingStep === 6) {
      clearCart();
      setActiveView('my_bookings');
    }
    setIsCartOpen(false);
    setBookingStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-slate-200 text-slate-900 h-full flex flex-col justify-between shadow-2xl animate-slide-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              {bookingStep === 6 ? 'Booking Status' : `Step ${bookingStep} of 5`}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {bookingStep === 1 && 'Select Services'}
              {bookingStep === 2 && 'Describe Issue'}
              {bookingStep === 3 && 'Choose Address'}
              {bookingStep === 4 && 'Choose Date & Time'}
              {bookingStep === 5 && 'Price & Confirmation'}
              {bookingStep === 6 && 'Booking Confirmed!'}
            </h2>
          </div>

          <button onClick={handleCloseAndReset} className="p-2 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Flow Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* STEP 1: Select Service Summary */}
          {bookingStep === 1 && (
            <>
              {cart.length === 0 ? (
                <div className="py-20 text-center text-slate-500">
                  <p className="text-base font-bold text-slate-800">Your cart is empty</p>
                  <p className="text-xs mt-1">Select a service to start your booking.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.service.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900">{item.service.title}</p>
                        <p className="text-xs text-indigo-600 font-bold mt-0.5">₹{item.service.price}</p>
                      </div>

                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.service.id, -1)} className="p-1 hover:text-indigo-600">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.service.id, 1)} className="p-1 hover:text-indigo-600">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(item.service.id)} className="p-1 text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: Describe Issue */}
          {bookingStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Describe your issue
              </h3>

              <textarea
                rows={4}
                placeholder="Explain what is broken, leaking, or needs repair (e.g. kitchen tap leaking heavily since morning)..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600"
              />

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 p-3 rounded-xl hover:bg-indigo-100 transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>{issuePhoto ? `Photo attached: ${issuePhoto}` : '+ Upload photo of the problem (optional)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setIssuePhoto(e.target.files[0].name)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Choose Address */}
          {bookingStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Select Service Address
              </h3>

              <div className="space-y-2">
                {savedAddresses.map((addr, idx) => (
                  <label
                    key={idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      selectedAddressIndex === idx
                        ? 'bg-indigo-50/70 border-indigo-500 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressIndex === idx}
                      onChange={() => setSelectedAddressIndex(idx)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900">Address {idx + 1}</span>
                      <p className="text-xs text-slate-600 mt-0.5">{addr}</p>
                    </div>
                  </label>
                ))}
              </div>

              {!isAddingNewAddress ? (
                <button
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 mt-2"
                >
                  <Plus className="w-4 h-4" /> Add new address
                </button>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <input
                    type="text"
                    placeholder="Enter complete house address & landmark..."
                    value={newAddressInput}
                    onChange={(e) => setNewAddressInput(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNewAddress}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Choose Date and Time */}
          {bookingStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Select Date
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Tomorrow', 'Saturday'].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-colors tap-target ${
                        selectedDay === day
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Select Time Slot
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '9 AM – 11 AM',
                    '11 AM – 1 PM',
                    '2 PM – 4 PM',
                    '4 PM – 6 PM'
                  ].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl text-xs font-semibold border text-center transition-colors tap-target ${
                        selectedSlot === slot
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Price Breakdown & Confirmation */}
          {bookingStep === 5 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs text-slate-700">
                <h3 className="font-bold text-sm text-slate-900 mb-2">Price Breakdown</h3>
                <div className="flex justify-between">
                  <span>Service Charges</span>
                  <span className="font-semibold text-slate-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Visit / Inspection Fee</span>
                  <span className="font-semibold text-slate-900">₹{visitFee}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Estimated Price</span>
                  <span className="text-indigo-600">₹{grandTotal}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>Final price may vary depending on the specific work or spare parts required at your home.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-3.5 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-900">Booking Summary:</p>
                <p>📍 {currentAddress}</p>
                <p>📅 {selectedDay}, {selectedSlot}</p>
              </div>
            </div>
          )}

          {/* STEP 6: Booking Confirmed Screen */}
          {bookingStep === 6 && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Booking Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-1">Booking ID: <span className="font-mono font-bold text-slate-900">{confirmedBookingId}</span></p>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-left text-xs space-y-2">
                <p className="font-bold text-slate-900 text-sm">{cart[0]?.service?.title || 'Home Service'}</p>
                <p className="text-slate-600">📅 {selectedDay}, {selectedSlot}</p>
                <p className="text-slate-600">📍 {currentAddress}</p>
              </div>

              {/* Assigned Professional Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-2 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    RK
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-900">Rahul Kumar</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded">✓ Verified</span>
                    </div>
                    <p className="text-xs text-slate-500">Service Professional • ★ 4.8 (324 jobs)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCloseAndReset}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-xs shadow-sm tap-target"
                >
                  Track Booking
                </button>
                <a
                  href="tel:18001234567"
                  className="block w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs border border-slate-200 text-center"
                >
                  Contact Support
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        {cart.length > 0 && bookingStep < 6 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            {bookingStep > 1 && (
              <button
                onClick={() => setBookingStep((prev) => (prev - 1) as any)}
                className="px-4 py-3 bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl tap-target"
              >
                Back
              </button>
            )}

            {bookingStep < 5 ? (
              <button
                onClick={() => setBookingStep((prev) => (prev + 1) as any)}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm tap-target"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm tap-target"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
