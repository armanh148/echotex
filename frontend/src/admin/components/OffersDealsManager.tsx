'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Tag, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Save, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  Percent, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  ShoppingBag,
  Sliders,
  Check
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product, DealConfig } from '../../types';
import { ImageUploader } from './ImageUploader';

const DEFAULT_DEAL_CONFIG: DealConfig = {
  enabled: true,
  productId: '',
  badge: 'ECO CHOICE',
  title: "Grab It Before\nIt's Gone!",
  subtitle: 'Commercial Wholesale Series',
  buttonText: 'SHOP THE DEAL',
  offerPrice: 0.25,
  originalPrice: 0.36,
  stockText: 'Ready for Immediate Dispatch',
  stockProgressPercent: 78,
  timerHours: 8,
  timerMinutes: 12,
  timerSeconds: 45
};

const PRESET_BADGES = [
  'ECO CHOICE',
  'DEAL OF THE DAY',
  'FLASH WHOLESALE DEAL',
  'LIMITED TIME OFFER',
  '50% OFF SPECIAL',
  'HOT SELLER',
  'CLEARANCE SALE'
];

export const OffersDealsManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, products } = useStore();
  const currentDeal = siteSettings?.dealConfig || DEFAULT_DEAL_CONFIG;

  const [formData, setFormData] = useState<DealConfig>({
    ...DEFAULT_DEAL_CONFIG,
    ...currentDeal,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Sync when store updates
  useEffect(() => {
    if (siteSettings?.dealConfig) {
      setFormData((prev) => ({
        ...prev,
        ...siteSettings.dealConfig
      }));
    }
  }, [siteSettings?.dealConfig]);

  // Selected Product reference
  const selectedProduct: Product | undefined = React.useMemo(() => {
    if (formData.productId) {
      const found = products.find((p) => p.id === formData.productId);
      if (found) return found;
    }
    return products[0];
  }, [formData.productId, products]);

  // Real-time local preview ticker for the 4 boxes
  const [previewTime, setPreviewTime] = useState({
    hours: formData.timerHours || 8,
    minutes: formData.timerMinutes || 12,
    seconds: formData.timerSeconds || 45,
    milliseconds: 91
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewTime((prev) => {
        let ms = prev.milliseconds - 1;
        let s = prev.seconds;
        let m = prev.minutes;
        let h = prev.hours;

        if (ms < 0) {
          ms = 99;
          s -= 1;
        }
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = formData.timerHours || 8;
          m = formData.timerMinutes || 12;
          s = formData.timerSeconds || 45;
        }
        return { hours: h, minutes: m, seconds: s, milliseconds: ms };
      });
    }, 42);

    return () => clearInterval(interval);
  }, [formData.timerHours, formData.timerMinutes, formData.timerSeconds]);

  // Handle selecting a product from catalog
  const handleSelectProduct = (product: Product) => {
    setFormData((prev) => ({
      ...prev,
      productId: product.id,
      subtitle: product.subtitle || product.categoryLabel || prev.subtitle,
      offerPrice: product.pricePerUnit,
      originalPrice: Number((product.pricePerUnit * 1.45).toFixed(2)),
      customImage: product.image || prev.customImage,
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteSettings({
      dealConfig: formData
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetToDefault = () => {
    if (!window.confirm('Reset Offer Product & Deal settings to factory defaults?')) return;
    setFormData(DEFAULT_DEAL_CONFIG);
    updateSiteSettings({
      dealConfig: DEFAULT_DEAL_CONFIG
    });
  };

  // Filtered products for selector
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q))
    );
  });

  // Calculate discount percentage
  const currentOfferPrice = Number(formData.offerPrice || selectedProduct?.pricePerUnit || 0.25);
  const currentOriginalPrice = Number(formData.originalPrice || (currentOfferPrice * 1.45));
  const discountPercent = currentOriginalPrice > currentOfferPrice
    ? Math.round(((currentOriginalPrice - currentOfferPrice) / currentOriginalPrice) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B2E2C5]/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2.5 rounded-xl bg-orange-100 text-[#FF5722] shadow-2xs">
              <Flame className="w-5 h-5 fill-current" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5722] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              SPECIAL PROMOTIONS & DEALS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Offer Products & Flash Deal Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure the prominent Deal of the Day / Special Offer banner on your storefront. Select any product from your catalog, set custom discount prices, urgency countdown timers, and promotional copy.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#22c55e] hover:from-[#15803d] hover:to-[#16a34a] text-white text-xs font-black tracking-wide uppercase shadow-lg shadow-green-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>SAVED!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE & PUBLISH</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-5 py-3.5 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold shadow-xs animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Offer section updated successfully! Live website reflects this active offer right now.</span>
        </div>
      )}

      {/* ========================================================
          1. LIVE STOREFRONT PREVIEW (MATCHES USER SCREENSHOT EXACTLY)
         ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">
              Live Storefront Preview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${formData.enabled ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-xs font-bold text-slate-600">
              {formData.enabled ? 'Section is VISIBLE on site' : 'Section is HIDDEN on site'}
            </span>
          </div>
        </div>

        {/* The Exact Banner Card */}
        <div className="w-full rounded-[32px] sm:rounded-[40px] bg-[#FFF5ED] border border-[#FFE0CC] p-6 sm:p-10 lg:p-12 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Deal Copy & CTA */}
            <div className="lg:col-span-5 flex flex-col text-left">
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#FF5722] mb-3 block">
                {formData.badge || 'ECO CHOICE'}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-[1.08] mb-4 whitespace-pre-line">
                {formData.title || "Grab It Before\nIt's Gone!"}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 mb-6 font-medium max-w-md">
                {formData.subtitle || selectedProduct?.subtitle || 'Commercial Wholesale Series'}
              </p>
              <div>
                <button
                  type="button"
                  className="bg-[#FF5722] hover:bg-[#e64a19] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-lg shadow-[#FF5722]/35 transition-all cursor-pointer pointer-events-none"
                >
                  <span>{formData.buttonText || 'SHOP THE DEAL'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Right Column: Clean White Product Card with Stock Bar & 4 Timer Boxes */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-200/70 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                
                {/* Product Thumbnail */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 bg-stone-50 rounded-2xl flex items-center justify-center p-3 shrink-0 overflow-hidden border border-stone-100">
                  <img
                    src={formData.customImage || selectedProduct?.image || '/images/bag-blue.png'}
                    alt={selectedProduct?.name || 'Offer Product'}
                    className="w-full h-full object-contain filter drop-shadow-md select-none"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/bag-blue.png';
                    }}
                  />
                </div>

                {/* Details Column */}
                <div className="flex-1 w-full text-left">
                  <h3 className="font-extrabold text-lg sm:text-xl text-stone-900 mb-1">
                    {selectedProduct?.name || 'Select a Product Below'}
                  </h3>
                  <p className="text-xs text-stone-500 mb-3 line-clamp-2">
                    {selectedProduct?.subtitle || selectedProduct?.description || 'Commercial Wholesale Series'}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2.5 mb-4">
                    <span className="text-2xl sm:text-3xl font-black text-[#FF5722]">
                      ${currentOfferPrice.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-stone-400 line-through">
                      ${currentOriginalPrice.toFixed(2)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Stock Bar */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-stone-700 mb-1.5">
                      {formData.stockText || 'Ready for Immediate Dispatch'}
                    </p>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div 
                        className="h-full bg-[#FF5722] rounded-full transition-all duration-500" 
                        style={{ width: `${formData.stockProgressPercent || 78}%` }}
                      />
                    </div>
                  </div>

                  {/* 4 Square Countdown Timer Boxes */}
                  <div className="grid grid-cols-4 gap-2.5 max-w-xs">
                    
                    {/* HRS */}
                    <div className="rounded-xl border border-stone-200/90 bg-stone-50/80 p-2 text-center">
                      <span className="font-mono font-black text-base sm:text-lg text-stone-900 leading-none block">
                        {String(previewTime.hours).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block mt-1">
                        HRS
                      </span>
                    </div>

                    {/* MINS */}
                    <div className="rounded-xl border border-stone-200/90 bg-stone-50/80 p-2 text-center">
                      <span className="font-mono font-black text-base sm:text-lg text-stone-900 leading-none block">
                        {String(previewTime.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block mt-1">
                        MINS
                      </span>
                    </div>

                    {/* SECS */}
                    <div className="rounded-xl border border-stone-200/90 bg-stone-50/80 p-2 text-center">
                      <span className="font-mono font-black text-base sm:text-lg text-stone-900 leading-none block">
                        {String(previewTime.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block mt-1">
                        SECS
                      </span>
                    </div>

                    {/* MSEC */}
                    <div className="rounded-xl border border-stone-200/90 bg-stone-50/80 p-2 text-center">
                      <span className="font-mono font-black text-base sm:text-lg text-[#FF5722] leading-none block">
                        {String(previewTime.milliseconds).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block mt-1">
                        MSEC
                      </span>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          2. FORM SETTINGS & PRODUCT SELECTOR
         ======================================================== */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Visibility Toggle */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Enable Offer / Deal Section on Website
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Turn this OFF if you want to temporarily hide the Deal banner without losing your settings.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#22c55e]"></div>
          </label>
        </div>

        {/* 1. Pick the Offer Product */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                1. Select Product for this Offer
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Total {products.length} products available
            </span>
          </div>

          {/* Search box for catalog */}
          <input
            type="text"
            placeholder="Type to filter catalog products (e.g. non-woven, shahu bondu)..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
          />

          {/* Product Cards Picker Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-72 overflow-y-auto p-1 border border-slate-100 rounded-2xl">
            {filteredProducts.map((p) => {
              const isSelected = (formData.productId === p.id) || (!formData.productId && selectedProduct?.id === p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#16a34a] bg-emerald-50/70 shadow-xs ring-2 ring-[#16a34a]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={p.image || '/images/bag-green.png'}
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {p.categoryLabel || p.subtitle} · ${p.pricePerUnit.toFixed(2)}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Offer Banner Headlines & Badges */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              2. Banner Headlines & Badge
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Badge input with quick presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Offer Badge Text
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-[#FF5722] bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. ECO CHOICE or 50% OFF"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BADGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData({ ...formData, badge: b })}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:text-[#FF5722] transition-colors"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
                placeholder="e.g. SHOP THE DEAL"
              />
            </div>

            {/* Main Headline */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Main Headline (Tip: use Enter for new line)
              </label>
              <textarea
                rows={2}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
                placeholder="Grab It Before&#10;It's Gone!"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
                placeholder="Commercial Wholesale Series"
              />
            </div>
          </div>
        </div>

        {/* 3. Offer Pricing & Discount */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              3. Offer Pricing & Discount
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Offer Sale Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Offer Sale Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.offerPrice || ''}
                  onChange={(e) => setFormData({ ...formData, offerPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-black text-[#FF5722] bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="0.25"
                />
              </div>
            </div>

            {/* Regular / Strikethrough Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Original Price ($) (Strikethrough)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
                  placeholder="0.36"
                />
              </div>
            </div>

            {/* Calculated Discount Info */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Calculated Discount
              </label>
              <div className="h-10 rounded-xl bg-orange-50 border border-orange-200 px-4 flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#FF5722]" />
                <span className="text-xs font-black text-[#FF5722]">
                  {discountPercent}% OFF
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Urgency Countdown & Stock Progress */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              4. Countdown Timer & Stock Bar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Timer Hours */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Timer Hours
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={formData.timerHours}
                onChange={(e) => setFormData({ ...formData, timerHours: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold bg-slate-50"
              />
            </div>

            {/* Timer Minutes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Timer Minutes
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={formData.timerMinutes}
                onChange={(e) => setFormData({ ...formData, timerMinutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold bg-slate-50"
              />
            </div>

            {/* Timer Seconds */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Timer Seconds
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={formData.timerSeconds}
                onChange={(e) => setFormData({ ...formData, timerSeconds: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold bg-slate-50"
              />
            </div>

            {/* Quick Timer Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Quick Presets
              </label>
              <div className="flex items-center gap-1.5 pt-0.5">
                {[6, 12, 24, 48].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setFormData({ ...formData, timerHours: h, timerMinutes: 0, timerSeconds: 0 })}
                    className="flex-1 text-[11px] font-bold py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-[#16a34a] hover:text-white transition-colors"
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Bar Text */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Stock Status Text
              </label>
              <input
                type="text"
                value={formData.stockText}
                onChange={(e) => setFormData({ ...formData, stockText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
                placeholder="Ready for Immediate Dispatch"
              />
            </div>

            {/* Stock Progress Percent */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Stock Claimed Bar (%)
                </label>
                <span className="text-xs font-bold text-[#FF5722]">
                  {formData.stockProgressPercent}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={formData.stockProgressPercent}
                onChange={(e) => setFormData({ ...formData, stockProgressPercent: parseInt(e.target.value) || 78 })}
                className="w-full accent-[#FF5722] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 5. Custom Promo Image (Optional override) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                5. Custom Promo Image (Optional)
              </h3>
              <p className="text-xs text-slate-500">
                By default, the selected product's image is used. You can upload or paste a custom promotional cutout image here.
              </p>
            </div>
            {formData.customImage && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, customImage: undefined })}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                Reset to product image
              </button>
            )}
          </div>

          <ImageUploader
            currentImage={formData.customImage || selectedProduct?.image}
            onImageSelect={(url) => setFormData({ ...formData, customImage: url })}
            label="Upload Custom Offer Product Image"
          />
        </div>

        {/* Bottom Save Bar */}
        <div className="sticky bottom-6 z-30 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-2xl flex items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                Ready to publish this offer?
              </p>
              <p className="text-[11px] text-slate-400">
                Saving will instantly update the live Deal banner for all storefront visitors.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 sm:px-8 py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-slate-950 font-black text-xs sm:text-sm tracking-wide uppercase transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {saveSuccess ? 'OFFER PUBLISHED!' : 'PUBLISH OFFER NOW'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default OffersDealsManager;
