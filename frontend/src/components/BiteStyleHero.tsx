'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type Variants } from 'motion/react';
import { 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface BiteStyleHeroProps {
  onNavigateToShop: () => void;
  onOpenCart?: () => void;
}

interface BagVariant {
  id: string;
  colorName: string;
  hex: string;
  image: string;
  glow: string;
  badge: string;
  material: string;
}

const DEFAULT_BAG_VARIANTS: BagVariant[] = [
  {
    id: 'v-blue',
    colorName: 'Oceanic Navy Blue',
    hex: '#1e3a5f',
    image: '/images/bag-blue.png',
    glow: 'rgba(30, 58, 95, 0.45)',
    badge: 'TOP SELLER',
    material: 'Ultrasonic Welded • 125+ Reuses'
  },
  {
    id: 'v-green',
    colorName: 'Ecotex Leaf Green',
    hex: '#4E9F76',
    image: '/images/bag-green.png',
    glow: 'rgba(78, 159, 118, 0.38)',
    badge: 'ECO CERTIFIED',
    material: 'Virgin Polypropylene • 100% Recyclable'
  },
  {
    id: 'v-black',
    colorName: 'Midnight Slate & Gold',
    hex: '#0f172a',
    image: '/images/bag-black.png',
    glow: 'rgba(212, 175, 55, 0.32)',
    badge: 'LUXURY BOUTIQUE',
    material: 'Metallic Gold Flexo • High Tensile'
  },
  {
    id: 'v-white',
    colorName: 'Pure White Linen',
    hex: '#FFFFFF',
    image: '/images/bag-white.png',
    glow: 'rgba(255, 255, 255, 0.65)',
    badge: 'MINIMALIST CLEAN',
    material: 'Durable Canvas Weave • FDA Safe'
  },
  {
    id: 'v-orange',
    colorName: 'Bio Amber Orange',
    hex: '#ea580c',
    image: '/images/bag-orange.png',
    glow: 'rgba(234, 88, 12, 0.42)',
    badge: 'PLANT BASED',
    material: 'Organic Non-Toxic Dyes • Compostable'
  }
];

export const BiteStyleHero: React.FC<BiteStyleHeroProps> = ({
  onNavigateToShop,
  onOpenCart
}) => {
  const { heroConfig } = useStore();

  // Combine store variants with rich visual metadata
  const bagVariants: BagVariant[] = React.useMemo(() => {
    if (heroConfig.variants && heroConfig.variants.length > 0) {
      // De-duplicate images if any duplicate greens exist
      const seen = new Set<string>();
      const filtered = heroConfig.variants.filter(v => {
        if (seen.has(v.image)) return false;
        seen.add(v.image);
        return true;
      });

      return filtered.map((v, i) => {
        const matched = DEFAULT_BAG_VARIANTS.find(dv => 
          dv.image === v.image || 
          dv.colorName.toLowerCase().includes(v.colorName.toLowerCase())
        ) || DEFAULT_BAG_VARIANTS[i % DEFAULT_BAG_VARIANTS.length];

        return {
          id: v.id,
          colorName: v.colorName || matched.colorName,
          hex: v.hex || matched.hex,
          image: v.image || matched.image,
          glow: matched.glow,
          badge: matched.badge,
          material: matched.material
        };
      });
    }
    return DEFAULT_BAG_VARIANTS;
  }, [heroConfig.variants]);

  // Slideshow & Animation State
  const AUTO_PLAY_INTERVAL = 3800;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const activeBag = bagVariants[currentIndex] || bagVariants[0];

  // Auto-cycle effect with smooth progress tracking
  useEffect(() => {
    if (isPaused || isHovered) return;

    startTimeRef.current = Date.now();
    setProgress(0);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);
      setProgress(pct);
    }, 40);

    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % bagVariants.length);
    }, AUTO_PLAY_INTERVAL);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [currentIndex, isPaused, isHovered, bagVariants.length]);

  const handleSelectVariant = useCallback((index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % bagVariants.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [bagVariants.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + bagVariants.length) % bagVariants.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [bagVariants.length]);

  // Mouse Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const jarRotateX = useTransform(smoothMouseY, [-300, 300], [5, -5]);
  const jarRotateY = useTransform(smoothMouseX, [-300, 300], [-7, 7]);
  const jarX = useTransform(smoothMouseX, [-300, 300], [-10, 10]);
  const jarY = useTransform(smoothMouseY, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Parse title for line breaks and highlighting
  const titleLines = (heroConfig.title || "It's time to\npack better.").split('\n');

  // Enhanced Auto-Swipe Animation
  const bagMotionVariants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 250 : -250,
      scale: 0.85,
      rotate: dir > 0 ? 15 : -15,
      filter: 'blur(8px)',
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.9,
      }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -250 : 250,
      scale: 0.85,
      rotate: dir > 0 ? -15 : 15,
      filter: 'blur(8px)',
      transition: {
        duration: 0.5,
        ease: 'easeInOut'
      }
    })
  };

  // Determine active background image: defaults to home-hero-bg.jpg unless explicitly set to 'none'
  const currentBgImage = 
    heroConfig.backgroundImage === 'none' 
      ? null 
      : (heroConfig.backgroundImage || '/images/home-hero-bg.jpg');

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center font-sans antialiased text-[#0f172a] overflow-hidden py-8 sm:py-10 lg:py-14 px-4 sm:px-8 lg:px-12 xl:px-16"
    >
      {/* Full Hero Panoramic Background Image */}
      {currentBgImage ? (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img 
            src={currentBgImage} 
            alt="Eco-friendly wholesale packaging showcase backdrop" 
            className="w-full h-full object-cover object-center" 
          />
          {/* Subtle soft atmospheric gradient for contrast while displaying the full photo clearly */}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none" />
        </div>
      ) : (
        /* Dynamic Animated Background Orbs fallback */
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#f8fafc]">
          <motion.div 
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-[#d1fae5] rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[140px] opacity-70" 
          />
          <motion.div 
            animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-[10%] right-[-10%] w-[45vw] h-[60vh] bg-[#ccfbf1] rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[140px] opacity-60" 
          />
          <motion.div 
            animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[50vh] bg-[#e0e7ff] rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[150px] opacity-60" 
          />
        </div>
      )}

      {/* 2-Column Full-Width Grid */}
      <div className="relative z-10 w-full max-w-[1820px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        
        {/* ======================================================
            LEFT COLUMN: DARK GREEN GRADIENT GLASSMORPHISM CARD
           ====================================================== */}
        <motion.div 
          initial={{ opacity: 0, x: -50, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-6 xl:col-span-5 bg-gradient-to-br from-[#052e1b]/40 via-[#0a3c23]/28 to-[#021a0e]/42 backdrop-blur-lg rounded-[32px] sm:rounded-[40px] lg:rounded-[48px] p-8 sm:p-12 md:p-14 lg:p-16 xl:p-20 flex flex-col justify-center items-center text-center lg:items-start lg:text-left transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-white/25 hover:border-emerald-400/40 min-h-[520px] sm:min-h-[580px] lg:min-h-[660px] overflow-hidden"
        >
          {/* Ambient Frosted Sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-black/10 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full">
            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-editorial text-[48px] sm:text-[60px] md:text-[68px] lg:text-[72px] xl:text-[84px] font-extrabold tracking-tight leading-[1.02] max-w-xl text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.7)]"
            >
              {titleLines.map((line, idx) => (
                <React.Fragment key={idx}>
                  {idx === titleLines.length - 1 ? (
                    <span>
                      <span className="text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
                        {line.split(' ').slice(0, -1).join(' ')}{' '}
                      </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#86efac] to-[#a7f3d0] drop-shadow-[0_2px_16px_rgba(74,222,128,0.55)]">
                        {line.split(' ').slice(-1)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
                      {line}<br />
                    </span>
                  )}
                </React.Fragment>
              ))}
            </motion.h1>

            {/* Sub-headline / Copy */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-[20px] text-white/95 leading-relaxed max-w-lg font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]"
            >
              {heroConfig.subtitle}
            </motion.p>

            {/* Primary Call-to-Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 sm:mt-12 md:mt-14 w-full sm:w-auto"
            >
              <motion.button
                onClick={onNavigateToShop}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden w-full sm:w-auto min-w-[240px] sm:min-w-[280px] py-4.5 sm:py-5 px-10 rounded-full bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#10b981] text-white font-extrabold text-base sm:text-lg tracking-wide transition-all duration-300 shadow-[0_12px_30px_rgba(34,197,94,0.35)] hover:shadow-[0_18px_40px_rgba(34,197,94,0.5)] cursor-pointer flex items-center justify-center gap-3 group border border-emerald-300/40"
              >
                {/* Shimmer Light Streak */}
                <motion.div 
                  animate={{ x: ['-120%', '220%'] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', repeatDelay: 1 }}
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg] pointer-events-none"
                />

                <span className="relative z-10 font-bold">{heroConfig.ctaText || 'Shop Now'}</span>
                
                <motion.div 
                  className="relative z-10 bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* ======================================================
            RIGHT COLUMN: 3D PARALLAX PRODUCT CENTERPIECE & AUTO-ANIMATED BAGS
           ====================================================== */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="lg:col-span-6 xl:col-span-7 relative flex flex-col items-center justify-center min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] p-2 sm:p-6 lg:p-8 perspective-1000 select-none group"
        >


          {/* ----------------------------------------------------
              AMBIENT ADAPTIVE COLOR GLOW (Behind the product)
             ---------------------------------------------------- */}
          <div 
            className="absolute inset-0 max-w-[580px] max-h-[580px] m-auto rounded-full blur-[100px] pointer-events-none transition-all duration-700 -z-10 opacity-70"
            style={{
              background: `radial-gradient(circle, ${activeBag.glow} 0%, transparent 68%)`
            }}
          />



          {/* ----------------------------------------------------
              MAIN PRODUCT CENTERPIECE (3D Parallax Tilt + Soft Float + Auto Animation)
             ---------------------------------------------------- */}
          <motion.div 
            style={{ 
              rotateX: jarRotateX, 
              rotateY: jarRotateY, 
              x: jarX, 
              y: jarY 
            }}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -12, 0]
            }}
            transition={{
              opacity: { duration: 1, delay: 0.2 },
              scale: { duration: 1, delay: 0.2 },
              y: { repeat: Infinity, duration: 5.5, ease: 'easeInOut' }
            }}
            className="relative z-10 w-full max-w-[620px] lg:max-w-[720px] flex flex-col items-center justify-center transform-gpu"
          >
            {/* Bag Image with 3D Pop & Spring Transition */}
            <div className="relative w-full flex items-center justify-center min-h-[440px] sm:min-h-[520px] lg:min-h-[580px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeBag.id || activeBag.image}
                  custom={direction}
                  variants={bagMotionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative w-full flex items-center justify-center transform-gpu"
                >
                  {/* Subtle Light Gleam Streak crossing over bag */}
                  <motion.div 
                    key={`gleam-${activeBag.id}`}
                    initial={{ x: '-120%', opacity: 0 }}
                    animate={{ x: '220%', opacity: [0, 0.45, 0] }}
                    transition={{ duration: 1.1, delay: 0.2, ease: 'easeInOut' }}
                    className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-22deg] pointer-events-none z-20"
                  />

                  <img 
                    src={activeBag.image} 
                    alt={activeBag.colorName} 
                    onError={(e) => {
                      e.currentTarget.src = '/images/bag-green.png';
                    }}
                    className="w-full h-auto max-h-[480px] sm:max-h-[540px] lg:max-h-[620px] object-contain pointer-events-none drop-shadow-[0_30px_50px_rgba(0,0,0,0.1)]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Realistic Ground Floor Shadow below the bag */}
              <motion.div
                animate={{
                  scale: [1, 0.85, 1],
                  opacity: [0.35, 0.2, 0.35],
                }}
                transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
                className="absolute -bottom-4 sm:-bottom-6 w-[70%] h-8 bg-black/25 rounded-[100%] blur-xl pointer-events-none -z-10"
              />
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default BiteStyleHero;
