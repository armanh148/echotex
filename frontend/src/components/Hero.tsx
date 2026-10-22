import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { ActiveSection } from '../types';

interface HeroProps {
  onNavigate: (section: ActiveSection) => void;
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenQuote }) => {
  const [activeBagColor, setActiveBagColor] = useState<string>('#7ea242'); // default to olive green matching logo

  const colorOptions = [
    { label: 'Ecotex Olive', hex: '#7ea242' },
    { label: 'Deep Forest', hex: '#1b4329' },
    { label: 'Organic Sand', hex: '#e8e2d5' },
    { label: 'Midnight Black', hex: '#262626' }
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#e5edd8]">
      {/* Background organic atmosphere (measured, clean) */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-[#8ea853]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-10 w-80 h-80 bg-[#1b4329]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Concrete Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean unboxed metadata kicker (No pill candy, natural text) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#526a46] tracking-wide mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-[#7ea242]" />
              <span>Corona, California Manufacturing & Wholesale Hub</span>
              <span aria-hidden="true">·</span>
              <span>GRS 4.0 & ASTM Certified</span>
            </div>

            {/* Display Headline with balanced wrap */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#142817] leading-[1.1] tracking-tight [text-wrap:balance]">
              Sustainable Packaging for a Circular Future.
            </h1>

            {/* Sub-headline / Concrete Value Proposition */}
            <p className="mt-5 text-base sm:text-lg text-[#40543e] leading-relaxed max-w-2xl">
              Ecotex Inc. manufactures high-performance reusable non-woven bags, certified compostable packaging, and reclaimed industrial wiping textiles. Engineered for grocery chains, retail brands, and industrial partners seeking zero-waste compliance.
            </p>

            {/* Primary Action Zone */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => onNavigate('shop')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#1b4329] hover:bg-[#12311c] rounded-xl shadow-md transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1b4329]"
              >
                <span>Browse Products Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#8ea853]" />
              </button>

              <button
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#1b4329] bg-[#edf4e7] hover:bg-[#e2edd8] border border-[#d3e3c5] rounded-xl transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ea242]"
              >
                <span>Instant Bulk Quote Estimator</span>
              </button>
            </div>

            {/* Adjacent Proof Ticker (Claim-to-Proof Adjacency) */}
            <div className="mt-10 pt-8 border-t border-[#e2ebd6] grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1b4329] font-mono tabular-nums">
                  50M+
                </p>
                <p className="text-xs text-[#52684e] mt-1 font-medium">
                  Plastic Bags Displaced
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1b4329] font-mono tabular-nums">
                  -84%
                </p>
                <p className="text-xs text-[#52684e] mt-1 font-medium">
                  Carbon vs Virgin Poly
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1b4329] font-mono tabular-nums">
                  125+
                </p>
                <p className="text-xs text-[#52684e] mt-1 font-medium">
                  Reusable Trips / Bag
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1b4329] font-mono tabular-nums">
                  100%
                </p>
                <p className="text-xs text-[#52684e] mt-1 font-medium">
                  Recyclable & Non-Toxic
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Bag Showcase Anchor */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#dce8d2] relative">
              
              {/* Product Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#edf3e8]">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#7ea242]">
                    Signature Wholesale Model
                  </span>
                  <h3 className="text-lg font-bold text-[#142817]">
                    Heavy-Duty 80 GSM Box-Tote
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Starting at</span>
                  <span className="text-xl font-extrabold text-[#1b4329] font-mono tabular-nums">
                    $0.42
                  </span>
                  <span className="text-[11px] text-slate-500"> / unit</span>
                </div>
              </div>

              {/* Large Interactive Vector Preview */}
              <div className="my-6 py-6 bg-gradient-to-b from-[#f5f9f0] to-[#e8efe0] rounded-xl flex items-center justify-center relative border border-[#e1ebd7]">
                <svg viewBox="0 0 200 240" className="w-48 h-56 drop-shadow-xl transition-all duration-300">
                  {/* Webbing handles */}
                  <path
                    d="M 75 110 L 75 25 C 75 14 125 14 125 25 L 125 110"
                    fill="none"
                    stroke={activeBagColor === '#ffffff' || activeBagColor === '#e8e2d5' ? '#374151' : 'rgba(0,0,0,0.35)'}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Tote main body with dynamic color */}
                  <rect
                    x="42"
                    y="70"
                    width="116"
                    height="150"
                    rx="4"
                    fill={activeBagColor}
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="2"
                  />
                  {/* Side gusset fold depth */}
                  <path d="M 142 70 L 158 82 L 158 220 L 142 220 Z" fill="rgba(0,0,0,0.22)" />
                  {/* Handle box stitch cross */}
                  <rect x="71" y="80" width="10" height="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  <rect x="119" y="80" width="10" height="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  {/* Recycled Leaf Logo Imprint on bag */}
                  <circle cx="100" cy="138" r="24" fill="rgba(255,255,255,0.25)" />
                  <path
                    d="M 92 144 C 92 144 90 131 100 125 C 110 119 112 129 110 135 Z"
                    fill={activeBagColor === '#e8e2d5' ? '#1b4329' : '#ffffff'}
                  />
                  <text
                    x="100"
                    y="178"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="800"
                    fill={activeBagColor === '#e8e2d5' ? '#1b4329' : '#ffffff'}
                    letterSpacing="1"
                  >
                    ECOTEX INC.
                  </text>
                  <text
                    x="100"
                    y="190"
                    textAnchor="middle"
                    fontSize="6.5"
                    fill={activeBagColor === '#e8e2d5' ? '#4b5563' : 'rgba(255,255,255,0.85)'}
                  >
                    CORONA, CALIFORNIA
                  </text>
                </svg>
              </div>

              {/* Color Swatch Picker */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-medium text-[#465a43] mb-2">
                  <span>Available Fabric Colors</span>
                  <span className="font-semibold text-[#1b4329]">
                    {colorOptions.find((c) => c.hex === activeBagColor)?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setActiveBagColor(c.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        activeBagColor === c.hex
                          ? 'border-[#1b4329] scale-110 shadow-sm'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={`Select ${c.label}`}
                    >
                      {activeBagColor === c.hex && (
                        <div className={`w-2 h-2 rounded-full ${c.hex === '#e8e2d5' ? 'bg-[#1b4329]' : 'bg-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Spec Highlights */}
              <div className="mt-5 pt-4 border-t border-[#edf3e8] grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#f6f9f2] p-2 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Load Test</span>
                  <span className="font-bold text-[#142817]">35 lbs</span>
                </div>
                <div className="bg-[#f6f9f2] p-2 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Durability</span>
                  <span className="font-bold text-[#142817]">125+ trips</span>
                </div>
                <div className="bg-[#f6f9f2] p-2 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Print Area</span>
                  <span className="font-bold text-[#142817]">10" x 10"</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onNavigate('shop')}
                className="mt-4 w-full py-2.5 px-4 text-xs font-semibold text-center text-[#1b4329] bg-[#eef5e8] hover:bg-[#e3edd9] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Technical Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
