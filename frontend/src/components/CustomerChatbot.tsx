'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Check, 
  Package, 
  ShieldCheck, 
  ChevronDown, 
  Mail, 
  Phone,
  ExternalLink,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, CustomerThread } from '../types';
import { 
  getStoredThreads, 
  getActiveChatbotThreadId, 
  sendCustomerMessage, 
  subscribeToMessages,
  saveStoredThreads
} from '../services/messageService';
import { useStore } from '../store/useStore';

// Clean SVG for WhatsApp
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.507 14.307l-.009.075c-2.399-1.2-2.802-1.311-3.111-1.369-.275-.051-.557.065-.805.247-.487.359-1.018 1.055-1.155 1.144-.127.082-.249.09-.371.032-.519-.244-2.027-.992-3.14-2.215-.297-.327-.249-.498.053-.852.196-.23.411-.531.597-.788.167-.232.203-.388.136-.579-.068-.192-.619-1.503-.849-2.062-.224-.543-.454-.469-.623-.478l-.534-.01c-.183 0-.481.069-.733.344-.252.275-.963.942-.963 2.298 0 1.356.987 2.666 1.124 2.85.138.183 1.944 2.969 4.71 4.164.658.284 1.171.454 1.571.581.661.21 1.263.18 1.739.109.531-.08 1.631-.667 1.86-1.312.228-.644.228-1.196.16-1.311-.069-.115-.251-.184-.528-.323z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.527 3.66 1.443 5.176L2 22l4.981-1.411A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.062c-1.637 0-3.167-.484-4.453-1.319l-.319-.205-2.961.839.851-2.883-.223-.332A8.026 8.026 0 014 12c0-4.411 3.589-8.062 8-8.062 4.411 0 8 3.651 8 8.062z" />
  </svg>
);

const SUGGESTED_QUICK_QUESTIONS = [
  '💬 Chat directly on WhatsApp for instant quote',
  '📦 Request physical fabric swatch kit',
  '💰 What are your wholesale MOQs & pricing tiers?',
  '🎨 How does custom logo flexo printing work?',
  '⏱️ What is your standard production lead time?'
];

export const CustomerChatbot: React.FC = () => {
  const { siteSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPromptedBanner, setHasPromptedBanner] = useState(true);
  const [inputText, setInputText] = useState('');
  const [activeThread, setActiveThread] = useState<CustomerThread | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Customer identity capture (WhatsApp & Email)
  const [showIdentityForm, setShowIdentityForm] = useState(false);
  const [identityMode, setIdentityMode] = useState<'whatsapp' | 'email'>('whatsapp');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [identitySaved, setIdentitySaved] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Official desk WhatsApp number and Email from store settings (Fully Dynamic from Admin)
  const officialPhone = siteSettings?.whatsappNumber
    || siteSettings?.orderNotifications?.whatsappNumber 
    || siteSettings?.contactConfig?.secondaryPhone 
    || siteSettings?.contactConfig?.phone 
    || siteSettings?.phone
    || '+1 (951) 450-9773';
  const cleanOfficialNumber = officialPhone.replace(/[^0-9]/g, '') || '19514509773';

  const officialEmail = siteSettings?.supportEmail
    || siteSettings?.email
    || siteSettings?.orderNotifications?.notificationEmail
    || siteSettings?.contactConfig?.email
    || 'orders@ecotexinc.com';

  // Construct dynamic WhatsApp chat link
  const currentQuery = activeThread?.messages?.filter(m => m.sender === 'customer')?.slice(-1)?.[0]?.text 
    || inputText 
    || 'Hi EcoTex Team! I would like to inquire about wholesale bags, fabric swatches, and volume pricing.';
  const directWhatsAppUrl = `https://wa.me/${cleanOfficialNumber}?text=${encodeURIComponent(`Hello EcoTex Team! ${currentQuery}`)}`;

  // Sync with active thread on mount & updates
  useEffect(() => {
    const syncCurrentThread = () => {
      const threads = getStoredThreads();
      const currentThreadId = getActiveChatbotThreadId();
      if (currentThreadId) {
        const found = threads.find(t => t.id === currentThreadId);
        if (found) {
          setActiveThread(found);
          if (found.customerName && found.customerName !== 'Website Visitor') {
            setCustName(found.customerName);
          }
          if (found.phone) {
            setCustPhone(found.phone);
            setIdentitySaved(true);
          }
          if (found.email && !found.email.includes('visitor@livechat') && !found.email.includes('@whatsapp')) {
            setCustEmail(found.email);
            setIdentitySaved(true);
          }
          if (found.company && found.company !== 'Live Storefront Visitor') {
            setCustCompany(found.company);
          }
        }
      }
    };

    syncCurrentThread();
    const unsubscribe = subscribeToMessages((threads) => {
      const currentThreadId = getActiveChatbotThreadId();
      if (currentThreadId) {
        const found = threads.find(t => t.id === currentThreadId);
        if (found) {
          setActiveThread(found);
          if (!isOpen) {
            const adminMsgs = found.messages.filter(m => m.sender === 'admin');
            setUnreadCount(adminMsgs.length);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [isOpen, activeThread?.messages]);

  const handleSendMessage = async (customMessageText?: string) => {
    const text = (customMessageText || inputText).trim();
    if (!text) return;

    // Special quick action: directly launch WhatsApp
    if (text.includes('Chat directly on WhatsApp')) {
      window.open(directWhatsAppUrl, '_blank');
      return;
    }

    setInputText('');

    const previousCustomerMessagesCount = activeThread 
      ? activeThread.messages.filter(m => m.sender === 'customer').length 
      : 0;
    const hasAlreadyReceivedGreeting = activeThread 
      ? activeThread.messages.some(m => m.sender === 'bot') 
      : false;

    // Send customer message into shared store (synced with Admin Messages)
    const { thread } = await sendCustomerMessage({
      text,
      customerName: custName || (custPhone ? `WhatsApp Client (${custPhone})` : 'Website Visitor'),
      email: custEmail || (custPhone ? `${custPhone.replace(/[^0-9]/g, '')}@whatsapp.ecotexinc.com` : 'visitor@livechat.ecotexinc.com'),
      phone: custPhone || '',
      company: custCompany || 'Live Storefront Visitor',
      subject: text.length > 35 ? text.slice(0, 35) + '...' : text
    });

    setActiveThread(thread);

    // Initial greeting bot response
    if (previousCustomerMessagesCount === 0 && !hasAlreadyReceivedGreeting) {
      setTimeout(async () => {
        const now = new Date();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          senderName: 'EcoTex Support Desk',
          text: `Thank you for reaching out to EcoTex! We have received your inquiry. For immediate assistance or digital mockups, you can also reach our desk via WhatsApp (${officialPhone}) or email us at ${officialEmail}.`,
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedThread: CustomerThread = {
          ...thread,
          messages: [...thread.messages, botMsg]
        };

        const allThreads = getStoredThreads().map(t => t.id === thread.id ? updatedThread : t);
        saveStoredThreads(allThreads);
        setActiveThread(updatedThread);
      }, 500);
    }
  };

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (identityMode === 'whatsapp' && !custPhone.trim()) return;
    if (identityMode === 'email' && !custEmail.trim()) return;

    setIdentitySaved(true);
    setShowIdentityForm(false);

    if (activeThread) {
      const updatedThread: CustomerThread = {
        ...activeThread,
        customerName: custName || activeThread.customerName,
        phone: custPhone || activeThread.phone,
        email: custEmail || (custPhone ? `${custPhone.replace(/[^0-9]/g, '')}@whatsapp.ecotexinc.com` : activeThread.email),
        company: custCompany || activeThread.company,
        channel: identityMode === 'whatsapp' ? 'WhatsApp' : activeThread.channel
      };
      const allThreads = getStoredThreads().map(t => t.id === activeThread.id ? updatedThread : t);
      saveStoredThreads(allThreads);
      setActiveThread(updatedThread);
    }
  };

  return (
    <>
      {/* ========================================================
          1. FLOATING LAUNCHER BUTTON & PROMPT PILL (BOTTOM-RIGHT)
         ======================================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        
        {/* Teaser greeting bubble */}
        {!isOpen && hasPromptedBanner && (
          <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl shadow-black/10 border border-[#B2E2C5]/50 max-w-[280px] text-xs font-serif text-[#1c1b18] flex items-start justify-between gap-3 animate-fadeIn">
            <div>
              <div className="flex items-center gap-1.5 font-sans font-bold text-[#166534] text-[11px] mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>EcoTex Live Chat & WhatsApp</span>
              </div>
              <p className="text-[#444] font-light leading-relaxed">
                Need wholesale bag pricing or free fabric swatches? Chat with us here or via WhatsApp!
              </p>
            </div>
            <button
              onClick={() => setHasPromptedBanner(false)}
              className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Trigger Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasPromptedBanner(false);
          }}
          className="relative group p-4 rounded-full bg-gradient-to-r from-[#166534] to-[#15803d] text-white shadow-xl shadow-[#166534]/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center border-2 border-white"
          title={isOpen ? 'Close Chat' : 'Chat with EcoTex Team'}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              {/* Online pulsing indicator */}
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 px-2 py-0.5 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold shadow-md">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* ========================================================
          2. CHATBOT WINDOW DIALOG
         ======================================================== */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[590px] max-h-[85vh] bg-white rounded-3xl shadow-2xl shadow-black/25 border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#166534] to-[#14532d] text-white p-4 sm:p-5 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-bold shrink-0">
                <Package className="w-5 h-5 text-emerald-200" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#166534]" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold tracking-wide text-white flex items-center gap-1.5">
                  <span>EcoTex Live Concierge</span>
                </h3>
                <p className="text-[11px] text-emerald-100/90 font-light flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Corona, CA · Active Wholesale Desk</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* WhatsApp Quick Direct Link */}
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold transition-all shadow-xs"
                title={`Chat with us on WhatsApp (${officialPhone})`}
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#fcfbfa]/80">
            
            {/* Introductory Greeting */}
            <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3.5 text-xs font-serif text-[#1c1b18] shadow-xs">
              <div className="flex items-center gap-1.5 font-sans font-bold text-[#166534] text-[11px] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Welcome to EcoTex Direct</span>
              </div>
              <p className="text-slate-600 font-light leading-relaxed">
                Connect directly with our California facility for custom tote specifications, volume price tiers, or physical swatch kits. 
              </p>
              
              {/* WhatsApp Callout Pill inside welcome card */}
              <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                  <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                  <span>Prefer WhatsApp?</span>
                </span>
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#166534] hover:text-[#14532d] hover:underline flex items-center gap-1"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick Action Chips (shown if thread has fewer than 2 messages) */}
            {(!activeThread || activeThread.messages.length <= 1) && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Questions:
                </span>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED_QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className={`text-left text-xs p-2.5 rounded-xl border transition-all shadow-xs cursor-pointer ${
                        q.includes('WhatsApp')
                          ? 'bg-emerald-50/80 hover:bg-emerald-100 text-[#166534] font-bold border-emerald-200 flex items-center justify-between'
                          : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#166534] border-slate-200/80 hover:border-emerald-300'
                      }`}
                    >
                      <span>{q}</span>
                      {q.includes('WhatsApp') && (
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Bubbles */}
            {activeThread?.messages.map((m) => {
              const isCust = m.sender === 'customer';
              const isAdmin = m.sender === 'admin';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isCust ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                    <span>{m.senderName}</span>
                    <span>·</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs font-serif leading-relaxed shadow-xs ${
                      isCust
                        ? 'bg-[#166534] text-white rounded-tr-xs'
                        : isAdmin
                        ? 'bg-slate-900 text-white rounded-tl-xs border border-slate-800'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80'
                    }`}
                  >
                    {m.text}
                  </div>

                  {isAdmin && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified EcoTex Specialist</span>
                      </span>

                      {/* Customer WhatsApp Notification Pill */}
                      {custPhone && (
                        <a
                          href={(() => {
                            let digits = custPhone.replace(/[^0-9]/g, '');
                            if (digits.startsWith('03') && digits.length === 11) {
                              digits = '92' + digits.slice(1);
                            } else if (digits.startsWith('00')) {
                              digits = digits.slice(2);
                            }
                            return `https://wa.me/${digits}?text=${encodeURIComponent(m.text)}`;
                          })()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-sans font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
                          title="Notification linked to your WhatsApp"
                        >
                          <WhatsAppIcon className="w-2.5 h-2.5 fill-[#25D366]" />
                          <span>Notified on WhatsApp ({custPhone})</span>
                          <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
                        </a>
                      )}

                      {/* Customer Email Notification Pill */}
                      {custEmail && !custEmail.includes('visitor@livechat') && !custEmail.includes('@whatsapp') && (
                        <span 
                          className="text-[10px] font-sans font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1"
                          title="Notification copy sent to your email"
                        >
                          <Mail className="w-2.5 h-2.5 text-blue-600" />
                          <span>Copy sent to {custEmail}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Contact & Identity Modal Card (WhatsApp Preferred + Email Option) */}
          {showIdentityForm && (
            <div className="p-4 bg-emerald-50/95 border-t border-emerald-200 text-xs space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                {/* Mode Selector Tabs: WhatsApp vs Email */}
                <div className="flex items-center gap-1 p-0.5 bg-white rounded-xl border border-emerald-200">
                  <button
                    type="button"
                    onClick={() => setIdentityMode('whatsapp')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      identityMode === 'whatsapp'
                        ? 'bg-[#25D366] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdentityMode('email')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      identityMode === 'email'
                        ? 'bg-[#166534] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowIdentityForm(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveIdentity} className="space-y-2.5">
                {identityMode === 'whatsapp' ? (
                  <>
                    <p className="text-[11px] text-emerald-900 font-medium leading-snug">
                      Connect your WhatsApp to receive instant pricing, swatch photos, and artwork approvals directly on your phone.
                    </p>
                    <div className="space-y-2">
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          placeholder="Your WhatsApp Number (e.g. +92 300... or +1 951...) *"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#25D366]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Your Name (optional)"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="submit"
                        className="py-2 px-3 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Save WhatsApp
                      </button>

                      <a
                        href={directWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Chat Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Enter your corporate email address to receive formal PDF quotations and spec sheets.
                    </p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Full Name *"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Business Email *"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Company Name (optional)"
                        value={custCompany}
                        onChange={(e) => setCustCompany(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Save Email for Formal Quote
                    </button>
                  </>
                )}
              </form>
            </div>
          )}

          {/* Footer Input Bar with WhatsApp & Email Connect */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0 space-y-2">
            
            {/* Quick Connect Prompt Bar */}
            {!identitySaved && !showIdentityForm ? (
              <div className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Get quotation updates:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIdentityMode('whatsapp');
                      setShowIdentityForm(true);
                    }}
                    className="text-emerald-700 bg-emerald-100/90 hover:bg-emerald-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Connect WhatsApp for instant replies"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                    <span>Connect WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentityMode('email');
                      setShowIdentityForm(true);
                    }}
                    className="text-slate-600 hover:text-slate-900 px-1.5 py-0.5 rounded-lg font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            ) : identitySaved && !showIdentityForm ? (
              <div className="flex items-center justify-between text-[11px] px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800">
                <div className="flex items-center gap-1.5 font-bold">
                  {custPhone ? (
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span className="truncate max-w-[160px]">
                    Connected: {custPhone || custEmail}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {custPhone && (
                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5"
                    >
                      <span>Open WhatsApp</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowIdentityForm(true)}
                    className="text-[10px] text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : null}

            {/* Input & Send Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your question or request..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#166534] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#166534] hover:bg-[#14532d] disabled:opacity-40 disabled:hover:bg-[#166534] text-white transition-all shadow-md cursor-pointer shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};

export default CustomerChatbot;
