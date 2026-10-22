'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Share2, 
  Maximize2,
  Wind,
  Layers
} from 'lucide-react';

import { PRODUCT_VARIANTS, type ProductVariant } from '../data/pufferVariants';
export type { ProductVariant };

interface ModernPufferHeroProps {
  onNavigateToHome?: () => void;
  onNavigateToShop?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToContact?: () => void;
  onOpenCart?: () => void;
  hideHeader?: boolean;
}

export const ModernPufferHero: React.FC<ModernPufferHeroProps> = ({
  onNavigateToHome,
  onNavigateToShop,
  onNavigateToAbout,
  onNavigateToContact,
  onOpenCart,
  hideHeader = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedSize, setSelectedSize] = useState('38');
  const [wishlistActive, setWishlistActive] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(2);
  const [cartCount, setCartCount] = useState(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('Home');

  const currentVariant = PRODUCT_VARIANTS[currentIndex];
  const nextIndex = (currentIndex + 1) % PRODUCT_VARIANTS.length;
  const nextVariant = PRODUCT_VARIANTS[nextIndex];

  // Dynamic Theme Colors
  const isLight = currentVariant.isLight;
  const textColor = isLight ? 'text-[#0f172a]' : 'text-white';
  const textMuted = isLight ? 'text-[#475569]' : 'text-white/80';
  const borderSubtle = isLight ? 'border-[#0f172a]/15' : 'border-white/20';
  const glassBg = isLight ? 'bg-white/70' : 'bg-black/25';
  const glassBorder = isLight ? 'border-black/10' : 'border-white/15';

  // Navigation handlers
  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % PRODUCT_VARIANTS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + PRODUCT_VARIANTS.length) % PRODUCT_VARIANTS.length);
  }, []);

  const handleSelectVariant = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Wishlist toggle
  const toggleWishlist = () => {
    setWishlistActive((prev) => {
      const next = !prev;
      setWishlistCount((c) => (next ? c + 1 : c - 1));
      showToast(next ? `Saved ${currentVariant.colorName} to Wishlist` : 'Removed from Wishlist');
      return next;
    });
  };

  // Add to Bag / CTA Action
  const handleAddToCart = () => {
    setCartCount((c) => c + 1);
    showToast(`Added ${currentVariant.colorName} (Size ${selectedSize}) to Bag!`);
    if (onOpenCart) {
      setTimeout(() => onOpenCart(), 600);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Central floating image animation variants
  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 90 : -90,
      y: 40,
      scale: 0.85,
      opacity: 0,
      rotate: dir > 0 ? 5 : -5,
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 220, damping: 24 },
        y: { type: 'spring' as const, stiffness: 220, damping: 24 },
        scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
        opacity: { duration: 0.4 },
        rotate: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -90 : 90,
      y: -30,
      scale: 0.88,
      opacity: 0,
      rotate: dir > 0 ? -5 : 5,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    }),
  };

  return (
    <motion.section
      animate={{ backgroundColor: currentVariant.themeColor }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] as const }}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden select-none transition-colors"
      style={{ minHeight: '100dvh' }}
    >
      {/* Subtle Ambient Radial Lighting Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none -z-0 opacity-40 mix-blend-overlay"
        style={{
          background: isLight 
            ? 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.8) 0%, rgba(200,200,200,0.2) 70%)'
            : 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.5) 75%)'
        }}
      />

      {/* ========================================================
          1. TOP NAVIGATION BAR (Rendered if hideHeader is false)
         ======================================================== */}
      {!hideHeader && (
        <header className="relative z-40 w-full pt-5 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Brand Logo (Top Left) */}
          <div className="flex items-center gap-2.5">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm tracking-wider shadow-lg transition-colors ${
                isLight ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-900'
              }`}
            >
              JM
            </motion.div>
            <div>
              <span className={`text-base sm:text-lg font-black tracking-wider uppercase block leading-none transition-colors ${textColor}`}>
                JACKET MASTERS
              </span>
              <span className={`text-[10px] tracking-widest uppercase font-semibold block transition-colors opacity-70 ${textColor}`}>
                ECOTEX STUDIOS
              </span>
            </div>
          </div>

          {/* Floating Glassmorphism Pill Navbar (Top Center) */}
          <nav 
            className={`hidden md:flex items-center gap-1.5 p-1.5 rounded-full backdrop-blur-xl shadow-2xl transition-all duration-500 border ${glassBg} ${glassBorder}`}
          >
            {[
              { label: 'Home', action: onNavigateToHome },
              { label: 'About Us', action: onNavigateToAbout },
              { label: 'Shop', action: onNavigateToShop },
              { label: 'Contact', action: onNavigateToContact },
            ].map((item) => {
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label);
                    if (item.action) item.action();
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    isActive
                      ? isLight
                        ? 'text-white'
                        : 'text-slate-950 font-bold'
                      : isLight
                      ? 'text-slate-700 hover:text-slate-950'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePillNav"
                      className={`absolute inset-0 rounded-full shadow-md transition-colors ${
                        isLight ? 'bg-[#0f172a]' : 'bg-white'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Controls: Wishlist & Cart (Top Right) */}
          <div className="flex items-center gap-3">
            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleWishlist}
              aria-label="Wishlist"
              className={`relative p-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-md ${glassBg} ${glassBorder} ${textColor}`}
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  wishlistActive ? 'fill-red-500 text-red-500' : 'text-current'
                }`} 
              />
              {wishlistCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shadow ${
                  isLight ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-950'
                }`}>
                  {wishlistCount}
                </span>
              )}
            </motion.button>

            {/* Cart Button with Tactile Animation */}
            <motion.button
              whileHover={{ scale: 1.12, rotate: [-1, 1, 0] }}
              whileTap={{ scale: 0.86 }}
              onClick={() => {
                if (onOpenCart) onOpenCart();
                else handleAddToCart();
              }}
              aria-label="Shopping Cart"
              className={`group relative p-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-md ${glassBg} ${glassBorder} ${textColor} cursor-pointer`}
            >
              <ShoppingBag className="w-4 h-4 text-current transition-transform duration-300 group-hover:scale-110" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.8 }}
                  className={`absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-[9px] font-black flex items-center justify-center shadow-md ${
                    isLight ? 'bg-red-600 text-white' : 'bg-white text-slate-950'
                  }`}
                >
                  {cartCount}
                </motion.span>
              )}
              {/* Interactive Pulse Halo */}
              <span className="absolute inset-0 rounded-full border border-current opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
            </motion.button>
          </div>

        </header>
      )}

      {/* ========================================================
          2. MAIN SPLIT STAGE (HERO VIEWPORT)
         ======================================================== */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* ----------------------------------------------------
              LEFT SIDE: BOLD EDITORIAL TYPOGRAPHY & CTA
             ---------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left">
            
            {/* Dynamic Collection Badge */}
            <motion.div
              key={`badge-${currentVariant.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center justify-center lg:justify-start gap-2 mb-4"
            >
              <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase backdrop-blur-md border shadow-sm ${glassBg} ${glassBorder} ${textColor}`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse" />
                {currentVariant.badge}
              </span>
            </motion.div>

            {/* Bold Headline */}
            <motion.h1
              key={`title-${currentVariant.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.96] uppercase transition-colors ${textColor}`}
            >
              Stand out<br />
              <span className="font-extrabold opacity-95">Without trying</span>
            </motion.h1>

            {/* Descriptive Paragraph */}
            <motion.p
              key={`desc-${currentVariant.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-normal transition-colors ${textMuted}`}
            >
              It's not just about staying warm. It's about stepping outside and instantly feeling confident, comfortable, and completely yourself...
            </motion.p>

            {/* Tech Specs Micro-Row */}
            <div className="mt-5 hidden sm:flex items-center justify-center lg:justify-start gap-4 text-xs">
              <div className={`flex items-center gap-1.5 font-medium ${textMuted}`}>
                <Wind className="w-3.5 h-3.5 text-current opacity-80" />
                <span>{currentVariant.specs.fillPower}</span>
              </div>
              <span className={`opacity-40 ${textMuted}`}>•</span>
              <div className={`flex items-center gap-1.5 font-medium ${textMuted}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-current opacity-80" />
                <span>{currentVariant.specs.temperature}</span>
              </div>
            </div>

            {/* Pill CTA Button: "Get the look →" */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className={`group px-7 py-3.5 rounded-full font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2.5 transition-all duration-300 border ${
                  isLight
                    ? 'bg-[#0f172a] text-white hover:bg-white hover:text-[#0f172a] hover:border-[#0f172a]'
                    : 'bg-white text-slate-950 hover:bg-transparent hover:text-white hover:border-white'
                }`}
              >
                <span>Get the look</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              <button
                onClick={() => onNavigateToShop ? onNavigateToShop() : handleAddToCart()}
                className={`px-5 py-3 rounded-full text-xs font-semibold tracking-wide transition-all ${textMuted} hover:opacity-100 underline underline-offset-4`}
              >
                Explore Lookbook
              </button>
            </div>

            {/* Color Swatch Fast Bar */}
            <div className="mt-6 pt-5 border-t border-current/15 flex items-center justify-center lg:justify-start gap-3">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${textMuted}`}>
                Colorway:
              </span>
              <div className="flex items-center gap-2">
                {PRODUCT_VARIANTS.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectVariant(i)}
                    aria-label={`Select ${v.colorName}`}
                    className={`w-6 h-6 rounded-full border-2 transition-all relative flex items-center justify-center ${
                      currentIndex === i
                        ? isLight
                          ? 'border-[#0f172a] scale-125 shadow-md'
                          : 'border-white scale-125 shadow-md'
                        : 'border-black/20 hover:scale-110 opacity-70'
                    }`}
                    style={{ backgroundColor: v.themeColor }}
                  >
                    {currentIndex === i && (
                      <span className={`w-1.5 h-1.5 rounded-full ${v.isLight ? 'bg-slate-900' : 'bg-white'}`} />
                    )}
                  </button>
                ))}
              </div>
              <span className={`text-xs font-bold ml-1 ${textColor}`}>
                {currentVariant.colorLabel}
              </span>
            </div>

          </div>

          {/* ----------------------------------------------------
              CENTER STAGE: 3D FLOATING HERO PRODUCT VISUAL
             ---------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 relative py-4 lg:py-0">
            
            {/* Ambient Backlight Halo behind product */}
            <div 
              className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none -z-0 opacity-40 transition-all duration-700"
              style={{
                background: isLight 
                  ? 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0) 70%)'
                  : 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 70%)'
              }}
            />

            {/* Animated Variant Container with Directional Enter/Exit */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] aspect-square flex flex-col items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentVariant.id}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative w-full h-full flex flex-col items-center justify-center"
                >
                  
                  {/* Continuous Floating/Breathing Motion Wrapper */}
                  <motion.div
                    animate={{
                      y: [-12, 10, -12],
                      rotate: [-0.6, 0.6, -0.6],
                    }}
                    transition={{
                      duration: 4.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative z-10 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) handleNext();
                      else if (info.offset.x > 60) handlePrev();
                    }}
                  >
                    <img
                      src={currentVariant.heroImage}
                      alt={`${currentVariant.colorName} Ecotex Bag`}
                      className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] select-none pointer-events-none"
                      draggable={false}
                    />
                  </motion.div>

                  {/* Soft Dynamic Shadow underneath that scales with height */}
                  <motion.div
                    animate={{
                      scale: [1, 0.82, 1],
                      opacity: [0.55, 0.28, 0.55],
                      filter: ['blur(16px)', 'blur(24px)', 'blur(16px)'],
                    }}
                    transition={{
                      duration: 4.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute -bottom-2 w-48 sm:w-64 h-6 rounded-full bg-black/60 pointer-events-none z-0"
                  />

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating Slogan below product */}
            <motion.p
              key={`slogan-${currentVariant.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className={`mt-4 text-center text-xs sm:text-sm font-bold tracking-[0.25em] uppercase transition-colors opacity-85 ${textColor}`}
            >
              "{currentVariant.tagline}"
            </motion.p>

          </div>

          {/* ----------------------------------------------------
              RIGHT SIDE: COMMERCE SPECS, SIZES & THUMBNAIL
             ---------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-center order-3 text-center lg:text-left">
            
            {/* Dynamic Price Tag */}
            <div className="flex items-baseline justify-center lg:justify-start gap-3">
              <motion.span 
                key={`price-${currentVariant.id}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-4xl sm:text-5xl font-black font-mono tracking-tight transition-colors ${textColor}`}
              >
                ${currentVariant.price}
              </motion.span>
              <span className={`text-lg sm:text-xl font-bold font-mono line-through opacity-50 transition-colors ${textColor}`}>
                ${currentVariant.originalPrice}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                isLight ? 'bg-red-600 text-white' : 'bg-white text-slate-900'
              }`}>
                SAVE $50
              </span>
            </div>

            <p className={`mt-1 text-xs font-medium transition-colors ${textMuted}`}>
              Taxes & international shipping calculated at checkout
            </p>

            {/* Interactive Size Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${textColor}`}>
                  Choose your size:
                </span>
                <button 
                  onClick={() => showToast('Size Chart: Model is 6\'1" wearing size 40')}
                  className={`text-[11px] underline font-medium hover:opacity-100 transition-colors ${textMuted}`}
                >
                  Size Guide
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2.5">
                {currentVariant.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        setSelectedSize(size);
                        showToast(`Selected Size ${size}`);
                      }}
                      className={`w-11 h-11 rounded-full text-xs font-extrabold flex items-center justify-center transition-all duration-300 shadow-md ${
                        isSelected
                          ? isLight
                            ? 'bg-[#0f172a] text-white ring-2 ring-[#0f172a] ring-offset-2 ring-offset-white'
                            : 'bg-white text-slate-950 ring-2 ring-white ring-offset-2 ring-offset-black/30'
                          : isLight
                          ? 'bg-white/80 text-slate-800 border border-slate-300 hover:border-slate-800'
                          : 'bg-white/15 text-white border border-white/20 hover:border-white'
                      }`}
                    >
                      {size}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stock Indicator */}
            <div className="mt-5 flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className={`text-xs font-semibold transition-colors ${textMuted}`}>
                In Stock · Ships within 24 Hours
              </span>
            </div>

            {/* Bottom-Right Next-Variant Thumbnail Card */}
            <div className="mt-8 pt-5 border-t border-current/15">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                role="button"
                tabIndex={0}
                className={`p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-xl flex items-center gap-3.5 text-left group ${glassBg} ${glassBorder}`}
              >
                <div 
                  className="w-14 h-14 rounded-xl p-1 flex items-center justify-center shadow-inner overflow-hidden border border-black/10 transition-transform group-hover:rotate-3"
                  style={{ backgroundColor: nextVariant.themeColor }}
                >
                  <img
                    src={nextVariant.heroImage}
                    alt={nextVariant.colorName}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${textMuted}`}>
                      Next Look
                    </span>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors ${textColor}`}>
                    {nextVariant.colorName}
                  </h4>
                  <span className={`text-[11px] font-mono font-medium ${textMuted}`}>
                    Tap to Switch →
                  </span>
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:translate-x-1 ${
                  isLight ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-900'
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          3. BOTTOM BAR (SLIDE PAGINATION & SOCIALS)
         ======================================================== */}
      <footer className="relative z-30 w-full pb-6 px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Slide Pagination Arrows & Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              aria-label="Previous Slide"
              className={`w-9 h-9 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-md transition-all ${glassBg} ${glassBorder} ${textColor}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              aria-label="Next Slide"
              className={`w-9 h-9 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-md transition-all ${glassBg} ${glassBorder} ${textColor}`}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className={`text-xs font-mono font-bold tracking-wider px-2 transition-colors ${textColor}`}>
            <span>0{currentIndex + 1}</span>
            <span className="opacity-40 mx-1.5">/</span>
            <span className="opacity-60">0{PRODUCT_VARIANTS.length}</span>
          </div>

          {/* Mini progress bar indicators */}
          <div className="flex items-center gap-1 ml-1">
            {PRODUCT_VARIANTS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectVariant(i)}
                className={`h-1 rounded-full transition-all duration-400 ${
                  currentIndex === i
                    ? `w-6 ${isLight ? 'bg-[#0f172a]' : 'bg-white'}`
                    : `w-2 ${isLight ? 'bg-[#0f172a]/20' : 'bg-white/30'}`
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Subtle Social Icons */}
        <div className="flex items-center gap-4">
          <span className={`text-[11px] font-semibold uppercase tracking-widest hidden sm:inline-block ${textMuted}`}>
            Connect:
          </span>
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              href="#instagram"
              aria-label="Instagram"
              className={`p-2 rounded-full backdrop-blur-md border transition-colors ${glassBg} ${glassBorder} ${textColor}`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </motion.a>

            {/* Facebook */}
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              href="#facebook"
              aria-label="Facebook"
              className={`p-2 rounded-full backdrop-blur-md border transition-colors ${glassBg} ${glassBorder} ${textColor}`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </motion.a>

            {/* TikTok */}
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              href="#tiktok"
              aria-label="TikTok"
              className={`p-2 rounded-full backdrop-blur-md border transition-colors ${glassBg} ${glassBorder} ${textColor}`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </motion.a>

            {/* Pinterest */}
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              href="#pinterest"
              aria-label="Pinterest"
              className={`p-2 rounded-full backdrop-blur-md border transition-colors ${glassBg} ${glassBorder} ${textColor}`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 12-5.373 12-12 0-6.628-5.393-12-12-12z"/>
              </svg>
            </motion.a>
          </div>
        </div>

      </footer>

      {/* ========================================================
          4. INTERACTIVE TOAST NOTIFICATION
         ======================================================== */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-xs font-bold tracking-wide shadow-2xl flex items-center gap-2 border ${
              isLight
                ? 'bg-[#0f172a] text-white border-slate-700'
                : 'bg-white text-slate-950 border-white/50'
            }`}
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.section>
  );
};
