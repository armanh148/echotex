'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  Minus, 
  Plus,
  Share2,
  AlertCircle
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number) => void;
  onOpenQuote: (product: Product) => void;
  onExpressCheckout?: (product: Product, selectedColor: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenQuote,
  onExpressCheckout
}) => {
  if (!product) return null;

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [orderType, setOrderType] = useState<'retail' | 'wholesale'>('retail');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [addedToast, setAddedToast] = useState(false);

  // Gallery images list tailored for this product
  const bagCutout = product.image || (
    product.id.includes('tshirt') || product.id.includes('loop') ? '/images/bag-green.png' :
    product.id.includes('dcut') || product.id.includes('punch') ? '/images/bag-orange.png' :
    product.id.includes('box') || product.id.includes('heavy') ? '/images/bag-black.png' :
    product.id.includes('laminated') || product.id.includes('boutique') ? '/images/bag-white.png' :
    '/images/bag-blue.png'
  );

  const galleryImages = [
    { url: bagCutout, label: 'Front Product Shot' },
    { url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85', label: 'Lifestyle Editorial' },
    { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85', label: 'Fabric Macro & Seam' },
    { url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85', label: 'Production Detail' }
  ];

  // Wholesale minimum order quantity:
  // Fallback to 500 pcs if product.moq is 1 (retail) or undefined
  const wholesaleMoq = (product.wholesaleMoq && product.wholesaleMoq >= 50)
    ? product.wholesaleMoq
    : (product.moq && product.moq >= 50 ? product.moq : 500);

  const minQuantity = orderType === 'wholesale' ? wholesaleMoq : 1;
  const [moqWarning, setMoqWarning] = useState<string | null>(null);

  // Sync state when product changes or orderType toggles
  useEffect(() => {
    setActiveImageIndex(0);
    setMoqWarning(null);
    setQuantity(orderType === 'retail' ? 1 : wholesaleMoq);
  }, [product, orderType, wholesaleMoq]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Pricing calculations
  const retailUnitPrice = product.pricePerUnit ? (product.pricePerUnit * 1.45) : 0.45;
  const wholesaleUnitPrice = product.pricePerUnit || 0.25;
  const currentPrice = orderType === 'retail' ? retailUnitPrice : wholesaleUnitPrice;
  const originalPrice = (currentPrice * 1.25);

  const handleIncrement = () => {
    const step = orderType === 'wholesale' ? 250 : 1;
    setQuantity(prev => prev + step);
    setMoqWarning(null);
  };

  const handleDecrement = () => {
    const step = orderType === 'wholesale' ? 250 : 1;
    setQuantity(prev => Math.max(minQuantity, prev - step));
  };

  const handleAddToCartClick = () => {
    if (orderType === 'wholesale' && quantity < wholesaleMoq) {
      setMoqWarning(`Wholesale minimum order quantity is ${wholesaleMoq.toLocaleString()} pcs. Order cannot be placed below this quantity.`);
      setQuantity(wholesaleMoq);
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    setMoqWarning(null);
    onAddToCart(product, product.availableColors[0]?.hex || '#166534', quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleExpressCheckout = () => {
    if (orderType === 'wholesale' && quantity < wholesaleMoq) {
      setMoqWarning(`Wholesale minimum order quantity is ${wholesaleMoq.toLocaleString()} pcs. Order cannot be placed below this quantity.`);
      setQuantity(wholesaleMoq);
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    setMoqWarning(null);
    const selectedColor = product.availableColors[0]?.hex || '#166534';
    if (onExpressCheckout) {
      onExpressCheckout(product, selectedColor, quantity);
    } else {
      onAddToCart(product, selectedColor, quantity);
      onClose();
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 animate-fadeIn transition-all"
    >
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden border border-slate-200 my-auto text-[#111827] max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar: Breadcrumbs & Close Button */}
        <div className="px-6 sm:px-10 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest overflow-hidden text-ellipsis whitespace-nowrap">
            <button onClick={onClose} className="hover:text-[#166534] transition-colors cursor-pointer">
              HOME
            </button>
            <span className="text-slate-300">&gt;</span>
            <button onClick={onClose} className="hover:text-[#166534] transition-colors cursor-pointer">
              COLLECTIONS
            </button>
            <span className="text-slate-300">&gt;</span>
            <span className="text-[#111827] font-bold truncate">
              {product.name}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer ml-4 shrink-0 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body: Exactly Matching Reference Image Layout */}
        <div className="overflow-y-auto px-6 sm:px-10 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ====================================================
                LEFT COLUMN: MAIN IMAGE & 4-THUMBNAIL GALLERY
               ==================================================== */}
            <div className="lg:col-span-6 flex flex-col">
              
              {/* Main Image Frame with Floating Wishlist Heart */}
              <div className="relative w-full aspect-[4/5] sm:aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md flex items-center justify-center p-6 group">
                <img
                  src={galleryImages[activeImageIndex].url}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105 select-none"
                />

                {/* Floating Circular Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Save to Wishlist"
                  className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-red-500 transition-all active:scale-90 cursor-pointer"
                >
                  <Heart className={`w-5 h-5 transition-colors ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'
                  }`} />
                </button>

                {/* Brand Signature Logo Watermark (Bottom Left) */}
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

              {/* 4 Thumbnails Strip Below Main Image */}
              <div className="mt-4 grid grid-cols-4 gap-3 sm:gap-4">
                {galleryImages.map((thumb, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-2xl overflow-hidden bg-white p-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-2 border-[#d97706] shadow-md ring-2 ring-amber-500/20 scale-102'
                          : 'border border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
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

            {/* ====================================================
                RIGHT COLUMN: DETAILS, ORDER SWITCHER, CTA, SPECS
               ==================================================== */}
            <div className="lg:col-span-6 flex flex-col justify-start">
              
              {/* Category & Rating Row */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-[#d97706]">
                  {product.categoryLabel || 'SUSTAINABLE NON-WOVEN'}
                </span>
                <span className="text-slate-300">—</span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#d97706]">
                  <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Main Product Heading */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#111827] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Article No. & Volume No. Row */}
              <div className="mt-2.5 flex items-center gap-6 text-[11px] font-mono text-slate-500 uppercase tracking-wider pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">ARTICLE NO.</span>
                  <span className="font-bold text-[#111827]">EP-{product.id.slice(0, 6).toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">VOLUME NO.</span>
                  <span className="font-bold text-[#111827]">{product.gsm} GSM LUXURY</span>
                </div>
              </div>

              {/* Descriptive Paragraph */}
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                {product.description || 'Discover the pinnacle of elegance with this masterfully crafted piece. Part of our exclusive Heritage Collection, it embodies the perfect blend of traditional artistry and modern sophistication.'}
              </p>

              {/* Segmented Switcher Pill: RETAIL ORDER vs WHOLESALE ORDER */}
              <div className="mt-5 p-1 bg-[#f3f4f6] rounded-xl inline-flex w-full sm:w-auto self-start border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setOrderType('retail')}
                  className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
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
                  className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    orderType === 'wholesale'
                      ? 'bg-white text-[#166534] shadow-sm'
                      : 'text-slate-500 hover:text-[#111827]'
                  }`}
                >
                  Wholesale Order
                </button>
              </div>

              {/* Price Container */}
              <div className="mt-4 py-3 px-5 bg-[#f8faf9] rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
                <span className="font-bold text-2xl sm:text-3xl text-[#d97706] font-mono tracking-tight">
                  ${currentPrice.toFixed(2)}
                </span>
                <span className="text-sm font-mono text-slate-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                {orderType === 'wholesale' && (
                  <span className="ml-auto text-[11px] font-bold text-[#166534] bg-[#dcfce7] px-2.5 py-0.5 rounded-full font-mono">
                    MOQ: {wholesaleMoq.toLocaleString()} pcs
                  </span>
                )}
              </div>

              {/* Explicit Quantity Label & Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <span>Order Quantity</span>
                    {orderType === 'wholesale' && (
                      <span className="text-[10px] font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        MOQ: {wholesaleMoq.toLocaleString()} PCS
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
                      onClick={() => {
                        const step = orderType === 'wholesale' ? 250 : 1;
                        setQuantity(prev => Math.max(minQuantity, prev - step));
                        setMoqWarning(null);
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        quantity <= minQuantity
                          ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                          : 'text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer'
                      }`}
                      aria-label="Decrease quantity"
                      title={quantity <= minQuantity ? `Minimum order is ${minQuantity.toLocaleString()} pcs` : 'Decrease'}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={minQuantity}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (isNaN(val)) {
                          setQuantity(minQuantity);
                        } else {
                          setQuantity(Math.max(minQuantity, val));
                        }
                        setMoqWarning(null);
                      }}
                      onBlur={() => {
                        if (quantity < minQuantity) {
                          setQuantity(minQuantity);
                        }
                      }}
                      className="w-20 text-center font-mono font-bold text-sm text-[#111827] focus:outline-none bg-transparent"
                      aria-label="Quantity amount"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const step = orderType === 'wholesale' ? 250 : 1;
                        setQuantity(prev => prev + step);
                        setMoqWarning(null);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ADD TO CART Button (Solid Black with ShoppingBag icon) */}
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    className="w-full sm:flex-1 h-12 bg-[#0f172a] hover:bg-[#166534] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart ({quantity.toLocaleString()} pcs)</span>
                  </button>
                </div>

                {/* Wholesale Quick Select Presets */}
                {orderType === 'wholesale' && (
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick:</span>
                    {Array.from(new Set([wholesaleMoq, 1000, 2500, 5000, 10000].filter(v => v >= wholesaleMoq)))
                      .map((preset) => (
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

                {/* Wholesale Policy Banner */}
                {orderType === 'wholesale' && !moqWarning && (
                  <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Wholesale minimum: <strong>{wholesaleMoq.toLocaleString()} pcs</strong>. Is se kam quantity mein wholesale order place nahi ho sakta.</span>
                  </div>
                )}
              </div>

              {/* EXPRESS CHECKOUT / REQUEST QUOTE Button */}
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
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Fast Delivery
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Secure Store
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Easy Return
                  </span>
                </div>
              </div>

              {/* Tabs: DESCRIPTION | DETAILS | REVIEWS */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-6 border-b border-slate-100 pb-2">
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

                {/* Tab Content */}
                <div className="pt-4 text-xs text-slate-600 leading-relaxed">
                  {activeTab === 'description' && (
                    <ul className="space-y-1.5 font-light">
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
                    <div className="space-y-2">
                      <p><strong className="font-semibold text-slate-800">Material :</strong> {product.material || '100% Virgin Non-Woven PP'}</p>
                      <p><strong className="font-semibold text-slate-800">Load Capacity :</strong> {product.capacity || 'Up to 25 lbs'}</p>
                      <p><strong className="font-semibold text-slate-800">Lead Time :</strong> {product.leadTime || '3-5 business days'}</p>
                      <p><strong className="font-semibold text-slate-800">Certifications :</strong> {product.certifications?.join(', ') || 'GRS, CalRecycle SB 270'}</p>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-2 italic">
                      <p>"Superb build quality! Not a single torn handle across 50,000 units." — Verified Procurement Client</p>
                      <p>"The custom flexo print color is exactly our brand pantone." — Retail Partner</p>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Added to Cart Feedback Banner */}
        {addedToast && (
          <div className="absolute bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
            <Check className="w-4 h-4 text-[#22c55e]" />
            <span>Added {product.name} to Cart</span>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProductDetailModal;
