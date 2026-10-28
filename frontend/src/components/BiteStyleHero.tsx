'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

interface BiteStyleHeroProps {
  onNavigateToShop: () => void;
  onOpenCart?: () => void;
}

export const BiteStyleHero: React.FC<BiteStyleHeroProps> = ({
  onNavigateToShop
}) => {
  const { heroConfig } = useStore();

  // Parse title for line breaks and highlighting
  const titleLines = (heroConfig.title || "It's time to\npack better.").split('\n');

  // Determine active background image: defaults to home-hero-bg.jpg unless explicitly set to 'none'
  const currentBgImage = 
    heroConfig.backgroundImage === 'none' 
      ? null 
      : (heroConfig.backgroundImage || '/images/home-hero-bg.jpg');

  const hasProductImage = Boolean(
    heroConfig.productImage && 
    heroConfig.productImage.trim() !== '' && 
    heroConfig.productImage !== 'none'
  );

  return (
    <section 
      className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center font-sans antialiased text-[#0f172a] overflow-hidden py-12 sm:py-16 lg:py-24 px-4 sm:px-8 lg:px-12 xl:px-16"
    >
      {/* Full Hero Panoramic Background Image with soft dark overlay for text contrast */}
      {currentBgImage ? (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img 
            src={currentBgImage} 
            alt="Eco-friendly wholesale packaging showcase backdrop" 
            className="w-full h-full object-cover object-center" 
          />
          {/* Atmospheric gradient overlay so white typography & bag cutout are crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70 pointer-events-none" />
        </div>
      ) : (
        /* Fallback gradient background */
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f172a]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/50 via-[#0f172a] to-[#022c22]/60" />
        </div>
      )}

      {/* Hero Content: Centered over background, or 2-Column Grid if product cutout is active */}
      <div className={`relative z-10 w-full ${hasProductImage ? 'max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center' : 'max-w-4xl mx-auto flex flex-col justify-center items-center text-center'}`}>
        
        {/* ======================================================
            HEADING, PARAGRAPH, AND BUTTON
           ====================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: hasProductImage ? 0 : 30, x: hasProductImage ? -40 : 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className={hasProductImage ? "lg:col-span-6 xl:col-span-7 flex flex-col justify-center items-center text-center lg:items-start lg:text-left order-1" : "flex flex-col justify-center items-center text-center"}
        >
          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className={`font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.06] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] ${hasProductImage ? 'max-w-2xl' : 'max-w-4xl'}`}
          >
            {titleLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {idx === titleLines.length - 1 ? (
                  <span>
                    <span className="text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
                      {line.split(' ').slice(0, -1).join(' ')}{' '}
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#86efac] to-[#a7f3d0] drop-shadow-[0_2px_16px_rgba(74,222,128,0.55)]">
                      {line.split(' ').slice(-1)}
                    </span>
                  </span>
                ) : (
                  <span className="text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
                    {line}<br />
                  </span>
                )}
              </React.Fragment>
            ))}
          </motion.h1>

          {/* Paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 sm:mt-7 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-xl font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
          >
            {heroConfig.subtitle}
          </motion.p>

          {/* Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 sm:mt-10"
          >
            <motion.button
              onClick={onNavigateToShop}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden min-w-[220px] sm:min-w-[260px] py-4 sm:py-5 px-10 rounded-full bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#10b981] text-white font-extrabold text-base sm:text-lg tracking-wide transition-all duration-300 shadow-[0_12px_30px_rgba(34,197,94,0.45)] hover:shadow-[0_18px_45px_rgba(34,197,94,0.6)] cursor-pointer flex items-center justify-center gap-3 group border border-emerald-300/40"
            >
              {/* Shimmer Light Streak */}
              <motion.div 
                animate={{ x: ['-120%', '220%'] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', repeatDelay: 1 }}
                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg] pointer-events-none"
              />

              <span className="relative z-10 font-bold">{heroConfig.ctaText || 'Shop Now'}</span>
              
              <div className="relative z-10 bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ======================================================
            RIGHT: PRODUCT BAG IMAGE (Only if configured)
           ====================================================== */}
        {hasProductImage && (
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[520px] select-none order-2"
          >
            {/* Soft ambient green backlight glow */}
            <div className="absolute inset-0 max-w-[460px] max-h-[460px] m-auto rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none -z-10" />

            {/* Floating Product Bag Cutout */}
            <motion.div
              animate={{ 
                y: [0, -12, 0],
                rotate: [-0.5, 0.5, -0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 5.5, 
                ease: 'easeInOut' 
              }}
              className="relative flex flex-col items-center justify-center w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px]"
            >
              <img 
                src={heroConfig.productImage} 
                alt="Ecotex Wholesale Packaging Bag" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-auto max-h-[420px] sm:max-h-[480px] lg:max-h-[540px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)] select-none pointer-events-none"
              />

              {/* Realistic Ground Floor Shadow */}
              <motion.div
                animate={{
                  scale: [1, 0.86, 1],
                  opacity: [0.35, 0.2, 0.35],
                }}
                transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
                className="absolute -bottom-4 sm:-bottom-6 w-[70%] h-8 bg-black/40 rounded-[100%] blur-xl pointer-events-none -z-10"
              />
            </motion.div>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default BiteStyleHero;
