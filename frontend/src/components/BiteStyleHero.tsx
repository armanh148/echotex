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
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center font-sans antialiased text-[#0f172a] overflow-hidden py-10 sm:py-14 lg:py-20 px-4 sm:px-8 lg:px-12 xl:px-16"
    >
      {/* Full Hero Panoramic Background Image */}
      {currentBgImage ? (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img 
            src={currentBgImage} 
            alt="Eco-friendly wholesale packaging showcase backdrop" 
            className="w-full h-full object-cover object-center" 
          />
          {/* Soft atmospheric gradient */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
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

      {/* Main Content Area: Heading, Paragraph, and Button Card */}
      <div className="relative z-10 w-full max-w-[1820px] mx-auto flex items-center justify-start">
        <motion.div 
          initial={{ opacity: 0, x: -50, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-gradient-to-br from-[#052e1b]/40 via-[#0a3c23]/28 to-[#021a0e]/42 backdrop-blur-lg rounded-[32px] sm:rounded-[40px] lg:rounded-[48px] p-8 sm:p-12 md:p-14 lg:p-16 xl:p-20 flex flex-col justify-center items-start text-left transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-white/25 hover:border-emerald-400/40 min-h-[500px] sm:min-h-[560px] overflow-hidden"
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
      </div>
    </section>
  );
};

export default BiteStyleHero;
