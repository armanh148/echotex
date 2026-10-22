'use client';

import React, { useState } from 'react';
import { 
  Recycle, 
  Sliders, 
  Headphones, 
  PackageCheck, 
  Printer, 
  Zap, 
  ArrowRight, 
  Check, 
  Mail, 
  Linkedin, 
  Twitter, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Leaf
} from 'lucide-react';

export default function AboutUsPage() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  const features = [
    {
      icon: Recycle,
      title: '100% Recyclable Fabrics',
      description: 'Manufactured with virgin and pre-consumer polypropylene, lab-certified for 125+ reuse cycles.'
    },
    {
      icon: Sliders,
      title: 'Easy to Customize',
      description: 'Flexible sizing, ultrasonic handle sealing, custom gusset depths, and pantone-matched dyed fabrics.'
    },
    {
      icon: Headphones,
      title: '24/7 B2B Global Support',
      description: 'Dedicated enterprise account directors for national retail chains, grocers, and FMCG brands.'
    },
    {
      icon: PackageCheck,
      title: 'Free Sample Verification',
      description: 'Physical pre-production specimen kits dispatched within 48 hours for tensile testing and color sign-off.'
    },
    {
      icon: Printer,
      title: 'High-Definition Flexo Print',
      description: 'Zero-VOC soy and water-based ink flexography delivering photo-sharp photographic brand imprints.'
    },
    {
      icon: Zap,
      title: 'Rapid Turnaround Times',
      description: 'Immediate dispatch for unbranded warehouse inventory and accelerated 10-14 day custom printed delivery.'
    }
  ];

  const teamMembers = [
    {
      name: 'Rashid Mahmood',
      role: 'Managing Director & Founder',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85',
      bio: 'Pioneered circular non-woven manufacturing across North America and South Asia with over two decades in sustainable polymer engineering.',
      linkedin: '#',
      twitter: '#',
      email: 'rashid@ecotexinc.com'
    },
    {
      name: 'Farah Al-Sayed',
      role: 'Head of Quality & Materials Engineering',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85',
      bio: 'Leads our ASTM D6400 biodegradable testing laboratories and Global Recycled Standard (GRS) chain-of-custody compliance.',
      linkedin: '#',
      twitter: '#',
      email: 'farah@ecotexinc.com'
    },
    {
      name: 'Marcus Vance',
      role: 'Chief Sustainability Officer',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85',
      bio: 'Oversees enterprise carbon reduction accounting and California SB 270 / SB 54 regulatory packaging compliance.',
      linkedin: '#',
      twitter: '#',
      email: 'marcus@ecotexinc.com'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans antialiased selection:bg-[#166534] selection:text-white">

      {/* ========================================================
          1. EDITORIAL HERO BANNER (UMBRA REFERENCE STYLE)
         ======================================================== */}
      <section className="relative w-full h-[520px] sm:h-[600px] md:h-[680px] bg-slate-950 overflow-hidden flex items-center justify-center">
        {/* Background Visual: Corporate studio founders environment */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=85')`
          }}
        />
        {/* Editorial Vignette & Dark Tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/70" />

        {/* Center Overlay Typography */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#22c55e] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            Ecotex Inc. Packaging Heritage
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.18em] uppercase text-white leading-none">
            About Us
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            A sustainable future for packaging. Engineered with purpose, manufactured for impact.
          </p>

          {/* Minimalist Breadcrumb with Green Accent */}
          <nav className="mt-8 flex items-center justify-center gap-2 text-xs font-medium tracking-wider text-slate-400" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-[#22c55e] font-bold">/</span>
            <span className="text-white font-semibold">About Us</span>
          </nav>
        </div>
      </section>

      {/* ========================================================
          2. "WE ARE ECOTEX" & FOUNDER SHOWCASE (SPLIT 2-COLUMN)
         ======================================================== */}
      <section className="py-20 sm:py-28 lg:py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand Story & Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Small Sub-heading in Green */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#166534]">
                | SUSTAINABILITY & INNOVATION
              </span>
            </div>

            {/* Large Section Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0f172a] uppercase leading-[1.08] mb-8">
              We Are Ecotex
            </h2>

            {/* Intro Quote / Lead Paragraph */}
            <blockquote className="border-l-3 border-[#166534] pl-5 sm:pl-6 my-2 text-lg sm:text-xl font-medium text-slate-900 leading-relaxed italic">
              "We engineered our circular manufacturing framework around a simple premise: commercial packaging can protect goods and elevate brands without ever polluting our natural world."
            </blockquote>

            {/* Detailed Story Body */}
            <div className="mt-6 space-y-5 text-sm sm:text-base text-[#475569] leading-relaxed font-normal">
              <p>
                Founded to combat the global crisis of single-use plastic waste, Ecotex Inc. operates as a vertically integrated packaging manufacturer. We specialize in high-tensile reusable non-woven polypropylene totes, certified compostable cornstarch blends, and reclaimed post-industrial cotton wiping textiles.
              </p>
              <p>
                From our corporate headquarters in California to state-of-the-art automated manufacturing facilities, every product is subjected to rigorous tensile testing, automated ultrasonic seam welding, and non-toxic water-based printing. We empower grocery retailers, boutique lifestyle brands, and logistics operations across the globe to achieve zero-waste compliance with full chain-of-custody audit trails.
              </p>
            </div>

            {/* Digital Calligraphic Founder Signature */}
            <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col items-start">
              {/* Stylized Signature Vector */}
              <svg className="w-48 h-14 text-slate-800" viewBox="0 0 240 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Rashid Mahmood signature">
                <path 
                  d="M15 48 C 35 15, 45 10, 60 30 C 72 45, 68 55, 85 25 C 95 10, 110 40, 130 35 C 150 30, 140 20, 165 25 C 185 30, 195 45, 225 20" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M 40 45 Q 90 52 180 38" 
                  stroke="currentColor" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                />
              </svg>
              <span className="mt-2 text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                Rashid Mahmood
              </span>
              <span className="text-[11px] font-semibold text-[#166534] tracking-wide">
                Managing Director & Founder, Ecotex Inc.
              </span>
            </div>

          </div>

          {/* Right Column: Sleek High-Contrast Founder Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              {/* Architectural Frame Offset Backdrop */}
              <div className="absolute inset-0 bg-[#dcfce7] rounded-2xl transform translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-100 border border-slate-200 aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85" 
                  alt="Rashid Mahmood, Founder of Ecotex Inc."
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                
                {/* Floating Micro Badge */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-white/40 shadow-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0f172a]">Leadership</p>
                    <p className="text-[10px] text-[#166534] font-semibold">20+ Years Sustainable Manufacturing</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center">
                    <Leaf className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. "WHY CHOOSE US" & MANUFACTURING PROCESS (SPLIT SECTION)
         ======================================================== */}
      <section className="py-20 sm:py-28 bg-[#f8fafc] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Side: Collaboration Workshop Image */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85" 
                  alt="Ecotex engineering team inspecting sustainable fabric samples" 
                  className="w-full h-[420px] sm:h-[480px] lg:h-[540px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-transparent to-transparent" />
                
                {/* Corner Stat Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-4 rounded-xl border border-slate-200/80 shadow-xl max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#dcfce7] text-[#166534]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xl font-mono font-black text-[#0f172a]">125+ Uses</p>
                      <p className="text-[11px] font-medium text-slate-500">ASTM D6400 & GRS Certified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Section Title & 6-Item Clean Grid */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
              
              <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#166534] mb-2">
                | INDUSTRIAL PRECISION & STANDARDS
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a] uppercase leading-tight mb-4">
                Why Choose Us
              </h2>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-8">
                We combine German ultrasonic welding machinery, ISO 9001 certified batch audits, and non-toxic soy formulations to deliver high-capacity packaging engineered to outlast disposable plastic.
              </p>

              {/* 6-Item Grid (2 cols x 3 rows) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
                {features.map((feat, index) => {
                  const Icon = feat.icon;
                  return (
                    <div 
                      key={index}
                      className="group p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#166534] hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-10 h-10 rounded-lg bg-[#dcfce7] text-[#166534] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#166534] group-hover:text-white transition-all duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-[#0f172a] tracking-tight group-hover:text-[#166534] transition-colors">
                          {feat.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed pl-13">
                        {feat.description}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4. "MEET OUR TEAM" LEADERSHIP CARDS
         ======================================================== */}
      <section className="py-20 sm:py-28 lg:py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#166534] block mb-2">
            | LEADERSHIP & VISION |
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0f172a] uppercase">
            Meet Our Team
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#475569]">
            The experts behind global sustainable packaging.
          </p>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group relative flex flex-col items-center"
            >
              {/* Photo Container */}
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Floating Bottom White Badge (Umbra Style overlap) */}
              <div className="relative -mt-14 w-[90%] bg-white p-5 rounded-xl shadow-xl border border-slate-200 text-center transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-[#166534] mt-0.5 tracking-wide">
                  {member.role}
                </p>

                {/* Micro Social Icons on Hover */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-slate-400">
                  <a 
                    href={member.linkedin}
                    className="p-1.5 rounded-full hover:bg-[#dcfce7] hover:text-[#166534] transition-colors"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href={member.twitter}
                    className="p-1.5 rounded-full hover:bg-[#dcfce7] hover:text-[#166534] transition-colors"
                    aria-label={`${member.name} Twitter`}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a 
                    href={`mailto:${member.email}`}
                    className="p-1.5 rounded-full hover:bg-[#dcfce7] hover:text-[#166534] transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          5. LUXURY DARK FOOTER (HIGH-CONTRAST OBSIDIAN)
         ======================================================== */}
      <footer className="bg-[#0b1320] text-slate-300 border-t border-slate-800 pt-16 sm:pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          
          {/* Main 4-Column Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-slate-800/80">
            
            {/* Column 1: Brand & Mission */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2.5">
                {/* Ecotex Recycle Triangle Leaf Logo */}
                <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center text-white shadow-md">
                  <Recycle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight text-white block leading-none">
                    ECO<span className="text-[#22c55e]">TEX</span> INC.
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">
                    One Stop Packaging Solution
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                A leading industrial enterprise providing certified sustainable non-woven packaging, biodegradable shopping solutions, and reclaimed circular textiles for commercial partners worldwide.
              </p>

              <div className="mt-5 flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-[#22c55e]" />
                <span>Zero Single-Use Plastic Mandate</span>
              </div>
            </div>

            {/* Column 2: Operating / Factory Hours */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#22c55e]" />
                Factory Hours
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex justify-between pb-1.5 border-b border-slate-800/60">
                  <span>Mon - Fri:</span>
                  <span className="font-semibold text-white">8:00 AM - 7:00 PM</span>
                </li>
                <li className="flex justify-between pb-1.5 border-b border-slate-800/60">
                  <span>Saturday:</span>
                  <span className="font-semibold text-white">9:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="text-slate-500 font-medium">Closed</span>
                </li>
                <li className="pt-2 text-[11px] text-[#22c55e] font-semibold">
                  24/7 Global Order Despatch
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#22c55e]" />
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about-us" className="text-white font-semibold transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#22c55e]" />
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/shop" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#22c55e]" />
                    Shop Catalog
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#22c55e]" />
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Global Offices */}
            <div className="lg:col-span-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#22c55e]" />
                Global Offices
              </h4>
              <div className="space-y-3.5 text-xs text-slate-400">
                <div>
                  <p className="font-bold text-white">United States HQ:</p>
                  <p>8500 Melrose Ave, West Hollywood, CA 90069</p>
                </div>
                <div>
                  <p className="font-bold text-white">South Asia Manufacturing Hub:</p>
                  <p>Plot 48/B, Sector 15, Korangi Industrial Area, Karachi, Pakistan</p>
                </div>
                <div className="pt-2 flex flex-col gap-1 text-[11px]">
                  <a href="tel:+19515553268" className="hover:text-white transition-colors flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>+1 (951) 555-ECOTEX (3268)</span>
                  </a>
                  <a href="mailto:info@ecotexinc.com" className="hover:text-white transition-colors flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>info@ecotexinc.com</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Compliance */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © 2026 <span className="text-slate-300 font-bold">Ecotex Inc.</span> All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                GRS 4.0 Certified
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                ASTM D6400
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                CalRecycle SB 270
              </span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
