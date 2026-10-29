'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { useStore } from '../store/useStore';
import { 
  ShoppingBag, 
  ShoppingCart,
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Headphones, 
  Heart, 
  ArrowRight, 
  Tag, 
  Check, 
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  Search,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Lock
} from 'lucide-react';

interface ShopSectionProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number) => void;
  onOpenQuoteForProduct: (product: Product) => void;
  showHero?: boolean;
  showCategories?: boolean;
  showDeal?: boolean;
  onNavigateToShop?: () => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  onQuickView,
  onAddToCart,
  onOpenQuoteForProduct,
  showHero = true,
  showCategories = true,
  showDeal = true,
  onNavigateToShop
}) => {
  // Category & Filter State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price' | 'moq'>('featured');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [showFullCatalog, setShowFullCatalog] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const catalogRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categorySliderRef = useRef<HTMLDivElement>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const newArrivalsSliderRef = useRef<HTMLDivElement>(null);
  const [activeNewArrivalsPage, setActiveNewArrivalsPage] = useState(0);

  const scrollNewArrivals = (direction: 'left' | 'right') => {
    if (newArrivalsSliderRef.current) {
      const scrollAmount = newArrivalsSliderRef.current.clientWidth * 0.95;
      newArrivalsSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleNewArrivalsScroll = () => {
    if (newArrivalsSliderRef.current) {
      const { scrollLeft, clientWidth } = newArrivalsSliderRef.current;
      const pageWidth = clientWidth * 0.90;
      const page = Math.round(scrollLeft / (pageWidth || 1));
      const maxPages = Math.ceil(featuredArrivals.length / 2) - 1;
      setActiveNewArrivalsPage(Math.max(0, Math.min(page, Math.max(0, maxPages))));
    }
  };

  const scrollCategory = (direction: 'left' | 'right') => {
    if (categorySliderRef.current) {
      const scrollAmount = categorySliderRef.current.clientWidth * 0.75;
      categorySliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryScroll = () => {
    if (categorySliderRef.current) {
      const { scrollLeft, clientWidth } = categorySliderRef.current;
      const cardWidth = clientWidth * 0.70;
      const index = Math.round(scrollLeft / (cardWidth || 1));
      setActiveCategoryIndex(Math.max(0, Math.min(index, displayCategories.length - 1)));
    }
  };

  // Global Store Data (Direct & Static Synchronized)
  const { products: storeProducts, categories: storeCategories, siteSettings } = useStore();

  const allProducts = (storeProducts && storeProducts.length > 0) ? storeProducts : PRODUCTS;
  const rawCategories = (storeCategories && storeCategories.length > 0) ? storeCategories : [];

  const displayCategories = React.useMemo(() => {
    return rawCategories.filter(c => c.id !== 'all');
  }, [rawCategories]);

  // Dynamic Deal of the Day Product from Catalog or Admin Offer Settings
  const dealConfig = siteSettings?.dealConfig;
  const isDealEnabled = dealConfig?.enabled !== false;

  const timerH = dealConfig?.timerHours !== undefined ? dealConfig.timerHours : 8;
  const timerM = dealConfig?.timerMinutes !== undefined ? dealConfig.timerMinutes : 12;
  const timerS = dealConfig?.timerSeconds !== undefined ? dealConfig.timerSeconds : 45;

  // Live Real-Time Flash Deal Countdown Timer (Hours, Minutes, Seconds, Milliseconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: timerH,
    minutes: timerM,
    seconds: timerS,
    milliseconds: 30
  });

  useEffect(() => {
    const totalDurationSeconds = (timerH * 3600 + timerM * 60 + timerS);
    const targetTime = Date.now() + Math.max(300, totalDurationSeconds) * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const milliseconds = Math.floor((diff % 1000) / 10);

      setTimeLeft({ hours, minutes, seconds, milliseconds });
    }, 42); // 24fps smooth update

    return () => clearInterval(interval);
  }, [timerH, timerM, timerS]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isOutOfStock = product.inStock === false || (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);
    if (isOutOfStock) {
      alert(`"${product.name}" is currently out of stock and cannot be added to cart.`);
      return;
    }
    const color = product.availableColors?.[0]?.hex || '#4E9F76';
    const qty = 1; // Retail quick-add defaults to 1 box (retail limit: 1-5 boxes)
    onAddToCart(product, color, qty);
    setCartToast(`Added "${product.name}" (1 Box) to Cart`);
    setTimeout(() => setCartToast(null), 3000);
  };

  // Dynamic Deal of the Day Product from Catalog (explicitly chosen in admin or auto-picked)
  const dealProduct: Product | null = React.useMemo(() => {
    if (!allProducts || allProducts.length === 0) return null;
    if (dealConfig?.productId) {
      const explicit = allProducts.find(p => p.id === dealConfig.productId);
      if (explicit) return explicit;
    }
    const foundDeal = allProducts.find(p => 
      p.badge?.toLowerCase().includes('off') || 
      p.badge?.toLowerCase().includes('deal') ||
      p.badge?.toLowerCase().includes('bestseller') ||
      p.badge?.toLowerCase().includes('choice')
    );
    return foundDeal || allProducts[0];
  }, [allProducts, dealConfig?.productId]);

  // Dynamic Featured / New Arrivals: Real newest products from catalog (newest added first)
  const featuredArrivals: Product[] = React.useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    if (activeCategory !== 'all') {
      const activeCatLower = activeCategory.toLowerCase();
      return allProducts.filter(p => 
        p.category?.toLowerCase() === activeCatLower ||
        (p.categoryLabel && p.categoryLabel.toLowerCase().includes(activeCatLower))
      );
    }
    return allProducts;
  }, [allProducts, activeCategory]);

  // Dynamic Filtering for Full Catalog
  const filteredProducts = allProducts.filter(p => {
    const activeCatLower = activeCategory.toLowerCase();
    const matchesCat = activeCategory === 'all' || 
      p.category?.toLowerCase() === activeCatLower ||
      (p.categoryLabel && p.categoryLabel.toLowerCase() === activeCatLower) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(activeCatLower));
    
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      p.name.toLowerCase().includes(q) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
      (p.material && p.material.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q));

    return matchesCat && matchesQuery;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price') return a.pricePerUnit - b.pricePerUnit;
    if (sortBy === 'moq') return a.moq - b.moq;
    return 0;
  });

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setTimeout(() => {
      document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="w-full bg-[#f8faf8] text-[#0f172a] font-sans antialiased selection:bg-[#FF5722] selection:text-white">

      {/* Floating Add-to-Cart Toast */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700 animate-slideUp">
          <div className="w-7 h-7 rounded-full bg-[#22c55e] flex items-center justify-center text-white shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm font-semibold">{cartToast}</span>
        </div>
      )}

      {/* ========================================================
          1. FULL-WIDTH EDGE-TO-EDGE HERO BANNER (STARTS AT TOP OF SHOP PAGE)
         ======================================================== */}
      {showHero && (
        <section className="relative w-full bg-gradient-to-r from-[#051a0e] via-[#0a2c17] to-[#04150a] text-white overflow-hidden shadow-xl border-b border-emerald-950/80">
          
          {/* Ambient Studio Lighting Glows */}
          <div className="pointer-events-none absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-600/15 blur-[120px]" />

          {/* Decorative Dot Matrix in top-right corner matching image */}
          <div className="pointer-events-none absolute top-8 right-12 opacity-25 hidden md:grid grid-cols-6 gap-2.5 z-10">
            {[...Array(24)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-white block" />
            ))}
          </div>

          {/* Banner Inner Content Container */}
          <div className="w-full max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 py-12 sm:py-16 lg:py-20 xl:py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
              
              {/* Left Content Column */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left">
                
                {/* Pill Badge: LIMITED TIME ONLY */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a2c16]/90 border border-emerald-500/35 text-emerald-300 text-[11px] font-bold tracking-widest uppercase mb-6 self-start shadow-inner">
                  <span>{siteSettings?.shopConfig?.heroBannerBadge || 'LIMITED TIME ONLY'}</span>
                </div>

                {/* Headline: Shop More, Save More! */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.06] mb-5 whitespace-pre-line">
                  {siteSettings?.shopConfig?.heroBannerTitle || "Shop More,\nSave More!"}
                </h1>

                {/* Subtitle */}
                <p className="text-emerald-100/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-9 font-normal">
                  {siteSettings?.shopConfig?.heroBannerSubtitle || 'Discover amazing deals on your favorite sustainable products & eco-friendly essentials.'}
                </p>

                {/* Value Props Row (3 Rounded Badges) */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 mb-10">
                  
                  {/* 1. Best Prices */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-sm shrink-0">
                      <Tag className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-white">{siteSettings?.shopConfig?.valueProp1Title || 'Best Prices'}</p>
                      <p className="text-emerald-200/80 text-[10px]">{siteSettings?.shopConfig?.valueProp1Subtitle || 'Guaranteed'}</p>
                    </div>
                  </div>

                  {/* 2. Secure Payments */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-sm shrink-0">
                      <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-white">{siteSettings?.shopConfig?.valueProp2Title || 'Secure'}</p>
                      <p className="text-emerald-200/80 text-[10px]">{siteSettings?.shopConfig?.valueProp2Subtitle || 'Payments'}</p>
                    </div>
                  </div>

                  {/* 3. Fast Delivery */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-sm shrink-0">
                      <Truck className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-white">{siteSettings?.shopConfig?.valueProp3Title || 'Fast Delivery'}</p>
                      <p className="text-emerald-200/80 text-[10px]">{siteSettings?.shopConfig?.valueProp3Subtitle || 'Worldwide'}</p>
                    </div>
                  </div>

                </div>

                {/* CTA Button: EXPLORE COLLECTION -> */}
                <div>
                  <button
                    onClick={scrollToCategories}
                    className="bg-[#FF5722] hover:bg-[#e64a19] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-full inline-flex items-center gap-3 shadow-xl shadow-[#FF5722]/40 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                  >
                    <span>{siteSettings?.shopConfig?.heroBannerBtnText || 'EXPLORE COLLECTION'}</span>
                    <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                  </button>
                </div>

              </div>

              {/* Right Showcase Podium Column */}
              <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center lg:justify-end">
                
                {/* Product Podium Container (High-Res E-Commerce Banner Image with Seamless Blend) */}
                <div className="relative w-full max-w-[620px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl select-none group">
                  <img
                    src={siteSettings?.shopConfig?.heroBannerImage || "/images/shop-hero-podium.jpg"}
                    alt="Ecotex Signature Collection Podium"
                    className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 select-none"
                    draggable={false}
                  />

                  {/* Soft Gradient Overlay on left edge for seamless banner integration */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a2c17] to-transparent opacity-75" />

                  {/* Floating Circular Orange Badge */}
                  <div className="absolute top-5 right-5 sm:top-7 sm:right-7 w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-[#FF5722] text-white flex flex-col items-center justify-center shadow-2xl shadow-[#FF5722]/50 font-extrabold uppercase text-center border-2 border-white/30 transform hover:scale-110 transition-transform duration-300 pointer-events-none select-none z-20">
                    <span className="text-xs sm:text-sm font-black leading-tight text-center px-2">
                      {siteSettings?.shopConfig?.heroBannerDiscountBadge || 'UP TO 50% OFF'}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* Main Container for Catalog, Categories & Deals - Ultra-Wide Responsive (Full Width) */}
      <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10 sm:py-14">

        {/* ========================================================
            2. TRUST / VALUE PROPOSITIONS BAR (4 ITEMS STRIP)
           ======================================================== */}
        <section className="w-full bg-[#FAF8F5] border border-stone-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 mb-14 sm:mb-18 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/80">
            
            {/* 1. Free Shipping */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <Truck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">{siteSettings?.shopConfig?.trustBar1Title || 'Free Shipping'}</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{siteSettings?.shopConfig?.trustBar1Subtitle || 'On orders over $75'}</p>
              </div>
            </div>

            {/* 2. Easy Returns */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <RotateCcw className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">{siteSettings?.shopConfig?.trustBar2Title || 'Easy Returns'}</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{siteSettings?.shopConfig?.trustBar2Subtitle || '30-day returns'}</p>
              </div>
            </div>

            {/* 3. Premium Quality */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">{siteSettings?.shopConfig?.trustBar3Title || 'Premium Quality'}</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{siteSettings?.shopConfig?.trustBar3Subtitle || '100% original products'}</p>
              </div>
            </div>

            {/* 4. 24/7 Support */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <Headphones className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">{siteSettings?.shopConfig?.trustBar4Title || '24/7 Support'}</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{siteSettings?.shopConfig?.trustBar4Subtitle || "We're here to help"}</p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            3. SHOP BY CATEGORY (DYNAMIC REAL-TIME GRID FROM ADMIN)
           ======================================================== */}
        {showCategories && (
          <section ref={categoriesRef} id="shop-categories-section" className="mb-16 sm:mb-20">
          
          {/* Section Heading & Mobile Slider Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
                {siteSettings?.shopConfig?.categoriesHeading || 'Shop By Category'}
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-xl font-medium">
                {siteSettings?.shopConfig?.categoriesSubheading || 'Explore our full range of certified industrial & retail packaging collections.'}
              </p>
            </div>

            {/* Mobile Navigation Arrows */}
            {displayCategories.length > 1 && (
              <div className="flex sm:hidden items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCategory('left')}
                  className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 active:scale-95 cursor-pointer hover:bg-stone-50 transition-all"
                  aria-label="Previous Category"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategory('right')}
                  className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 active:scale-95 cursor-pointer hover:bg-stone-50 transition-all"
                  aria-label="Next Category"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Responsive Grid / Mobile Horizontal Slider */}
          {displayCategories.length > 0 ? (
            <>
              <div
                ref={categorySliderRef}
                onScroll={handleCategoryScroll}
                className="flex sm:grid overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 gap-4 sm:gap-6 lg:gap-8 snap-x snap-mandatory sm:snap-none scrollbar-none sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
              >
              {displayCategories.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.id.toLowerCase() || 
                                 activeCategory.toLowerCase() === cat.label.toLowerCase();
                const catProducts = allProducts.filter(p => 
                  p.category?.toLowerCase() === cat.id.toLowerCase() ||
                  (p.categoryLabel && p.categoryLabel.toLowerCase() === cat.label.toLowerCase())
                );
                const firstProd = catProducts[0];

                const DEFAULT_CATEGORY_SPECS: Record<string, { size: string; gsm: string }> = {
                  't-shirt': { size: '11.5" x 21"', gsm: '45 GSM' },
                  'non-woven': { size: '12" x 15"', gsm: '80 GSM' },
                  'd-cut': { size: '12" x 15"', gsm: '55 GSM' },
                  'slider': { size: '10" x 13"', gsm: '70 GSM' },
                  'food': { size: '12" x 14"', gsm: '90 GSM' },
                  'laminated': { size: '14" x 16"', gsm: '120 GSM' },
                  'biodegradable': { size: '12" x 15"', gsm: '55 GSM' },
                  'all': { size: 'Custom Sizes', gsm: '40-140 GSM' }
                };

                const matchedSpec = DEFAULT_CATEGORY_SPECS[cat.id.toLowerCase()] || 
                                    Object.entries(DEFAULT_CATEGORY_SPECS).find(([key]) => cat.label.toLowerCase().includes(key))?.[1];

                const displaySize = cat.size || matchedSpec?.size || (firstProd?.dimensions ? firstProd.dimensions.split(' with ')[0].split(' x ')[0] + ' x ' + (firstProd.dimensions.split(' x ')[1] || '15"').split(' ')[0] : '12" x 15"');
                const displayGsm = cat.gsm 
                  ? (typeof cat.gsm === 'number' || !cat.gsm.toString().toUpperCase().includes('GSM') ? `${cat.gsm} GSM` : cat.gsm) 
                  : (matchedSpec?.gsm || (firstProd?.gsm ? `${firstProd.gsm} GSM` : '70 GSM'));

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`group relative flex flex-col bg-[#F9F7F4] rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer shrink-0 w-[72vw] xs:w-[60vw] sm:w-auto snap-center sm:snap-align-none ${
                      isActive
                        ? 'border-[#0d3419] ring-2 ring-[#0d3419]/30 shadow-lg'
                        : 'border-stone-200/90 hover:border-stone-300'
                    }`}
                  >
                    {/* Category Photo */}
                    <div className="relative w-full aspect-[4/5] bg-stone-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={cat.image || '/images/bag-green.png'}
                        alt={cat.label}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 select-none"
                        draggable={false}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/bag-green.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Optional Category Tag Badge */}
                      {cat.tag && (
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#0d3419]/90 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-xs">
                          {cat.tag}
                        </div>
                      )}
                    </div>

                    {/* Card Bottom Meta */}
                    <div className="p-4 sm:p-5 text-center flex flex-col items-center">
                      <h3 className="font-extrabold text-base sm:text-lg text-stone-900 mb-1 group-hover:text-[#0d3419] transition-colors line-clamp-1">
                        {cat.label}
                      </h3>
                      <p className="text-[11px] text-stone-500 mb-2 font-medium line-clamp-1">
                        {cat.subtitle || `${catProducts.length} Models Available`}
                      </p>

                      {/* Size & GSM Below Heading and Paragraph */}
                      <div className="flex items-center justify-center gap-1.5 flex-wrap my-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white text-stone-700 border border-stone-200/90 shadow-2xs">
                          Size: {displaySize}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0d3419]/8 text-[#0d3419] border border-[#0d3419]/20 shadow-2xs">
                          {displayGsm}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 group-hover:text-[#FF5722] transition-colors mt-2">
                        <span>Shop Now</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Indicator Dots & Swipe Helper */}
            {displayCategories.length > 1 && (
              <div className="flex sm:hidden flex-col items-center gap-2 mt-4">
                <div className="flex items-center gap-1.5">
                  {displayCategories.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (categorySliderRef.current) {
                          const targetCard = categorySliderRef.current.children[idx] as HTMLElement;
                          targetCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeCategoryIndex === idx
                          ? 'w-6 bg-[#0d3419]'
                          : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-stone-400">
                  Swipe horizontally to explore all {displayCategories.length} categories
                </span>
              </div>
            )}
            </>
          ) : (
            <div className="text-center py-12 text-sm text-stone-500">
              No categories configured yet. Add categories from the Admin Panel.
            </div>
          )}

          </section>
        )}

        {/* ========================================================
            4. DEAL OF THE DAY (FULL-WIDTH EXPANSIVE SPLIT CARD)
           ======================================================== */}
        {showDeal && isDealEnabled && dealProduct && (
          <section className="w-full rounded-[32px] sm:rounded-[40px] bg-[#FFF5ED] border border-[#FFE0CC] p-8 sm:p-12 lg:p-16 mb-16 sm:mb-20 shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
              
              {/* Left Column: Deal Copy & CTA */}
              <div className="lg:col-span-5 flex flex-col text-left">
                <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#FF5722] mb-3 block">
                  {dealConfig?.badge || dealProduct.badge || 'ECO CHOICE'}
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.08] mb-4 whitespace-pre-line">
                  {dealConfig?.title || "Grab It Before\nIt's Gone!"}
                </h2>
                <p className="text-base sm:text-lg text-stone-600 mb-8 font-medium max-w-md">
                  {dealConfig?.subtitle || dealProduct.subtitle || 'Commercial Wholesale Series'}
                </p>
                <div>
                  <button
                    onClick={(e) => handleQuickAdd(dealProduct, e)}
                    className="bg-[#FF5722] hover:bg-[#e64a19] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-full inline-flex items-center gap-3 shadow-lg shadow-[#FF5722]/35 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                  >
                    <span>{dealConfig?.buttonText || 'SHOP THE DEAL'}</span>
                    <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Right Column: Clean White Product Card with Stock Bar & 4 Timer Boxes */}
              <div className="lg:col-span-7">
                <div 
                  onClick={() => onQuickView(dealProduct)}
                  className="bg-white rounded-3xl p-7 sm:p-9 lg:p-10 shadow-lg border border-stone-200/70 flex flex-col sm:flex-row items-center gap-8 lg:gap-10 group cursor-pointer hover:shadow-2xl transition-shadow"
                >
                  
                  {/* Product Thumbnail */}
                  <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-stone-50 rounded-2xl flex items-center justify-center p-4 shrink-0 overflow-hidden border border-stone-100">
                    <img
                      src={dealConfig?.customImage || dealProduct.image || '/images/bag-blue.png'}
                      alt={dealProduct.name}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 select-none"
                      draggable={false}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/bag-blue.png';
                      }}
                    />
                  </div>

                  {/* Details Column */}
                  <div className="flex-1 w-full text-left">
                    <h3 className="font-extrabold text-xl sm:text-2xl text-stone-900 mb-1.5 group-hover:text-[#0d3419] transition-colors">
                      {dealProduct.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 mb-4 line-clamp-2">
                      {dealProduct.subtitle || dealProduct.description}
                    </p>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-3 mb-5">
                      <span className="text-3xl sm:text-4xl font-black text-[#FF5722]">
                        ${(typeof dealConfig?.offerPrice === 'number' && dealConfig.offerPrice > 0 ? dealConfig.offerPrice : dealProduct.pricePerUnit).toFixed(2)}
                      </span>
                      <span className="text-base sm:text-lg font-medium text-stone-400 line-through">
                        ${(typeof dealConfig?.originalPrice === 'number' && dealConfig.originalPrice > 0 ? dealConfig.originalPrice : (dealProduct.pricePerUnit * 1.45)).toFixed(2)}
                      </span>
                    </div>

                    {/* Stock Bar */}
                    <div className="mb-6">
                      <p className="text-xs sm:text-sm font-bold text-stone-700 mb-2">
                        {dealConfig?.stockText || (dealProduct.inStock ? 'Ready for Immediate Dispatch' : 'Backordered')}
                      </p>
                      <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                        <div 
                          className="h-full bg-[#FF5722] rounded-full transition-all duration-500" 
                          style={{ width: `${dealConfig?.stockProgressPercent ? dealConfig.stockProgressPercent : 78}%` }}
                        />
                      </div>
                    </div>

                    {/* 4 Square Countdown Timer Boxes */}
                    <div className="grid grid-cols-4 gap-3 max-w-sm">
                      
                      {/* HRS */}
                      <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-2.5 sm:p-3 text-center">
                        <span className="font-mono font-black text-lg sm:text-xl lg:text-2xl text-stone-900 leading-none block">
                          {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mt-1.5">
                          HRS
                        </span>
                      </div>

                      {/* MINS */}
                      <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-2.5 sm:p-3 text-center">
                        <span className="font-mono font-black text-lg sm:text-xl lg:text-2xl text-stone-900 leading-none block">
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mt-1.5">
                          MINS
                        </span>
                      </div>

                      {/* SECS */}
                      <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-2.5 sm:p-3 text-center">
                        <span className="font-mono font-black text-lg sm:text-xl lg:text-2xl text-stone-900 leading-none block">
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mt-1.5">
                          SECS
                        </span>
                      </div>

                      {/* MSEC */}
                      <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-2.5 sm:p-3 text-center">
                        <span className="font-mono font-black text-lg sm:text-xl lg:text-2xl text-[#FF5722] leading-none block">
                          {String(timeLeft.milliseconds).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mt-1.5">
                          MSEC
                        </span>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>
          </section>
        )}

        {/* ========================================================
            5. NEW ARRIVALS (2 PER LINE ON MOBILE CAROUSEL - RESPONSIVE)
           ======================================================== */}
        <section id="new-arrivals-section" className="mb-16 sm:mb-20">
          
          {/* Header Row: Title & See All Link + Mobile Controls */}
          <div className="flex items-center justify-between mb-6 sm:mb-10 pb-3 sm:pb-4 border-b border-stone-200">
            <div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
                {activeCategory !== 'all' 
                  ? (displayCategories.find(c => c.id === activeCategory)?.label || 'Products')
                  : (siteSettings?.shopConfig?.newArrivalsHeading || 'New Arrivals')}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {activeCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className="text-xs font-bold text-[#FF5722] hover:underline cursor-pointer mr-1"
                >
                  Clear Filter
                </button>
              )}

              {/* Mobile Carousel Arrow Controls */}
              {featuredArrivals.length > 2 && (
                <div className="flex sm:hidden items-center gap-1.5 mr-1">
                  <button
                    type="button"
                    onClick={() => scrollNewArrivals('left')}
                    className="w-8 h-8 rounded-full bg-white border border-stone-200 shadow-2xs flex items-center justify-center text-stone-700 active:scale-95 cursor-pointer hover:bg-stone-50"
                    aria-label="Previous Products"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollNewArrivals('right')}
                    className="w-8 h-8 rounded-full bg-white border border-stone-200 shadow-2xs flex items-center justify-center text-stone-700 active:scale-95 cursor-pointer hover:bg-stone-50"
                    aria-label="Next Products"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* SEE ALL LINK (Lands on Shop page) */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToShop) {
                    onNavigateToShop();
                  } else {
                    const shopEl = document.getElementById('shop-categories-section') || document.getElementById('new-arrivals-section');
                    shopEl?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0d3419] hover:bg-[#165a2d] text-white text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:scale-105 active:scale-95"
              >
                <span>See All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* 2 Products per Line on Mobile Touch-Carousel / 4-Col Grid on Desktop */}
          <div
            ref={newArrivalsSliderRef}
            onScroll={handleNewArrivalsScroll}
            className="flex sm:grid overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 gap-3 sm:gap-6 lg:gap-8 snap-x snap-mandatory sm:snap-none scrollbar-none sm:grid-cols-2 lg:grid-cols-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
          >
            {featuredArrivals.map((product) => {
              const isWishlisted = !!wishlist[product.id];
              const isProdOutOfStock = product.inStock === false || (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);

              return (
                <div
                  key={product.id}
                  onClick={() => onQuickView(product)}
                  className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-3 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer shrink-0 w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-auto snap-start sm:snap-align-none"
                >
                  
                  {/* Top Bar inside Card: NEW/SOLD OUT Badge on left, Heart Icon on right */}
                  <div className="flex items-center justify-between w-full mb-2.5 sm:mb-4 relative z-10">
                    {isProdOutOfStock ? (
                      <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-rose-600 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow-2xs">
                        SOLD OUT
                      </span>
                    ) : (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-stone-900 text-white text-[9px] sm:text-[11px] font-black uppercase tracking-wider shadow-2xs">
                        NEW
                      </span>
                    )}

                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      aria-label="Add to wishlist"
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white flex items-center justify-center text-stone-500 hover:text-red-500 shadow-2xs border border-stone-200/80 transition-transform active:scale-90"
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-colors ${
                        isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-600'
                      }`} />
                    </button>
                  </div>

                  {/* Clean Centered Product Image */}
                  <div className="relative w-full aspect-square bg-[#FAF8F5] rounded-xl sm:rounded-2xl flex items-center justify-center p-3 sm:p-6 mb-3 sm:mb-5 overflow-hidden">
                    <img
                      src={product.image || '/images/essential-hoodie.jpg'}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 select-none"
                      draggable={false}
                    />
                  </div>

                  {/* Bottom Info: Title, Price & Shopping Cart Button */}
                  <div className="mt-auto">
                    <h3 className="font-extrabold text-xs sm:text-base lg:text-lg text-stone-900 truncate mb-1 sm:mb-2 group-hover:text-[#0d3419] transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-end sm:items-center justify-between gap-1">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1">
                          <span className="font-black text-sm sm:text-xl lg:text-2xl text-stone-900 block leading-tight">
                            ${product.pricePerUnit.toFixed(2)}
                          </span>
                          <span className="text-[10px] sm:text-xs text-stone-500 font-bold">/ box</span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap mt-1">
                          <span className="text-[8px] sm:text-[10px] font-bold text-amber-800 bg-amber-50 px-1 sm:px-1.5 py-0.5 rounded border border-amber-200/80 truncate">
                            📦 {product.pcsPerBox || 200} pcs
                          </span>
                          <span className="hidden xs:inline-block text-[8px] sm:text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded border border-emerald-200/70 truncate">
                            {product.moq > 1 ? `MOQ: ${product.moq}` : 'Min: 1'}
                          </span>
                        </div>
                      </div>

                      {/* Outline Shopping Cart Button or Disabled Out of Stock */}
                      {isProdOutOfStock ? (
                        <button
                          disabled={true}
                          title="Sold Out / Out of Stock"
                          className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border border-stone-200 bg-stone-100 text-stone-400 flex items-center justify-center cursor-not-allowed shrink-0"
                        >
                          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          aria-label={`Add ${product.name} to cart`}
                          className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white text-stone-700 flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer shrink-0"
                        >
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Mobile Carousel Indicator Dots */}
          {featuredArrivals.length > 2 && (
            <div className="flex sm:hidden justify-center items-center gap-1.5 mt-3.5">
              {Array.from({ length: Math.ceil(featuredArrivals.length / 2) }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (newArrivalsSliderRef.current) {
                      const scrollTarget = idx * (newArrivalsSliderRef.current.clientWidth * 0.95);
                      newArrivalsSliderRef.current.scrollTo({ left: scrollTarget, behavior: 'smooth' });
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeNewArrivalsPage === idx
                      ? 'w-6 bg-[#0d3419]'
                      : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          )}

        </section>

      </div>

    </div>
  );
};