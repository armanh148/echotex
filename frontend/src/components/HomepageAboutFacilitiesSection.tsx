'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Leaf, 
  Factory, 
  MapPin, 
  ArrowRight, 
  ExternalLink,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { ActiveSection } from '../types';

interface HomepageAboutFacilitiesSectionProps {
  onNavigate?: (section: ActiveSection) => void;
}

export const HomepageAboutFacilitiesSection: React.FC<HomepageAboutFacilitiesSectionProps> = ({
  onNavigate
}) => {
  const { siteSettings } = useStore();

  const aConfig = siteSettings?.aboutConfig;
  const fConfig = siteSettings?.facilitiesConfig;

  // If explicitly disabled in admin, hide this section
  if (fConfig?.showOnHomepage === false) {
    return null;
  }

  const founderName = aConfig?.founderName || 'Rashid Mahmood';
  const founderRole = aConfig?.founderRole || 'Managing Director & Founder, Ecotex Inc.';
  const founderImage = aConfig?.founderImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85';

  const defaultHubs = [
    {
      name: 'Corona Distribution & Testing Hub',
      tag: 'US Headquarters & Fulfillment',
      address: siteSettings?.facilityAddress || '1200 Industrial Parkway, Corona, CA 92881',
      capabilities: ['Same-Day Pallet Dispatch', 'ASTM Tensile Testing Lab', 'Custom Sample Prototyping'],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      googleMapsUrl: siteSettings?.contactConfig?.googleMapsUrl || 'https://maps.google.com/?q=1200+Industrial+Parkway,+Corona,+CA+92881'
    },
    {
      name: 'Primary Manufacturing Plant',
      tag: 'Heavy Industrial Production',
      address: siteSettings?.plantAddress || 'Sector 15, Korangi Industrial Area, Karachi, PK',
      capabilities: ['Automated Ultrasonic Welding', '8-Color Flexographic Printing', 'Virgin PP & Bio-PLA Extrusion'],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      googleMapsUrl: 'https://maps.google.com/?q=Korangi+Industrial+Area+Karachi'
    }
  ];

  const hubs = (fConfig?.hubs && fConfig.hubs.length > 0) ? fConfig.hubs : defaultHubs;

  return (
    <div className="w-full bg-[#f8fafc] text-[#0f172a] font-sans antialiased border-t border-slate-200/80">
      
      {/* ========================================================
          PART 1: ABOUT ECOTEX BRAND STORY & LEADERSHIP SHOWCASE
         ======================================================== */}
      <section className="py-12 sm:py-24 lg:py-28 w-full max-w-[1820px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase text-[#166534]">
                | SUSTAINABILITY & CIRCULAR PACKAGING
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0f172a] uppercase leading-[1.08] mb-4 sm:mb-6">
              {aConfig?.storyTitle || siteSettings?.aboutTitle || 'We Are Ecotex'}
            </h2>

            <blockquote className="border-l-4 border-[#166534] pl-3.5 sm:pl-6 my-2 text-sm sm:text-xl lg:text-2xl font-medium text-slate-900 leading-relaxed italic">
              "{aConfig?.missionQuote || siteSettings?.aboutMission || 'We engineered our circular manufacturing framework around a simple premise: commercial packaging can protect goods and elevate brands without ever polluting our natural world.'}"
            </blockquote>

            <div className="mt-6 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              <p>
                {aConfig?.storyParagraph1 || siteSettings?.aboutStory || 'Founded to combat the global crisis of single-use plastic waste, Ecotex Inc. operates as a vertically integrated packaging manufacturer. We specialize in high-tensile reusable non-woven polypropylene totes, certified compostable cornstarch blends, and reclaimed post-industrial cotton wiping textiles.'}
              </p>
              {aConfig?.storyParagraph2 && (
                <p>
                  {aConfig.storyParagraph2}
                </p>
              )}
            </div>

            {/* Founder Signature Area */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-[#0f172a]">
                  {founderName}
                </p>
                <p className="text-xs font-semibold text-[#166534]">
                  {founderRole}
                </p>
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:text-[#14532d] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Read Full Heritage Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Founder Portrait Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md group">
              <div className="absolute inset-0 bg-[#dcfce7] rounded-3xl transform translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-200 aspect-[4/5]">
                <img 
                  src={founderImage} 
                  alt={founderName}
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                
                {/* Floating Bottom Badge */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/40 shadow-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0f172a]">Manufacturing Leadership</p>
                    <p className="text-[11px] text-[#166534] font-semibold">20+ Years Polymer Engineering</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#166534] text-white flex items-center justify-center shadow-xs">
                    <Leaf className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          PART 2: MANUFACTURING FACILITIES & PRODUCTION HUBS
         ======================================================== */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
        <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase text-[#166534] block mb-2">
              | DIRECT MILL PRODUCTION & CAPACITIES |
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0f172a] uppercase">
              {fConfig?.title || 'Manufacturing Facilities & Fulfillment Hubs'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {fConfig?.subtitle || 'Dual-continental operations combining California wholesale fulfillment with high-speed automated manufacturing mills.'}
            </p>
          </div>

          {/* 3 Metric Stat Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-10 sm:mb-14">
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-center">
              <p className="text-2xl sm:text-4xl font-black font-mono text-[#166534]">
                {fConfig?.annualCapacity || '50,000,000+'}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-1">
                Units Produced Annually
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Zero-landfill certified production
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-center">
              <p className="text-3xl sm:text-4xl font-black font-mono text-[#166534]">
                {fConfig?.certificationsMetric || 'ISO 9001 & ASTM'}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-1">
                Laboratory Certified Standards
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                California SB 270 & ASTM D6400
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-center">
              <p className="text-3xl sm:text-4xl font-black font-mono text-[#166534]">
                {fConfig?.activeLinesMetric || '14 Extrusion Lines'}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-1">
                High-Speed Automated Capacity
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Ultrasonic seam welding & flexo print
              </p>
            </div>
          </div>

          {/* 2 Facility Hub Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hubs.map((hub, idx) => (
              <div 
                key={idx}
                className="group rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Photo Header */}
                <div className="relative w-full h-44 sm:h-64 overflow-hidden bg-slate-900">
                  <img
                    src={hub.image || (idx === 0 ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80' : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80')}
                    alt={hub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 text-slate-900 backdrop-blur-md shadow-xs">
                    {hub.tag}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {hub.name}
                    </h3>
                  </div>
                </div>

                {/* Hub Details */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                    <span>{hub.address}</span>
                  </div>

                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      Key Facility Capabilities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(hub.capabilities || []).map((cap, cIdx) => (
                        <span 
                          key={cIdx}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {hub.googleMapsUrl && (
                    <div className="pt-2 border-t border-slate-100">
                      <a
                        href={hub.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:text-[#14532d] uppercase tracking-wider transition-colors"
                      >
                        <span>Open Map & Directions</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomepageAboutFacilitiesSection;

