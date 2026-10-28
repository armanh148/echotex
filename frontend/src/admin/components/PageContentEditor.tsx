'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  AlertCircle,
  FileText,
  Save,
  RotateCcw,
  Building,
  Phone,
  Mail,
  TrendingUp,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Megaphone,
  Layers,
  Users,
  Calculator,
  Star,
  Trash2,
  Plus,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Recycle,
  Tag,
  Check
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import {
  SiteSettings,
  LogoConfig,
  NavbarConfig,
  VersatilityConfig,
  SustainabilityConfig,
  AboutConfig,
  ContactConfig,
  FooterConfig,
  QuoteCalcConfig,
  ShopConfig,
  TeamMemberConfig,
  TestimonialConfig
} from '../../types';
import { ImageUploader } from './ImageUploader';

type EditorTab =
  | 'logo'
  | 'navbar'
  | 'versatility'
  | 'about'
  | 'contact'
  | 'footer'
  | 'single-product';

export const PageContentEditor: React.FC = () => {
  const { siteSettings, updateSiteSettings, products, updateProduct } = useStore();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productSaveSuccess, setProductSaveSuccess] = useState(false);

  useEffect(() => {
    if (!selectedProductId && products.length > 0) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const activeSelectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const [pdpForm, setPdpForm] = useState<any>(null);

  useEffect(() => {
    if (activeSelectedProduct) {
      const gImgs = activeSelectedProduct.galleryImages || [
        activeSelectedProduct.image || '/images/bag-green.png',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85'
      ];
      setPdpForm({
        name: activeSelectedProduct.name,
        categoryLabel: activeSelectedProduct.categoryLabel || 'SUSTAINABLE NON-WOVEN',
        subtitle: activeSelectedProduct.subtitle || '',
        articleNo: activeSelectedProduct.articleNo || `EP-${activeSelectedProduct.id.slice(0, 6).toUpperCase()}`,
        volumeNo: activeSelectedProduct.volumeNo || `${activeSelectedProduct.gsm || 80} GSM LUXURY`,
        rating: activeSelectedProduct.rating !== undefined ? activeSelectedProduct.rating : 4.9,
        brandName: activeSelectedProduct.brandName || 'ECOTEX INC.',
        pricePerUnit: activeSelectedProduct.pricePerUnit || 0.25,
        originalPrice: activeSelectedProduct.originalPrice || Math.round((activeSelectedProduct.pricePerUnit || 0.25) * 1.35 * 100) / 100,
        pcsPerBox: activeSelectedProduct.pcsPerBox || 200,
        wholesaleMoq: activeSelectedProduct.wholesaleMoq || 5,
        stockQuantity: activeSelectedProduct.stockQuantity !== undefined ? activeSelectedProduct.stockQuantity : 50,
        inStock: activeSelectedProduct.inStock !== false,
        gallery0: gImgs[0] || activeSelectedProduct.image || '/images/bag-green.png',
        gallery1: gImgs[1] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
        gallery2: gImgs[2] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
        gallery3: gImgs[3] || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
        fabricDetails: activeSelectedProduct.fabricDetails || `${activeSelectedProduct.gsm || 80} GSM Virgin Non-Woven Polypropylene`,
        dimensions: activeSelectedProduct.dimensions || '11.5\"W x 21\"H x 6.5\" Gusset',
        handles: activeSelectedProduct.handles || 'Ultrasonic Thermal Welded Loops',
        printingMethod: activeSelectedProduct.printingMethod || 'High-Precision Flexographic / Gravure Custom Imprint',
        compliance: activeSelectedProduct.compliance || 'Certified California SB 270 & ASTM D6400',
        packingDetails: activeSelectedProduct.packingDetails || 'Export-Grade Heavy Duty Corrugated Cartons',
        guaranteedFabric: activeSelectedProduct.guaranteedFabric || '100% Virgin Grade Recyclable Polypropylene',
        enrouteQuality: activeSelectedProduct.enrouteQuality || 'Enroute to Quality Standard',
        bestFor: activeSelectedProduct.bestFor || 'Supermarket grocers, retail boutiques',
        recommendedPrint: activeSelectedProduct.recommendedPrint || 'High-Precision Flexographic Custom Imprint',
        description: activeSelectedProduct.description || '',
        trustBadge1: activeSelectedProduct.trustBadge1 || 'Fast Delivery',
        trustBadge2: activeSelectedProduct.trustBadge2 || 'Secure Store',
        trustBadge3: activeSelectedProduct.trustBadge3 || 'Easy Return',
        retailPolicyText: activeSelectedProduct.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
        wholesalePolicyText: activeSelectedProduct.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
        outOfStockNotice: activeSelectedProduct.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.'
      });
    }
  }, [activeSelectedProduct]);

  const handleSavePdpForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSelectedProduct || !pdpForm) return;

    const finalStock = Math.max(0, Number(pdpForm.stockQuantity) || 0);
    const finalInStock = pdpForm.inStock && finalStock > 0;
    const finalGallery = [
      pdpForm.gallery0?.trim(),
      pdpForm.gallery1?.trim(),
      pdpForm.gallery2?.trim(),
      pdpForm.gallery3?.trim()
    ].filter(Boolean);

    updateProduct(activeSelectedProduct.id, {
      name: pdpForm.name.trim(),
      categoryLabel: pdpForm.categoryLabel.trim(),
      subtitle: pdpForm.subtitle.trim(),
      articleNo: pdpForm.articleNo.trim(),
      volumeNo: pdpForm.volumeNo.trim(),
      rating: Number(pdpForm.rating) || 4.9,
      brandName: pdpForm.brandName.trim(),
      pricePerUnit: Number(pdpForm.pricePerUnit) || 0.25,
      originalPrice: Number(pdpForm.originalPrice) || 0.35,
      pcsPerBox: Number(pdpForm.pcsPerBox) || 200,
      wholesaleMoq: Number(pdpForm.wholesaleMoq) || 5,
      stockQuantity: finalStock,
      inStock: finalInStock,
      image: pdpForm.gallery0?.trim() || activeSelectedProduct.image || '/images/bag-green.png',
      galleryImages: finalGallery,
      fabricDetails: pdpForm.fabricDetails.trim(),
      dimensions: pdpForm.dimensions.trim(),
      handles: pdpForm.handles.trim(),
      printingMethod: pdpForm.printingMethod.trim(),
      compliance: pdpForm.compliance.trim(),
      packingDetails: pdpForm.packingDetails.trim(),
      guaranteedFabric: pdpForm.guaranteedFabric.trim(),
      enrouteQuality: pdpForm.enrouteQuality.trim(),
      bestFor: pdpForm.bestFor.trim(),
      recommendedPrint: pdpForm.recommendedPrint.trim(),
      description: pdpForm.description.trim(),
      trustBadge1: pdpForm.trustBadge1.trim(),
      trustBadge2: pdpForm.trustBadge2.trim(),
      trustBadge3: pdpForm.trustBadge3.trim(),
      retailPolicyText: pdpForm.retailPolicyText.trim(),
      wholesalePolicyText: pdpForm.wholesalePolicyText.trim(),
      outOfStockNotice: pdpForm.outOfStockNotice.trim()
    });

    setProductSaveSuccess(true);
    setTimeout(() => setProductSaveSuccess(false), 3000);
  };
  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [activeTab, setActiveTab] = useState<EditorTab>('logo');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(siteSettings);
  }, [siteSettings]);

  const hasUnpublishedChanges = JSON.stringify(formData) !== JSON.stringify(siteSettings);

  const handleDiscardDraft = () => {
    setFormData(siteSettings);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetToDefaults = () => {
    if (!window.confirm('Reset all custom component content back to factory defaults?')) return;

    const defaultSettings: SiteSettings = {
      companyName: 'Ecotex Inc.',
      tagline: 'Certified Sustainable Wholesale Packaging Direct From Manufacturer',
      heroTitle: "It's time to pack better.",
      heroSubtitle: "Engineered non-woven, compostable bio-PLA, and insulated wholesale carrier bags for retail supermarkets, luxury boutiques, and global distributors.",
      heroButtonText: 'Shop Now',
      announcement: '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility',
      announcementActive: true,
      phone: '(951) 555-ECOTEX',
      secondaryPhone: '+1 (951) 450-9773',
      email: 'orders@ecotexinc.com',
      facilityAddress: '1200 Industrial Parkway, Corona, CA 92881',
      plantAddress: 'Sector 15, Korangi Industrial Area, Karachi, PK',
      minOrderNotice: 'Free pallet freight on continental US orders over $1,000',
      leadTimeBlank: '2-4 Business Days',
      leadTimeCustom: '10-14 Business Days',
      aboutTitle: 'Engineered For Durability. Designed For Circularity.',
      aboutMission: 'Empowering commercial enterprises and supermarket chains with certified non-woven and compostable packaging that drastically reduces carbon footprints without sacrificing load capacity.',
      aboutStory: 'Founded with a dedication to manufacturing excellence, Ecotex operates state-of-the-art ultrasonic welding and automated flexographic printing facilities in California and Karachi.',
      footerTagline: 'One stop solution for your enterprise packaging needs.',
      copyrightNotice: 'Copyright 2026 © Ecotex Inc. All rights reserved.',
      esgMetrics: {
        plasticDisplaced: '50M+',
        carbonReduction: '-84%',
        reusableTrips: '125+',
        recyclablePercent: '100%'
      },
      logoConfig: {
        wordmarkPrefix: 'ECO',
        wordmarkSuffix: 'TEX',
        badgeText: 'INC.',
        subtitle: 'Sustainable Packaging',
        customLogoUrl: '',
        faviconUrl: ''
      },
      navbarConfig: {
        announcementText: '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility',
        announcementActive: true,
        ctaButtonText: 'START SHOP',
        phoneDisplay: '(951) 555-ECOTEX'
      },
      versatilityConfig: {
        sustainableFashionTitle: 'Sustainable Fashion For A Greener Tomorrow',
        sustainableFashionSubtitle: 'Discover our eco-friendly bags made from sustainable materials. Join the movement to reduce environmental impact without compromising style!',
        featureCards: [
          { id: 'vc1', title: 'Eco-Friendly', description: 'Non-woven polypropylene bags are considered eco-friendly because they are reusable and can replace single-use plastic bags.' },
          { id: 'vc2', title: 'Durable', description: 'These bags are known for their strength and durability. They can withstand multiple uses and are capable of carrying heavy loads.' },
          { id: 'vc3', title: 'Customizable', description: 'Non-woven polypropylene bags can be easily customized with various designs, colors, and logos, making them a popular choice.' },
          { id: 'vc4', title: 'Breathable', description: 'The fabric structure allows air circulation, making it ideal for retail garments, food produce, and everyday merchandise.' }
        ],
        bannerTitle: 'Exploring The Versatility of Non-Woven PP Bags',
        bannerSubtitle: 'Dive deeper into the various styles, sizes, and designs available in non-woven polypropylene bags.',
        bannerButtonText: 'View Collection',
        bannerImage: '/images/versatility-banner-bg.jpg',
        bottomTrustBadges: [
          'Fast Turnaround Times',
          'A friendly, open and honest service',
          'Ethical and Fairly Traded Products',
          'Expert Customer Service'
        ]
      },
      sustainabilityConfig: {
        metrics: {
          plasticDisplaced: '50M+',
          carbonReduction: '-84%',
          reusableTrips: '125+',
          recyclablePercent: '100%'
        },
        circularSteps: [
          { step: '01', title: 'Responsible Material Sourcing', desc: 'Utilizing certified post-industrial virgin PP regrind, non-GMO corn-derived PLA resins, and reclaimed apparel cut-offs.' },
          { step: '02', title: 'Ultrasonic Zero-Solvent Welding', desc: 'Sonic molecular excitation bonds fabric panels with unbreakable tensile strength without toxic glues or volatile emissions.' },
          { step: '03', title: 'Extended Multi-Year Lifecycle', desc: 'Engineered to withstand 125+ heavy shopping cycles, each tote displaces hundreds of single-use polybags from city landfills.' },
          { step: '04', title: 'Pure Mechanical & Biological Recovery', desc: '100% pelletized back into polymer pellets at end-of-life, while our bio line returns to soil biomass within 90-180 days.' }
        ]
      },
      aboutConfig: {
        heroTitle: 'About Us',
        heroSubtitle: 'A sustainable future for packaging. Engineered with purpose, manufactured for impact.',
        heroBgImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=85',
        missionQuote: 'We engineered our circular manufacturing framework around a simple premise: commercial packaging can protect goods and elevate brands without ever polluting our natural world.',
        storyParagraph1: 'Founded to combat the global crisis of single-use plastic waste, Ecotex Inc. operates as a vertically integrated packaging manufacturer. We specialize in high-tensile reusable non-woven polypropylene totes, certified compostable cornstarch blends, and reclaimed post-industrial cotton wiping textiles.',
        storyParagraph2: 'From our corporate headquarters in California to state-of-the-art automated manufacturing facilities, every product is subjected to rigorous tensile testing, automated ultrasonic seam welding, and non-toxic water-based printing. We empower grocery retailers, boutique lifestyle brands, and logistics operations across the globe to achieve zero-waste compliance with full chain-of-custody audit trails.',
        founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85',
        workshopImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
        whyChooseUsTitle: 'Why Choose Us',
        whyChooseUsSubtitle: 'We combine German ultrasonic welding machinery, ISO 9001 certified batch audits, and non-toxic soy formulations to deliver high-capacity packaging engineered to outlast disposable plastic.',
        whyChooseUsFeatures: [
          { title: '100% Recyclable Fabrics', description: 'Manufactured with virgin and pre-consumer polypropylene, lab-certified for 125+ reuse cycles.' },
          { title: 'Easy to Customize', description: 'Flexible sizing, ultrasonic handle sealing, custom gusset depths, and pantone-matched dyed fabrics.' },
          { title: '24/7 B2B Global Support', description: 'Dedicated enterprise account directors for national retail chains, grocers, and FMCG brands.' },
          { title: 'Free Sample Verification', description: 'Physical pre-production specimen kits dispatched within 48 hours for tensile testing and color sign-off.' },
          { title: 'High-Definition Flexo Print', description: 'Zero-VOC soy and water-based ink flexography delivering photo-sharp photographic brand imprints.' },
          { title: 'Rapid Turnaround Times', description: 'Immediate dispatch for unbranded warehouse inventory and accelerated 10-14 day custom printed delivery.' }
        ],
        teamMembers: [
          {
            id: 'tm1',
            name: 'Rashid Mahmood',
            role: 'Managing Director & Founder',
            bio: 'Pioneered circular non-woven manufacturing across North America and South Asia with over two decades in sustainable polymer engineering.',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85',
            email: 'rashid@ecotexinc.com',
            linkedin: '#'
          },
          {
            id: 'tm2',
            name: 'Farah Al-Sayed',
            role: 'Head of Quality & Materials Engineering',
            bio: 'Leads our ASTM D6400 biodegradable testing laboratories and Global Recycled Standard (GRS) chain-of-custody compliance.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85',
            email: 'farah@ecotexinc.com',
            linkedin: '#'
          },
          {
            id: 'tm3',
            name: 'Marcus Vance',
            role: 'Chief Sustainability Officer',
            bio: 'Oversees enterprise carbon reduction accounting and California SB 270 / SB 54 regulatory packaging compliance.',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85',
            email: 'marcus@ecotexinc.com',
            linkedin: '#'
          }
        ]
      },
      contactConfig: {
        headline: 'Let’s Engineer Your Sustainable Wholesale Packaging Solution',
        email: 'orders@ecotexinc.com',
        phone: '(951) 555-ECOTEX',
        secondaryPhone: '+1 (951) 450-9773',
        facilityAddress: '1200 Industrial Parkway, Corona, CA 92881',
        plantAddress: 'Sector 15, Korangi Industrial Area, Karachi, PK',
        facebookUrl: 'https://facebook.com',
        instagramUrl: 'https://instagram.com',
        twitterUrl: 'https://twitter.com',
        linkedinUrl: 'https://linkedin.com'
      },
      footerConfig: {
        newsletterTitle: 'Subscribe To Our Quarterly Newsletter',
        newsletterSubtitle: 'Receive direct mill pricing updates, material innovation whitepapers, and California SB 54 regulatory packaging briefs.',
        newsletterBgImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80',
        tagline: 'Direct manufacturer of certified circular non-woven, compostable bio-PLA, and insulated wholesale packaging for global commercial enterprise.',
        copyrightNotice: 'Copyright 2026 © Ecotex Inc. All rights reserved.'
      },
      quoteCalcConfig: {
        plateFee: 120,
        freeFreightThreshold: 1000,
        leadTimeBlank: '2-4 Business Days',
        leadTimeCustom: '10-14 Business Days'
      },
      shopConfig: {
        catalogTitle: 'Wholesale Catalog & Mill Collections',
        catalogSubtitle: 'Explore our full manufacturing catalog of certified eco-friendly industrial & retail packaging with wholesale pricing tiers.',
        testimonials: [
          {
            id: 'rev1',
            quote: "Switching our 42 regional grocery locations to Ecotex loop bags cut packaging overhead by 28% while exceeding state single-use mandates.",
            author: "Elena Vasquez",
            role: "VP Supply Chain",
            company: "SunWest Markets California",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
          },
          {
            id: 'rev2',
            quote: "The custom gold flexo printing on their black matte totes gave our boutique clients an unmistakable luxury feel that shoppers reuse every single day.",
            author: "Marcus Vance",
            role: "Creative Director",
            company: "Artisan Living Brands NY",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
          }
        ],
        galleryImages: [
          { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', caption: 'High-Speed Automated Ultrasonic Welder' },
          { url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80', caption: 'Virgin Non-Woven Polypropylene Rolls' },
          { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80', caption: 'Cleanroom ISO Quality Testing' },
          { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', caption: 'Palletized Container Shipments' },
          { url: 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&w=600&q=80', caption: 'Precision Handle Box-Stitch Detail' },
          { url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80', caption: 'Export-Grade Custom Cartons' }
        ]
      }
    };

    setFormData(defaultSettings);
    updateSiteSettings(defaultSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const tabs: { id: EditorTab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'logo', label: 'Logo & Brand', icon: Recycle, desc: 'Visual identity & favicon' },
    { id: 'navbar', label: 'Navbar & Banner', icon: Megaphone, desc: 'Header bar & CTA' },
    { id: 'versatility', label: 'Versatility & Cards', icon: Layers, desc: 'Feature value cards' },
    { id: 'about', label: 'About Us & Team', icon: Users, desc: 'Company story & leadership' },
    { id: 'contact', label: 'Contact & Facilities', icon: Phone, desc: 'Locations & sales lines' },
    { id: 'footer', label: 'Footer & Legal', icon: Globe, desc: 'Links, copyright & badges' },
    { id: 'single-product', label: 'Single Product Page', icon: Package, desc: 'Specs, gallery & policies' },
  ];

  return (
    <div className="space-y-6 animate-fadeInUp pb-16 font-sans">

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#B2E2C5]/40 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#B2E2C5]/20 text-[#4E9F76]">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#4E9F76]">
              100% Dynamic Storefront Studio
            </span>
            {hasUnpublishedChanges ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unpublished Changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Published & Live
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
            Universal Content & Image CMS
          </h2>
          <p className="text-xs text-slate-500">
            Import images directly from your computer without URLs. Customize text, metrics, and cards across all components in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {hasUnpublishedChanges && (
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100 text-xs font-bold transition-all cursor-pointer"
              title="Discard unsaved changes and restore current live content"
            >
              <span>Discard Changes</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              hasUnpublishedChanges
                ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-emerald-600/30 ring-2 ring-[#4ade80]/50 animate-pulse'
                : 'bg-[#4E9F76] hover:bg-[#86C59E] text-white shadow-[#4E9F76]/20'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#B2E2C5]" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Left Sticky Vertical Sidebar + Right Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Vertical Navigation Sidebar */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-6 space-y-3">
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-[#B2E2C5]/50 shadow-xs">
            <div className="px-3 py-2.5 mb-2.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  CMS Navigation
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Storefront Sections
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#166534] bg-emerald-100/80 border border-emerald-300/60 px-2.5 py-0.5 rounded-full shadow-2xs">
                {tabs.length} Tabs
              </span>
            </div>

            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-thin">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer w-full text-left border group ${
                      isActive
                        ? 'bg-[#166534] text-white border-[#166534] shadow-md shadow-[#166534]/20 lg:translate-x-1 font-extrabold'
                        : 'bg-white text-slate-700 border-transparent hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-2xs' 
                        : 'bg-slate-100 text-slate-500 group-hover:bg-[#B2E2C5]/30 group-hover:text-[#166534]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate flex-1 min-w-0">
                      <span className="block truncate font-bold text-xs">{tab.label}</span>
                      <span className={`block text-[10px] font-normal truncate mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {tab.desc}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-6 rounded-full bg-white shrink-0 hidden lg:block" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Right Content Panel */}
        <div className="flex-1 min-w-0 w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#B2E2C5]/40 shadow-xs">

          {/* Active Section Context Header */}
          {(() => {
            const currentTab = tabs.find(t => t.id === activeTab);
            const TabIcon = currentTab?.icon || FileText;
            return (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <TabIcon className="w-5 h-5 text-[#4E9F76]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#166534] bg-emerald-100/90 border border-emerald-300/60 px-2 py-0.5 rounded-md">
                        Section Editor
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">· Live Real-Time Storefront Sync</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#0f172a] mt-0.5">
                      {currentTab?.label}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleSave()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-md shadow-[#4E9F76]/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save {currentTab?.label.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })()}

        {/* ========================================================
            TAB 1: LOGO & BRAND IDENTITY
           ======================================================== */}
        {activeTab === 'logo' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                  Logo & Visual Brand Identity
                </h3>
                <p className="text-xs text-slate-500">
                  Controls the primary navigation logo, mobile drawer logo, and footer brand mark.
                </p>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-2xl bg-[#F4F9F5] border border-[#B2E2C5]/40 flex items-center gap-3 min-h-[56px]">
                {formData.logoConfig?.customLogoUrl ? (
                  <img
                    src={formData.logoConfig.customLogoUrl}
                    alt="Custom Brand Logo"
                    className="h-10 sm:h-12 w-auto max-w-[220px] object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4E9F76] text-white flex items-center justify-center font-black shadow-xs">
                      <Recycle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-base font-black tracking-tight text-[#0f172a] leading-none block">
                        {formData.logoConfig?.wordmarkPrefix || 'ECO'}
                        <span className="text-[#4E9F76]">{formData.logoConfig?.wordmarkSuffix || 'TEX'}</span>{' '}
                        <span className="text-[#B2E2C5]">{formData.logoConfig?.badgeText || 'INC.'}</span>
                      </span>
                      <span className="text-[8px] font-bold tracking-[0.16em] uppercase text-slate-400 block mt-0.5">
                        {formData.logoConfig?.subtitle || 'SUSTAINABLE PACKAGING'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Image File Import for Official Brand Logo */}
            <div>
              <ImageUploader
                label="Official Company Brand Logo"
                description="Upload your high-resolution company SVG, PNG, or WebP logo. Automatically synchronizes across the Header Navbar, Footer, and Cart Modal."
                value={formData.logoConfig?.customLogoUrl || ''}
                onChange={(newUrl) => {
                  const updatedLogoConfig = { ...(formData.logoConfig || {}), customLogoUrl: newUrl };
                  setFormData(prev => ({ ...prev, logoConfig: updatedLogoConfig }));
                }}
                aspectRatio="banner"
              />
            </div>

            {/* Browser Tab Favicon Section */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-[#0f172a] uppercase tracking-wider">
                    Browser Tab Favicon (Site Icon)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    The small icon shown on browser tabs, bookmarks, and shortcuts. Recommended format: Square SVG, PNG, or ICO.
                  </p>
                </div>

                {/* Live Mock Browser Tab Preview */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-t-xl bg-slate-100 border border-slate-200 border-b-0 text-[11px] text-slate-700 font-medium shadow-2xs self-start sm:self-auto">
                  {formData.logoConfig?.faviconUrl ? (
                    <img
                      src={formData.logoConfig.faviconUrl}
                      alt="Favicon preview"
                      className="w-4 h-4 object-contain rounded-xs"
                    />
                  ) : formData.logoConfig?.customLogoUrl ? (
                    <img
                      src={formData.logoConfig.customLogoUrl}
                      alt="Favicon fallback"
                      className="w-4 h-4 object-contain rounded-xs"
                    />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-[#4E9F76] flex items-center justify-center text-white text-[8px] font-bold">
                      E
                    </div>
                  )}
                  <span className="truncate max-w-[130px] font-sans">Ecotex Inc. · Packaging</span>
                </div>
              </div>

              <ImageUploader
                label="Upload Favicon File (Square 1:1)"
                description="Upload square icon file directly from your computer (SVG, PNG, ICO, WebP)."
                value={formData.logoConfig?.faviconUrl || ''}
                onChange={(newUrl) => {
                  const updatedLogoConfig = { ...(formData.logoConfig || {}), faviconUrl: newUrl };
                  setFormData(prev => ({ ...prev, logoConfig: updatedLogoConfig }));
                }}
                aspectRatio="square"
              />
            </div>

            {/* Direct Save Logo & Brand Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F4F9F5] p-4 rounded-2xl border border-[#B2E2C5]/50">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4E9F76]" />
                <span>Logo & visual identity updates automatically save and synchronize live.</span>
              </div>
              <button
                type="button"
                onClick={() => handleSave()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#86C59E] text-white text-xs font-bold transition-all shadow-md shadow-[#4E9F76]/20 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#B2E2C5]" />
                    <span>Saved & Live!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Logo & Brand</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: NAVBAR & ANNOUNCEMENT BAR
           ======================================================== */}
        {activeTab === 'navbar' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                  Navbar & Top Announcement Bar
                </h3>
                <p className="text-xs text-slate-500">
                  Configure top banner notification, CTA button wording, and telephone display.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={formData.navbarConfig?.announcementActive ?? true}
                  onChange={(e) => setFormData({
                    ...formData,
                    navbarConfig: { ...formData.navbarConfig!, announcementActive: e.target.checked }
                  })}
                  className="w-4 h-4 text-[#4E9F76] rounded-md focus:ring-[#86C59E]"
                />
                <span className="text-xs font-bold text-slate-700">Display Top Announcement</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Top Announcement Bar Copy
              </label>
              <input
                type="text"
                value={formData.navbarConfig?.announcementText || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  navbarConfig: { ...formData.navbarConfig!, announcementText: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                placeholder="🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Navbar Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.navbarConfig?.ctaButtonText || 'START SHOP'}
                  onChange={(e) => setFormData({
                    ...formData,
                    navbarConfig: { ...formData.navbarConfig!, ctaButtonText: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#4E9F76] focus:outline-none focus:border-[#86C59E]"
                  placeholder="e.g. START SHOP or REQUEST SAMPLE"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Header Phone Number Display
                </label>
                <input
                  type="text"
                  value={formData.navbarConfig?.phoneDisplay || '(951) 555-ECOTEX'}
                  onChange={(e) => setFormData({
                    ...formData,
                    navbarConfig: { ...formData.navbarConfig!, phoneDisplay: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                  placeholder="(951) 555-ECOTEX"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: VERSATILITY & VALUE CARDS
           ======================================================== */}
        {activeTab === 'versatility' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                Versatility & Value Cards Section
              </h3>
              <p className="text-xs text-slate-500">
                Customize the Sustainable Fashion section, the 4 value feature cards, the large photographic editorial banner, and bottom trust badges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Sustainable Fashion Section Headline
                </label>
                <input
                  type="text"
                  value={formData.versatilityConfig?.sustainableFashionTitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    versatilityConfig: { ...formData.versatilityConfig!, sustainableFashionTitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Sustainable Fashion Subtitle
                </label>
                <input
                  type="text"
                  value={formData.versatilityConfig?.sustainableFashionSubtitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    versatilityConfig: { ...formData.versatilityConfig!, sustainableFashionSubtitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* 4 Feature Cards */}
            <div>
              <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider mb-3">
                4 Value Proposition Cards
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.versatilityConfig?.featureCards || []).map((card, idx) => (
                  <div key={card.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="text-[10px] font-bold text-[#4E9F76] uppercase tracking-wider block">
                      Card #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const newCards = [...formData.versatilityConfig!.featureCards];
                        newCards[idx] = { ...newCards[idx], title: e.target.value };
                        setFormData({
                          ...formData,
                          versatilityConfig: { ...formData.versatilityConfig!, featureCards: newCards }
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#86C59E]"
                      placeholder="Title"
                    />
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => {
                        const newCards = [...formData.versatilityConfig!.featureCards];
                        newCards[idx] = { ...newCards[idx], description: e.target.value };
                        setFormData({
                          ...formData,
                          versatilityConfig: { ...formData.versatilityConfig!, featureCards: newCards }
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Big Editorial Banner */}
            <div className="p-5 rounded-2xl bg-[#F4F9F5] border border-[#B2E2C5]/40 space-y-4">
              <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider">
                Big Editorial Banner
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={formData.versatilityConfig?.bannerTitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      versatilityConfig: { ...formData.versatilityConfig!, bannerTitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Banner Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.versatilityConfig?.bannerSubtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      versatilityConfig: { ...formData.versatilityConfig!, bannerSubtitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Banner Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.versatilityConfig?.bannerButtonText || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      versatilityConfig: { ...formData.versatilityConfig!, bannerButtonText: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#4E9F76] bg-white focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>

              {/* Direct File Import for Big Banner Background */}
              <div className="pt-2">
                <ImageUploader
                  label="Editorial Banner Background Image"
                  description="Import high-resolution lifestyle packaging photo from your computer."
                  value={formData.versatilityConfig?.bannerImage || ''}
                  onChange={(newUrl) => setFormData({
                    ...formData,
                    versatilityConfig: { ...formData.versatilityConfig!, bannerImage: newUrl }
                  })}
                  aspectRatio="wide"
                />
              </div>
            </div>

            {/* Bottom Trust Badges */}
            <div>
              <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider mb-2">
                4 Bottom Trust Badges
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {(formData.versatilityConfig?.bottomTrustBadges || []).map((badge, idx) => (
                  <div key={idx}>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Badge #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => {
                        const newBadges = [...formData.versatilityConfig!.bottomTrustBadges];
                        newBadges[idx] = e.target.value;
                        setFormData({
                          ...formData,
                          versatilityConfig: { ...formData.versatilityConfig!, bottomTrustBadges: newBadges }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f172a] bg-white focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: ABOUT US & LEADERSHIP TEAM
           ======================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                About Us, Corporate Narrative & Leadership Team
              </h3>
              <p className="text-xs text-slate-500">
                Import real photos directly for the hero background, founder portrait, factory floor, and team profiles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={formData.aboutConfig?.heroTitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutConfig: { ...formData.aboutConfig!, heroTitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={formData.aboutConfig?.heroSubtitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutConfig: { ...formData.aboutConfig!, heroSubtitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* Direct Image File Import for About Hero Background */}
            <ImageUploader
              label="About Us Page Hero Background Photo"
              description="Import high-resolution facility / executive background image."
              value={formData.aboutConfig?.heroBgImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=85'}
              onChange={(newUrl) => setFormData({
                ...formData,
                aboutConfig: { ...formData.aboutConfig!, heroBgImage: newUrl }
              })}
              aspectRatio="wide"
            />

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Executive Mission Quote
              </label>
              <textarea
                rows={2}
                value={formData.aboutConfig?.missionQuote || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  aboutConfig: { ...formData.aboutConfig!, missionQuote: e.target.value }
                })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Story Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutConfig?.storyParagraph1 || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutConfig: { ...formData.aboutConfig!, storyParagraph1: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Story Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutConfig?.storyParagraph2 || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutConfig: { ...formData.aboutConfig!, storyParagraph2: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* Direct Image File Import for Founder Portrait and Workshop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <ImageUploader
                label="Founder Portrait Photo (Rashid Mahmood)"
                description="Import official founder executive portrait from your computer."
                value={formData.aboutConfig?.founderImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85'}
                onChange={(newUrl) => setFormData({
                  ...formData,
                  aboutConfig: { ...formData.aboutConfig!, founderImage: newUrl }
                })}
                aspectRatio="portrait"
              />

              <ImageUploader
                label="Engineering Workshop & Testing Laboratory Photo"
                description="Import manufacturing inspection photo from your computer."
                value={formData.aboutConfig?.workshopImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85'}
                onChange={(newUrl) => setFormData({
                  ...formData,
                  aboutConfig: { ...formData.aboutConfig!, workshopImage: newUrl }
                })}
                aspectRatio="wide"
              />
            </div>

            {/* Team Members List */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider">
                    Executive Leadership Team Roster
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Add or update leadership cards displayed on the About Us page with direct photo uploads.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newMember: TeamMemberConfig = {
                      id: `tm-${Date.now()}`,
                      name: 'New Executive',
                      role: 'Vice President of Production',
                      bio: 'Experienced supply chain executive dedicated to sustainable industrial packaging.',
                      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
                      email: 'team@ecotexinc.com',
                      linkedin: '#'
                    };
                    const updatedMembers = [...(formData.aboutConfig?.teamMembers || []), newMember];
                    setFormData({
                      ...formData,
                      aboutConfig: { ...formData.aboutConfig!, teamMembers: updatedMembers }
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4E9F76]/10 hover:bg-[#4E9F76]/20 text-[#4E9F76] text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="space-y-6">
                {(formData.aboutConfig?.teamMembers || []).map((member, idx) => (
                  <div key={member.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-[#4E9F76]">
                        Member #{idx + 1}: {member.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.aboutConfig!.teamMembers.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData,
                            aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      <div className="lg:col-span-4">
                        <ImageUploader
                          label="Profile Headshot Photo"
                          value={member.image}
                          onChange={(newUrl) => {
                            const updated = [...formData.aboutConfig!.teamMembers];
                            updated[idx] = { ...updated[idx], image: newUrl };
                            setFormData({
                              ...formData,
                              aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                            });
                          }}
                          aspectRatio="portrait"
                        />
                      </div>

                      <div className="lg:col-span-8 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => {
                                const updated = [...formData.aboutConfig!.teamMembers];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#86C59E]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => {
                                const updated = [...formData.aboutConfig!.teamMembers];
                                updated[idx] = { ...updated[idx], role: e.target.value };
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Professional Bio</label>
                          <textarea
                            rows={2}
                            value={member.bio}
                            onChange={(e) => {
                              const updated = [...formData.aboutConfig!.teamMembers];
                              updated[idx] = { ...updated[idx], bio: e.target.value };
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                            <input
                              type="text"
                              value={member.email}
                              onChange={(e) => {
                                const updated = [...formData.aboutConfig!.teamMembers];
                                updated[idx] = { ...updated[idx], email: e.target.value };
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
                            <input
                              type="text"
                              value={member.linkedin}
                              onChange={(e) => {
                                const updated = [...formData.aboutConfig!.teamMembers];
                                updated[idx] = { ...updated[idx], linkedin: e.target.value };
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: CORPORATE CONTACT & FACILITIES
           ======================================================== */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                Corporate Contact & Manufacturing Facilities
              </h3>
              <p className="text-xs text-slate-500">
                Live telephone numbers, facility locations, and social media URLs across the application.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Contact Page Headline
              </label>
              <input
                type="text"
                value={formData.contactConfig?.headline || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  contactConfig: { ...formData.contactConfig!, headline: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Primary Corporate Phone
                </label>
                <input
                  type="text"
                  value={formData.contactConfig?.phone || formData.phone || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    phone: e.target.value,
                    contactConfig: { ...formData.contactConfig!, phone: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Secondary Logistics Hotline
                </label>
                <input
                  type="text"
                  value={formData.contactConfig?.secondaryPhone || formData.secondaryPhone || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    secondaryPhone: e.target.value,
                    contactConfig: { ...formData.contactConfig!, secondaryPhone: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Orders & Procurement Email
                </label>
                <input
                  type="email"
                  value={formData.contactConfig?.email || formData.email || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    email: e.target.value,
                    contactConfig: { ...formData.contactConfig!, email: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  US Distribution Facility (Corona, CA)
                </label>
                <input
                  type="text"
                  value={formData.contactConfig?.facilityAddress || formData.facilityAddress || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    facilityAddress: e.target.value,
                    contactConfig: { ...formData.contactConfig!, facilityAddress: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Primary Manufacturing Mill Plant
                </label>
                <input
                  type="text"
                  value={formData.contactConfig?.plantAddress || formData.plantAddress || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    plantAddress: e.target.value,
                    contactConfig: { ...formData.contactConfig!, plantAddress: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider mb-3">
                Social Media URLs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={formData.contactConfig?.linkedinUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig!, linkedinUrl: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    value={formData.contactConfig?.facebookUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig!, facebookUrl: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={formData.contactConfig?.instagramUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig!, instagramUrl: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Twitter / X URL
                  </label>
                  <input
                    type="text"
                    value={formData.contactConfig?.twitterUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig!, twitterUrl: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: FOOTER & LEGAL
           ======================================================== */}
        {activeTab === 'footer' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                Footer, Newsletter Banner & Legal Copy
              </h3>
              <p className="text-xs text-slate-500">
                Customise the bottom newsletter strip, background image, footer brand tagline, and copyright notice.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Newsletter Banner Title
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.newsletterTitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    footerConfig: { ...formData.footerConfig!, newsletterTitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Newsletter Subtitle
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.newsletterSubtitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    footerConfig: { ...formData.footerConfig!, newsletterSubtitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* Direct Image File Import for Newsletter Background */}
            <ImageUploader
              label="Quarterly Newsletter Background Photo"
              description="Import high-contrast background photo from your computer."
              value={formData.footerConfig?.newsletterBgImage || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80'}
              onChange={(newUrl) => setFormData({
                ...formData,
                footerConfig: { ...formData.footerConfig!, newsletterBgImage: newUrl }
              })}
              aspectRatio="wide"
            />

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Footer Brand Sub-tagline
              </label>
              <input
                type="text"
                value={formData.footerConfig?.tagline || formData.footerTagline || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  footerTagline: e.target.value,
                  footerConfig: { ...formData.footerConfig!, tagline: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Legal Copyright Notice
              </label>
              <input
                type="text"
                value={formData.footerConfig?.copyrightNotice || formData.copyrightNotice || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  copyrightNotice: e.target.value,
                  footerConfig: { ...formData.footerConfig!, copyrightNotice: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
              />
            </div>
          </div>
        )}

        {/* TAB 7: SINGLE PRODUCT PAGE EDITOR */}
        {activeTab === 'single-product' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header Banner & Product Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-amber-950 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#d97706]" />
                  <span>Single Product Page Content Customizer</span>
                </h4>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  Select any wholesale product from your catalog to customize its single product page specifications, 4-photo gallery, badges, and policies.
                </p>
              </div>

              {/* Product Selector Dropdown */}
              <div className="w-full sm:w-72 shrink-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1">
                  Active Product:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.articleNo || p.id.slice(0, 6).toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {pdpForm && (
              <form onSubmit={handleSavePdpForm} className="space-y-5">
                
                {/* 1. Basic Metadata */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#d97706]" />
                      <span>1. Headline, Article & Brand Metadata</span>
                    </h5>
                    <span className="text-[11px] font-mono text-slate-400">ID: {activeSelectedProduct.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={pdpForm.name}
                        onChange={(e) => setPdpForm({ ...pdpForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category Label</label>
                      <input
                        type="text"
                        value={pdpForm.categoryLabel}
                        onChange={(e) => setPdpForm({ ...pdpForm, categoryLabel: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="SUSTAINABLE NON-WOVEN"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Customer Rating (Stars)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="5.0"
                        value={pdpForm.rating}
                        onChange={(e) => setPdpForm({ ...pdpForm, rating: parseFloat(e.target.value) || 4.9 })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Article No.</label>
                      <input
                        type="text"
                        value={pdpForm.articleNo}
                        onChange={(e) => setPdpForm({ ...pdpForm, articleNo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold"
                        placeholder="EP-NW-3040"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Volume No.</label>
                      <input
                        type="text"
                        value={pdpForm.volumeNo}
                        onChange={(e) => setPdpForm({ ...pdpForm, volumeNo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold"
                        placeholder="80 GSM LUXURY"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. 4-Thumbnail Gallery */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#d97706]" />
                    <span>2. 4-Photo Gallery Strip</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map((slotIdx) => {
                      const key = `gallery${slotIdx}`;
                      const val = pdpForm[key] || '';
                      return (
                        <div key={slotIdx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>{slotIdx === 0 ? 'Slot 1 (Main Hero)' : `Slot ${slotIdx + 1} (Thumbnail)`}</span>
                          </div>
                          <div className="w-full aspect-square bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center p-2 overflow-hidden">
                            <img
                              src={val || '/images/bag-green.png'}
                              alt={`Slot ${slotIdx + 1}`}
                              className="w-full h-full object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/images/bag-green.png'; }}
                            />
                          </div>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => setPdpForm({ ...pdpForm, [key]: e.target.value })}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-[11px] font-mono"
                            placeholder="Image URL..."
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Full Specifications List */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#d97706]" />
                    <span>3. Technical Specifications Table</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• BRAND NAME</label>
                      <input
                        type="text"
                        value={pdpForm.brandName}
                        onChange={(e) => setPdpForm({ ...pdpForm, brandName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="ECOTEX INC."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Fabric</label>
                      <input
                        type="text"
                        value={pdpForm.fabricDetails}
                        onChange={(e) => setPdpForm({ ...pdpForm, fabricDetails: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="80 GSM Virgin Non-Woven Polypropylene"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Dimensions</label>
                      <input
                        type="text"
                        value={pdpForm.dimensions}
                        onChange={(e) => setPdpForm({ ...pdpForm, dimensions: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder='11.5"W x 21"H x 6.5" Gusset'
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Handles</label>
                      <input
                        type="text"
                        value={pdpForm.handles}
                        onChange={(e) => setPdpForm({ ...pdpForm, handles: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="Ultrasonic Thermal Welded Loops"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Printing</label>
                      <input
                        type="text"
                        value={pdpForm.printingMethod}
                        onChange={(e) => setPdpForm({ ...pdpForm, printingMethod: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="High-Precision Flexographic / Gravure Custom Imprint"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Compliance</label>
                      <input
                        type="text"
                        value={pdpForm.compliance}
                        onChange={(e) => setPdpForm({ ...pdpForm, compliance: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="Certified California SB 270 & ASTM D6400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Bag & Picture Packing</label>
                      <input
                        type="text"
                        value={pdpForm.packingDetails}
                        onChange={(e) => setPdpForm({ ...pdpForm, packingDetails: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="Export-Grade Heavy Duty Corrugated Cartons"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Guaranteed Fabric</label>
                      <input
                        type="text"
                        value={pdpForm.guaranteedFabric}
                        onChange={(e) => setPdpForm({ ...pdpForm, guaranteedFabric: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="100% Virgin Grade Recyclable Polypropylene"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">• Quality Standard Banner</label>
                    <input
                      type="text"
                      value={pdpForm.enrouteQuality}
                      onChange={(e) => setPdpForm({ ...pdpForm, enrouteQuality: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#d97706]"
                      placeholder="Enroute to Quality Standard"
                    />
                  </div>
                </div>

                {/* 4. Badges & Policies */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d97706]" />
                    <span>4. Badges, Policies & Out of Stock Notification</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Trust Badge 1</label>
                      <input
                        type="text"
                        value={pdpForm.trustBadge1}
                        onChange={(e) => setPdpForm({ ...pdpForm, trustBadge1: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                        placeholder="Fast Delivery"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Trust Badge 2</label>
                      <input
                        type="text"
                        value={pdpForm.trustBadge2}
                        onChange={(e) => setPdpForm({ ...pdpForm, trustBadge2: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                        placeholder="Secure Store"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Trust Badge 3</label>
                      <input
                        type="text"
                        value={pdpForm.trustBadge3}
                        onChange={(e) => setPdpForm({ ...pdpForm, trustBadge3: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                        placeholder="Easy Return"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Retail Order Policy Text</label>
                    <textarea
                      rows={2}
                      value={pdpForm.retailPolicyText}
                      onChange={(e) => setPdpForm({ ...pdpForm, retailPolicyText: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Wholesale Order Policy Text</label>
                    <textarea
                      rows={2}
                      value={pdpForm.wholesalePolicyText}
                      onChange={(e) => setPdpForm({ ...pdpForm, wholesalePolicyText: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-800 mb-1">Out of Stock Notice (When 0 Boxes)</label>
                    <textarea
                      rows={2}
                      value={pdpForm.outOfStockNotice}
                      onChange={(e) => setPdpForm({ ...pdpForm, outOfStockNotice: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-rose-200 bg-white text-xs font-medium text-rose-900"
                    />
                  </div>
                </div>

                {/* Save Product Page Button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  {productSaveSuccess && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Single Product Page changes saved live!</span>
                    </span>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-extrabold shadow-md shadow-amber-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Single Product Page</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

                </div>
      </div>

      {/* Floating Save Actions Bar at Bottom */}
      <div className="sticky bottom-4 z-30 flex items-center justify-between bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#B2E2C5]/50 shadow-xl">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${hasUnpublishedChanges ? 'bg-amber-500 animate-pulse' : 'bg-[#86C59E]'}`} />
          <span className="text-xs font-bold text-slate-600">
            {hasUnpublishedChanges ? 'Unpublished draft changes. Click "Publish All Changes Now" to update storefront.' : 'Storefront is synchronized with the latest published content.'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {hasUnpublishedChanges && (
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-3.5 py-2 rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
            >
              Discard Changes
            </button>
          )}
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              hasUnpublishedChanges
                ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-emerald-600/30 ring-2 ring-[#4ade80]/50 animate-pulse'
                : 'bg-[#4E9F76] hover:bg-[#86C59E] text-white shadow-[#4E9F76]/20'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#B2E2C5]" />
                <span>Saved & Published!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default PageContentEditor;
