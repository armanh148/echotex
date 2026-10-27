'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  User, 
  Building, 
  Plus, 
  X, 
  ExternalLink,
  MessageCircle,
  Filter,
  Check,
  Calendar,
  Sparkles,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Smartphone,
  Settings,
  Trash2
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ChatMessage, CustomerThread } from '../../types';
import { StatusBadgeDropdown } from './ui/StatusBadgeDropdown';
import { 
  getStoredThreads, 
  saveStoredThreads, 
  subscribeToMessages, 
  sendAdminReply,
  fetchRemoteThreads,
  deleteStoredThread,
  INITIAL_THREADS 
} from '../../services/messageService';

const QUICK_REPLIES = [
  {
    label: '👋 Greet & Acknowledge',
    text: 'Thank you for reaching out to EcoTex! We have received your inquiry. One of our dedicated wholesale packaging specialists is reviewing your specs and will share a detailed breakdown shortly.'
  },
  {
    label: '📦 Swatches Dispatched',
    text: 'Great news! Your fabric swatch kit and physical sample box have been prepared and dispatched. Tracking info will be sent to your email.'
  },
  {
    label: '💼 Wholesale Pricing Ready',
    text: 'We have generated custom wholesale tier pricing based on your volume requirements. Would you like us to schedule a brief 10-minute call to review specs?'
  },
  {
    label: '🎨 Request Artwork Files',
    text: 'To generate your complimentary 3D digital mockup proof, please email your high-resolution vector logo (.AI or .PDF) to graphics@ecotexinc.com.'
  },
  {
    label: '⏱️ Production Lead Time',
    text: 'Standard production lead time is 12-14 business days post artwork approval. Expedited rush production (7 days) is also available upon request.'
  }
];

export const CustomerMessagesManager: React.FC = () => {
  const { quotes, siteSettings, updateSiteSettings } = useStore();

  const [threads, setThreads] = useState<CustomerThread[]>(() => getStoredThreads());

  // Real-time synchronization with Frontend Chatbot and Server
  useEffect(() => {
    fetchRemoteThreads().then((remote) => {
      if (remote && remote.length > 0) {
        setThreads(remote);
      }
    });

    const unsubscribe = subscribeToMessages((updatedThreads) => {
      setThreads(updatedThreads);
    });
    return () => unsubscribe();
  }, []);

  // Sync any newly submitted website contact forms / quotes from useStore
  useEffect(() => {
    if (!quotes || quotes.length === 0) return;

    setThreads((current) => {
      let updated = [...current];
      let hasChanges = false;

      quotes.forEach((q) => {
        // If message is present or it's a direct web inquiry, ensure it's in threads
        const existing = updated.find((t) => t.id === `quote-${q.id}` || t.email.toLowerCase() === q.email.toLowerCase());
        if (!existing && (q.message || q.bagType)) {
          const newThread: CustomerThread = {
            id: `quote-${q.id}`,
            customerName: q.name || 'Valued Customer',
            company: q.company || 'Direct Client',
            email: q.email,
            phone: q.phone || '+1 (800) 555-0199',
            subject: q.bagType ? `${q.bagType} Inquiry (${q.quantity ? q.quantity + ' units' : 'Bulk'})` : 'Website Customer Inquiry',
            status: q.status === 'Closed' ? 'Resolved' : 'New',
            isUnread: true,
            channel: q.bagType === 'Direct Web Inquiry' ? 'Contact Form' : 'RFQ Quote',
            lastUpdated: q.date || 'Just now',
            messages: [
              {
                id: `qm-${q.id}`,
                sender: 'customer',
                senderName: q.name || 'Customer',
                text: q.message || `Customer submitted inquiry for ${q.bagType || 'Wholesale Packaging'} (Quantity: ${q.quantity || '5,000'}). Please follow up.`,
                timestamp: q.date || 'Just now',
                channel: 'web'
              }
            ]
          };
          updated = [newThread, ...updated];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        saveStoredThreads(updated);
      }
      return hasChanges ? updated : current;
    });
  }, [quotes]);

  // Persist threads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecotex_customer_messages_v1', JSON.stringify(threads));
    } catch (e) {
      console.warn('Failed to save customer messages:', e);
    }
  }, [threads]);

  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Unread' | 'New' | 'In Discussion' | 'Resolved'>('All');
  const [replyText, setReplyText] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Desk Channels State (WhatsApp & Email)
  const currentWhatsApp = siteSettings?.whatsappNumber || siteSettings?.orderNotifications?.whatsappNumber || '+1 (951) 450-9773';
  const currentEmail = siteSettings?.supportEmail || siteSettings?.email || 'orders@ecotexinc.com';
  const [deskWhatsApp, setDeskWhatsApp] = useState(currentWhatsApp);
  const [deskEmail, setDeskEmail] = useState(currentEmail);

  useEffect(() => {
    if (showChannelModal) {
      setDeskWhatsApp(siteSettings?.whatsappNumber || siteSettings?.orderNotifications?.whatsappNumber || '+1 (951) 450-9773');
      setDeskEmail(siteSettings?.supportEmail || siteSettings?.email || 'orders@ecotexinc.com');
    }
  }, [showChannelModal, siteSettings]);

  // Lock body scroll and handle Escape key for modals
  useEffect(() => {
    if (!showNewThreadModal && !showChannelModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNewThreadModal(false);
        setShowChannelModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNewThreadModal, showChannelModal]);

  const handleSaveDeskChannels = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = deskWhatsApp.trim();
    const cleanEmail = deskEmail.trim();

    updateSiteSettings({
      whatsappNumber: cleanPhone,
      email: cleanEmail,
      supportEmail: cleanEmail,
      orderNotifications: {
        ...(siteSettings?.orderNotifications || { emailEnabled: true, whatsappEnabled: true, autoOpenWhatsapp: true }),
        whatsappNumber: cleanPhone,
        notificationEmail: cleanEmail
      }
    });

    setShowChannelModal(false);
    showToast('Official Desk WhatsApp & Email updated across website & live chatbot!');
  };

  // New Thread Form State
  const [newThreadData, setNewThreadData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    initialMessage: '',
    channel: 'Direct Web Inquiry' as CustomerThread['channel']
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeThread = useMemo(() => {
    return threads.find((t) => t.id === selectedThreadId) || threads[0] || null;
  }, [threads, selectedThreadId]);

  // Mark thread as read when selected
  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id);
    const updated = threads.map((t) => (t.id === id ? { ...t, isUnread: false } : t));
    setThreads(updated);
    saveStoredThreads(updated);
  };

  // Filter threads
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.customerName.toLowerCase().includes(q) ||
        (t.company && t.company.toLowerCase().includes(q)) ||
        t.email.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.messages.some((m) => m.text.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filterStatus === 'All') return true;
      if (filterStatus === 'Unread') return t.isUnread;
      return t.status === filterStatus;
    });
  }, [threads, searchQuery, filterStatus]);

  const [notifyCustomerWhatsApp, setNotifyCustomerWhatsApp] = useState(true);

  // Helper to format phone number for WhatsApp wa.me links (supports 03... Pakistani numbers & international)
  const formatWhatsAppNumber = (phone?: string) => {
    if (!phone) return '';
    let digits = phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('03') && digits.length === 11) {
      digits = '92' + digits.slice(1);
    } else if (digits.startsWith('00')) {
      digits = digits.slice(2);
    }
    return digits;
  };

  // Send Reply (Synchronizes with Frontend Chatbot live & dispatches to customer WhatsApp/Email)
  const handleSendReply = async (customText?: string, forceWhatsAppDispatch: boolean = false) => {
    const textToSend = (customText || replyText).trim();
    if (!textToSend || !activeThread) return;

    setReplyText('');
    const updatedThread = await sendAdminReply(activeThread.id, textToSend);
    if (updatedThread) {
      setThreads(getStoredThreads());

      const rawPhone = activeThread.phone || '';
      const cleanPhone = formatWhatsAppNumber(rawPhone);
      const shouldDispatchWhatsApp = (forceWhatsAppDispatch || notifyCustomerWhatsApp) && cleanPhone.length >= 7;

      if (shouldDispatchWhatsApp) {
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToSend)}`;
        window.open(waUrl, '_blank');
        showToast(`Reply sent to live chat & opened WhatsApp to ${activeThread.customerName} (${activeThread.phone})!`);
      } else {
        showToast(`Reply sent to ${activeThread.customerName}!`);
      }
    }
  };

  // Change Thread Status
  const handleUpdateStatus = (newStatus: CustomerThread['status']) => {
    if (!activeThread) return;
    const updated = threads.map((t) => (t.id === activeThread.id ? { ...t, status: newStatus } : t));
    setThreads(updated);
    saveStoredThreads(updated);
    showToast(`Conversation status updated to "${newStatus}"`);
  };

  // Submit New Inbound Conversation
  const handleCreateNewThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadData.customerName.trim() || !newThreadData.email.trim()) return;

    const created: CustomerThread = {
      id: `thread-${Date.now()}`,
      customerName: newThreadData.customerName.trim(),
      company: newThreadData.company.trim() || 'Wholesale Client',
      email: newThreadData.email.trim(),
      phone: newThreadData.phone.trim() || '+1 (555) 000-0000',
      subject: newThreadData.subject.trim() || 'General Customer Inquiry',
      status: 'New',
      isUnread: false,
      channel: newThreadData.channel,
      lastUpdated: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: newThreadData.customerName.trim(),
          text: newThreadData.initialMessage.trim() || 'New inquiry registered by admin staff.',
          timestamp: 'Just now',
          channel: 'web'
        }
      ]
    };

    const updated = [created, ...threads];
    setThreads(updated);
    saveStoredThreads(updated);
    setSelectedThreadId(created.id);
    setShowNewThreadModal(false);
    setNewThreadData({
      customerName: '',
      company: '',
      email: '',
      phone: '',
      subject: '',
      initialMessage: '',
      channel: 'Direct Web Inquiry'
    });
    showToast(`New customer conversation created for ${created.customerName}`);
  };

  // Helper for quick WhatsApp connect
  const getWhatsAppLink = (phone?: string, name?: string) => {
    if (!phone) return '#';
    const cleanNumber = formatWhatsAppNumber(phone);
    const greeting = encodeURIComponent(`Hello ${name || 'there'}! This is the EcoTex Wholesale Packaging team following up on your inquiry.`);
    return `https://wa.me/${cleanNumber}?text=${greeting}`;
  };

  // Unread badge count
  const unreadCount = threads.filter((t) => t.isUnread).length;
  const inDiscussionCount = threads.filter((t) => t.status === 'In Discussion').length;

  return (
    <div className="space-y-6 animate-fadeInUp pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#B2E2C5]/30 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76]">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
                Customer Messages & Live Connect
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">
                  {unreadCount} Unread
                </span>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Stay in direct contact with wholesale clients and buyers. Reply to website inquiries, chat via WhatsApp, dispatch sample updates, and log communications.
          </p>
        </div>

        {/* Quick Connection Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowChannelModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs hover:border-slate-300"
            title="Configure Desk WhatsApp & Support Email used by Live Chatbot"
          >
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Smartphone className="w-3.5 h-3.5" />
              <span className="font-semibold">{currentWhatsApp}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Mail className="w-3.5 h-3.5" />
              <span className="font-semibold">{currentEmail}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-500 font-bold ml-1">
              Change
            </span>
          </button>

          <button
            onClick={() => setShowNewThreadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white font-bold text-xs shadow-md shadow-[#4E9F76]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Customer Thread</span>
          </button>
        </div>
      </div>

      {/* Fast Connect Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Conversations</div>
            <div className="text-xl font-black text-[#0f172a] mt-0.5">{threads.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Response</div>
            <div className="text-xl font-black text-amber-600 mt-0.5">
              {threads.filter((t) => t.status === 'New').length}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Active Discussion</div>
            <div className="text-xl font-black text-[#4E9F76] mt-0.5">{inDiscussionCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Response Time</div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">&lt; 15 Mins</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Two-Pane Messaging Interface */}
      <div className="bg-white rounded-3xl border border-[#B2E2C5]/30 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
        {/* ========================================================
            LEFT PANE: THREADS LIST (COL 1-4)
           ======================================================== */}
        <div className="lg:col-span-4 border-r border-slate-100 flex flex-col bg-[#fcfdfc]">
          
          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer, company, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76] focus:ring-1 focus:ring-[#4E9F76] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {(['All', 'Unread', 'New', 'In Discussion', 'Resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-[#4E9F76] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                  {status === 'Unread' && unreadCount > 0 && ` (${unreadCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">No conversations found</p>
                <p className="text-[11px] text-slate-400 mt-1">Try clearing filters or search query</p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = activeThread?.id === thread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];

                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={`p-4 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-50/60 border-l-4 border-[#4E9F76]'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-[#4E9F76] font-black text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          {thread.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#0f172a] truncate">
                              {thread.customerName}
                            </span>
                            {thread.isUnread && (
                              <span className="w-2 h-2 rounded-full bg-[#4E9F76] shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate font-medium">
                            {thread.company || thread.email}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {thread.lastUpdated}
                      </span>
                    </div>

                    <div className="mt-2">
                      <p className="text-[11px] font-semibold text-slate-700 truncate">
                        {thread.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 line-clamp-1">
                        {lastMsg ? lastMsg.text : 'No messages yet'}
                      </p>
                    </div>

                    {/* Status & Channel Tags */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        thread.status === 'New'
                          ? 'bg-amber-100 text-amber-800'
                          : thread.status === 'In Discussion'
                          ? 'bg-blue-100 text-blue-800'
                          : thread.status === 'Quoted'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-[#B2E2C5]/30 text-[#4E9F76]'
                      }`}>
                        {thread.status}
                      </span>

                      <span className="text-[10px] text-slate-400 font-medium">
                        {thread.channel}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ========================================================
            RIGHT PANE: ACTIVE CONVERSATION & REPLY (COL 5-12)
           ======================================================== */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          {activeThread ? (
            <>
              {/* Active Thread Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fbfdfb]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#4E9F76] text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {activeThread.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-sm sm:text-base text-[#0f172a]">
                        {activeThread.customerName}
                      </h2>
                      {activeThread.company && (
                        <span className="text-xs text-slate-500 font-medium">
                          · {activeThread.company}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <a 
                        href={`mailto:${activeThread.email}`}
                        className="hover:text-[#4E9F76] flex items-center gap-1 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{activeThread.email}</span>
                      </a>
                      {activeThread.phone && (
                        <a 
                          href={`tel:${activeThread.phone}`}
                          className="hover:text-[#4E9F76] flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{activeThread.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Instant Connect & Status Action Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* WhatsApp Direct Connect */}
                  {activeThread.phone && (
                    <a
                      href={getWhatsAppLink(activeThread.phone, activeThread.customerName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Direct Chat on WhatsApp"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                      <ExternalLink className="w-3 h-3 text-emerald-500" />
                    </a>
                  )}

                  {/* Mailto Direct */}
                  <a
                    href={`mailto:${activeThread.email}?subject=${encodeURIComponent('EcoTex Wholesale Packaging - ' + activeThread.subject)}`}
                    title="Send Email"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Email</span>
                  </a>

                  {/* Status Dropdown */}
                  <StatusBadgeDropdown
                    value={activeThread.status}
                    onChange={(val) => handleUpdateStatus(val as CustomerThread['status'])}
                    options={['New', 'In Discussion', 'Quoted', 'Resolved']}
                    size="md"
                  />

                </div>
              </div>

              {/* Inquiry Subject Strip */}
              <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-bold text-slate-800">Subject:</span>
                  <span className="font-medium truncate max-w-md">{activeThread.subject}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                  <span>Channel:</span>
                  <span className="font-semibold text-slate-600">{activeThread.channel}</span>
                </div>
              </div>

              {/* Messages History Timeline */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[460px] bg-slate-50/40">
                {activeThread.messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400 font-medium">
                        <span className="font-bold text-slate-700">{msg.senderName}</span>
                        <span>·</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isAdmin
                            ? 'bg-[#166534] text-white rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {isAdmin && msg.notifications && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px]">
                          {msg.notifications.whatsapp?.dispatched && (
                            <a
                              href={msg.notifications.whatsapp.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md font-semibold hover:bg-emerald-100 transition-colors"
                              title="Click to view/open WhatsApp conversation"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp Notified ({msg.notifications.whatsapp.target})</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          )}
                          {msg.notifications.email?.dispatched && (
                            <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md font-semibold">
                              <Mail className="w-3 h-3 text-blue-600" />
                              <span>Email Sent ({msg.notifications.email.target})</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Reply Templates Chip Strip */}
              <div className="px-4 py-2 border-t border-slate-100 bg-[#fbfdfb]">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#4E9F76]" />
                  <span>1-Click Quick Response Templates:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {QUICK_REPLIES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReplyText(tmpl.text)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#4E9F76] hover:bg-[#B2E2C5]/10 text-slate-700 hover:text-[#4E9F76] text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Composer */}
              <div className="p-4 border-t border-slate-100 bg-white space-y-2.5">
                {/* Active Notification Channels Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#4E9F76]" />
                      Customer Linked Channels:
                    </span>

                    {activeThread.phone ? (
                      <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium">
                        <input
                          type="checkbox"
                          checked={notifyCustomerWhatsApp}
                          onChange={(e) => setNotifyCustomerWhatsApp(e.target.checked)}
                          className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500 accent-[#4E9F76]"
                        />
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <MessageCircle className="w-3 h-3" />
                          Auto-open Customer WhatsApp ({activeThread.phone})
                        </span>
                      </label>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No WhatsApp linked</span>
                    )}

                    {activeThread.email && !activeThread.email.includes('visitor@livechat') && !activeThread.email.includes('@whatsapp') ? (
                      <span className="inline-flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                        <Mail className="w-3 h-3" />
                        Email ({activeThread.email})
                      </span>
                    ) : null}
                  </div>

                  {activeThread.phone && (
                    <a
                      href={getWhatsAppLink(activeThread.phone, activeThread.customerName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      <span>Direct Chat</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder={`Write a reply to ${activeThread.customerName}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    className="w-full p-3.5 pr-52 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#4E9F76] focus:ring-1 focus:ring-[#4E9F76] resize-none transition-all placeholder:text-slate-400"
                  />
                  
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    {activeThread.phone && (
                      <button
                        type="button"
                        onClick={() => handleSendReply(undefined, true)}
                        disabled={!replyText.trim()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                        title="Send reply to live chat and immediately open WhatsApp chat with customer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Send & WhatsApp</span>
                        <span className="sm:hidden">WhatsApp</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleSendReply()}
                      disabled={!replyText.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px] text-slate-600">Ctrl + Enter</kbd> to quickly send reply</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Updates reflect immediately in visitor chatbot & customer channels
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
              <h3 className="font-bold text-base text-slate-700">No Conversation Selected</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Choose a customer thread from the left pane to view message history and send replies.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================
          MODAL: CREATE NEW INBOUND THREAD - Centered with Blurry Backdrop in Portal
         ======================================================== */}
      {showNewThreadModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setShowNewThreadModal(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/40 border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setShowNewThreadModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0f172a]">New Customer Thread</h3>
                <p className="text-xs text-slate-500">Log an inbound inquiry from a client or phone call</p>
              </div>
            </div>

            <form onSubmit={handleCreateNewThread} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={newThreadData.customerName}
                    onChange={(e) => setNewThreadData({ ...newThreadData, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Pacific Goods Co."
                    value={newThreadData.company}
                    onChange={(e) => setNewThreadData({ ...newThreadData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={newThreadData.email}
                    onChange={(e) => setNewThreadData({ ...newThreadData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 234-5678"
                    value={newThreadData.phone}
                    onChange={(e) => setNewThreadData({ ...newThreadData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Product Inquired</label>
                <input
                  type="text"
                  placeholder="e.g. Custom Canvas Tote Quote (5,000 units)"
                  value={newThreadData.subject}
                  onChange={(e) => setNewThreadData({ ...newThreadData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Customer Message</label>
                <textarea
                  rows={3}
                  placeholder="Notes from customer inquiry or phone discussion..."
                  value={newThreadData.initialMessage}
                  onChange={(e) => setNewThreadData({ ...newThreadData, initialMessage: e.target.value })}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white font-bold text-xs shadow-md shadow-[#4E9F76]/20 transition-all cursor-pointer"
                >
                  Create Conversation
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================
          MODAL: QUICK DESK CHANNELS (WHATSAPP & EMAIL) - Centered in Portal
         ======================================================== */}
      {showChannelModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setShowChannelModal(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl shadow-black/50 border border-slate-200/80 space-y-5 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0f172a]">
                    Desk Contact Channels
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live Chatbot & Storefront Contact Targets
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChannelModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeskChannels} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Official Desk WhatsApp Number *</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Direct wa.me link</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={deskWhatsApp}
                    onChange={(e) => setDeskWhatsApp(e.target.value)}
                    placeholder="+92 330 8738606 or +1 (951) 450-9773"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#25D366] focus:outline-none font-semibold text-slate-900 text-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Customer chatbot "WhatsApp" button, quick questions, and direct chat links will instantly open this WhatsApp number.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Official Support & Sales Email *</span>
                  <span className="text-[10px] text-emerald-600 font-bold">PDF Quotes</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={deskEmail}
                    onChange={(e) => setDeskEmail(e.target.value)}
                    placeholder="orders@ecotexinc.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-semibold text-slate-900 text-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Email captured from the chatbot and formal quote requests will route to this address.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowChannelModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white font-bold text-xs shadow-md shadow-emerald-900/20 cursor-pointer"
                >
                  Save & Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default CustomerMessagesManager;
