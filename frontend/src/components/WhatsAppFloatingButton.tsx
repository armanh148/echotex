'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';

// Official WhatsApp Vector Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M17.507 14.307l-.009.075c-2.399-1.2-2.802-1.311-3.111-1.369-.275-.051-.557.065-.805.247-.487.359-1.018 1.055-1.155 1.144-.127.082-.249.09-.371.032-.519-.244-2.027-.992-3.14-2.215-.297-.327-.249-.498.053-.852.196-.23.411-.531.597-.788.167-.232.203-.388.136-.579-.068-.192-.619-1.503-.849-2.062-.224-.543-.454-.469-.623-.478l-.534-.01c-.183 0-.481.069-.733.344-.252.275-.963.942-.963 2.298 0 1.356.987 2.666 1.124 2.85.138.183 1.944 2.969 4.71 4.164.658.284 1.171.454 1.571.581.661.21 1.263.18 1.739.109.531-.08 1.631-.667 1.86-1.312.228-.644.228-1.196.16-1.311-.069-.115-.251-.184-.528-.323z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.527 3.66 1.443 5.176L2 22l4.981-1.411A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.062c-1.637 0-3.167-.484-4.453-1.319l-.319-.205-2.961.839.851-2.883-.223-.332A8.026 8.026 0 014 12c0-4.411 3.589-8.062 8-8.062 4.411 0 8 3.651 8 8.062z" />
  </svg>
);

export const WhatsAppFloatingButton: React.FC = () => {
  const { siteSettings } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  // Dynamic phone from admin siteSettings
  const rawPhone = siteSettings?.whatsappNumber 
    || siteSettings?.orderNotifications?.whatsappNumber 
    || siteSettings?.contactConfig?.secondaryPhone 
    || siteSettings?.contactConfig?.phone 
    || siteSettings?.phone
    || '+1 (951) 450-9773';

  // Format clean digits for wa.me
  const formatWhatsAppNumber = (phone: string) => {
    let digits = phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('03') && digits.length === 11) {
      digits = '92' + digits.slice(1);
    } else if (digits.startsWith('00')) {
      digits = digits.slice(2);
    }
    return digits || '19514509773';
  };

  const cleanNumber = formatWhatsAppNumber(rawPhone);
  const greeting = 'Hello EcoTex! I would like to inquire about wholesale packaging, custom printing, and volume pricing.';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
      {/* Floating Greeting Pill */}
      {showTooltip && (
        <div 
          onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
          className="group/pill bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg shadow-black/10 border border-emerald-200/80 text-xs text-slate-800 flex items-center gap-2 max-w-[85vw] animate-fadeIn cursor-pointer hover:border-[#25D366] hover:bg-emerald-50/60 transition-all select-none"
        >
          <div className="flex items-center gap-2 font-semibold text-emerald-800 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Need Help? Chat on WhatsApp</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 rounded-full hover:bg-slate-100 transition-colors ml-0.5"
            title="Dismiss"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Circular Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with EcoTex on WhatsApp"
        className="relative group p-3.5 sm:p-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-[#25D366]/35 hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center border-2 border-white ring-4 ring-[#25D366]/20"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 fill-white drop-shadow-xs" />
        
        {/* Pulsing online green dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full shadow-xs" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
      </a>
    </div>
  );
};

export default WhatsAppFloatingButton;
