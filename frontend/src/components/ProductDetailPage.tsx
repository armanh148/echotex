'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ArrowLeft,
  ArrowRight, 
  Minus, 
  Plus,
  Share2,
  AlertCircle
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onNavigateHome: () => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale') => void;
  onOpenQuote: (product: Product) => void;
  onExpressCheckout?: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale') => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onNavigateHome,
  onAddToCart,
  onOpenQuote,
  onExpressCheckout
}) => {
  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [orderType, setOrderType] = useState<'retail' | 'wholesale'>('retail');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [addedToast, setAddedToast] = useState(false);

  // Wholesale minimum order quantity starts at 5 pcs and goes in multiples of 5
  const wholesaleMoq = 5;

  const minQuantity = orderType === 'wholesale' ? wholesaleMoq : 1;
  const maxQuantity = orderType === 'retail' ? 5 : 100000;
  const [moqWarning, setMoqWarning] = useState<string | null>(null);

  // Scroll to top on mount or when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setMoqWarning(null);
    setQuantity(orderType === 'retail' ? 1 : wholesaleMoq);
  }, [product, orderType, wholesaleMoq]);

  // Product transparent cutout bag
  const bagCutout = product.image || (
    product.id.includes('tshirt') || product.id.includes('loop') ? '/images/bag-green.png' :
    product.id.includes('dcut') || product.id.includes('punch') ? '/images/bag-orange.png' :
    product.id.includes('box') || product.id.includes('heavy') ? '/images/bag-black.png' :
    product.id.includes('laminated') || product.id.includes('boutique') ? '/images/bag-white.png' :
    '/images/bag-blue.png'
  );

  // 4 Gallery images tailored for this product
  const galleryImages = [
    { 
      url: bagCutout, 
      label: 'Front Product Shot',
      badge: 'Studio Cutout'
    },
    { 
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85', 
      label: 'Lifestyle Editorial',
      badge: 'Editorial'
    },
    { 
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85', 
      label: 'Fabric Macro & Seam',
      badge: 'Macro Seam'
    },
    { 
      url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85', 
      label: 'Production Detail',
      badge: 'Workshop'
    }
  ];

  // Pricing calculations
  const retailUnitPrice = product.pricePerUnit ? (product.pricePerUnit * 1.45) : 0.45;
  const wholesaleUnitPrice = product.pricePerUnit || 0.25;
  const currentPrice = orderType === 'retail' ? retailUnitPrice : wholesaleUnitPrice;
  const originalPrice = (currentPrice * 1.25);

  const handleIncrement = () => {
    if (orderType === 'retail') {
      if (quantity >= 5) {
        setMoqWarning('Retail orders are limited to a maximum of 5 units. For larger orders, please switch to Wholesale Order.');
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      setQuantity(prev => Math.min(5, prev + 1));
    } else {
      // Wholesale: step of 5
      setQuantity(prev => {
        if (prev < 5) return 5;
        if (prev % 5 !== 0) return Math.floor(prev / 5) * 5 + 5;
        return prev + 5;
      });
    }
    setMoqWarning(null);
  };

  const handleDecrement = () => {
    if (orderType === 'retail') {
      setQuantity(prev => Math.max(1, prev - 1));
    } else {
      // Wholesale: step of 5, minimum 5
      setQuantity(prev => {
        if (prev <= 5) return 5;
        if (prev % 5 !== 0) return Math.max(5, Math.floor(prev / 5) * 5);
        return Math.max(5, prev - 5);
      });
    }
    setMoqWarning(null);
  };

  const handleAddToCartClick = () => {
    if (orderType === 'wholesale') {
      if (quantity < wholesaleMoq) {
        setMoqWarning(`Wholesale minimum order quantity is ${wholesaleMoq} pcs.`);
        setQuantity(wholesaleMoq);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      if (quantity % 5 !== 0) {
        const rounded = Math.ceil(quantity / 5) * 5;
        setMoqWarning(`Wholesale orders must be in multiples of 5. Updated to ${rounded} pcs.`);
        setQuantity(rounded);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
    }
    if (orderType === 'retail' && quantity > 5) {
      setMoqWarning('Retail orders are limited to a maximum of 5 units. Please switch to Wholesale Order for larger quantities.');
      setQuantity(5);
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    setMoqWarning(null);
    onAddToCart(product, product.availableColors?.[0]?.hex || '#166534', quantity, orderType);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleExpressCheckout = () => {
    if (orderType === 'wholesale') {
      if (quantity < wholesaleMoq) {
        setMoqWarning(`Wholesale minimum order quantity is ${wholesaleMoq} pcs.`);
        setQuantity(wholesaleMoq);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      if (quantity % 5 !== 0) {
        const rounded = Math.ceil(quantity / 5) * 5;
        setMoqWarning(`Wholesale orders must be in multiples of 5. Updated to ${rounded} pcs.`);
        setQuantity(rounded);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
    }
    if (orderType === 'retail' && quantity > 5) {
      setMoqWarning('Retail orders are limited to a maximum of 5 units. Please switch to Wholesale Order for larger quantities.');
      setQuantity(5);
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    setMoqWarning(null);
    const selectedColor = product.availableColors?.[0]?.hex || '#166534';
    if (onExpressCheckout) {
      onExpressCheckout(product, selectedColor, quantity, orderType);
    } else {
      onAddToCart(product, selectedColor, quantity, orderType);
    }
  };

  return (
    <div className="w-full bg-[#fbfcfb] text-[#111827] min-h-screen py-6 sm:py-10 selection:bg-[#166534] selection:text-white animate-fadeInUp">
      
      {/* Maximum Container matching Reference Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Top Breadcrumb Header Bar */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-10 flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest overflow-hidden text-ellipsis whitespace-nowrap">
            <button 
              onClick={onNavigateHome} 
              className="hover:text-[#166534] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span className="text-slate-300">&gt;</span>
            <button 
              onClick={onBack} 
              className="hover:text-[#166534] transition-colors cursor-pointer"
            >
              COLLECTIONS
            </button>
            <span className="text-slate-300">&gt;</span>
            <span className="text-[#111827] font-bold truncate">
              {product.name}
            </span>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:text-[#14532d] uppercase tracking-wider transition-colors cursor-pointer ml-4 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Shop</span>
          </button>
        </nav>

        {/* Main 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* ========================================================
              LEFT COLUMN: MAIN SHOWCASE IMAGE & 4-THUMBNAIL GALLERY
             ======================================================== */}
          <div className="lg:col-span-6 flex flex-col">
            
            {/* Main Image Frame (Rounded-3xl, Drop Shadow, Heart Button, Brand Watermark) */}
            <div className="relative w-full aspect-[4/5] bg-white rounded-[28px] sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl flex items-center justify-center p-6 sm:p-10 group">
              
              {/* Product Visual */}
              <img
                src={galleryImages[activeImageIndex].url}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-md transition-all duration-500 group-hover:scale-105 select-none"
              />

              {/* Floating Circular Wishlist Button (Top Right) */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Save to Wishlist"
                className="absolute top-5 right-5 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-red-500 transition-all active:scale-90 cursor-pointer z-10"
              >
                <Heart className={`w-5 h-5 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'
                }`} />
              </button>

              {/* Brand Signature Logo Watermark (Bottom Left - Replicating Reference Image) */}
              <div className="absolute bottom-5 left-6 select-none opacity-75 pointer-events-none">
                <div className="flex items-center gap-1.5 text-slate-800">
                  <span className="font-serif italic font-bold text-2xl tracking-tighter">E</span>
                  <div className="flex flex-col -space-y-1">
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase text-slate-800 font-sans">
                      ECOTEX
                    </span>
                    <span className="text-[7px] font-bold tracking-[0.3em] uppercase text-slate-500 font-sans">
                      ORIGINALS
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 4 Thumbnails Gallery Strip */}
            <div className="mt-4 sm:mt-5 grid grid-cols-4 gap-3 sm:gap-4">
              {galleryImages.map((thumb, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white p-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-2 border-[#d97706] shadow-md ring-2 ring-amber-500/20 scale-102'
                        : 'border border-slate-200/90 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={thumb.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: EDITORIAL DETAILS, CONTROLS, SPECS
             ======================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Category Label & Rating */}
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#d97706]">
                {product.categoryLabel || 'SUSTAINABLE NON-WOVEN'}
              </span>
              <span className="text-slate-300 font-light">—</span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#d97706]">
                <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                <span>4.9</span>
              </div>
            </div>

            {/* Product Title (Luxury Editorial Serif Font) */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#111827] tracking-tight leading-[1.12] [text-wrap:balance]">
              {product.name}
            </h1>

            {/* Article No. & Volume No. Metadata */}
            <div className="mt-4 flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider pb-4 border-b border-slate-200/70">
              <div>
                <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">
                  ARTICLE NO.
                </span>
                <span className="font-bold text-[#111827]">
                  EP-{product.id.slice(0, 6).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">
                  VOLUME NO.
                </span>
                <span className="font-bold text-[#111827]">
                  {product.gsm} GSM LUXURY
                </span>
              </div>
            </div>

            {/* Product Editorial Description */}
            <p className="mt-5 text-sm sm:text-[15px] text-[#4b5563] leading-relaxed font-light">
              {product.description || 'Discover the pinnacle of elegance with this masterfully crafted piece. Part of our exclusive Heritage Collection, it embodies the perfect blend of traditional artistry and modern sophistication.'}
            </p>

            {/* Segmented Switcher Pill: RETAIL ORDER vs WHOLESALE ORDER */}
            <div className="mt-6 p-1 bg-[#f3f4f6] rounded-xl inline-flex w-full sm:w-auto self-start border border-slate-200/60">
              <button
                type="button"
                onClick={() => setOrderType('retail')}
                className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  orderType === 'retail'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-slate-500 hover:text-[#111827]'
                }`}
              >
                Retail Order
              </button>
              <button
                type="button"
                onClick={() => setOrderType('wholesale')}
                className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  orderType === 'wholesale'
                    ? 'bg-white text-[#166534] shadow-sm'
                    : 'text-slate-500 hover:text-[#111827]'
                }`}
              >
                Wholesale Order
              </button>
            </div>

            {/* Price Box */}
            <div className="mt-4 py-3.5 px-6 bg-[#f8faf9] rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
              <span className="font-bold text-3xl sm:text-4xl text-[#d97706] font-mono tracking-tight">
                ${currentPrice.toFixed(2)}
              </span>
              <span className="text-base font-mono text-slate-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              {orderType === 'wholesale' && (
                <span className="ml-auto text-xs font-bold text-[#166534] bg-[#dcfce7] px-3 py-1 rounded-full font-mono">
                  MOQ: {wholesaleMoq} pcs (Multiples of 5)
                </span>
              )}
            </div>

            {/* Explicit Quantity Label & Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span>Order Quantity</span>
                  {orderType === 'retail' ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      RETAIL LIMIT: 1 – 5 PCS MAX
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#166534] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      WHOLESALE MOQ: 5 PCS · MULTIPLES OF 5
                    </span>
                  )}
                </label>
                <span className="font-mono text-xs font-bold text-[#166534]">
                  Total: {quantity.toLocaleString()} {quantity === 1 ? 'unit' : 'units'}
                </span>
              </div>

              {/* Quantity Stepper & ADD TO CART Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Stepper with Editable Input */}
                <div className="w-full sm:w-44 h-12 rounded-xl border border-slate-300 bg-white flex items-center justify-between px-2 shadow-xs">
                  <button
                    type="button"
                    disabled={quantity <= minQuantity}
                    onClick={handleDecrement}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      quantity <= minQuantity
                        ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                        : 'text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer'
                    }`}
                    aria-label="Decrease quantity"
                    title={quantity <= minQuantity ? `Minimum order is ${minQuantity} pcs` : 'Decrease'}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    step={orderType === 'wholesale' ? 5 : 1}
                    min={minQuantity}
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val)) {
                        setQuantity(minQuantity);
                      } else {
                        if (orderType === 'retail' && val > 5) {
                          setQuantity(5);
                          setMoqWarning('Retail orders are limited to a maximum of 5 units. For bulk orders, please select Wholesale Order.');
                          setTimeout(() => setMoqWarning(null), 4000);
                        } else {
                          setQuantity(val);
                          setMoqWarning(null);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (quantity < minQuantity) {
                        setQuantity(minQuantity);
                      } else if (orderType === 'retail' && quantity > 5) {
                        setQuantity(5);
                      } else if (orderType === 'wholesale' && quantity % 5 !== 0) {
                        const rounded = Math.max(5, Math.ceil(quantity / 5) * 5);
                        setQuantity(rounded);
                        setMoqWarning(`Wholesale orders must be in multiples of 5 (adjusted to ${rounded} pcs).`);
                        setTimeout(() => setMoqWarning(null), 4000);
                      }
                    }}
                    className="w-20 text-center font-mono font-bold text-sm text-[#111827] focus:outline-none bg-transparent"
                    aria-label="Quantity amount"
                  />
                  <button
                    type="button"
                    disabled={orderType === 'retail' && quantity >= 5}
                    onClick={handleIncrement}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      orderType === 'retail' && quantity >= 5
                        ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                        : 'text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer'
                    }`}
                    aria-label="Increase quantity"
                    title={orderType === 'retail' && quantity >= 5 ? 'Retail order limit is 5 units' : (orderType === 'wholesale' ? 'Increase by 5' : 'Increase')}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* ADD TO CART Button (Solid Black with ShoppingBag icon) */}
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="w-full sm:flex-1 h-12 bg-[#0f172a] hover:bg-[#166534] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart ({quantity.toLocaleString()} pcs)</span>
                </button>
              </div>

              {/* Wholesale Quick Select Presets (All Multiples of 5 starting from 5) */}
              {orderType === 'wholesale' && (
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick:</span>
                  {[5, 10, 25, 50, 100, 250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setQuantity(preset);
                        setMoqWarning(null);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                        quantity === preset
                          ? 'bg-[#166534] text-white border-[#166534] font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      {preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              )}

              {/* Validation Warning Alert */}
              {moqWarning && (
                <div className="mt-2.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{moqWarning}</span>
                </div>
              )}

              {/* Retail Policy Banner */}
              {orderType === 'retail' && !moqWarning && (
                <div className="mt-2 text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/70 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Retail order policy: <strong>1 se 5 units maximum</strong>. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar <strong>Wholesale Order</strong> select karein.</span>
                </div>
              )}

              {/* Wholesale Policy Banner */}
              {orderType === 'wholesale' && !moqWarning && (
                <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Wholesale order: starting <strong>5 pcs</strong> se hai aur sabhi orders <strong>5 ke multiples</strong> mein place hote hain (5, 10, 15, 20...).</span>
                </div>
              )}
            </div>

            {/* EXPRESS CHECKOUT Button */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleExpressCheckout}
                className="w-full h-12 rounded-xl border-2 border-[#0f172a] hover:bg-[#0f172a] hover:text-white text-[#0f172a] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 cursor-pointer"
              >
                <span>→ Express Checkout</span>
              </button>
            </div>

            {/* 3 Trust Badges Row */}
            <div className="mt-8 pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Fast Delivery
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Secure Store
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Easy Return
                </span>
              </div>
            </div>

            {/* Tabs: DESCRIPTION | DETAILS | REVIEWS */}
            <div className="mt-10 pt-6 border-t border-slate-200/70">
              <div className="flex items-center gap-8 border-b border-slate-200/70 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('description')}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 transition-colors cursor-pointer ${
                    activeTab === 'description'
                      ? 'text-[#d97706] border-b-2 border-[#d97706]'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 transition-colors cursor-pointer ${
                    activeTab === 'details'
                      ? 'text-[#d97706] border-b-2 border-[#d97706]'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 transition-colors cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'text-[#d97706] border-b-2 border-[#d97706]'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Reviews
                </button>
              </div>

              {/* Tab Content: Clean Specifications Bullet List */}
              <div className="pt-5 text-xs text-slate-600 leading-relaxed">
                {activeTab === 'description' && (
                  <ul className="space-y-2 font-light">
                    <li>• <strong className="font-semibold text-slate-800">BRAND NAME :</strong> ECOTEX INC.</li>
                    <li>• <strong className="font-semibold text-slate-800">Fabric :</strong> {product.gsm} GSM Virgin Non-Woven Polypropylene</li>
                    <li>• <strong className="font-semibold text-slate-800">Dimensions :</strong> {product.dimensions || '12"W x 15"H with Reinforced Gusset'}</li>
                    <li>• <strong className="font-semibold text-slate-800">Handles :</strong> Ultrasonic Thermal Welded Loops</li>
                    <li>• <strong className="font-semibold text-slate-800">Printing :</strong> High-Precision Flexographic / Gravure Custom Imprint</li>
                    <li>• <strong className="font-semibold text-slate-800">Compliance :</strong> Certified California SB 270 & ASTM D6400</li>
                    <li>• <strong className="font-semibold text-slate-800">Bag & Picture Packing :</strong> Export-Grade Heavy Duty Corrugated Cartons</li>
                    <li>• <strong className="font-semibold text-slate-800">Guaranteed Fabric :</strong> 100% Virgin Grade Recyclable Polypropylene</li>
                    <li>• <strong className="font-semibold text-slate-800">Enroute to Quality Standard</strong></li>
                  </ul>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-2.5">
                    <p><strong className="font-semibold text-slate-800">Material Composition:</strong> {product.material || '100% Virgin Non-Woven Polypropylene'}</p>
                    <p><strong className="font-semibold text-slate-800">Load Capacity:</strong> {product.capacity || 'Up to 25 lbs (11.5 kg)'}</p>
                    <p><strong className="font-semibold text-slate-800">Minimum Order Quantity:</strong> {product.moq} Units</p>
                    <p><strong className="font-semibold text-slate-800">Production Lead Time:</strong> {product.leadTime || '3-5 business days stock, 2-3 weeks custom'}</p>
                    <p><strong className="font-semibold text-slate-800">Environmental Certifications:</strong> {product.certifications?.join(', ') || 'GRS, CalRecycle SB 270'}</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3 italic">
                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                      <p className="text-slate-700">"Superb build quality! Not a single torn handle across 50,000 retail units in California."</p>
                      <span className="text-[10px] font-bold text-[#166534] not-italic block mt-1">— Verified Regional Grocery Client</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                      <p className="text-slate-700">"The custom flexo print color is exactly our brand pantone. Cleanest packaging we have ever sourced."</p>
                      <span className="text-[10px] font-bold text-[#166534] not-italic block mt-1">— Boutique Retailer, NY</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Added to Cart Feedback Banner */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-[#22c55e]" />
          <span>Added {product.name} to Cart</span>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
