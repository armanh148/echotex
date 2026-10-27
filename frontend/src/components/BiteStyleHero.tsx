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

  return (
    <section 
      className="relative w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center font-sans antialiased text-[#0f172a] overflow-hidden py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12"
    >
      {/* Full Hero Panoramic Background Image with soft dark overlay for text contrast */}
      {currentBgImage ? (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img 
            src={currentBgImage} 
            alt="Eco-friendly wholesale packaging showcase backdrop" 
            className="w-full h-full object-cover object-center" 
          />
          {/* Atmospheric gradient overlay so white typography is crisp and readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/75 pointer-events-none" />
        </div>
      ) : (
        /* Fallback gradient background */
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f172a]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/50 via-[#0f172a] to-[#022c22]/60" />
        </div>
      )}

      {/* Clean Hero Layout: Heading, Paragraph, and Button */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        
        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl sm:max-w-3xl font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
        >
          {heroConfig.subtitle}
        </motion.p>

        {/* Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 sm:mt-12"
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

      </div>
    </section>
  );
};

export default BiteStyleHero;
