'use client';

import React, { useState } from 'react';
import { ProductDetailPage } from '../../components/ProductDetailPage';
import { PRODUCTS } from '../../data/products';
import { 
  ShoppingBag, 
  Briefcase, 
  Package, 
  PackageCheck, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Star, 
  ShieldCheck, 
  Truck, 
  Layers, 
  Printer, 
  RotateCcw,
  Mail,
  Recycle,
  Instagram,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [wishlist, setWishlist] = useState({});
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [bestsellerIndex, setBestsellerIndex] = useState(0);
  const [cartToast, setCartToast] = useState(null);

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (productName) => {
    setCartToast(`Added ${productName} to Quote Request`);
    setTimeout(() => setCartToast(null), 3000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  const categories = [
    { id: 't-shirt', label: 'T-Shirt Bags', icon: ShoppingBag, count: '12 Models' },
    { id: 'non-woven', label: 'Non-Woven Totes', icon: Briefcase, count: '18 Models' },
    { id: 'd-cut', label: 'D-Cut Punch Bags', icon: Package, count: '14 Models' },
    { id: 'slider', label: 'Slider Zipper Bags', icon: PackageCheck, count: '9 Models' },
    { id: 'food', label: 'Food Item Bags', icon: Sparkles, count: '11 Models' },
  ];

  const newArrivals = [
    {
      id: 'loop-tote',
      name: 'The Ecotex Classic Loop Tote',
      price: '$0.25',
      unit: '/ unit',
      moq: '500 pcs/case',
      gsm: '80 GSM',
      image: '/images/bag-green.png',
      badge: 'Bestseller',
      category: 'non-woven',
      productRef: PRODUCTS[2] || PRODUCTS[0]
    },
    {
      id: 'soft-laminated',
      name: 'The Soft Laminated Curve Bag',
      price: '$0.95',
      unit: '/ unit',
      moq: '300 pcs/case',
      gsm: '110 GSM Gloss',
      image: '/images/bag-white.png',
      badge: 'Luxury Finish',
      category: 'non-woven',
      productRef: PRODUCTS[3] || PRODUCTS[0]
    },
    {
      id: 'd-punch',
      name: 'Heavy Duty D-Punch Carrier',
      price: '$0.55',
      unit: '/ unit',
      moq: '1,000 pcs/case',
      gsm: '65 GSM Bio-PLA',
      image: '/images/bag-orange.png',
      badge: 'Compostable',
      category: 'd-cut',
      productRef: PRODUCTS[1] || PRODUCTS[0]
    },
    {
      id: 'slider-pouch',
      name: 'EVA Slider Zipper Pouch',
      price: '$0.68',
      unit: '/ unit',
      moq: '500 pcs/case',
      gsm: '120 Micron Soft',
      image: '/images/bag-blue.png',
      badge: 'Waterproof',
      category: 'slider',
      productRef: PRODUCTS[4] || PRODUCTS[0]
    }
  ];

  const bestsellers = [
    {
      id: 'bs-1',
      name: 'Signature 80 GSM Box-Tote',
      price: '$0.42',
      unit: '/ unit',
      moq: 'MOQ 500 units',
      image: '/images/bag-black.png',
      material: 'Virgin Non-Woven Polypropylene',
      productRef: PRODUCTS[2] || PRODUCTS[0]
    },
    {
      id: 'bs-2',
      name: 'Matte Laminated Boutique Carrier',
      price: '$0.65',
      unit: '/ unit',
      moq: 'MOQ 500 units',
      image: '/images/bag-white.png',
      material: 'Laminated BOPP + Non-Woven',
      productRef: PRODUCTS[3] || PRODUCTS[0]
    },
    {
      id: 'bs-3',
      name: 'Eco-Loop Grocery T-Shirt Sack',
      price: '$0.18',
      unit: '/ unit',
      moq: 'MOQ 1,000 units',
      image: '/images/bag-green.png',
      material: 'Recycled Polypropylene Non-Woven',
      productRef: PRODUCTS[0]
    },
    {
      id: 'bs-4',
      name: 'Thermal Cold-Chain Insulated Cooler',
      price: '$1.15',
      unit: '/ unit',
      moq: 'MOQ 300 units',
      image: '/images/bag-orange.png',
      material: 'Non-Woven + EPE Foam + Foil',
      productRef: PRODUCTS[4] || PRODUCTS[0]
    }
  ];

  const reviews = [
    {
      quote: "Switching our 42 regional grocery locations to Ecotex loop bags cut packaging overhead by 28% while exceeding state single-use mandates.",
      author: "Elena Vasquez",
      role: "VP Supply Chain",
      company: "SunWest Markets California",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "The custom gold flexo printing on their black matte totes gave our boutique clients an unmistakable luxury feel that shoppers reuse every single day.",
      author: "Marcus Vance",
      role: "Creative Director",
      company: "Artisan Living Brands NY",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "Flawless batch consistency across 150,000 custom printed units. Not a single torn handle during holiday freight distribution. Exceptional manufacturer.",
      author: "Sarah Lindqvist",
      role: "Head of Procurement",
      company: "Nordic Lifestyle Group",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', caption: 'High-Speed Automated Ultrasonic Welder' },
    { url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80', caption: 'Virgin Non-Woven Polypropylene Rolls' },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80', caption: 'Cleanroom ISO Quality Testing' },
    { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', caption: 'Palletized Container Shipments' },
    { url: 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&w=600&q=80', caption: 'Precision Handle Box-Stitch Detail' },
    { url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80', caption: 'Export-Grade Custom Cartons' }
  ];

  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        onBack={() => {
          setSelectedProduct(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateHome={() => {
          setSelectedProduct(null);
          window.location.href = '/';
        }}
        onAddToCart={(product, color, qty) => {
          setCartToast(`Added ${product.name} to Cart / Quote`);
          setTimeout(() => setCartToast(null), 2500);
        }}
        onOpenQuote={() => {
          window.location.href = '/contact-us';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfb] text-[#111827] font-sans antialiased selection:bg-[#166534] selection:text-white">

      {/* ========================================================
          1. EDITORIAL SHOP HERO (LORIEN REFERENCE STYLE - SPLIT 50/50)
         ======================================================== */}
      <section className="relative w-full border-b border-[#e5e7eb] bg-gradient-to-b from-[#f4f6f4] to-[#fbfcfb] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-12 pb-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-6 flex flex-col justify-center text-left">
              <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#166534] mb-3 block">
                SUSTAINABLE. REUSABLE. FACTORY DIRECT.
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111827] leading-[1.08] [text-wrap:balance]">
                A Bag For Every Purpose.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[#4b5563] leading-relaxed max-w-lg font-light">
                Thoughtfully manufactured non-woven and biodegradable bags that elevate your brand image while keeping the planet green.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <a
                  href="#catalog-grid"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#166534] hover:bg-[#14532d] text-white px-8 py-4 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Explore The Collection</span>
                  <ArrowRight className="w-4 h-4 text-[#22c55e]" />
                </a>
              </div>

              {/* Quality Micro-Badge */}
              <div className="mt-10 pt-6 border-t border-[#e5e7eb] flex items-center gap-6 text-xs text-[#4b5563]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span>100% Recyclable Polypropylene</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span>ASTM D6400 Certified</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Lifestyle Visual */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-white border border-[#e5e7eb] group">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85"
                  alt="Person carrying sustainable branded Ecotex tote bag outside modern corporate building"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                {/* Floating Product Highlight Tag */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#166534] block">
                      Featured Model
                    </span>
                    <h4 className="text-sm font-bold text-[#111827]">
                      The Classic Forest Box-Tote
                    </h4>
                    <p className="text-xs text-[#4b5563]">
                      Starting at <span className="font-extrabold text-[#166534]">$0.42 / unit</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] text-[#166534] flex items-center justify-center font-bold text-xs">
                    80 GSM
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. HORIZONTAL CATEGORY ICON STRIP (LORIEN STYLE)
         ======================================================== */}
      <section className="border-b border-[#e5e7eb] bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex items-center justify-start lg:justify-between overflow-x-auto py-4 gap-3 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id === activeCategory ? 'all' : cat.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? 'bg-[#166534] text-white border-[#166534] shadow-md scale-105'
                      : 'bg-[#fbfcfb] text-[#4b5563] border-[#e5e7eb] hover:border-[#166534] hover:text-[#166534] hover:bg-[#dcfce7]/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#166534]'}`} />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. "NEW ARRIVALS" 4-COLUMN PRODUCT GRID
         ======================================================== */}
      <section id="catalog-grid" className="py-16 sm:py-24 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-[#e5e7eb]">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#166534] block mb-1">
              Factory Direct Catalog
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111827] tracking-tight uppercase">
              New Arrivals
            </h2>
          </div>

          <a 
            href="#bestsellers"
            className="text-xs font-bold uppercase tracking-wider text-[#166534] hover:text-[#14532d] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.map((product) => {
            const isWishlisted = !!wishlist[product.id];
            return (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product.productRef || product)}
                className="group relative flex flex-col bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Image Container with Soft Neutral Background */}
                <div className="relative w-full aspect-square bg-[#f8faf8] flex items-center justify-center p-6 overflow-hidden">
                  
                  {/* Badge */}
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-white/90 backdrop-blur-xs text-[#166534] border border-[#dcfce7] shadow-xs">
                    {product.badge}
                  </span>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    aria-label={`Save ${product.name} to wishlist`}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-slate-600 hover:text-red-500 shadow-xs transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-current'
                    }`} />
                  </button>

                  {/* Product Transparent Bag Visual with scale animation */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500 ease-out select-none"
                    loading="lazy"
                  />

                  {/* Quick Action Overlay Button on Hover */}
                  <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.name);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#166534] hover:bg-[#14532d] text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Quote / Cart</span>
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[11px] font-semibold text-[#166534] tracking-wide block">
                      {product.gsm} · {product.moq}
                    </span>
                    <h3 className="text-sm font-bold text-[#111827] mt-1 group-hover:text-[#166534] transition-colors leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-[#111827] font-mono">
                        {product.price}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">
                        {product.unit}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Tier Discounts
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          4. MID-PAGE PROMOTIONAL EDIT BANNER (SPLIT 50/50)
         ======================================================== */}
      <section className="py-12 bg-[#f4f6f4] border-y border-[#e5e7eb] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side: Overhead flat-lay editorial photo */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e5e7eb] aspect-[4/3] group">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85"
                  alt="Overhead flat-lay displaying sustainable non-woven fabric swatches and branded packaging samples"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg text-[#166534] border border-[#e5e7eb]">
                  Custom Color Lab · 40+ Swatches
                </span>
              </div>
            </div>

            {/* Right Side: Editorial Text Block */}
            <div className="lg:col-span-6 flex flex-col justify-center lg:pl-6">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#166534] mb-2 block">
                LIMITED RUN WHOLESALE OFFER
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111827] leading-tight mb-4 [text-wrap:balance]">
                Green Retail Edit: Save Up to 25% on Bulk Orders
              </h2>

              <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed font-light mb-6">
                Upgrade your store operations with custom silkscreen or flexographic printed totes. Low minimum order quantities starting at only 500 units with accelerated 48-hour physical sample proofing.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="#quote-form"
                  className="bg-[#166534] hover:bg-[#14532d] text-white px-7 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Get Custom Quote</span>
                  <ArrowRight className="w-4 h-4 text-[#22c55e]" />
                </a>

                <span className="text-xs text-slate-500 font-medium">
                  Free Digital Mockup in 4 Hours
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          5. 4-PILLAR VALUE STRIP (LORIEN STYLE)
         ======================================================== */}
      <section className="py-12 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#166534] flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  100% Virgin Materials
                </h4>
                <p className="text-xs text-[#4b5563] mt-1 leading-relaxed">
                  Superior tensile strength; quality you can feel in every handle.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#166534] flex items-center justify-center shrink-0">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  Custom Gravure & Flexo
                </h4>
                <p className="text-xs text-[#4b5563] mt-1 leading-relaxed">
                  Pantone color matching with soy-based non-toxic inks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#166534] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  Secure Global Logistics
                </h4>
                <p className="text-xs text-[#4b5563] mt-1 leading-relaxed">
                  Direct port export from California & Karachi with live tracking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#166534] flex items-center justify-center shrink-0">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  Free Sample Packs
                </h4>
                <p className="text-xs text-[#4b5563] mt-1 leading-relaxed">
                  Hassle-free physical material test kits sent to your desk.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          6. "BESTSELLERS" & "PACKAGING GUIDE" SPLIT SECTION
         ======================================================== */}
      <section id="bestsellers" className="py-16 sm:py-24 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 border-b border-[#e5e7eb]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Bestsellers Carousel Style */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#e5e7eb]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#166534] block mb-0.5">
                    Highest Reorder Volume
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#111827] uppercase">
                    Bestsellers
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBestsellerIndex((prev) => (prev > 0 ? prev - 1 : bestsellers.length - 3))}
                    className="p-2 rounded-full border border-[#e5e7eb] hover:border-[#166534] text-slate-700 hover:text-[#166534] transition-colors cursor-pointer"
                    aria-label="Previous bestseller"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setBestsellerIndex((prev) => (prev + 1) % (bestsellers.length - 2))}
                    className="p-2 rounded-full border border-[#e5e7eb] hover:border-[#166534] text-slate-700 hover:text-[#166534] transition-colors cursor-pointer"
                    aria-label="Next bestseller"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3 Visible Products Mini-Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {bestsellers.slice(bestsellerIndex, bestsellerIndex + 3).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedProduct(item.productRef || item)}
                    className="group bg-white rounded-xl border border-[#e5e7eb] p-3 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="w-full aspect-square bg-[#f8faf8] rounded-lg p-2 flex items-center justify-center overflow-hidden mb-2">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h5 className="text-[11px] sm:text-xs font-bold text-[#111827] truncate">
                        {item.name}
                      </h5>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {item.moq}
                      </p>
                      <p className="text-xs font-black text-[#166534] mt-1 font-mono">
                        {item.price} <span className="text-[9px] text-slate-400 font-normal">/ unit</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#4b5563]">
              <span>Over 50 million units produced in 2025</span>
              <a href="#catalog-grid" className="font-bold text-[#166534] hover:underline">
                View Full Catalog →
              </a>
            </div>
          </div>

          {/* Right Column: Packaging Guide / Case Studies (Lorien Styling Guide style) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#e5e7eb]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#166534] block mb-0.5">
                    Industrial Knowledge
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#111827] uppercase">
                    Packaging Guide
                  </h3>
                </div>

                <a href="#quote-form" className="text-xs font-bold uppercase tracking-wider text-[#166534] hover:underline">
                  Case Studies →
                </a>
              </div>

              {/* 2 Editorial Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Guide Card 1 */}
                <div className="group rounded-2xl overflow-hidden border border-[#e5e7eb] bg-white flex flex-col shadow-xs hover:shadow-lg transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=85"
                      alt="Laboratory tensile testing of non-woven fabric"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white px-2 py-0.5 rounded">
                      MATERIAL SPEC
                    </span>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-[#166534] transition-colors leading-snug">
                      How to choose between 80 GSM vs 100 GSM non-woven fabric
                    </h4>
                    <span className="text-[10px] text-slate-500 mt-2 block font-medium">
                      5 Min Read · Material Guide
                    </span>
                  </div>
                </div>

                {/* Guide Card 2 */}
                <div className="group rounded-2xl overflow-hidden border border-[#e5e7eb] bg-white flex flex-col shadow-xs hover:shadow-lg transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=85"
                      alt="Modern retail customer carrying reusable eco bag"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#166534] text-[9px] font-bold text-white px-2 py-0.5 rounded">
                      REGULATORY SHIFT
                    </span>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-[#166534] transition-colors leading-snug">
                      Why retail brands are shifting from plastic to PEVA & Loop Bags
                    </h4>
                    <span className="text-[10px] text-slate-500 mt-2 block font-medium">
                      4 Min Read · SB 270 Compliance
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#4b5563]">
              <span>Complimentary compliance consulting available</span>
              <a href="#quote-form" className="font-bold text-[#166534] hover:underline">
                Download Whitepaper →
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          7. CUSTOMER TRUST & REVIEWS STRIP (LORIEN STYLE)
         ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fbfcfb] border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-center">
          
          <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#166534] block mb-2">
            PROVEN IN GLOBAL SUPPLY CHAINS
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#111827] uppercase tracking-tight mb-12">
            Trusted by 500+ Global Businesses
          </h2>

          {/* 3 Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            {reviews.map((rev, index) => (
              <div 
                key={index}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e5e7eb] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* 5 Green/Gold Stars */}
                  <div className="flex items-center gap-1 mb-4 text-[#166534]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#166534] text-[#166534]" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed italic">
                    "{rev.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-[#dcfce7]"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-[#111827]">
                      {rev.author}
                    </h5>
                    <p className="text-[11px] text-[#166534] font-medium">
                      {rev.role}, {rev.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          8. FACTORY GALLERY STRIP & LUXURY FOOTER
         ======================================================== */}
      {/* Follow @ecotex.inc 6-Image Strip */}
      <section className="bg-white">
        <div className="py-4 px-6 md:px-12 lg:px-16 border-b border-[#e5e7eb] flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2 text-[#166534]">
            <Instagram className="w-4 h-4" />
            <span className="tracking-wider uppercase">Follow @ecotex.inc</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Inside Our Manufacturing Floor
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-[#e5e7eb]">
          {galleryImages.map((g, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden bg-slate-900 border-r border-[#e5e7eb] last:border-r-0">
              <img
                src={g.url}
                alt={g.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <span className="text-[10px] text-white font-semibold">
                  {g.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Obsidian Dark Footer (#0f172a) */}
      <footer id="quote-form" className="bg-[#0f172a] text-slate-300 pt-16 sm:pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-slate-800">
            
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center text-white shadow-md">
                  <Recycle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight text-white block leading-none">
                    ECO<span className="text-[#22c55e]">TEX</span> INC.
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">
                    Sustainable Packaging Solutions
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm font-light">
                Timeless, durable non-woven and plant-based packaging crafted with precision. Backed by certified carbon reductions and industrial strength.
              </p>

              <div className="mt-5 text-[11px] text-[#22c55e] font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>CalRecycle SB 270 & ASTM D6400 Compliant</span>
              </div>
            </div>

            {/* Col 2: Shop Links */}
            <div className="lg:col-span-2">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
                Shop Packaging
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="#catalog-grid" className="hover:text-white transition-colors">All Bags</a></li>
                <li><a href="#catalog-grid" className="hover:text-white transition-colors">Loop Totes</a></li>
                <li><a href="#catalog-grid" className="hover:text-white transition-colors">D-Punch Carriers</a></li>
                <li><a href="#catalog-grid" className="hover:text-white transition-colors">Laminated Luxury</a></li>
                <li><a href="#catalog-grid" className="hover:text-white transition-colors">Slider Pouches</a></li>
              </ul>
            </div>

            {/* Col 3: Help & Wholesale Guide */}
            <div className="lg:col-span-2">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
                Wholesale Help
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="/about-us" className="hover:text-white transition-colors">Our Story & Factory</a></li>
                <li><a href="#quote-form" className="hover:text-white transition-colors">Volume Tier Pricing</a></li>
                <li><a href="#quote-form" className="hover:text-white transition-colors">Custom Printing Spec</a></li>
                <li><a href="#quote-form" className="hover:text-white transition-colors">Free Sample Kit</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Engineers</a></li>
              </ul>
            </div>

            {/* Col 4: Newsletter / Stay In The Loop */}
            <div className="lg:col-span-4">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-white mb-2">
                Stay In The Loop
              </h5>
              <p className="text-xs text-slate-400 mb-4 font-light">
                Be the first to know about new packaging models, volume discounts, and material test reports.
              </p>

              {!newsletterSubscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Your work email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    →
                  </button>
                </form>
              ) : (
                <div className="text-xs text-[#22c55e] font-semibold bg-slate-900 p-3 rounded-lg border border-[#22c55e]/30 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Subscribed! Check your inbox for volume discount codes.</span>
                </div>
              )}
            </div>

          </div>

          {/* Copyright Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © 2026 <span className="text-white font-bold">Ecotex Inc.</span> All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
              <span>Corona, CA · Karachi, PK</span>
              <span>·</span>
              <span>ISO 9001:2015</span>
              <span>·</span>
              <span>ASTM D6400</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive Cart/Quote Toast */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-[#22c55e]" />
          <span>{cartToast}</span>
        </div>
      )}

    </div>
  );
}
