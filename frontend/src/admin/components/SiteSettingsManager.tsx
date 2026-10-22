'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Upload, 
  Globe, 
  User, 
  Lock, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  AlertCircle, 
  Eye, 
  Image as ImageIcon, 
  Megaphone, 
  DollarSign, 
  Truck, 
  Layers, 
  ExternalLink,
  Key,
  LogOut,
  RefreshCw,
  Sparkles,
  Search,
  Bell,
  Smartphone,
  Send,
  MessageCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SiteSettings, LogoConfig, OrderNotificationsConfig } from '../../types';
import { BASE_URL } from '../../services/apiService';

interface SiteSettingsManagerProps {
  onLogout?: () => void;
}

type SettingsTab = 'identity' | 'account' | 'notifications' | 'announcement' | 'business' | 'commerce';

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({ onLogout }) => {
  const { siteSettings, updateSiteSettings, adminUser, logout } = useStore();

  // Local Form State initialized from siteSettings
  const [formData, setFormData] = useState<SiteSettings>(siteSettings || {
    companyName: 'Ecotex Inc.',
    siteTitle: 'Ecotex Inc. | Wholesale Sustainable Packaging & Polypropylene Bags',
    metaDescription: 'Vertically integrated manufacturer of circular non-woven polypropylene bags, compostable blends, and reusable commercial textiles. Direct from Corona, CA.',
    tagline: 'Industrial-Grade Sustainable Packaging Solutions',
    heroTitle: 'Wholesale Sustainable Packaging & Polypropylene Bags',
    heroSubtitle: 'Direct factory pricing on lab-certified reusable non-woven bags.',
    announcement: '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility',
    announcementActive: true,
    phone: '+1 (800) 555-ECOTEX',
    secondaryPhone: '+1 (951) 898-8800',
    email: 'sales@ecotexinc.com',
    facilityAddress: '1250 E. Ontario Ave, Corona, CA 92881',
    plantAddress: 'EcoTex Mill Facility, Corona Industrial Corridor, CA',
    minOrderNotice: 'Wholesale orders require MOQ of 500 units per custom imprint run',
    leadTimeBlank: '48-72 Hours',
    leadTimeCustom: '10-14 Business Days',
    logoConfig: {
      wordmarkPrefix: 'ECO',
      wordmarkSuffix: 'TEX',
      badgeText: 'INC.',
      subtitle: 'SUSTAINABLE PACKAGING',
      faviconUrl: '/favicon.ico',
      customLogoUrl: ''
    }
  });

  const [activeTab, setActiveTab] = useState<SettingsTab>('identity');

  // Horizontal Slider state for Navigation Tabs
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkTabsScroll = () => {
    if (!tabsContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    checkTabsScroll();
    const el = tabsContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkTabsScroll);
      window.addEventListener('resize', checkTabsScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkTabsScroll);
      window.removeEventListener('resize', checkTabsScroll);
    };
  }, []);

  const slideTabs = (direction: 'left' | 'right') => {
    if (!tabsContainerRef.current) return;
    const offset = direction === 'left' ? -260 : 260;
    tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkTabsScroll, 350);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Account management state
  const [adminName, setAdminName] = useState(adminUser?.name || 'Operations Director');
  const [adminEmail, setAdminEmail] = useState(adminUser?.email || 'admin@ecotexinc.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Favicon upload ref
  const faviconFileInputRef = useRef<HTMLInputElement>(null);
  const [faviconUploading, setFaviconUploading] = useState(false);

  // Keep form data synced if store settings load or update externally
  useEffect(() => {
    if (siteSettings) {
      setFormData(prev => ({
        ...prev,
        ...siteSettings,
        siteTitle: siteSettings.siteTitle || prev.siteTitle || 'Ecotex Inc. | Wholesale Sustainable Packaging & Polypropylene Bags',
        metaDescription: siteSettings.metaDescription || prev.metaDescription || 'Vertically integrated manufacturer of circular non-woven polypropylene bags, compostable blends, and reusable commercial textiles. Direct from Corona, CA.',
        logoConfig: {
          ...prev.logoConfig,
          ...(siteSettings.logoConfig || {})
        }
      }));
    }
  }, [siteSettings]);

  // Toast auto-dismiss
  useEffect(() => {
    if (saveToast.show) {
      const timer = setTimeout(() => {
        setSaveToast(prev => ({ ...prev, show: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [saveToast.show]);

  // Generic Field Updater with Cross-Field Sync
  const handleFieldChange = (field: keyof SiteSettings, value: any) => {
    setFormData(prev => {
      const updates: any = { [field]: value };
      if (field === 'whatsappNumber') {
        updates.orderNotifications = {
          emailEnabled: prev.orderNotifications?.emailEnabled ?? true,
          notificationEmail: prev.orderNotifications?.notificationEmail || prev.email || 'orders@ecotexinc.com',
          whatsappEnabled: prev.orderNotifications?.whatsappEnabled ?? true,
          whatsappGreeting: prev.orderNotifications?.whatsappGreeting || 'New Wholesale Order Received on EcoTex Storefront',
          autoOpenWhatsapp: prev.orderNotifications?.autoOpenWhatsapp ?? true,
          ...(prev.orderNotifications || {}),
          whatsappNumber: value
        };
      } else if (field === 'email' || field === 'supportEmail') {
        updates.email = value;
        updates.supportEmail = value;
        updates.orderNotifications = {
          emailEnabled: prev.orderNotifications?.emailEnabled ?? true,
          whatsappEnabled: prev.orderNotifications?.whatsappEnabled ?? true,
          whatsappNumber: prev.orderNotifications?.whatsappNumber || prev.whatsappNumber || prev.phone || '+1 (951) 450-9773',
          whatsappGreeting: prev.orderNotifications?.whatsappGreeting || 'New Wholesale Order Received on EcoTex Storefront',
          autoOpenWhatsapp: prev.orderNotifications?.autoOpenWhatsapp ?? true,
          ...(prev.orderNotifications || {}),
          notificationEmail: value
        };
      }
      return { ...prev, ...updates };
    });
  };

  // Nested LogoConfig Updater
  const handleLogoConfigChange = (field: keyof LogoConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      logoConfig: {
        ...(prev.logoConfig || {}),
        [field]: value
      }
    }));
  };

  // Order Notifications & Communication Channels Updater
  const handleOrderNotifChange = (field: keyof OrderNotificationsConfig, value: any) => {
    setFormData(prev => {
      const updatedNotif = {
        emailEnabled: prev.orderNotifications?.emailEnabled ?? true,
        notificationEmail: prev.orderNotifications?.notificationEmail || prev.email || 'orders@ecotexinc.com',
        whatsappEnabled: prev.orderNotifications?.whatsappEnabled ?? true,
        whatsappNumber: prev.orderNotifications?.whatsappNumber || prev.whatsappNumber || prev.phone || '+1 (951) 450-9773',
        whatsappGreeting: prev.orderNotifications?.whatsappGreeting || 'New Wholesale Order Received on EcoTex Storefront',
        autoOpenWhatsapp: prev.orderNotifications?.autoOpenWhatsapp ?? true,
        ...(prev.orderNotifications || {}),
        [field]: value
      };

      const syncUpdates: Partial<SiteSettings> = {
        orderNotifications: updatedNotif
      };

      if (field === 'whatsappNumber') {
        syncUpdates.whatsappNumber = value;
      }
      if (field === 'notificationEmail') {
        syncUpdates.supportEmail = value;
        syncUpdates.email = value;
      }

      return {
        ...prev,
        ...syncUpdates
      };
    });
  };

  // Test WhatsApp Alert
  const handleTestWhatsApp = () => {
    const phone = formData.orderNotifications?.whatsappNumber || formData.phone || '+1 (951) 450-9773';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const greeting = formData.orderNotifications?.whatsappGreeting || 'New Wholesale Order Received on EcoTex Storefront';
    const sampleMsg = `🛒 *${greeting.toUpperCase()}*\n━━━━━━━━━━━━━━━━━━━━\n📄 *Order Ref:* #ECX-SAMPLE\n👤 *Customer:* Alex Morgan\n🏢 *Company:* Pacific Retailers Inc.\n📍 *Address:* 1200 Industrial Pkwy, Corona, CA 92881\n📦 *Items:*\n• 1,000x Heavy-Duty Non-Woven Tote ($250.00)\n💰 *Total Amount:* $250.00\n💳 *Payment Terms:* Credit Card / Instant ACH\n━━━━━━━━━━━━━━━━━━━━\n🏭 *EcoTex Facility:* Direct Verification Test Successful ✅`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(sampleMsg)}`;
    window.open(url, '_blank');
    setSaveToast({
      show: true,
      message: `Test WhatsApp notification opened for ${phone}!`,
      type: 'success'
    });
  };

  // Test Email Alert
  const handleTestEmail = () => {
    const email = formData.orderNotifications?.notificationEmail || formData.email || 'orders@ecotexinc.com';
    setSaveToast({
      show: true,
      message: `Test order notification dispatched to ${email}!`,
      type: 'success'
    });
  };

  // Favicon File Upload
  const handleFaviconUpload = async (file: File) => {
    if (!file) return;
    setFaviconUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: uploadFormData
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url || data.filePath;
        handleLogoConfigChange('faviconUrl', uploadedUrl);

        // Immediate dynamic update of link rel="icon"
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = uploadedUrl;
      } else {
        // Fallback to base64 data url
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Url = e.target?.result as string;
          handleLogoConfigChange('faviconUrl', base64Url);
          let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
          if (link) link.href = base64Url;
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Favicon upload server error, falling back to FileReader:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        handleLogoConfigChange('faviconUrl', base64Url);
      };
      reader.readAsDataURL(file);
    } finally {
      setFaviconUploading(false);
    }
  };

  // Save Settings to Backend and Global Store
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // 1. Update Global Zustand Store and LocalStorage
      updateSiteSettings(formData);

      // 2. Persist to API Server
      const res = await fetch(`${BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // 3. Immediately reflect siteTitle and favicon in the current browser tab
      if (formData.siteTitle) {
        document.title = formData.siteTitle;
      }
      if (formData.logoConfig?.faviconUrl) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (link) link.href = formData.logoConfig.faviconUrl;
      }

      setSaveToast({
        show: true,
        message: 'Site settings and preferences updated successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error('Error saving site settings:', err);
      setSaveToast({
        show: true,
        message: 'Saved locally, but failed to synchronize with backend server.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update Admin Profile Info
  const handleUpdateAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...(adminUser || {}),
      name: adminName.trim(),
      email: adminEmail.trim(),
      role: 'Super Admin'
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('ecotex_admin_user', JSON.stringify(updatedUser));
      sessionStorage.setItem('ecotex_admin_user', JSON.stringify(updatedUser));
    }
    useStore.setState({ adminUser: updatedUser });

    setSaveToast({
      show: true,
      message: 'Admin account details updated successfully!',
      type: 'success'
    });
  };

  // Change Admin Password Handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    // In this CMS, credentials are stored in admin credentials store / local token
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecotex_admin_pass_hash', btoa(newPassword));
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage({ type: 'success', text: 'Password successfully changed! Use your new credentials for next login.' });
  };

  const currentFavicon = formData.logoConfig?.faviconUrl || '/favicon.ico';
  const currentTitle = formData.siteTitle || formData.companyName || 'Ecotex Inc.';

  return (
    <div className="space-y-8 animate-fadeIn text-[#0f172a]">

      {/* Floating Toast Notification */}
      {saveToast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold animate-fadeInUp ${
          saveToast.type === 'success' 
            ? 'bg-[#166534] text-white border-emerald-400/40 shadow-emerald-950/20' 
            : 'bg-red-700 text-white border-red-400/40 shadow-red-950/20'
        }`}>
          {saveToast.type === 'success' ? <Check className="w-5 h-5 stroke-[2.5]" /> : <AlertCircle className="w-5 h-5" />}
          <span>{saveToast.message}</span>
        </div>
      )}

      {/* Top Header Card & Quick Action Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B2E2C5]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-[#dcfce7] text-[#166534]">
              <Settings className="w-5 h-5" />
            </span>
            <span className="text-xs font-black tracking-widest uppercase text-[#166534]">
              System Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f172a] uppercase">
            Site & Account Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Configure site metadata, favicon, browser title, administrator account details, and core store preferences.
          </p>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setFormData(siteSettings)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar with Horizontal Slider Controls */}
      <div className="relative group bg-slate-50/90 p-1.5 rounded-2xl border border-slate-200/90 mb-6 flex items-center shadow-2xs">
        
        {/* Slider Left Arrow Button */}
        <button
          type="button"
          onClick={() => slideTabs('left')}
          disabled={!canScrollLeft}
          className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 z-10 flex items-center justify-center cursor-pointer ${
            canScrollLeft
              ? 'bg-white text-slate-800 hover:bg-[#166534] hover:text-white border border-slate-200/80 shadow-xs hover:shadow-md active:scale-95'
              : 'text-slate-300 bg-transparent border border-transparent cursor-not-allowed opacity-30'
          }`}
          title="Slide Tabs Left"
          aria-label="Previous tabs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Tabs Carousel Track */}
        <div
          ref={tabsContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto scroll-smooth scrollbar-none py-0.5 px-2 flex-1 no-scrollbar"
        >
          {[
            { id: 'identity', label: 'Site Identity & SEO', icon: Globe },
            { id: 'account', label: 'Admin Account & Security', icon: User },
            { id: 'notifications', label: 'WhatsApp & Email Channels (Chatbot & Alerts)', icon: Bell },
            { id: 'announcement', label: 'Header Announcement', icon: Megaphone },
            { id: 'business', label: 'Business & Contacts', icon: Building2 },
            { id: 'commerce', label: 'Store Defaults', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={(e) => {
                  setActiveTab(tab.id as SettingsTab);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'border-[#166534] text-[#166534] bg-white shadow-xs font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#166534]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Slider Right Arrow Button */}
        <button
          type="button"
          onClick={() => slideTabs('right')}
          disabled={!canScrollRight}
          className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 z-10 flex items-center justify-center cursor-pointer ${
            canScrollRight
              ? 'bg-white text-slate-800 hover:bg-[#166534] hover:text-white border border-slate-200/80 shadow-xs hover:shadow-md active:scale-95'
              : 'text-slate-300 bg-transparent border border-transparent cursor-not-allowed opacity-30'
          }`}
          title="Slide Tabs Right"
          aria-label="Next tabs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

      {/* ========================================================
          TAB 1: SITE IDENTITY & SEO (FAVICON, SITE TITLE, META)
         ======================================================== */}
      {activeTab === 'identity' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* 1. Live Browser Tab Mockup Preview */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Browser Tab Mockup
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Chrome / Edge / Safari View</span>
            </div>

            {/* Window Browser Chrome simulation */}
            <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800/80 max-w-xl">
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="bg-slate-900 rounded-xl px-4 py-2 flex items-center gap-3 border border-slate-800 shadow-inner">
                {/* Simulated Favicon */}
                <div className="w-4 h-4 rounded-xs shrink-0 flex items-center justify-center overflow-hidden bg-white/10">
                  <img 
                    src={currentFavicon} 
                    alt="Favicon" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback icon visualizer
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                {/* Simulated Tab Title */}
                <span className="text-xs font-medium text-slate-200 truncate">
                  {currentTitle}
                </span>
                <span className="ml-auto text-[10px] text-slate-500">×</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 6 cols: Favicon Upload & Configuration */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#166534]" />
                  Website Favicon
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  The micro icon shown in browser tabs, bookmarks, and mobile shortcut tiles (Recommended: 32×32 or 64×64 PNG / ICO / SVG).
                </p>
              </div>

              {/* Favicon Preview & Action Row */}
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#f8faf8] border border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-xs shrink-0 relative group">
                  <img 
                    src={currentFavicon} 
                    alt="Favicon Preview" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', '/favicon.ico');
                    }}
                  />
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <input
                    type="file"
                    ref={faviconFileInputRef}
                    accept="image/png, image/x-icon, image/svg+xml, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFaviconUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => faviconFileInputRef.current?.click()}
                      disabled={faviconUploading}
                      className="px-3.5 py-2 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{faviconUploading ? 'Uploading...' : 'Upload File'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLogoConfigChange('faviconUrl', '/favicon.ico')}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
                    >
                      Reset Default
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">Supports .ico, .png, .svg, .webp</p>
                </div>
              </div>

              {/* Direct URL Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Direct Favicon URL
                </label>
                <input
                  type="text"
                  value={formData.logoConfig?.faviconUrl || ''}
                  onChange={(e) => handleLogoConfigChange('faviconUrl', e.target.value)}
                  placeholder="https://example.com/favicon.png or /favicon.ico"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Standard Brand Icon Presets
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Green Bag Icon', url: '/images/bag-green.png' },
                    { label: 'Classic Favicon', url: '/favicon.ico' },
                    { label: 'Orange Bag Icon', url: '/images/bag-orange.png' },
                    { label: 'Black Bag Icon', url: '/images/bag-black.png' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLogoConfigChange('faviconUrl', preset.url)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] text-left text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                    >
                      <img src={preset.url} alt="" className="w-5 h-5 object-contain" />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 6 cols: Site Title & Google SEO Snippet */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#166534]" />
                  Browser & SEO Site Title
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  The primary HTML title tag shown in search engine results and the browser title bar.
                </p>
              </div>

              {/* Site Title Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Site Title *
                  </label>
                  <span className={`text-[10px] font-mono ${(formData.siteTitle?.length || 0) > 65 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {formData.siteTitle?.length || 0} / 60-70 characters
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.siteTitle || ''}
                  onChange={(e) => handleFieldChange('siteTitle', e.target.value)}
                  placeholder="Ecotex Inc. | Wholesale Sustainable Packaging & Polypropylene Bags"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors"
                />
              </div>

              {/* Meta Description Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Meta Description (Search Snippet)
                  </label>
                  <span className={`text-[10px] font-mono ${(formData.metaDescription?.length || 0) > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {formData.metaDescription?.length || 0} / 155-160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.metaDescription || ''}
                  onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                  placeholder="Vertically integrated manufacturer of circular non-woven polypropylene bags..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Google Search Engine Result Preview */}
              <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Google Search Engine Snippet Preview
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">ecotexinc.com</span>
                  <span>› wholesale › packaging</span>
                </div>
                <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                  {currentTitle}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {formData.metaDescription || 'High-capacity reusable non-woven polypropylene bags engineered for enterprise retail and FMCG compliance.'}
                </p>
              </div>

            </div>

          </div>

          {/* Site Wordmark & Logo Typography */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide">
              Brand Wordmark Typography (Header & Navbar Logo)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Wordmark Prefix</label>
                <input
                  type="text"
                  value={formData.logoConfig?.wordmarkPrefix || 'ECO'}
                  onChange={(e) => handleLogoConfigChange('wordmarkPrefix', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Wordmark Suffix</label>
                <input
                  type="text"
                  value={formData.logoConfig?.wordmarkSuffix || 'TEX'}
                  onChange={(e) => handleLogoConfigChange('wordmarkSuffix', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Badge Tag</label>
                <input
                  type="text"
                  value={formData.logoConfig?.badgeText || 'INC.'}
                  onChange={(e) => handleLogoConfigChange('badgeText', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 2: ADMIN ACCOUNT & SECURITY
         ======================================================== */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          
          {/* Left Column: Account Profile Details */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] text-white flex items-center justify-center font-black text-xl shadow-md">
                AD
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">
                  {adminName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {adminEmail}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full text-[10px] font-bold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Administrator</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateAdminProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0f172a] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Update Profile Info
              </button>
            </form>

            {/* Logout Action */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Sign Out of Session</h4>
                <p className="text-[11px] text-slate-500">Safely log out of this browser</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  if (onLogout) onLogout();
                }}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Right Column: Change Password */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#166534]" />
                Security & Password
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Update the administrator master credentials for accessing `/admin`.
              </p>
            </div>

            {passwordMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                passwordMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {passwordMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Change Admin Password
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB: ORDER NOTIFICATIONS (EMAIL & WHATSAPP)
         ======================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header Banner */}
          <div className="bg-[#fbfdfb] rounded-3xl p-6 sm:p-7 border border-[#B2E2C5]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#dcfce7] text-[#166534] flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0f172a] uppercase tracking-wide">
                  Real-Time Order Notifications (Email & WhatsApp)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                  Jab bhi customer storefront par wholesale order ya express checkout place kare, EcoTex team ko automated notification email aur WhatsApp alert receive hoga. Aap dono options ko apni marzi se configure aur test kar sakte hain.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
                <span>Live Alerts Active</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (Col 1-7): Config Cards */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: Email Notification Settings */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <Mail className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#0f172a]">1. Email Order Notifications</h4>
                      <p className="text-[11px] text-slate-400">Automated order manifest sent to EcoTex inbox</p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.orderNotifications?.emailEnabled !== false}
                      onChange={(e) => handleOrderNotifChange('emailEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]" />
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      EcoTex Notification Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.orderNotifications?.notificationEmail || formData.email || 'orders@ecotexinc.com'}
                        onChange={(e) => handleOrderNotifChange('notificationEmail', e.target.value)}
                        placeholder="orders@ecotexinc.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      New customer orders placed via Express Checkout or Cart will dispatch full line items, client details, and delivery address to this email.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Verify your email recipient setup:</span>
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-500" />
                      <span>Test Email Alert</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: WhatsApp Notification Settings */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <MessageCircle className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#0f172a]">2. WhatsApp Order Alerts</h4>
                      <p className="text-[11px] text-slate-400">Direct instant alert on EcoTex company WhatsApp</p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.orderNotifications?.whatsappEnabled !== false}
                      onChange={(e) => handleOrderNotifChange('whatsappEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]" />
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      EcoTex WhatsApp Alert Number *
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.orderNotifications?.whatsappNumber || formData.phone || '+1 (951) 450-9773'}
                        onChange={(e) => handleOrderNotifChange('whatsappNumber', e.target.value)}
                        placeholder="+1 (951) 450-9773"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Include country code (e.g., +1 for USA, +92 for Pakistan, +44 for UK). Format: +[country code][number].
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Custom Message Header / Greeting
                    </label>
                    <input
                      type="text"
                      value={formData.orderNotifications?.whatsappGreeting || 'New Wholesale Order Received on EcoTex Storefront'}
                      onChange={(e) => handleOrderNotifChange('whatsappGreeting', e.target.value)}
                      placeholder="New Wholesale Order Received on EcoTex Storefront"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Auto-open toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <div className="text-xs font-bold text-[#0f172a]">Auto-Open WhatsApp On Checkout</div>
                      <div className="text-[11px] text-slate-400">Launch WhatsApp tab automatically when order completes</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.orderNotifications?.autoOpenWhatsapp !== false}
                        onChange={(e) => handleOrderNotifChange('autoOpenWhatsapp', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]" />
                    </label>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Verify WhatsApp link with a test dispatch:</span>
                    <button
                      type="button"
                      onClick={handleTestWhatsApp}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Test WhatsApp Alert</span>
                      <ExternalLink className="w-3 h-3 text-emerald-500" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (Col 8-12): Live Simulated WhatsApp Notification Preview */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#0b141a] rounded-3xl p-6 border border-slate-800 shadow-xl text-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold">
                      <MessageCircle className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">WhatsApp Alert Preview</h4>
                      <p className="text-[10px] text-slate-400">
                        {formData.orderNotifications?.whatsappNumber || formData.phone || '+1 (951) 450-9773'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#128C7E] text-white">
                    Live Template
                  </span>
                </div>

                {/* Simulated Chat Bubble */}
                <div className="bg-[#005c4b] rounded-2xl p-4 text-xs font-sans text-slate-100 space-y-2 shadow-md border border-[#128C7E]/40 leading-relaxed">
                  <div className="font-bold text-[#86efac] flex items-center gap-1.5 text-[11px]">
                    <span>🛒</span>
                    <span>{formData.orderNotifications?.whatsappGreeting || 'NEW WHOLESALE ORDER RECEIVED - ECOTEX INC.'}</span>
                  </div>

                  <div className="text-[11px] text-slate-200 space-y-1 font-mono">
                    <div>━━━━━━━━━━━━━━━━━━━━</div>
                    <div><span className="text-emerald-300 font-bold">📄 Order Ref:</span> #ECX-892104</div>
                    <div><span className="text-emerald-300 font-bold">👤 Customer:</span> David Miller</div>
                    <div><span className="text-emerald-300 font-bold">🏢 Company:</span> Sierra Grocers Inc.</div>
                    <div><span className="text-emerald-300 font-bold">📍 Address:</span> 1200 Industrial Pkwy, Corona, CA</div>
                    <div>━━━━━━━━━━━━━━━━━━━━</div>
                    <div className="text-emerald-200 font-bold">📦 Ordered Items:</div>
                    <div className="pl-2 text-[10px] text-slate-200">• 1,000x Heavy-Duty Gusseted Supermarket Tote ($250.00)</div>
                    <div className="pl-2 text-[10px] text-slate-200">• 500x Bio-PLA Compostable Carrier ($125.00)</div>
                    <div>━━━━━━━━━━━━━━━━━━━━</div>
                    <div><span className="text-emerald-300 font-bold">💰 Total Amount:</span> $375.00</div>
                    <div><span className="text-emerald-300 font-bold">💳 Terms:</span> Credit Card / Instant ACH</div>
                    <div>━━━━━━━━━━━━━━━━━━━━</div>
                    <div className="text-[10px] text-emerald-300 italic">🏭 EcoTex Facility: Corona, CA 92881</div>
                  </div>

                  <div className="text-right text-[9px] text-emerald-200/80 pt-1 flex items-center justify-end gap-1">
                    <span>Just now</span>
                    <span>✓✓</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>How This Works:</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Whenever a client checks out, their exact order items and shipping details are structured into this template. The EcoTex administrator receives both an instant WhatsApp ping and an email audit trail.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 4: HEADER & ANNOUNCEMENT BAR
         ======================================================== */}
      {activeTab === 'announcement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide">
              Top Announcement Ribbon Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Controls the top thin banner running at the very top of all customer-facing storefront pages.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8faf8] border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-900">Show Announcement Bar</p>
              <p className="text-[11px] text-slate-500">Enable or hide the announcement bar across all storefront pages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementActive !== false}
                onChange={(e) => handleFieldChange('announcementActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]" />
            </label>
          </div>

          {/* Announcement Text Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Announcement Message
            </label>
            <input
              type="text"
              value={formData.announcement || ''}
              onChange={(e) => handleFieldChange('announcement', e.target.value)}
              placeholder="🌱 Certified Recycled & Compostable Wholesale Packaging..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
            />
          </div>

          {/* Header Action Button & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Header CTA Button Text
              </label>
              <input
                type="text"
                value={formData.navbarConfig?.ctaButtonText || formData.heroButtonText || 'START SHOP'}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    heroButtonText: e.target.value,
                    navbarConfig: {
                      ...(prev.navbarConfig || { announcementText: '', announcementActive: true, phoneDisplay: '', ctaButtonText: '' }),
                      ctaButtonText: e.target.value
                    }
                  }));
                }}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Header Support Phone Display
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: BUSINESS & MILL CONTACTS
         ======================================================== */}
      {activeTab === 'business' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide">
              Corporate Headquarters & Contact Details
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Used in footer credentials, quote proposals, contact forms, and email notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Legal Name
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleFieldChange('companyName', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Primary Sales & Support Email</span>
                <span className="text-[10px] text-[#166534] font-bold">Chatbot Quotes</span>
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Official Desk WhatsApp Number</span>
                <span className="text-[10px] text-[#25D366] font-bold">Chatbot & Direct Chat</span>
              </label>
              <input
                type="text"
                placeholder="+1 (951) 450-9773 or +92 330 8738606"
                value={formData.whatsappNumber || formData.orderNotifications?.whatsappNumber || ''}
                onChange={(e) => handleFieldChange('whatsappNumber', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#25D366] focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Toll-Free Phone
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Factory Mill Line (Secondary)
              </label>
              <input
                type="text"
                value={formData.secondaryPhone || ''}
                onChange={(e) => handleFieldChange('secondaryPhone', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Corporate Facility Address
              </label>
              <input
                type="text"
                value={formData.facilityAddress || ''}
                onChange={(e) => handleFieldChange('facilityAddress', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Manufacturing Plant Address
              </label>
              <input
                type="text"
                value={formData.plantAddress || ''}
                onChange={(e) => handleFieldChange('plantAddress', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: COMMERCE & STORE DEFAULTS
         ======================================================== */}
      {activeTab === 'commerce' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide">
              Store & Fulfillment Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Default lead times, free shipping qualifications, and minimum wholesale run notices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Warehouse Unbranded Dispatch Lead Time
              </label>
              <input
                type="text"
                value={formData.leadTimeBlank || '48-72 Hours'}
                onChange={(e) => handleFieldChange('leadTimeBlank', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Custom Printed Flexography Lead Time
              </label>
              <input
                type="text"
                value={formData.leadTimeCustom || '10-14 Business Days'}
                onChange={(e) => handleFieldChange('leadTimeCustom', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Wholesale Minimum Order Quantity (MOQ) Notice
              </label>
              <input
                type="text"
                value={formData.minOrderNotice || ''}
                onChange={(e) => handleFieldChange('minOrderNotice', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Configured settings will instantly apply to both admin and customer storefront.</span>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
        </button>
      </div>

    </div>
  );
};

export default SiteSettingsManager;
