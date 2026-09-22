import React, { useState } from 'react';
import { LifeBuoy, PhoneCall, MessageSquare, ChevronDown, ShieldCheck, Clock, CreditCard, AlertCircle } from 'lucide-react';

export const HelpSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I book a service on Ghartak?',
      answer: 'Select what service you need (e.g. Electrician or Cleaning), pick a convenient date & time slot, enter your home address, and confirm. A verified professional will come directly to your doorstep.'
    },
    {
      question: 'How does pricing work?',
      answer: 'We show transparent starting prices upfront. A standard visit fee is included in your booking summary. If additional work or spare parts are required, the professional will inform you before starting.'
    },
    {
      question: 'Are Ghartak professionals verified?',
      answer: 'Yes! All professionals undergo strict identity verification, government ID checks, and background checks before receiving job requests.'
    },
    {
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Absolutely. You can cancel or reschedule anytime from your "Bookings" tab before the professional reaches your home without any penalty.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'You can pay Cash on Service directly to the professional or pay securely online via UPI, Google Pay, PhonePe, Cards, or Net Banking after job completion.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mb-24">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-full mb-3">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">How can we help you?</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">We are here to support you 7 days a week from 8:00 AM to 9:00 PM</p>
      </div>

      {/* Quick Contact Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <a
          href="https://wa.me/919999999999?text=Hi%20Ghartak%20Support,%20I%20need%20help%20with%20my%20booking"
          target="_blank"
          rel="noopener noreferrer"
          className="consumer-card-interactive p-5 flex items-center gap-4 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400"
        >
          <div className="p-3 bg-emerald-500 text-white rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">Chat on WhatsApp</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Quick response within 5 minutes</p>
          </div>
        </a>

        <a
          href="tel:18001234567"
          className="consumer-card-interactive p-5 flex items-center gap-4 bg-indigo-500/10 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 hover:border-indigo-400"
        >
          <div className="p-3 bg-indigo-600 text-white rounded-xl">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">Call Support</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Toll-free 1800-123-4567</p>
          </div>
        </a>
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">100% Verified</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Background checked professionals</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">On-Time Service</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Prompt arrival at chosen time slot</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">Transparent Pricing</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">No hidden charges or extra fees</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Frequently Asked Questions</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left font-medium text-slate-900 dark:text-slate-100 text-sm sm:text-base py-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openFaq === index ? 'transform rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
