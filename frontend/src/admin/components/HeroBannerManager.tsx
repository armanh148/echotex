'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  ExternalLink,
  DollarSign,
  Package,
  Layers,
  Eye
} from 'lucide-react';
import { useStore, HeroConfig } from '../../store/useStore';
import { ImageUploader } from './ImageUploader';

export const HeroBannerManager: React.FC = () => {
  const { 
    heroConfig, 
    updateHeroConfig, 
    siteImages, 
    updateSiteImage,
    mediaLibrary,
    addMediaAsset
  } = useStore();

  const [localHero, setLocalHero] = useState<HeroConfig>(heroConfig);
  const [localImages, setLocalImages] = useState(siteImages);
  const [activeVariantTab, setActiveVariantTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if store updates externally
  React.useEffect(() => {
    setLocalHero(heroConfig);
  }, [heroConfig]);

  React.useEffect(() => {
    setLocalImages(siteImages);
  }, [siteImages]);

  const handleSaveAll = () => {
    updateHeroConfig(localHero);
    Object.entries(localImages).forEach(([key, url]) => {
      updateSiteImage(key, url);
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetToDefault = () => {
    const defaultHero: HeroConfig = {
      title: "It's time to\npack better.",
      subtitle: "Engineered non-woven, compostable bio-PLA, and insulated wholesale carrier bags for retail supermarkets, luxury boutiques, and global distributors.",
      ctaText: "Shop Now",
      badgeDoctor: "Recommended by doctors",
      badgeTrust: "Trusted by 21,000+ People",
      productImage: "/images/bite-hero-product.png",
      backgroundImage: "/images/home-hero-bg.jpg",
      showcasePrice: 0.25,
      casePackSize: 1000,
      variants: [
        { id: 'v1', colorName: 'Ecotex Leaf Green', hex: '#86C59E', image: '/images/bag-green.png' },
        { id: 'v2', colorName: 'Pure White Linen', hex: '#FFFFFF', image: '/images/bag-white.png' },
        { id: 'v3', colorName: 'Deep Slate Black', hex: '#0f172a', image: '/images/bag-black.png' },
        { id: 'v4', colorName: 'Deep Forest Green', hex: '#4E9F76', image: '/images/bag-green.png' },
        { id: 'v5', colorName: 'Cobalt Blue', hex: '#2563eb', image: '/images/bag-blue.png' },
        { id: 'v6', colorName: 'Bio Amber Orange', hex: '#ea580c', image: '/images/bag-orange.png' }
      ]
    };
    setLocalHero(defaultHero);
    updateHeroConfig(defaultHero);
  };

  const handleAddVariant = () => {
    const newId = `v-${Date.now()}`;
    const newVariant = {
      id: newId,
      colorName: 'New Custom Colorway',
      hex: '#86C59E',
      image: '/images/bag-green.png'
    };
    const updated = {
      ...localHero,
      variants: [...localHero.variants, newVariant]
    };
    setLocalHero(updated);
    setActiveVariantTab(updated.variants.length - 1);
  };

  const handleDeleteVariant = (index: number) => {
    if (localHero.variants.length <= 1) {
      alert('You must have at least one colorway variant.');
      return;
    }
    const updatedVariants = localHero.variants.filter((_, i) => i !== index);
    setLocalHero({ ...localHero, variants: updatedVariants });
    if (activeVariantTab >= updatedVariants.length) {
      setActiveVariantTab(updatedVariants.length - 1);
    }
  };

  const handleVariantChange = (field: string, value: string) => {
    const updated = localHero.variants.map((v, i) => {
      if (i === activeVariantTab) {
        return { ...v, [field]: value };
      }
      return v;
    });
    setLocalHero({ ...localHero, variants: updated });
    updateHeroConfig({ variants: updated });
  };

  // Image file upload handler converting to object/data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetKey: 'heroProduct' | 'variant' | 'facilityPhoto' | 'shopBanner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      // Register in media library
      addMediaAsset({
        name: file.name,
        url: result,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.type
      });

      if (targetKey === 'heroProduct') {
        setLocalHero(prev => ({ ...prev, productImage: result }));
      } else if (targetKey === 'variant') {
        handleVariantChange('image', result);
      } else if (targetKey === 'facilityPhoto') {
        setLocalImages(prev => ({ ...prev, facilityPhoto: result }));
      } else if (targetKey === 'shopBanner') {
        setLocalImages(prev => ({ ...prev, shopBanner: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const activeVariant = localHero.variants[activeVariantTab] || localHero.variants[0];

  return (
    <div className="space-y-8 animate-fadeInUp pb-12">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#B2E2C5]/20 text-[#4E9F76]">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#4E9F76]">
              Sanity-Style Visual Customizer
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
            Hero Section & Site Assets Manager
          </h2>
          <p className="text-xs text-slate-500">
            Changes publish immediately across the live storefront without page refreshes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#0f172a] hover:bg-slate-50 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Factory</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#86C59E] text-white text-xs font-bold transition-all shadow-md shadow-[#4E9F76]/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#B2E2C5]" />
                <span>Live Synced!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Updates</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Live Preview & Editor Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Editor Controls (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Hero Headlines & Badges */}
          <div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">
                1. Hero Headlines & Social Proof
              </h3>
              <p className="text-xs text-slate-400">
                Configure primary title, narrative copy, and doctor / customer trust counters.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Main Headline (Use Enter for line-breaks)
                </label>
                <textarea
                  rows={2}
                  value={localHero.title}
                  onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-[#0f172a] focus:outline-none focus:border-[#86C59E] focus:ring-2 focus:ring-[#B2E2C5]/30"
                  placeholder="It's time to pack better."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Hero Subtitle Copy
                </label>
                <textarea
                  rows={3}
                  value={localHero.subtitle}
                  onChange={(e) => setLocalHero({ ...localHero, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#86C59E] focus:ring-2 focus:ring-[#B2E2C5]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Call-to-Action Text
                  </label>
                  <input
                    type="text"
                    value={localHero.ctaText}
                    onChange={(e) => setLocalHero({ ...localHero, ctaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#4E9F76] focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Badge 1 (Doctor / Industry)
                  </label>
                  <input
                    type="text"
                    value={localHero.badgeDoctor}
                    onChange={(e) => setLocalHero({ ...localHero, badgeDoctor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Badge 2 (Social Proof)
                  </label>
                  <input
                    type="text"
                    value={localHero.badgeTrust}
                    onChange={(e) => setLocalHero({ ...localHero, badgeTrust: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>

              {/* Price & Case Pack Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Showcase Unit Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={localHero.showcasePrice}
                      onChange={(e) => setLocalHero({ ...localHero, showcasePrice: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-[#4E9F76] focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Wholesale Case Pack Size (pcs)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={localHero.casePackSize}
                    onChange={(e) => setLocalHero({ ...localHero, casePackSize: parseInt(e.target.value) || 1000 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Colorway Variants Manager */}
          <div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">
                  2. Hero Colorway Variants ({localHero.variants.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Manage the clickable color swatches and associated high-res bag renders.
                </p>
              </div>

              <button
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B2E2C5]/20 hover:bg-[#B2E2C5]/40 text-[#4E9F76] text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Colorway</span>
              </button>
            </div>

            {/* Colorway Pills Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {localHero.variants.map((v, idx) => (
                <button
                  key={v.id || idx}
                  onClick={() => setActiveVariantTab(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                    activeVariantTab === idx
                      ? 'bg-[#4E9F76] text-white border-[#4E9F76] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#B2E2C5]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: v.hex }}
                  />
                  <span>{v.colorName.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Active Variant Editing Panel */}
            {activeVariant && (
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Editing: {activeVariant.colorName}
                  </span>
                  {localHero.variants.length > 1 && (
                    <button
                      onClick={() => handleDeleteVariant(activeVariantTab)}
                      className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Colorway Name
                    </label>
                    <input
                      type="text"
                      value={activeVariant.colorName}
                      onChange={(e) => handleVariantChange('colorName', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      HEX Code / Swatch
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={activeVariant.hex}
                        onChange={(e) => handleVariantChange('hex', e.target.value)}
                        className="w-9 h-9 p-0.5 rounded-xl border border-slate-300 cursor-pointer bg-white"
                      />
                      <input
                        type="text"
                        value={activeVariant.hex}
                        onChange={(e) => handleVariantChange('hex', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-[#0f172a] uppercase focus:outline-none focus:border-[#86C59E]"
                      />
                    </div>
                  </div>
                </div>

                <ImageUploader
                  label="Variant Bag Asset Image"
                  description="Import cutout bag PNG/WebP directly from your computer"
                  value={activeVariant.image}
                  onChange={(newUrl) => handleVariantChange('image', newUrl)}
                  aspectRatio="square"
                />
              </div>
            )}
          </div>

          {/* Card 3: Homepage Hero Background Image */}
          <div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">
                    3. Homepage Hero Background Image
                  </h3>
                  {(localHero.backgroundImage && localHero.backgroundImage !== 'none') ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Default Glowing Orbs
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set, change, or remove the panoramic background image displayed on the homepage hero banner.
                </p>
              </div>

              {(localHero.backgroundImage && localHero.backgroundImage !== 'none') && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...localHero, backgroundImage: 'none' };
                    setLocalHero(updated);
                    updateHeroConfig({ backgroundImage: 'none' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  title="Remove image and return to clean animated gradient orbs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Background</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              <ImageUploader
                label="Hero Background Artwork"
                description="Upload custom banner image (PNG, JPG, WebP) from your device or paste an image link"
                value={localHero.backgroundImage === 'none' ? '' : (localHero.backgroundImage || '/images/home-hero-bg.jpg')}
                onChange={(newUrl) => {
                  const val = newUrl ? newUrl : 'none';
                  const updated = { ...localHero, backgroundImage: val };
                  setLocalHero(updated);
                  updateHeroConfig({ backgroundImage: val });
                }}
                aspectRatio="banner"
              />

              {(localHero.backgroundImage && localHero.backgroundImage !== 'none') ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold truncate">
                      Active Image: {localHero.backgroundImage || '/images/home-hero-bg.jpg'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...localHero, backgroundImage: '/images/home-hero-bg.jpg' };
                        setLocalHero(updated);
                        updateHeroConfig({ backgroundImage: '/images/home-hero-bg.jpg' });
                      }}
                      className="text-[#4E9F76] hover:underline font-bold text-xs cursor-pointer"
                    >
                      Reset to Packaging Image
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...localHero, backgroundImage: 'none' };
                        setLocalHero(updated);
                        updateHeroConfig({ backgroundImage: 'none' });
                      }}
                      className="text-rose-600 hover:underline font-bold text-xs cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span>Background image is disabled. Default animated glowing green & cyan gradient orbs are active.</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...localHero, backgroundImage: '/images/home-hero-bg.jpg' };
                      setLocalHero(updated);
                      updateHeroConfig({ backgroundImage: '/images/home-hero-bg.jpg' });
                    }}
                    className="text-[#4E9F76] hover:underline font-bold text-xs cursor-pointer ml-3 shrink-0"
                  >
                    Restore Packaging Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Site Assets & Banners Replacement */}
          <div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">
                4. Site-Wide Assets & Banner Replacer
              </h3>
              <p className="text-xs text-slate-400">
                Replace facility photos, hero 3D jar images, and background banners across the website.
              </p>
            </div>

            <div className="space-y-4">
              {/* Hero 3D Jar Asset */}
              <ImageUploader
                label="Hero 3D Floating Product Asset (Bite Jar / Main Bag)"
                description="Import centerpiece transparent PNG product shot from your computer"
                value={localHero.productImage}
                onChange={(newUrl) => {
                  setLocalHero({ ...localHero, productImage: newUrl });
                  updateHeroConfig({ productImage: newUrl });
                }}
                aspectRatio="square"
              />

              {/* Facility Photo Asset */}
              <ImageUploader
                label="Corona, CA Manufacturing Facility Banner Photo"
                description="Import production plant editorial photo from your computer"
                value={localImages.facilityPhoto || ''}
                onChange={(newUrl) => {
                  setLocalImages({ ...localImages, facilityPhoto: newUrl });
                  updateSiteImage('facilityPhoto', newUrl);
                }}
                aspectRatio="wide"
              />
            </div>
          </div>

        </div>

        {/* Right: Live Interactive Card Preview (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 bg-[#EBF4EE] rounded-3xl p-6 sm:p-8 border border-[#B2E2C5]/30 shadow-md relative overflow-hidden">
            
            {/* Real-time background image in preview */}
            {(localHero.backgroundImage !== 'none' && (localHero.backgroundImage || '/images/home-hero-bg.jpg')) && (
              <div className="absolute inset-0 pointer-events-none -z-0">
                <img
                  src={localHero.backgroundImage || '/images/home-hero-bg.jpg'}
                  alt="Hero Preview Backdrop"
                  className="w-full h-full object-cover object-center opacity-40"
                />
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px]" />
              </div>
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-[#0f172a]/10">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#4E9F76]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#0f172a]">
                    Storefront Hero Preview
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/70 text-[#4E9F76]">
                  Real-Time
                </span>
              </div>

              {/* Simulated Bite Hero Layout */}
              <div className="mt-6 space-y-4">
              
              {/* Doctor & Trust Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[11px] font-bold text-[#0f172a] shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4E9F76]" />
                  <span>{localHero.badgeDoctor}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[11px] font-bold text-[#0f172a] shadow-xs">
                  <span>★</span>
                  <span>{localHero.badgeTrust}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight leading-[1.1] whitespace-pre-line">
                {localHero.title}
              </h2>

              {/* Subtitle */}
              <p className="text-xs text-[#0f172a]/80 leading-relaxed">
                {localHero.subtitle}
              </p>

              {/* Product Preview Image with Active Swatch */}
              <div className="relative py-6 flex items-center justify-center">
                <div className="w-44 h-44 sm:w-52 sm:h-52 relative flex items-center justify-center">
                  <img
                    src={activeVariant?.image || localHero.productImage || '/images/bag-green.png'}
                    alt="Hero Preview"
                    onError={(e) => {
                      e.currentTarget.src = '/images/bag-green.png';
                    }}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center justify-center gap-2">
                {localHero.variants.map((v, idx) => (
                  <div
                    key={v.id || idx}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      activeVariantTab === idx ? 'border-[#4E9F76] scale-125 shadow-xs' : 'border-white/80'
                    }`}
                    style={{ backgroundColor: v.hex }}
                  />
                ))}
              </div>

              {/* CTA & Price Mock */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Wholesale Tier</div>
                  <div className="text-lg font-black text-[#4E9F76]">
                    ${localHero.showcasePrice.toFixed(2)}
                    <span className="text-xs font-normal text-slate-500"> / unit</span>
                  </div>
                </div>

                <div className="px-5 py-2.5 rounded-xl bg-[#4E9F76] text-white text-xs font-black shadow-md">
                  {localHero.ctaText}
                </div>
              </div>

            </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
