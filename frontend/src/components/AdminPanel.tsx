'use client';

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { apiService } from '../services/apiService';
import { Product, CategoryItem, Order, QuoteSubmission, SiteSettings, ProductCategory } from '../types';
import { StatusBadgeDropdown } from '../admin/components/ui/StatusBadgeDropdown';
import { CustomSelect } from '../admin/components/ui/CustomSelect';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Mail, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  ArrowLeft, 
  RefreshCw, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Search, 
  Filter, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  Building,
  Phone,
  RotateCcw,
  LogOut,
  Save,
  Globe,
  Sliders,
  Sparkles,
  Info,
  CheckCircle,
  KeyRound,
  Lock
} from 'lucide-react';

interface AdminPanelProps {
  onBackToSite: () => void;
  onLogout?: () => void;
  adminUser?: any;
}

type AdminTab = 'dashboard' | 'products' | 'categories' | 'orders' | 'quotes' | 'settings';
type SettingsSubTab = 'hero' | 'contact' | 'about' | 'policies' | 'footer' | 'security';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onBackToSite, 
  onLogout,
  adminUser 
}) => {
  const {
    products,
    categories,
    settings,
    orders,
    quotes,
    stats,
    loading,
    refreshData,
    addProduct,
    editProduct,
    removeProduct,
    toggleStock,
    addCategory,
    editCategory,
    removeCategory,
    saveSettings,
    changeOrderStatus,
    removeOrder,
    changeQuoteStatus,
    removeQuote,
    resetToFactory
  } = useData();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'non-woven' as ProductCategory,
    categoryLabel: 'Non-Woven Totes',
    subtitle: '',
    pricePerUnit: 0.25,
    moq: 1000,
    gsm: 80,
    dimensions: '12"W x 14"H x 4"D',
    material: 'Virgin Non-Woven Polypropylene',
    capacity: 'Up to 25 lbs',
    badge: 'Factory Direct',
    image: '/images/bag-green.png',
    inStock: true,
    description: 'High tensile enterprise carrier bag manufactured for supermarkets, boutique retail, and trade exhibitions.'
  });

  // Comprehensive CMS Settings Form State
  const [cmsSettings, setCmsSettings] = useState<SiteSettings>({
    companyName: settings?.companyName || 'Ecotex Inc.',
    tagline: settings?.tagline || 'Certified Sustainable Wholesale Packaging Direct From Manufacturer',
    heroTitle: settings?.heroTitle || 'Industrial-Scale Sustainable Packaging',
    heroSubtitle: settings?.heroSubtitle || 'Custom engineered non-woven, bio-compostable and laminated wholesale carrier bags for retail chains, distributors, and global brands.',
    heroButtonText: settings?.heroButtonText || 'Explore Collections',
    announcement: settings?.announcement || '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility',
    announcementActive: settings?.announcementActive !== false,
    phone: settings?.phone || '(951) 555-ECOTEX',
    secondaryPhone: settings?.secondaryPhone || '+1 (951) 450-9773',
    email: settings?.email || 'orders@ecotexinc.com',
    facilityAddress: settings?.facilityAddress || '1200 Industrial Parkway, Corona, CA 92881',
    plantAddress: settings?.plantAddress || 'Sector 15, Korangi Industrial Area, Karachi, PK',
    minOrderNotice: settings?.minOrderNotice || 'Free pallet freight on continental US orders over $1,000',
    leadTimeBlank: settings?.leadTimeBlank || '2-4 Business Days',
    leadTimeCustom: settings?.leadTimeCustom || '10-14 Business Days',
    aboutTitle: settings?.aboutTitle || 'Engineered For Durability. Designed For Circularity.',
    aboutMission: settings?.aboutMission || 'Empowering commercial enterprises and supermarket chains with certified non-woven and compostable packaging that drastically reduces carbon footprints without sacrificing load capacity.',
    aboutStory: settings?.aboutStory || 'Founded with a dedication to manufacturing excellence, Ecotex operates state-of-the-art ultrasonic welding and automated flexographic printing facilities in California and Karachi.',
    footerTagline: settings?.footerTagline || 'One stop solution for your enterprise packaging needs.',
    copyrightNotice: settings?.copyrightNotice || 'Copyright 2026 © Ecotex Inc. All rights reserved.'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Modal for New Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'non-woven',
      categoryLabel: 'Non-Woven Totes',
      subtitle: '',
      pricePerUnit: 0.25,
      moq: 1000,
      gsm: 80,
      dimensions: '12"W x 14"H x 4"D',
      material: 'Virgin Non-Woven Polypropylene',
      capacity: 'Up to 25 lbs',
      badge: 'Factory Direct',
      image: '/images/bag-green.png',
      inStock: true,
      description: 'High tensile enterprise carrier bag manufactured for supermarkets, boutique retail, and trade exhibitions.'
    });
    setIsProductModalOpen(true);
  };

  // Open Modal for Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      categoryLabel: prod.categoryLabel || 'Non-Woven Totes',
      subtitle: prod.subtitle || '',
      pricePerUnit: prod.pricePerUnit,
      moq: prod.moq,
      gsm: prod.gsm,
      dimensions: prod.dimensions,
      material: prod.material,
      capacity: prod.capacity,
      badge: prod.badge || (prod.inStock ? 'In Stock' : 'Pre-Order'),
      image: prod.image || '/images/bag-green.png',
      inStock: prod.inStock,
      description: prod.description
    });
    setIsProductModalOpen(true);
  };

  // Submit Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await editProduct(editingProduct.id, {
          ...formData,
          pricePerUnit: Number(formData.pricePerUnit),
          moq: Number(formData.moq),
          gsm: Number(formData.gsm)
        });
        showToast(`Product "${formData.name}" successfully updated in backend.`);
      } else {
        await addProduct({
          ...formData,
          pricePerUnit: Number(formData.pricePerUnit),
          moq: Number(formData.moq),
          gsm: Number(formData.gsm)
        });
        showToast(`New product "${formData.name}" successfully created.`);
      }
      setIsProductModalOpen(false);
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Delete product confirmation
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await removeProduct(productToDelete.id);
      showToast(`Product "${productToDelete.name}" deleted.`);
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`);
    }
  };

  // Save CMS Settings
  const handleSaveCmsSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSettings(cmsSettings);
      showToast('Website CMS & Site Settings successfully published to live website!');
    } catch (err: any) {
      showToast(`Save failed: ${err.message}`);
    }
  };

  // Security & Admin Credentials State & Handler
  const [securityForm, setSecurityForm] = useState({
    name: adminUser?.name || 'Operations Director',
    email: adminUser?.email || 'admin@ecotexinc.com',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityError('New password and confirm password do not match.');
      return;
    }

    if (securityForm.newPassword && securityForm.newPassword.length < 4) {
      setSecurityError('Password must be at least 4 characters long.');
      return;
    }

    setSecurityLoading(true);
    try {
      const payload: { name: string; email: string; password?: string } = {
        name: securityForm.name.trim(),
        email: securityForm.email.trim()
      };
      if (securityForm.newPassword) {
        payload.password = securityForm.newPassword;
      }
      const res = await apiService.updateCredentials(payload);
      if (res.success) {
        setSecuritySuccess('Master administrator security credentials successfully updated in Node.js backend.');
        showToast('Admin credentials updated successfully.');
        setSecurityForm(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      }
    } catch (err: any) {
      setSecurityError(err.message || 'Failed to update credentials. Please check server connectivity.');
    } finally {
      setSecurityLoading(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.material.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const totalRevenue = stats?.grossRevenue ?? orders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-[#f4faf4] text-[#142918] font-sans antialiased selection:bg-[#008000] selection:text-white flex flex-col">
      
      {/* ========================================================
          1. TOP ENTERPRISE HEADER (WHITE WITH #008000 ACCENTS)
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#d4ebd4] shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#008000] text-white flex items-center justify-center font-black shadow-md shadow-[#008000]/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[#142918] uppercase">
                  ECO<span className="text-[#008000]">TEX</span>
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase bg-[#eaf6ea] text-[#008000] px-2 py-0.5 rounded-full border border-[#008000]/25">
                  ADMIN v2.5
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 block">
                Central Node.js REST Gateway
              </span>
            </div>
          </div>

          {/* Center: System Status Pill */}
          <div className="hidden md:flex items-center gap-2 bg-[#f0f9f0] border border-[#008000]/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#008000]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008000] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#008000]"></span>
            </span>
            <span>REST API Active · Real-time JSON Persistence</span>
          </div>

          {/* Right: Actions (Refresh, Back to Site, Logout) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                refreshData();
                showToast('Syncing with backend API...');
              }}
              className="p-2 rounded-xl border border-[#d4ebd4] bg-white text-slate-700 hover:text-[#008000] hover:border-[#008000]/50 hover:bg-[#f6faf6] transition-colors cursor-pointer"
              title="Refresh Data from Node Backend"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#008000]' : ''}`} />
            </button>

            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-[#008000]/30 text-[#008000] hover:bg-[#eaf6ea] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit to Storefront</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer"
                title="Log Out of Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Log Out</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ========================================================
          2. TOAST NOTIFICATION BANNER
         ======================================================== */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-fadeInUp">
          <div className="bg-[#008000] text-white px-5 py-3 rounded-2xl shadow-xl border border-white/20 text-xs font-bold flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          3. MAIN ADMIN BODY (SIDEBAR + MAIN STAGE)
         ======================================================== */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* ======================================================
            SIDEBAR (PURE WHITE WITH #008000 GREEN HIGHLIGHTS)
           ====================================================== */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          
          <div className="bg-white rounded-2xl border border-[#d4ebd4] p-4 shadow-sm space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#008000]">
              Management Modules
            </div>

            {/* Tab 1: Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#008000] text-white shadow-md shadow-[#008000]/25'
                  : 'text-slate-700 hover:bg-[#eaf6ea] hover:text-[#008000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & KPIs</span>
              </div>
            </button>

            {/* Tab 2: Products */}
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#008000] text-white shadow-md shadow-[#008000]/25'
                  : 'text-slate-700 hover:bg-[#eaf6ea] hover:text-[#008000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Products Catalog</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-[#eaf6ea] text-[#008000]'
              }`}>
                {products.length}
              </span>
            </button>

            {/* Tab 3: Categories */}
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#008000] text-white shadow-md shadow-[#008000]/25'
                  : 'text-slate-700 hover:bg-[#eaf6ea] hover:text-[#008000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderTree className="w-4 h-4" />
                <span>Categories & Styles</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                activeTab === 'categories' ? 'bg-white/20 text-white' : 'bg-[#eaf6ea] text-[#008000]'
              }`}>
                {categories.length}
              </span>
            </button>

            {/* Tab 4: Orders */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#008000] text-white shadow-md shadow-[#008000]/25'
                  : 'text-slate-700 hover:bg-[#eaf6ea] hover:text-[#008000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4" />
                <span>Customer Orders</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#eaf6ea] text-[#008000]'
              }`}>
                {orders.length}
              </span>
            </button>

            {/* Tab 5: Quotes / RFQs */}
            <button
              onClick={() => setActiveTab('quotes')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quotes'
                  ? 'bg-[#008000] text-white shadow-md shadow-[#008000]/25'
                  : 'text-slate-700 hover:bg-[#eaf6ea] hover:text-[#008000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Wholesale RFQs</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                activeTab === 'quotes' ? 'bg-white/20 text-white' : 'bg-[#eaf6ea] text-[#008000]'
              }`}>
                {quotes.length}
              </span>
            </button>

            {/* Tab 6: Site Settings / CMS (Edit Everything!) */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#008000] text-white shadow-md shadow-[#008000]/25'
                  : 'text-slate-700 hover:bg-[#eaf6ea] hover:text-[#008000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Site Content (CMS)</span>
              </div>
              <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                EDIT
              </span>
            </button>

          </div>

          {/* Quick Admin Profile Card */}
          <div className="bg-white rounded-2xl border border-[#d4ebd4] p-4 shadow-sm text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#008000] text-white flex items-center justify-center font-bold">
                AD
              </div>
              <div>
                <div className="font-bold text-[#142918]">Operations Director</div>
                <div className="text-[11px] text-slate-500 font-mono">admin@ecotexinc.com</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e6f3e6] flex items-center justify-between text-[11px] text-slate-500">
              <span>Security Level:</span>
              <strong className="text-[#008000]">Super Admin</strong>
            </div>

            <div className="mt-3 py-2.5 px-3 rounded-xl bg-[#f4faf4] border border-[#d4ebd4] text-[11px] flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 text-[#008000] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#008000]" />
                <span>Node.js DB Status</span>
              </span>
              <strong className="font-mono text-slate-800">Healthy (0.3ms)</strong>
            </div>
          </div>


        </aside>

        {/* ======================================================
            MAIN STAGE CONTENT
           ====================================================== */}
        <main className="flex-1 min-w-0">

          {/* ----------------------------------------------------
              TAB 1: DASHBOARD OVERVIEW
             ---------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeInUp">
              
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#008000] to-[#006800] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-[#008000]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full inline-block mb-3">
                    REAL-TIME OVERVIEW
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Welcome to Ecotex Control Center
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 font-light mt-1 max-w-xl">
                    Full administration authority over manufacturing catalog, wholesale RFQs, customer orders, and live website CMS contents.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center gap-2 bg-white text-[#008000] hover:bg-slate-50 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* 4 Metric Cards in Green/White */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Metric 1 */}
                <div className="bg-white rounded-2xl p-6 border border-[#d4ebd4] shadow-sm flex flex-col justify-between hover:border-[#008000]/40 transition-colors">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Gross Sales</span>
                    <div className="w-8 h-8 rounded-lg bg-[#eaf6ea] text-[#008000] flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-mono text-[#142918]">
                      ${totalRevenue.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-[#008000] font-semibold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{orders.length} Wholesale Orders logged</span>
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white rounded-2xl p-6 border border-[#d4ebd4] shadow-sm flex flex-col justify-between hover:border-[#008000]/40 transition-colors">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Products</span>
                    <div className="w-8 h-8 rounded-lg bg-[#eaf6ea] text-[#008000] flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-mono text-[#142918]">
                      {products.length}
                    </div>
                    <span className="text-[11px] text-[#008000] font-semibold mt-1 block">
                      {products.filter(p => p.inStock).length} models in active stock
                    </span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white rounded-2xl p-6 border border-[#d4ebd4] shadow-sm flex flex-col justify-between hover:border-[#008000]/40 transition-colors">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pending RFQs</span>
                    <div className="w-8 h-8 rounded-lg bg-[#eaf6ea] text-[#008000] flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-mono text-[#142918]">
                      {quotes.filter(q => q.status === 'New').length}
                    </div>
                    <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
                      {quotes.length} total customer leads
                    </span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white rounded-2xl p-6 border border-[#d4ebd4] shadow-sm flex flex-col justify-between hover:border-[#008000]/40 transition-colors">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Bags Displaced</span>
                    <div className="w-8 h-8 rounded-lg bg-[#eaf6ea] text-[#008000] flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-mono text-[#142918]">
                      4.52M+
                    </div>
                    <span className="text-[11px] text-[#008000] font-semibold mt-1 block">
                      Single-use plastic reduction
                    </span>
                  </div>
                </div>

              </div>

              {/* Two Column Section: Recent Orders & Recent Quotes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Recent Orders Box */}
                <div className="bg-white rounded-2xl border border-[#d4ebd4] overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-[#e6f3e6] flex items-center justify-between bg-[#fbfdfb]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#142918] flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-[#008000]" />
                      <span>Recent Orders ({orders.length})</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#008000] hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="divide-y divide-[#eaf5ea]">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#f6faf6] transition-colors">
                        <div>
                          <div className="font-bold text-[#142918]">
                            {order.buyerName || order.customerName} <span className="text-slate-500 font-normal">({order.companyName || order.customerCompany})</span>
                          </div>
                          <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                            {order.id} · {order.items.length} line items
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold font-mono text-[#008000]">
                            ${(order.total || order.totalAmount || 0).toLocaleString()}
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#eaf6ea] text-[#008000] border border-[#008000]/20 mt-1">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent RFQs Box */}
                <div className="bg-white rounded-2xl border border-[#d4ebd4] overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-[#e6f3e6] flex items-center justify-between bg-[#fbfdfb]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#142918] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#008000]" />
                      <span>Recent RFQs ({quotes.length})</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('quotes')}
                      className="text-xs font-bold text-[#008000] hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="divide-y divide-[#eaf5ea]">
                    {quotes.slice(0, 3).map(quote => (
                      <div key={quote.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#f6faf6] transition-colors">
                        <div>
                          <div className="font-bold text-[#142918]">{quote.name}</div>
                          <div className="text-slate-500 text-[11px]">{quote.company || quote.email} · {quote.category || quote.bagType}</div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            quote.status === 'New' 
                              ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                              : 'bg-[#eaf6ea] text-[#008000] border border-[#008000]/20'
                          }`}>
                            {quote.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ----------------------------------------------------
              TAB 2: PRODUCTS CATALOG (FULL CRUD)
             ---------------------------------------------------- */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeInUp">
              
              {/* Header & Controls Bar */}
              <div className="bg-white rounded-2xl p-6 border border-[#d4ebd4] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                
                {/* Search & Filter */}
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search bags by name, GSM, material..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-xs focus:outline-none focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                    />
                  </div>

                  <CustomSelect
                    value={filterCategory}
                    onChange={(val) => setFilterCategory(val)}
                    options={[
                      { value: 'all', label: 'All Categories' },
                      { value: 'non-woven', label: 'Non-Woven Totes' },
                      { value: 't-shirt', label: 'T-Shirt Bags' },
                      { value: 'd-cut', label: 'D-Cut Punch' },
                      { value: 'slider', label: 'Slider Zipper' },
                      { value: 'food', label: 'Food Item' }
                    ]}
                  />
                </div>

                {/* Add Product Button */}
                <button
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center justify-center gap-2 bg-[#008000] hover:bg-[#006800] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>

              </div>

              {/* Products Table (Clean White with #008000 Green Table Header) */}
              <div className="bg-white rounded-2xl border border-[#d4ebd4] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f0f8f0] text-[#008000] font-black uppercase tracking-wider text-[10px] border-b border-[#d4ebd4]">
                      <tr>
                        <th className="py-3.5 px-4">Product Visual & Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price (Unit)</th>
                        <th className="py-3.5 px-4">MOQ</th>
                        <th className="py-3.5 px-4">Thickness</th>
                        <th className="py-3.5 px-4 text-center">Stock Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaf5ea]">
                      {filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-[#f8faf8] transition-colors">
                          
                          {/* Visual & Title */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#f4faf4] border border-[#d4ebd4] p-1 flex items-center justify-center shrink-0">
                                <img
                                  src={prod.image || '/images/bag-green.png'}
                                  alt={prod.name}
                                  className="w-full h-full object-contain filter drop-shadow-2xs"
                                />
                              </div>
                              <div>
                                <span className="font-bold text-[#142918] block hover:text-[#008000] transition-colors">
                                  {prod.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {prod.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 font-semibold text-slate-600">
                            <span className="bg-[#eaf6ea] text-[#008000] px-2.5 py-1 rounded-full text-[10px] font-bold">
                              {prod.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 font-mono font-bold text-[#008000]">
                            ${prod.pricePerUnit.toFixed(2)}
                          </td>

                          {/* MOQ */}
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {prod.moq.toLocaleString()} pcs
                          </td>

                          {/* GSM */}
                          <td className="py-3.5 px-4 text-slate-600">
                            {prod.gsm} GSM
                          </td>

                          {/* Stock Toggle Button */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={async () => {
                                await toggleStock(prod.id);
                                showToast(`Stock status toggled for ${prod.name}`);
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                                prod.inStock
                                  ? 'bg-[#eaf6ea] text-[#008000] border-[#008000]/30 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              {prod.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-2 rounded-lg text-slate-600 hover:text-[#008000] hover:bg-[#eaf6ea] transition-colors cursor-pointer"
                                title="Edit Product Specs"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setProductToDelete(prod);
                                  setIsDeleteConfirmOpen(true);
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No products matched your search or category filter.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ----------------------------------------------------
              TAB 3: CATEGORIES MANAGER
             ---------------------------------------------------- */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-fadeInUp">
              
              <div className="bg-white rounded-2xl p-6 border border-[#d4ebd4] shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#142918]">Manufacturing Categories</h3>
                  <p className="text-xs text-slate-500">Live collections displayed in the horizontal category bar on the shop page.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white rounded-2xl border border-[#d4ebd4] p-5 shadow-sm hover:border-[#008000]/40 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase bg-[#eaf6ea] text-[#008000] px-2.5 py-1 rounded-full">
                          {cat.tag}
                        </span>
                        <span className="font-mono text-xs text-slate-500 font-bold">
                          {cat.count}
                        </span>
                      </div>

                      <div className="w-16 h-16 rounded-xl bg-[#f4faf4] border border-[#d4ebd4] p-2 flex items-center justify-center my-3">
                        <img src={cat.image} alt={cat.label} className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>

                      <h4 className="text-base font-bold text-[#142918]">{cat.label}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-3">{cat.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#eaf5ea] flex items-center justify-between text-xs text-[#008000] font-bold">
                      <span>ID: {cat.id}</span>
                      <span className="text-slate-400 font-normal">Active in Navbar</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ----------------------------------------------------
              TAB 4: CUSTOMER ORDERS MANAGER
             ---------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeInUp">
              
              <div className="bg-white rounded-2xl p-6 border border-[#d4ebd4] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#142918]">Customer Checkout Orders</h3>
                  <p className="text-xs text-slate-500">Live incoming procurement orders placed by enterprise buyers on the storefront.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Status Filter:</span>
                  <CustomSelect
                    value={orderStatusFilter}
                    onChange={(val) => setOrderStatusFilter(val)}
                    options={[
                      { value: 'all', label: 'All Orders' },
                      { value: 'Pending', label: 'Pending', dot: 'bg-amber-500' },
                      { value: 'In Production', label: 'In Production', dot: 'bg-purple-500' },
                      { value: 'Dispatched', label: 'Dispatched', dot: 'bg-sky-500' },
                      { value: 'Completed', label: 'Completed', dot: 'bg-emerald-500' },
                      { value: 'Cancelled', label: 'Cancelled', dot: 'bg-rose-500' }
                    ]}
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-[#d4ebd4] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f0f8f0] text-[#008000] font-black uppercase tracking-wider text-[10px] border-b border-[#d4ebd4]">
                      <tr>
                        <th className="py-3.5 px-4">Order Ref</th>
                        <th className="py-3.5 px-4">Buyer & Organization</th>
                        <th className="py-3.5 px-4">Facility Delivery Address</th>
                        <th className="py-3.5 px-4">Items Ordered</th>
                        <th className="py-3.5 px-4 text-right">Total ($)</th>
                        <th className="py-3.5 px-4 text-center">Status Action</th>
                        <th className="py-3.5 px-4 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaf5ea]">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-[#f8faf8] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#008000]">
                            {order.id}
                            <div className="text-[10px] text-slate-400 font-normal">{order.date || 'Recent'}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#142918]">{order.buyerName || order.customerName}</div>
                            <div className="text-slate-500 text-[11px]">{order.companyName || order.customerCompany}</div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                            {order.address || order.shippingAddress || 'Corona Facility Delivery'}
                          </td>

                          <td className="py-3.5 px-4 text-slate-600">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="truncate max-w-[180px]">
                                • {it.name || it.productName} ({it.quantity?.toLocaleString()} pcs)
                              </div>
                            ))}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#008000]">
                            ${(order.total || order.totalAmount || 0).toLocaleString()}
                          </td>

                          {/* Status Switcher Dropdown */}
                          <td className="py-3.5 px-4 text-center">
                            <StatusBadgeDropdown
                              value={order.status}
                              onChange={async (val) => {
                                await changeOrderStatus(order.id, val);
                                showToast(`Order ${order.id} status updated to "${val}"`);
                              }}
                              options={['Pending', 'In Production', 'Dispatched', 'Completed', 'Cancelled']}
                            />
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete order ${order.id}?`)) {
                                  await removeOrder(order.id);
                                  showToast(`Order ${order.id} deleted.`);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredOrders.length === 0 && (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No customer orders matching this status filter.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ----------------------------------------------------
              TAB 5: WHOLESALE RFQS & LEADS
             ---------------------------------------------------- */}
          {activeTab === 'quotes' && (
            <div className="space-y-6 animate-fadeInUp">
              
              <div className="bg-white rounded-2xl p-6 border border-[#d4ebd4] shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#142918]">Wholesale RFQ Leads</h3>
                  <p className="text-xs text-slate-500">Contact form and quote calculator submissions submitted by corporate procurement officers.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quotes.map(quote => (
                  <div key={quote.id} className="bg-white rounded-2xl border border-[#d4ebd4] p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#eaf5ea] mb-4">
                        <span className="font-mono text-xs font-bold text-[#008000]">
                          {quote.id}
                        </span>
                        
                        <StatusBadgeDropdown
                          value={quote.status}
                          onChange={async (val) => {
                            await changeQuoteStatus(quote.id, val);
                            showToast(`Quote ${quote.id} status updated to ${val}`);
                          }}
                          options={['New', 'Reviewed', 'Quotation Sent', 'Closed']}
                        />
                      </div>

                      <h4 className="text-base font-bold text-[#142918]">{quote.name}</h4>
                      <div className="text-xs text-slate-500 mt-1">
                        Company: <strong className="text-slate-700">{quote.company || 'Not Specified'}</strong>
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-[#f9fdf9] p-3 rounded-xl border border-[#e2ede2]">
                        <div>Email: <a href={`mailto:${quote.email}`} className="text-[#008000] font-semibold underline">{quote.email}</a></div>
                        {quote.phone && <div>Phone: <strong className="text-slate-800">{quote.phone}</strong></div>}
                        <div>Category: <strong className="text-slate-800">{quote.category || quote.bagType}</strong></div>
                        {quote.volume && <div>Estimated Volume: <strong className="text-[#008000]">{quote.volume}</strong></div>}
                        {quote.message && <div className="pt-2 text-slate-700 italic border-t border-[#e2ede2]">"{quote.message}"</div>}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#eaf5ea] flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{quote.date || 'Received recently'}</span>
                      <button
                        onClick={async () => {
                          if (window.confirm('Delete this RFQ lead?')) {
                            await removeQuote(quote.id);
                            showToast('Quote lead removed.');
                          }
                        }}
                        className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                      >
                        Delete Lead
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ----------------------------------------------------
              TAB 6: COMPREHENSIVE SITE CMS (EDIT EVERYTHING ON SITE)
             ---------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeInUp">
              
              <div className="bg-white rounded-2xl p-6 border border-[#d4ebd4] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#142918]">Live Website Content Management (CMS)</h3>
                  <p className="text-xs text-slate-500">Edit every headline, announcement banner, contact phone, email, facility address, and wholesale terms across the entire website.</p>
                </div>

                <button
                  onClick={handleSaveCmsSettings}
                  className="inline-flex items-center justify-center gap-2 bg-[#008000] hover:bg-[#006800] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish All Changes</span>
                </button>
              </div>

              {/* Sub-tabs for CMS Sections */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#d4ebd4]">
                <button
                  onClick={() => setSettingsSubTab('hero')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    settingsSubTab === 'hero'
                      ? 'bg-[#008000] text-white'
                      : 'bg-white text-slate-600 hover:bg-[#eaf6ea] hover:text-[#008000] border border-[#d4ebd4]'
                  }`}
                >
                  1. Homepage Hero & Top Banner
                </button>
                <button
                  onClick={() => setSettingsSubTab('contact')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    settingsSubTab === 'contact'
                      ? 'bg-[#008000] text-white'
                      : 'bg-white text-slate-600 hover:bg-[#eaf6ea] hover:text-[#008000] border border-[#d4ebd4]'
                  }`}
                >
                  2. Contact & Facility Addresses
                </button>
                <button
                  onClick={() => setSettingsSubTab('about')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    settingsSubTab === 'about'
                      ? 'bg-[#008000] text-white'
                      : 'bg-white text-slate-600 hover:bg-[#eaf6ea] hover:text-[#008000] border border-[#d4ebd4]'
                  }`}
                >
                  3. About Us & Mission Copy
                </button>
                <button
                  onClick={() => setSettingsSubTab('policies')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    settingsSubTab === 'policies'
                      ? 'bg-[#008000] text-white'
                      : 'bg-white text-slate-600 hover:bg-[#eaf6ea] hover:text-[#008000] border border-[#d4ebd4]'
                  }`}
                >
                  4. Wholesale Freight & Terms
                </button>
                <button
                  onClick={() => setSettingsSubTab('footer')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    settingsSubTab === 'footer'
                      ? 'bg-[#008000] text-white'
                      : 'bg-white text-slate-600 hover:bg-[#eaf6ea] hover:text-[#008000] border border-[#d4ebd4]'
                  }`}
                >
                  5. Footer & Legal Copy
                </button>
                <button
                  onClick={() => setSettingsSubTab('security')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    settingsSubTab === 'security'
                      ? 'bg-[#008000] text-white'
                      : 'bg-white text-slate-600 hover:bg-[#eaf6ea] hover:text-[#008000] border border-[#d4ebd4]'
                  }`}
                >
                  6. Admin Security & Password
                </button>
              </div>

              {/* Security Credentials Subtab OR CMS Form */}
              {settingsSubTab === 'security' ? (
                <form onSubmit={handleSaveSecurity} className="bg-white rounded-2xl border border-[#d4ebd4] p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-[#008000] font-bold text-xs uppercase tracking-wider mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Corporate Master Authentication Node</span>
                    </div>
                    <h4 className="text-base font-black text-[#142918]">Admin Account & Security Credentials</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Update your master administrator login email, administrative display title, and security access password.
                    </p>
                  </div>

                  {/* Status Feedback */}
                  {securitySuccess && (
                    <div className="p-4 rounded-xl bg-[#eaf6ea] border border-[#008000]/30 text-[#008000] text-xs font-semibold flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#008000]" />
                      <span>{securitySuccess}</span>
                    </div>
                  )}

                  {securityError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{securityError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Administrator Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={securityForm.name}
                        onChange={(e) => setSecurityForm({ ...securityForm, name: e.target.value })}
                        placeholder="e.g. Operations Director"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] font-medium focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Shown in top navigation & system logs</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Admin Login Email / Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={securityForm.email}
                        onChange={(e) => setSecurityForm({ ...securityForm, email: e.target.value })}
                        placeholder="admin@ecotexinc.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] font-medium focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Primary login identifier for /admin gateway</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#eaf5ea]">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#142918] mb-3 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#008000]" />
                      <span>Change Master Security Password</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          New Security Password
                        </label>
                        <input
                          type="password"
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          placeholder="Leave empty to keep current password"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Confirm New Security Password
                        </label>
                        <input
                          type="password"
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                          placeholder="Confirm password"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f4faf4] border border-[#d4ebd4] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#008000] animate-pulse" />
                      <span className="font-semibold text-[#142918]">Node.js Security Standard:</span>
                      <span>Persistent master authentication stored securely in server/db.json</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">SHA/HMAC Verified</span>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={securityLoading}
                      className="inline-flex items-center gap-2 bg-[#008000] hover:bg-[#006800] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {securityLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Updating Security Database...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Update Master Credentials</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* CMS Form Card */
                <form onSubmit={handleSaveCmsSettings} className="bg-white rounded-2xl border border-[#d4ebd4] p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Section 1: Hero & Announcements */}
                {settingsSubTab === 'hero' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[#142918] mb-1">Hero Section & Announcement Settings</h4>
                      <p className="text-xs text-slate-500">Edit the top announcement ticker and primary hero headlines seen on the homepage.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Homepage Hero Headline (Title)
                        </label>
                        <input
                          type="text"
                          value={cmsSettings.heroTitle}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, heroTitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm font-semibold text-[#142918] focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Hero Subtitle & Manufacturing Value Proposition
                        </label>
                        <textarea
                          rows={3}
                          value={cmsSettings.heroSubtitle}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, heroSubtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Hero Call-To-Action Button Text
                        </label>
                        <input
                          type="text"
                          value={cmsSettings.heroButtonText || 'Explore Collections'}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, heroButtonText: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm font-semibold text-[#142918] focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                        />
                      </div>

                      <div className="pt-4 border-t border-[#eaf5ea]">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Top Announcement Bar Copy
                        </label>
                        <input
                          type="text"
                          value={cmsSettings.announcement}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, announcement: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 2: Contact & Facilities */}
                {settingsSubTab === 'contact' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[#142918] mb-1">Corporate & Manufacturing Addresses</h4>
                      <p className="text-xs text-slate-500">Edit the direct telephone lines, support email, and physical facility coordinates.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Primary Support Phone
                        </label>
                        <input
                          type="text"
                          value={cmsSettings.phone}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Secondary Operations Line
                        </label>
                        <input
                          type="text"
                          value={cmsSettings.secondaryPhone || '+1 (951) 450-9773'}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, secondaryPhone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Procurement & Orders Email Address
                      </label>
                      <input
                        type="email"
                        value={cmsSettings.email}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Corona, California Warehouse / Fulfillment Center
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.facilityAddress}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, facilityAddress: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Karachi Manufacturing Facility Address
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.plantAddress || 'Sector 15, Korangi Industrial Area, Karachi, PK'}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, plantAddress: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                      />
                    </div>
                  </div>
                )}

                {/* Section 3: About Us */}
                {settingsSubTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[#142918] mb-1">About Us & Environmental Mission</h4>
                      <p className="text-xs text-slate-500">Edit the brand story and sustainability statements that appear on the About section.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        About Us Section Headline
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.aboutTitle || 'Engineered For Durability. Designed For Circularity.'}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, aboutTitle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm font-semibold text-[#142918] focus:border-[#008000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Mission Statement
                      </label>
                      <textarea
                        rows={3}
                        value={cmsSettings.aboutMission}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, aboutMission: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Company Story & Facilities Narrative
                      </label>
                      <textarea
                        rows={3}
                        value={cmsSettings.aboutStory}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, aboutStory: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                      />
                    </div>
                  </div>
                )}

                {/* Section 4: Wholesale Policies */}
                {settingsSubTab === 'policies' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[#142918] mb-1">Wholesale Freight & Order Lead Times</h4>
                      <p className="text-xs text-slate-500">Configure logistics terms shown in the Cart Drawer and Quote Calculator.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Freight & Pallet Shipping Notice
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.minOrderNotice}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, minOrderNotice: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Blank Stock Lead Time
                        </label>
                        <input
                          type="text"
                          value={cmsSettings.leadTimeBlank}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, leadTimeBlank: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Custom Silkscreen / Flexo Print Lead Time
                        </label>
                        <input
                          type="text"
                          value={cmsSettings.leadTimeCustom}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, leadTimeCustom: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 5: Footer & Legal */}
                {settingsSubTab === 'footer' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[#142918] mb-1">Footer Tagline & Legal Information</h4>
                      <p className="text-xs text-slate-500">Control the brand wordmark tagline and copyright notice displayed on the live footer.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Footer Slogan / Tagline
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.footerTagline}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, footerTagline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Copyright Notice Line
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.copyrightNotice}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, copyrightNotice: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-sm text-[#142918] focus:border-[#008000]"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-[#d4ebd4] flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#008000] hover:bg-[#006800] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Changes Live</span>
                  </button>
                </div>

              </form>
            )}

            </div>
          )}

        </main>

      </div>

      {/* ========================================================
          4. ADD / EDIT PRODUCT MODAL (PURE WHITE WITH #008000 GREEN)
         ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#d4ebd4] shadow-2xl p-6 sm:p-8 animate-fadeInUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#eaf5ea]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#eaf6ea] text-[#008000] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black uppercase text-[#142918]">
                  {editingProduct ? 'Edit Product Specifications' : 'Add New Manufacturing Model'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="py-4 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. The Ecotex Supermarket Tote"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-slate-900 font-medium focus:border-[#008000] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category *
                  </label>
                  <CustomSelect
                    value={formData.category}
                    onChange={(val) => setFormData({ ...formData, category: val as ProductCategory })}
                    options={[
                      { value: 'non-woven', label: 'Non-Woven Totes' },
                      { value: 't-shirt', label: 'T-Shirt Bags' },
                      { value: 'd-cut', label: 'D-Cut Punch' },
                      { value: 'slider', label: 'Slider Zipper' },
                      { value: 'food', label: 'Food Item' },
                      { value: 'biodegradable', label: 'Biodegradable PLA' }
                    ]}
                    className="w-full"
                    buttonClassName="w-full bg-[#fbfdfb] border-[#d4ebd4] text-slate-900 py-2.5 font-medium"
                  />
                </div>
              </div>

              {/* Subtitle / Value Prop */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Short Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Ultra high-tensile reusable vest carrier"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-slate-900 focus:border-[#008000] focus:outline-none"
                />
              </div>

              {/* Pricing, MOQ, GSM */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.05"
                    required
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] font-mono font-bold text-[#008000] focus:border-[#008000] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Minimum MOQ *
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="100"
                    required
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) || 100 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] font-mono text-slate-900 focus:border-[#008000] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fabric GSM *
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="200"
                    required
                    value={formData.gsm}
                    onChange={(e) => setFormData({ ...formData, gsm: parseInt(e.target.value) || 70 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] font-mono text-slate-900 focus:border-[#008000] focus:outline-none"
                  />
                </div>
              </div>

              {/* Dimensions & Material */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Dimensions (W x H x D)
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="12 x 14 x 4 Gusset"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-slate-900 focus:border-[#008000] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Material Specification
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Virgin Non-Woven Polypropylene"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-slate-900 focus:border-[#008000] focus:outline-none"
                  />
                </div>
              </div>

              {/* Visual Bag Image Selection */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Visual Bag Preset or Enter Image URL
                </label>
                <div className="grid grid-cols-5 gap-2.5 mb-2">
                  {[
                    { img: '/images/bag-green.png', label: 'Green Eco' },
                    { img: '/images/bag-white.png', label: 'Pure White' },
                    { img: '/images/bag-black.png', label: 'Luxury Black' },
                    { img: '/images/bag-orange.png', label: 'Bio Orange' },
                    { img: '/images/bag-blue.png', label: 'Cobalt Blue' },
                  ].map((preset) => (
                    <button
                      key={preset.img}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.img })}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        formData.image === preset.img
                          ? 'border-[#008000] bg-[#eaf6ea] ring-2 ring-[#008000]/30 shadow-xs'
                          : 'border-[#d4ebd4] bg-white hover:bg-slate-50'
                      }`}
                    >
                      <img src={preset.img} alt={preset.label} className="w-8 h-8 object-contain" />
                      <span className="text-[9px] font-bold text-slate-600">{preset.label}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or paste custom image URL (https://...)"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#d4ebd4] bg-[#fbfdfb] text-slate-700 text-xs focus:border-[#008000] focus:outline-none font-mono"
                />
              </div>

              {/* Stock Status Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded text-[#008000] focus:ring-[#008000] accent-[#008000] cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="font-bold text-slate-800 cursor-pointer select-none">
                  Available in Live Production Stock
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#eaf5ea] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#d4ebd4] text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#008000] hover:bg-[#006800] text-white font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  {editingProduct ? 'Save Product' : 'Create Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================
          5. DELETE CONFIRMATION MODAL
         ======================================================== */}
      {isDeleteConfirmOpen && productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-red-200 p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4 animate-fadeInUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#142918]">Delete Product?</h4>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently remove <strong>{productToDelete.name}</strong> from the database and live storefront?
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
