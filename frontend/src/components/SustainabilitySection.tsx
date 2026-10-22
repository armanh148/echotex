'use client';

import React, { useState, useMemo } from 'react';
import { 
  Recycle, 
  Cloud, 
  TreePine, 
  CheckCircle2, 
  ShieldCheck, 
  Check
} from 'lucide-react';
import { useStore } from '../store/useStore';

export const SustainabilitySection: React.FC = () => {
  const { siteSettings } = useStore();
  const [monthlyBags, setMonthlyBags] = useState<number>(25000);

  const esgMetrics = useMemo(() => {
    const plasticSavedLbs = Math.round(monthlyBags * 12 * 0.045);
    const co2SavedTons = ((monthlyBags * 12 * 0.082) / 1000).toFixed(1);
    const treeEquiv = Math.round(Number(co2SavedTons) * 45);

    return {
      plasticSavedLbs,
      co2SavedTons,
      treeEquiv
    };
  }, [monthlyBags]);

  const circularSteps = siteSettings?.sustainabilityConfig?.circularSteps || [
    {
      step: '01',
      title: 'Responsible Material Sourcing',
      desc: 'Utilizing certified post-industrial virgin PP regrind, non-GMO corn-derived PLA resins, and reclaimed apparel cut-offs.'
    },
    {
      step: '02',
      title: 'Ultrasonic Zero-Solvent Welding',
      desc: 'Sonic molecular excitation bonds fabric panels with unbreakable tensile strength without toxic glues or volatile emissions.'
    },
    {
      step: '03',
      title: 'Extended Multi-Year Lifecycle',
      desc: 'Engineered to withstand 125+ heavy shopping cycles, each tote displaces hundreds of single-use polybags from city landfills.'
    },
    {
      step: '04',
      title: 'Pure Mechanical & Biological Recovery',
      desc: '100% pelletized back into polymer pellets at end-of-life, while our bio line returns to soil biomass within 90-180 days.'
    }
  ];

  const clientExperiences = [
    {
      metric: '1.4M Plastic Bags Displaced',
      quote:
        'Transitioning 180 grocery retail locations to Ecotex reusable loop totes slashed our packaging procurement overhead by 34% in Year 1 while completely eliminating single-use plastic penalty fees under California SB 270.',
      author: 'David Sterling',
      role: 'Director of Retail Supply Chain',
      company: 'Pacific Coast Grocers Alliance'
    },
    {
      metric: '100% Brand Retention Rating',
      quote:
        'The flexographic imprint quality and structural durability of the 100 GSM laminated totes exceeded our expectations. Customers actively reuse our branded bags for months, delivering continuous retail impressions across urban markets.',
      author: 'Claire Devereux',
      role: 'VP of Brand Operations',
      company: 'Aura Lifestyle & Apparel'
    },
    {
      metric: '40% Cost Savings vs Disposables',
      quote:
        'Factory-direct FOB container shipping with guaranteed GSM consistency gave our distribution centers the reliability we could not get with brokers. Zero batch defects across 500,000 custom carriers.',
      author: 'Marcus Chen',
      role: 'Chief Procurement Officer',
      company: 'Apex Industrial Logistics'
    }
  ];

  return (
    <div className="w-full bg-[#f8fafc] text-[#0f172a] font-sans antialiased">
      
      {/* 4-Step Circular Engineering */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcfce7] text-[#166534] text-xs font-bold tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span>Closed Loop Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              How Ecotex Closes the Textile & Packaging Loop
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Industrial sustainability engineered through raw material stewardship, sonic thermal bonding, and complete post-use polymer recovery.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {circularSteps.map((st) => (
              <div
                key={st.step}
                className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200 hover:border-[#166534]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black font-mono text-[#166534] block mb-3">
                    {st.step}.
                  </span>
                  <h3 className="text-base font-bold text-[#0f172a] mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-[11px] font-semibold text-[#166534]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>Verified Clean Standard</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 1: INTERACTIVE CORPORATE ESG ESTIMATOR */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#0e3d24] text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden border border-[#166534]/40">
            {/* Ambient Radial Glow */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#166534]/30 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-bold tracking-widest uppercase text-[#4ade80] mb-3 block">
                Corporate Environmental Impact Calculator
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Measure Your Organization's Environmental Dividends
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-light max-w-2xl">
                Drag the slider to input your retail network's current monthly single-use bag consumption to calculate real-world landfill and carbon offsets.
              </p>
            </div>

            {/* Estimator Engine: Slider + 3 Dynamic Metric Cards */}
            <div className="relative z-10 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Interactive Slider Container */}
              <div className="lg:col-span-6 bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-inner">
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                    Monthly Bag Consumption
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-[#22c55e] tabular-nums flex items-baseline gap-1">
                    <span>{monthlyBags.toLocaleString()}</span>
                    <span className="text-xs font-sans text-slate-300 font-normal">bags / month</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="1000"
                  max="250000"
                  step="1000"
                  value={monthlyBags}
                  onChange={(e) => setMonthlyBags(Number(e.target.value))}
                  aria-label="Monthly Bag Consumption Slider"
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#22c55e] transition-all"
                />

                {/* Range Markers */}
                <div className="flex justify-between text-[11px] text-slate-300 mt-3 font-mono">
                  <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setMonthlyBags(1000)}>
                    1,000 (Local Boutique)
                  </span>
                  <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setMonthlyBags(100000)}>
                    100,000
                  </span>
                  <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setMonthlyBags(250000)}>
                    250,000+ (Regional / Chain)
                  </span>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                    <span>EPA WARM Model Compatible</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#22c55e]">
                    ~{(monthlyBags * 12).toLocaleString()} bags displaced/yr
                  </span>
                </div>

              </div>

              {/* Right Column: 3 Dynamic Metric Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Metric Card 1: Virgin Plastic Diverted */}
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center hover:border-[#22c55e]/50 hover:bg-white/10 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#22c55e]/20 flex items-center justify-center text-[#22c55e] mb-3 group-hover:scale-110 transition-transform">
                      <Recycle className="w-5 h-5" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums tracking-tight">
                      {esgMetrics.plasticSavedLbs.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-2 font-medium leading-snug">
                    lbs Virgin Plastic Diverted/yr
                  </div>
                </div>

                {/* Metric Card 2: CO2 Avoided */}
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center hover:border-[#22c55e]/50 hover:bg-white/10 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#22c55e]/20 flex items-center justify-center text-[#22c55e] mb-3 group-hover:scale-110 transition-transform">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums tracking-tight">
                      {esgMetrics.co2SavedTons}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-2 font-medium leading-snug">
                    Metric Tons CO2 Avoided/yr
                  </div>
                </div>

                {/* Metric Card 3: Tree Offset Equivalent */}
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center hover:border-[#22c55e]/50 hover:bg-white/10 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#22c55e]/20 flex items-center justify-center text-[#22c55e] mb-3 group-hover:scale-110 transition-transform">
                      <TreePine className="w-5 h-5" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums tracking-tight">
                      {esgMetrics.treeEquiv.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-2 font-medium leading-snug">
                    Tree Offset Equivalent
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: ENTERPRISE CLIENT EXPERIENCES */}
      <section className="py-16 sm:py-24 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#166534] block mb-2">
              | ENTERPRISE CLIENT EXPERIENCES |
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              Trusted by Retail & Industrial Leaders
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Verified outcomes from retail chains, FMCG brands, and distribution operators who upgraded to factory-direct Ecotex reusable packaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {clientExperiences.map((exp, idx) => (
              <div
                key={idx}
                className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcfce7] border border-[#22c55e]/30 text-[#166534] text-xs font-bold font-mono mb-5">
                    <Check className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>{exp.metric}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{exp.quote}"
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#166534]/10 text-[#166534] font-bold text-xs flex items-center justify-center border border-[#166534]/20 group-hover:bg-[#166534] group-hover:text-white transition-colors">
                    {exp.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">
                      {exp.author}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {exp.role}
                    </p>
                    <p className="text-[11px] text-[#166534] font-semibold">
                      {exp.company}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default SustainabilitySection;
