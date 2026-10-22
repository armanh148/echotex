'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  ArrowUpRight, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ContactUsPage() {
  const { siteSettings } = useStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const facilityAddress = siteSettings?.contactConfig?.facilityAddress || '1200 Industrial Parkway, Corona, CA 92881';
  const email = siteSettings?.contactConfig?.email || 'orders@ecotexinc.com';
  const phone = siteSettings?.contactConfig?.phone || '+1 (951) 450-9773';
  const website = 'ecotexinc.com';

  const googleMapsUrl = siteSettings?.contactConfig?.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(facilityAddress)}`;

  return (
    <main className="relative w-full overflow-hidden bg-[#07170e] py-16 sm:py-24 lg:py-32 selection:bg-[#22c55e] selection:text-[#07170e] border-t border-[#22c55e]/20">
      
      {/* Full-Bleed Background Image Edge-to-Edge */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=85"
          alt="Ecotex Wholesale Packaging Executive Team"
          className="w-full h-full object-cover object-center grayscale scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07170e]/95 via-[#0b2416]/92 to-[#07170e]/95" />
      </div>

      {/* Edge-to-Edge Corner Wave Ribbons */}
      <div className="absolute top-0 left-0 w-96 sm:w-[480px] h-96 sm:h-[480px] pointer-events-none opacity-20">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M-50 40 C 100 80, 80 200, 240 240 C 320 260, 380 340, 420 420" stroke="#86efac" strokeWidth="1.5" />
          <path d="M-40 60 C 110 100, 90 220, 250 260 C 330 280, 390 360, 430 440" stroke="#22c55e" strokeWidth="1" />
          <path d="M-30 80 C 120 120, 100 240, 260 280 C 340 300, 400 380, 440 460" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          <path d="M-20 100 C 130 140, 110 260, 270 300 C 350 320, 410 400, 450 480" stroke="#86efac" strokeWidth="0.6" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-96 sm:w-[480px] h-96 sm:h-[480px] pointer-events-none opacity-20 rotate-180">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M-50 40 C 100 80, 80 200, 240 240 C 320 260, 380 340, 420 420" stroke="#86efac" strokeWidth="1.5" />
          <path d="M-40 60 C 110 100, 90 220, 250 260 C 330 280, 390 360, 430 440" stroke="#22c55e" strokeWidth="1" />
          <path d="M-30 80 C 120 120, 100 240, 260 280 C 340 300, 400 380, 440 460" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left Column: Get in touch. + 4 Contacts */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 sm:space-y-10">
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                Get in<br />
                <span className="text-white">touch</span><span className="text-[#22c55e]">.</span>
              </h1>
            </div>

            <div className="space-y-5 text-white/95 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-4 group">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white group-hover:text-[#22c55e] transition-colors" />
                </div>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-[#22c55e] transition-colors tracking-wide font-light truncate"
                >
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-white group-hover:text-[#22c55e] transition-colors" />
                </div>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-[#22c55e] transition-colors tracking-wide font-light"
                >
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-white group-hover:text-[#22c55e] transition-colors" />
                </div>
                <a
                  href={`https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#22c55e] transition-colors tracking-wide font-light"
                >
                  {website}
                </a>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-6 h-6 flex items-center justify-center shrink-0 pt-0.5">
                  <MapPin className="w-5 h-5 text-white group-hover:text-[#22c55e] transition-colors" />
                </div>
                <div className="space-y-1">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#22c55e] transition-colors tracking-wide font-light block leading-relaxed"
                  >
                    {facilityAddress}
                  </a>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#86efac] hover:text-white transition-colors"
                  >
                    <span>View on Google Maps</span>
                    <ArrowUpRight className="w-3 h-3 text-[#22c55e]" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label
                      htmlFor="page-contact-first-name"
                      className="block text-xs sm:text-sm font-semibold text-white mb-1.5 tracking-wide"
                    >
                      First Name
                    </label>
                    <input
                      id="page-contact-first-name"
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 sm:py-3.5 bg-white/20 hover:bg-white/25 focus:bg-white/30 border border-white/20 focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] rounded-xs text-sm sm:text-base text-white placeholder:text-white/50 focus:outline-none transition-all backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="page-contact-last-name"
                      className="block text-xs sm:text-sm font-semibold text-white mb-1.5 tracking-wide"
                    >
                      Last Name
                    </label>
                    <input
                      id="page-contact-last-name"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 sm:py-3.5 bg-white/20 hover:bg-white/25 focus:bg-white/30 border border-white/20 focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] rounded-xs text-sm sm:text-base text-white placeholder:text-white/50 focus:outline-none transition-all backdrop-blur-md"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="page-contact-email-addr"
                    className="block text-xs sm:text-sm font-semibold text-white mb-1.5 tracking-wide"
                  >
                    Email Address
                  </label>
                  <input
                    id="page-contact-email-addr"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 sm:py-3.5 bg-white/20 hover:bg-white/25 focus:bg-white/30 border border-white/20 focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] rounded-xs text-sm sm:text-base text-white placeholder:text-white/50 focus:outline-none transition-all backdrop-blur-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="page-contact-message-body"
                    className="block text-xs sm:text-sm font-semibold text-white mb-1.5 tracking-wide"
                  >
                    Message
                  </label>
                  <textarea
                    id="page-contact-message-body"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 sm:py-3.5 bg-white/20 hover:bg-white/25 focus:bg-white/30 border border-white/20 focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] rounded-xs text-sm sm:text-base text-white placeholder:text-white/50 focus:outline-none transition-all backdrop-blur-md resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 sm:py-4 px-6 bg-white hover:bg-[#22c55e] text-[#07170e] font-black text-sm uppercase tracking-[0.2em] rounded-xs transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.99] cursor-pointer"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-12 px-6 sm:px-8 bg-white/20 border border-white/25 backdrop-blur-md rounded-xs text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#22c55e] text-[#07170e] flex items-center justify-center shadow-lg">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">
                    Thank You For Reaching Out!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md mx-auto">
                    Your message has been received. Our executive commercial team will connect with you within 2 business hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      message: ''
                    });
                  }}
                  className="text-xs text-[#86efac] hover:text-white font-bold inline-flex items-center gap-1 cursor-pointer pt-2 underline"
                >
                  <span>Send another message</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

    </main>
  );
}
