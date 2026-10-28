import React, { useState } from 'react';
import { ActiveSection } from '../types';
import { useStore } from '../store/useStore';
import { Logo } from './Logo';
import { 
  Check, 
  ArrowRight, 
  Recycle,
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Youtube 
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (section: ActiveSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const siteSettings = useStore((state) => state.siteSettings);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
  };

  const handleNav = (section: ActiveSection) => {
    if (onNavigate) {
      onNavigate(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#0a1811] text-slate-300 font-sans antialiased">

      {/* ========================================================
          1. TOP NEWSLETTER BANNER (EXACT LAYOUT OF REFERENCE IMAGE 2)
             Photographic background with fused pill subscription bar
         ======================================================== */}
      <div className="relative w-full overflow-hidden py-12 sm:py-16 px-6 md:px-12 lg:px-16 border-b border-white/10">
        
        {/* Background Editorial Photo with Dark Emerald Tint */}
        <div className="absolute inset-0">
          <img
            src={siteSettings?.footerConfig?.newsletterBgImage || "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80"}
            alt="Corporate procurement and packaging design workspace"
            className="w-full h-full object-cover object-center grayscale opacity-30"
          />
          {/* Lighter Ecotex Green gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f5132]/90 via-[#198754]/85 to-[#0f5132]/90" />
        </div>

        {/* Banner Content (Split 50/50: Title on Left, Fused Pill on Right) */}
        <div className="relative z-10 w-full max-w-[1820px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left: Heading */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-[0.12em] text-white">
              {siteSettings?.footerConfig?.newsletterTitle || 'Subscribe To Our Quarterly Newsletter'}
            </h3>
            {siteSettings?.footerConfig?.newsletterSubtitle && (
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                {siteSettings.footerConfig.newsletterSubtitle}
              </p>
            )}
          </div>

          {/* Right: Pill-Shaped Input & Subscribe Button */}
          <div className="w-full lg:w-auto max-w-xl">
            {!newsletterSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex items-center w-full">
                <div className="relative flex items-center w-full bg-white rounded-full p-1 shadow-2xl border border-white/20">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-5 py-3 text-xs sm:text-sm text-[#0f172a] placeholder:text-slate-400 bg-transparent focus:outline-none rounded-l-full"
                  />
                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-[#07140e] font-black text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-[#166534] border border-[#22c55e]/40 py-3 px-6 rounded-full flex items-center justify-center gap-2 text-xs font-bold text-white shadow-lg animate-fadeIn">
                <Check className="w-4 h-4 text-[#22c55e]" />
                <span>Thank you! You are subscribed to our quarterly briefing.</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================
          2. MAIN FOOTER BODY (5 COLUMNS - EXACT MATCH TO IMAGE 2)
         ======================================================== */}
      <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          
          {/* Column 1: Brand Logo & Address (4 cols) */}
          <div className="lg:col-span-4">
            {/* Dynamic Brand Logo */}
            <div className="flex items-center">
              <Logo variant="dark" size="md" />
            </div>

            {/* Address & Email */}
            <div className="mt-6 space-y-1.5 text-xs text-slate-300 font-light leading-relaxed">
              <p className="font-normal text-white">
                {siteSettings?.facilityAddress || siteSettings?.contactConfig?.facilityAddress || '1200 Industrial Parkway, Corona, CA 92881'}
              </p>
              <p className="pt-2">
                <a 
                  href={`mailto:${siteSettings?.email || siteSettings?.contactConfig?.email || 'orders@ecotexinc.com'}`} 
                  className="text-[#86efac] hover:text-[#22c55e] transition-colors underline font-medium"
                >
                  {siteSettings?.email || siteSettings?.contactConfig?.email || 'orders@ecotexinc.com'}
                </a>
              </p>
            </div>
          </div>


          {/* Column 2: ECOTEX Navigation (2 cols) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-black uppercase tracking-[0.18em] text-white mb-4">
              ECOTEX
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('home')} 
                  className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('about')} 
                  className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('shop')} 
                  className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                >
                  Shop
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('contact')} 
                  className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>



          {/* Column 3: SERVICES / PRODUCTS (2 cols) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-black uppercase tracking-[0.18em] text-white mb-4">
              SERVICES
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('shop')} 
                  className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                >
                  Non-Woven Totes
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('shop')} 
                  className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                >
                  D-Cut Bags
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('shop')} 
                  className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                >
                  Laminated Gift Bags
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('contact')} 
                  className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                >
                  Custom Flexo Print
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: EVENTS / STANDARDS (2 cols) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-black uppercase tracking-[0.18em] text-white mb-4">
              EVENTS
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a href="#quote-form" className="hover:text-[#22c55e] transition-colors">
                  Pack Expo 2026
                </a>
              </li>
              <li>
                <a href="#quote-form" className="hover:text-[#22c55e] transition-colors">
                  Sustainable Retail
                </a>
              </li>
              <li>
                <a href="#quote-form" className="hover:text-[#22c55e] transition-colors">
                  SB 270 Workshops
                </a>
              </li>
              <li>
                <a href="#quote-form" className="hover:text-[#22c55e] transition-colors">
                  Sample Roadshow
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: FOLLOW (2 cols) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-black uppercase tracking-[0.18em] text-white mb-4">
              FOLLOW
            </h5>
            <div className="flex items-center gap-3 text-slate-300">
              <a 
                href={siteSettings?.contactConfig?.twitterUrl || "https://twitter.com"} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Twitter"
                className="hover:text-[#22c55e] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={siteSettings?.contactConfig?.facebookUrl || "https://facebook.com"} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook"
                className="hover:text-[#22c55e] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={siteSettings?.contactConfig?.linkedinUrl || "https://linkedin.com"} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn"
                className="hover:text-[#22c55e] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube"
                className="hover:text-[#22c55e] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href={siteSettings?.contactConfig?.instagramUrl || "https://instagram.com"} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="hover:text-[#22c55e] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* ========================================================
            3. BOTTOM LEGAL BAR (DIVIDER LINE + TERMS + COPYRIGHT)
           ======================================================== */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* Left: TERMS & CONDITIONS, PRIVACY POLICY, SITEMAP */}
          <div className="flex items-center gap-6 font-semibold tracking-wider uppercase text-[11px]">
            <a href="#privacy" className="hover:text-[#22c55e] transition-colors">
              TERMS & CONDITIONS
            </a>
            <a href="#privacy" className="hover:text-[#22c55e] transition-colors">
              PRIVACY POLICY
            </a>
            <a href="#sitemap" className="hover:text-[#22c55e] transition-colors">
              SITEMAP
            </a>
          </div>



          {/* Right: Copyright */}
          <div className="text-right text-[11px] text-slate-400 font-light">
            <span>{siteSettings?.footerConfig?.copyrightNotice || siteSettings?.copyrightNotice || 'Copyright 2026 © Ecotex Inc. All rights reserved.'}</span>
          </div>


        </div>

      </div>

    </footer>
  );
};

export default Footer;
