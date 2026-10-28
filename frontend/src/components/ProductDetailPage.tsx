'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../types';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ArrowLeft,
  ArrowRight, 
  Minus, 
  Plus,
  Share2,
  AlertCircle,
  Package,
  Lock,
  Sparkles,
  Edit3,
  X,
  Save
} from 'lucide-react';
import { DYE_COLORS, DyeColor } from '../data/colors';
import { useStore } from '../store/useStore';
import { PRODUCTS } from '../data/products';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onNavigateHome: () => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale') => void;
  onOpenQuote: (product: Product) => void;
  onExpressCheckout?: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale') => void;
  onSelectProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onNavigateHome,
  onAddToCart,
  onOpenQuote,
  onExpressCheckout,
  onSelectProduct,
  onEditProduct
}) => {
  const { products: storeProducts, isAuthenticated, updateProduct } = useStore();
  const allProducts = (storeProducts && storeProducts.length > 0) ? storeProducts : PRODUCTS;

  // 5 Related products for bottom section
  const relatedProducts = React.useMemo(() => {
    const others = allProducts.filter(p => p.id !== product.id);
    const sameCategory = others.filter(p => 
      p.category && product.category && p.category.toLowerCase() === product.category.toLowerCase()
    );
    const differentCategory = others.filter(p => 
      !p.category || !product.category || p.category.toLowerCase() !== product.category.toLowerCase()
    );
    return [...sameCategory, ...differentCategory].slice(0, 5);
  }, [allProducts, product.id, product.category]);
  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [orderType, setOrderType] = useState<'retail' | 'wholesale'>('retail');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Dynamic Wholesale MOQ & Retail Limits from Product Settings
  const wholesaleMoq = product.wholesaleMoq || 5;
  const retailMaxBoxes = product.retailMaxBoxes || 5;
  const pcsPerBox = product.pcsPerBox || 200;
  const isOutOfStock = product.inStock === false || (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);
  const availableStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock !== false ? 50 : 0);

  const minQuantity = orderType === 'wholesale' ? wholesaleMoq : 1;
  const maxQuantity = orderType === 'retail' ? Math.min(retailMaxBoxes, availableStock) : availableStock;
  const [moqWarning, setMoqWarning] = useState<string | null>(null);

  // Scroll to top on mount or when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setMoqWarning(null);
    setQuantity(orderType === 'retail' ? Math.min(1, availableStock) : Math.min(wholesaleMoq, availableStock));
  }, [product, orderType, wholesaleMoq, availableStock]);

  const [selectedColor, setSelectedColor] = useState<DyeColor>(() => {
    return DYE_COLORS.find(c => c.name.toLowerCase() === ((product as any).color || product.availableColors?.[0]?.name)?.toLowerCase()) || DYE_COLORS[4]; // Default: Dark Green
  });

  // ========================================================
  // SINGLE PRODUCT PAGE CMS EDITOR STATE
  // ========================================================
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<'info' | 'pricing' | 'images' | 'specs' | 'badges'>('info');
  const [editorToast, setEditorToast] = useState<string | null>(null);

  const PRESET_IMAGES = [
    { label: 'Leaf Green', url: '/images/bag-green.png' },
    { label: 'Cobalt Blue', url: '/images/bag-blue.png' },
    { label: 'Linen White', url: '/images/bag-white.png' },
    { label: 'Luxury Black', url: '/images/bag-black.png' },
    { label: 'Bio Amber', url: '/images/bag-orange.png' },
    { label: 'PLA Bio Jar', url: '/images/bite-hero-product.png' }
  ];

  const [editForm, setEditForm] = useState({
    name: product.name,
    categoryLabel: product.categoryLabel || 'SUSTAINABLE NON-WOVEN',
    subtitle: product.subtitle || '',
    rating: product.rating !== undefined ? product.rating : 4.9,
    articleNo: product.articleNo || `EP-${product.id.slice(0, 6).toUpperCase()}`,
    volumeNo: product.volumeNo || `${product.gsm || 45} GSM LUXURY`,
    description: product.description || '',
    pricePerUnit: product.pricePerUnit || 59.99,
    originalPrice: product.originalPrice || ((product.pricePerUnit || 59.99) * 1.25),
    retailPricePerUnit: product.retailPricePerUnit !== undefined && product.retailPricePerUnit > 0 ? product.retailPricePerUnit : Number(((product.pricePerUnit || 59.99) * 1.45).toFixed(2)),
    retailOriginalPrice: product.retailOriginalPrice !== undefined && product.retailOriginalPrice > 0 ? product.retailOriginalPrice : Number(((product.retailPricePerUnit || ((product.pricePerUnit || 59.99) * 1.45)) * 1.25).toFixed(2)),
    retailMaxBoxes: product.retailMaxBoxes || 5,
    wholesaleMoq: product.wholesaleMoq || 5,
    pcsPerBox: product.pcsPerBox || 200,
    stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 50,
    inStock: product.inStock !== false,
    image: product.image || '/images/bag-green.png',
    gallery0: product.galleryImages?.[0] || product.image || '/images/bag-green.png',
    gallery1: product.galleryImages?.[1] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    gallery2: product.galleryImages?.[2] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
    gallery3: product.galleryImages?.[3] || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
    bestFor: product.bestFor || 'Supermarket grocers, retail boutiques',
    recommendedPrint: product.recommendedPrint || '2-Color Flexographic ink on Leaf Green',
    brandName: product.brandName || 'ECOTEX INC.',
    fabricDetails: product.fabricDetails || `${product.gsm || 45} GSM Virgin Non-Woven Polypropylene`,
    dimensions: product.dimensions || '11.5"W x 21"H x 6.5" Gusset',
    handles: product.handles || 'Ultrasonic Thermal Welded Loops',
    printingMethod: product.printingMethod || 'High-Precision Flexographic / Gravure Custom Imprint',
    compliance: product.compliance || 'Certified California SB 270 & ASTM D6400',
    packingDetails: product.packingDetails || 'Export-Grade Heavy Duty Corrugated Cartons',
    guaranteedFabric: product.guaranteedFabric || '100% Virgin Grade Recyclable Polypropylene',
    enrouteQuality: product.enrouteQuality || 'Enroute to Quality Standard',
    trustBadge1: product.trustBadge1 || 'Fast Delivery',
    trustBadge2: product.trustBadge2 || 'Secure Store',
    trustBadge3: product.trustBadge3 || 'Easy Return',
    retailPolicyText: product.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
    wholesalePolicyText: product.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
    outOfStockNotice: product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
    checkoutButtonText: product.checkoutButtonText || '→ Express Checkout',
    outOfStockButtonText: product.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)',
    retailTabLabel: product.retailTabLabel || 'Retail Order',
    wholesaleTabLabel: product.wholesaleTabLabel || 'Wholesale Order',
    specsHeading: product.specsHeading || 'Description',
    relatedTag: product.relatedTag || 'Explore More Options',
    relatedTitle: product.relatedTitle || 'Related Products',
    relatedSubtitle: product.relatedSubtitle || 'Frequently ordered together or alternative sizing options for your business.',
    relatedBackBtnText: product.relatedBackBtnText || 'View Full Catalog →',
  });

  useEffect(() => {
    setEditForm({
      name: product.name,
      categoryLabel: product.categoryLabel || 'SUSTAINABLE NON-WOVEN',
      subtitle: product.subtitle || '',
      rating: product.rating !== undefined ? product.rating : 4.9,
      articleNo: product.articleNo || `EP-${product.id.slice(0, 6).toUpperCase()}`,
      volumeNo: product.volumeNo || `${product.gsm || 45} GSM LUXURY`,
      description: product.description || '',
      pricePerUnit: product.pricePerUnit || 59.99,
      originalPrice: product.originalPrice || Math.round((product.pricePerUnit || 59.99) * 1.25 * 100) / 100,
      retailPricePerUnit: product.retailPricePerUnit !== undefined && product.retailPricePerUnit > 0 ? product.retailPricePerUnit : Number(((product.pricePerUnit || 59.99) * 1.45).toFixed(2)),
      retailOriginalPrice: product.retailOriginalPrice !== undefined && product.retailOriginalPrice > 0 ? product.retailOriginalPrice : Number(((product.retailPricePerUnit || ((product.pricePerUnit || 59.99) * 1.45)) * 1.25).toFixed(2)),
      retailMaxBoxes: product.retailMaxBoxes || 5,
      wholesaleMoq: product.wholesaleMoq || 5,
      pcsPerBox: product.pcsPerBox || 200,
      stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 50,
      inStock: product.inStock !== false,
      image: product.image || '/images/bag-green.png',
      gallery0: product.galleryImages?.[0] || product.image || '/images/bag-green.png',
      gallery1: product.galleryImages?.[1] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      gallery2: product.galleryImages?.[2] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
      gallery3: product.galleryImages?.[3] || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      bestFor: product.bestFor || 'Supermarket grocers, retail boutiques',
      recommendedPrint: product.recommendedPrint || '2-Color Flexographic ink on Leaf Green',
      brandName: product.brandName || 'ECOTEX INC.',
      fabricDetails: product.fabricDetails || `${product.gsm || 45} GSM Virgin Non-Woven Polypropylene`,
      dimensions: product.dimensions || '11.5"W x 21"H x 6.5" Gusset',
      handles: product.handles || 'Ultrasonic Thermal Welded Loops',
      printingMethod: product.printingMethod || 'High-Precision Flexographic / Gravure Custom Imprint',
      compliance: product.compliance || 'Certified California SB 270 & ASTM D6400',
      packingDetails: product.packingDetails || 'Export-Grade Heavy Duty Corrugated Cartons',
      guaranteedFabric: product.guaranteedFabric || '100% Virgin Grade Recyclable Polypropylene',
      enrouteQuality: product.enrouteQuality || 'Enroute to Quality Standard',
      trustBadge1: product.trustBadge1 || 'Fast Delivery',
      trustBadge2: product.trustBadge2 || 'Secure Store',
      trustBadge3: product.trustBadge3 || 'Easy Return',
      retailPolicyText: product.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
      wholesalePolicyText: product.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
      outOfStockNotice: product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
      checkoutButtonText: product.checkoutButtonText || '→ Express Checkout',
      outOfStockButtonText: product.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)',
      retailTabLabel: product.retailTabLabel || 'Retail Order',
      wholesaleTabLabel: product.wholesaleTabLabel || 'Wholesale Order',
      specsHeading: product.specsHeading || 'Description',
      relatedTag: product.relatedTag || 'Explore More Options',
      relatedTitle: product.relatedTitle || 'Related Products',
      relatedSubtitle: product.relatedSubtitle || 'Frequently ordered together or alternative sizing options for your business.',
      relatedBackBtnText: product.relatedBackBtnText || 'View Full Catalog →',
    });
  }, [product]);

  const handleSaveProductPage = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStockQuantity = Math.max(0, Number(editForm.stockQuantity) || 0);
    const finalInStock = editForm.inStock && finalStockQuantity > 0;

    const updates: Partial<Product> = {
      name: editForm.name.trim(),
      categoryLabel: editForm.categoryLabel.trim(),
      subtitle: editForm.subtitle.trim(),
      rating: Number(editForm.rating) || 4.9,
      articleNo: editForm.articleNo.trim(),
      volumeNo: editForm.volumeNo.trim(),
      description: editForm.description.trim(),
      pricePerUnit: Math.max(0.01, Number(editForm.pricePerUnit) || 59.99),
      originalPrice: Math.max(0.01, Number(editForm.originalPrice) || 74.99),
      retailPricePerUnit: Math.max(0.01, Number(editForm.retailPricePerUnit) || 86.99),
      retailOriginalPrice: Math.max(0.01, Number(editForm.retailOriginalPrice) || 108.73),
      retailMaxBoxes: Math.max(1, Number(editForm.retailMaxBoxes) || 5),
      wholesaleMoq: Math.max(1, Number(editForm.wholesaleMoq) || 5),
      pcsPerBox: Math.max(1, Number(editForm.pcsPerBox) || 200),
      stockQuantity: finalStockQuantity,
      inStock: finalInStock,
      image: editForm.image.trim(),
      galleryImages: [
        editForm.gallery0.trim() || editForm.image.trim(),
        editForm.gallery1.trim(),
        editForm.gallery2.trim(),
        editForm.gallery3.trim(),
      ].filter(Boolean),
      bestFor: editForm.bestFor.trim(),
      recommendedPrint: editForm.recommendedPrint.trim(),
      brandName: editForm.brandName.trim(),
      fabricDetails: editForm.fabricDetails.trim(),
      dimensions: editForm.dimensions.trim(),
      handles: editForm.handles.trim(),
      printingMethod: editForm.printingMethod.trim(),
      compliance: editForm.compliance.trim(),
      packingDetails: editForm.packingDetails.trim(),
      guaranteedFabric: editForm.guaranteedFabric.trim(),
      enrouteQuality: editForm.enrouteQuality.trim(),
      trustBadge1: editForm.trustBadge1.trim(),
      trustBadge2: editForm.trustBadge2.trim(),
      trustBadge3: editForm.trustBadge3.trim(),
      retailPolicyText: editForm.retailPolicyText.trim(),
      wholesalePolicyText: editForm.wholesalePolicyText.trim(),
      outOfStockNotice: editForm.outOfStockNotice.trim(),
      checkoutButtonText: editForm.checkoutButtonText.trim(),
      outOfStockButtonText: editForm.outOfStockButtonText.trim(),
      retailTabLabel: editForm.retailTabLabel.trim(),
      wholesaleTabLabel: editForm.wholesaleTabLabel.trim(),
      specsHeading: editForm.specsHeading.trim(),
      relatedTag: editForm.relatedTag.trim(),
      relatedTitle: editForm.relatedTitle.trim(),
      relatedSubtitle: editForm.relatedSubtitle.trim(),
      relatedBackBtnText: editForm.relatedBackBtnText.trim(),
    };

    updateProduct(product.id, updates);
    setIsEditorOpen(false);
    setEditorToast('Single Product Page updated & published live!');
    setTimeout(() => setEditorToast(null), 3500);
  };


  // Fixed product bag image (does not change on color swatch selection)
  const bagCutout = product.image || '/images/bag-green.png';

  // 4 Gallery images tailored for this product (dynamic from product with studio fallbacks)
  const defaultGalleryImages = [
    { 
      url: bagCutout, 
      label: 'Front Product Shot',
      badge: 'Studio Cutout'
    },
    { 
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85', 
      label: 'Lifestyle Editorial',
      badge: 'Editorial'
    },
    { 
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85', 
      label: 'Fabric Macro & Seam',
      badge: 'Macro Seam'
    },
    { 
      url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85', 
      label: 'Production Detail',
      badge: 'Workshop'
    }
  ];

  const galleryImages = [
    { 
      url: product.galleryImages?.[0] || bagCutout, 
      label: 'Front Product Shot',
      badge: 'Studio Cutout'
    },
    { 
      url: product.galleryImages?.[1] || defaultGalleryImages[1].url, 
      label: 'Lifestyle Editorial',
      badge: 'Editorial'
    },
    { 
      url: product.galleryImages?.[2] || defaultGalleryImages[2].url, 
      label: 'Fabric Macro & Seam',
      badge: 'Macro Seam'
    },
    { 
      url: product.galleryImages?.[3] || defaultGalleryImages[3].url, 
      label: 'Production Detail',
      badge: 'Workshop'
    }
  ];

  // Pricing calculations: Dedicated Retail & Wholesale options
  const retailUnitPrice = product.retailPricePerUnit !== undefined && product.retailPricePerUnit > 0
    ? product.retailPricePerUnit
    : (product.pricePerUnit ? Number((product.pricePerUnit * 1.45).toFixed(2)) : 86.99);

  const wholesaleUnitPrice = product.pricePerUnit || 59.99;
  const currentPrice = orderType === 'retail' ? retailUnitPrice : wholesaleUnitPrice;

  const originalPrice = orderType === 'retail'
    ? (product.retailOriginalPrice !== undefined && product.retailOriginalPrice > 0 
        ? product.retailOriginalPrice 
        : Number((retailUnitPrice * 1.25).toFixed(2)))
    : (product.originalPrice !== undefined && product.originalPrice > 0 
        ? product.originalPrice 
        : Number((wholesaleUnitPrice * 1.25).toFixed(2)));

  const handleIncrement = () => {
    if (orderType === 'retail') {
      if (quantity >= maxQuantity) {
        setMoqWarning(maxQuantity < 5 
          ? `Stock limit reached: only ${availableStock} boxes available in stock.`
          : 'Retail orders are limited to a maximum of 5 boxes. For larger orders, please switch to Wholesale Order.');
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      setQuantity(prev => Math.min(maxQuantity, prev + 1));
    } else {
      // Wholesale: step of 5 up to maxQuantity (availableStock)
      if (quantity >= maxQuantity) {
        setMoqWarning(`Stock limit reached: only ${availableStock} boxes available in stock.`);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      setQuantity(prev => {
        if (prev < 5) return Math.min(maxQuantity, 5);
        const next = (prev % 5 !== 0) ? Math.floor(prev / 5) * 5 + 5 : prev + 5;
        return Math.min(maxQuantity, next);
      });
    }
    setMoqWarning(null);
  };

  const handleDecrement = () => {
    if (orderType === 'retail') {
      setQuantity(prev => Math.max(1, prev - 1));
    } else {
      // Wholesale: step of 5, minimum 5
      setQuantity(prev => {
        if (prev <= 5) return 5;
        if (prev % 5 !== 0) return Math.max(5, Math.floor(prev / 5) * 5);
        return Math.max(5, prev - 5);
      });
    }
    setMoqWarning(null);
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) {
      setMoqWarning('This product is currently out of stock and cannot be added to cart.');
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    if (quantity > availableStock) {
      setMoqWarning(`Cannot add to cart: only ${availableStock} boxes available in stock.`);
      setQuantity(availableStock);
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    if (orderType === 'wholesale') {
      if (quantity < wholesaleMoq) {
        setMoqWarning(`Wholesale minimum order quantity is ${wholesaleMoq} boxes.`);
        setQuantity(wholesaleMoq);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      if (quantity % 5 !== 0) {
        const rounded = Math.min(availableStock, Math.ceil(quantity / 5) * 5);
        setMoqWarning(`Wholesale orders must be in multiples of 5. Updated to ${rounded} boxes.`);
        setQuantity(rounded);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
    }
    if (orderType === 'retail' && quantity > retailMaxBoxes) {
      setMoqWarning(`Retail orders are limited to a maximum of ${retailMaxBoxes} boxes. Please switch to Wholesale Order for larger quantities.`);
      setQuantity(Math.min(retailMaxBoxes, availableStock));
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    setMoqWarning(null);
    onAddToCart(product, selectedColor.name, quantity, orderType);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleExpressCheckout = () => {
    if (isOutOfStock) {
      setMoqWarning('This product is currently out of stock and cannot be ordered.');
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    if (quantity > availableStock) {
      setMoqWarning(`Cannot order: only ${availableStock} boxes available in stock.`);
      setQuantity(availableStock);
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    if (orderType === 'wholesale') {
      if (quantity < wholesaleMoq) {
        setMoqWarning(`Wholesale minimum order quantity is ${wholesaleMoq} boxes.`);
        setQuantity(wholesaleMoq);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      if (quantity % 5 !== 0) {
        const rounded = Math.min(availableStock, Math.ceil(quantity / 5) * 5);
        setMoqWarning(`Wholesale orders must be in multiples of 5. Updated to ${rounded} boxes.`);
        setQuantity(rounded);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
    }
    if (orderType === 'retail' && quantity > retailMaxBoxes) {
      setMoqWarning(`Retail orders are limited to a maximum of ${retailMaxBoxes} boxes. Please switch to Wholesale Order for larger quantities.`);
      setQuantity(Math.min(retailMaxBoxes, availableStock));
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    setMoqWarning(null);
    if (onExpressCheckout) {
      onExpressCheckout(product, selectedColor.name, quantity, orderType);
    } else {
      onAddToCart(product, selectedColor.name, quantity, orderType);
    }
  };

  return (
    <div className="w-full bg-[#fbfcfb] text-[#111827] min-h-screen py-6 sm:py-10 selection:bg-[#166534] selection:text-white animate-fadeInUp">
      
      {/* Maximum Container matching Reference Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Top Breadcrumb Header Bar */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-10 flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest overflow-hidden text-ellipsis whitespace-nowrap">
            <button 
              onClick={onNavigateHome} 
              className="hover:text-[#166534] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span className="text-slate-300">&gt;</span>
            <button 
              onClick={onBack} 
              className="hover:text-[#166534] transition-colors cursor-pointer"
            >
              COLLECTIONS
            </button>
            <span className="text-slate-300">&gt;</span>
            <span className="text-[#111827] font-bold truncate">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2.5 ml-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-extrabold transition-all shadow-xs hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-98"
              title="Edit this entire single product page (CMS Studio)"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Single Page</span>
              <span className="sm:hidden">Edit Page</span>
            </button>

            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:text-[#14532d] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Shop</span>
            </button>
          </div>
        </nav>

        {/* Main 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* ========================================================
              LEFT COLUMN: MAIN SHOWCASE IMAGE & 4-THUMBNAIL GALLERY
             ======================================================== */}
          <div className="lg:col-span-6 flex flex-col">
            
            {/* Main Image Frame (Rounded-3xl, Drop Shadow, Heart Button, Brand Watermark) */}
            <div className="relative w-full aspect-[4/5] bg-white rounded-[28px] sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl flex items-center justify-center p-6 sm:p-10 group">
              
              {/* Product Visual */}
              <img
                src={galleryImages[activeImageIndex].url}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-md transition-all duration-500 group-hover:scale-105 select-none"
              />

              {/* Floating Circular Wishlist Button (Top Right) */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Save to Wishlist"
                className="absolute top-5 right-5 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-red-500 transition-all active:scale-90 cursor-pointer z-10"
              >
                <Heart className={`w-5 h-5 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'
                }`} />
              </button>

              {/* Brand Signature Logo Watermark (Bottom Left - Replicating Reference Image) */}
              <div className="absolute bottom-5 left-6 select-none opacity-75 pointer-events-none">
                <div className="flex items-center gap-1.5 text-slate-800">
                  <span className="font-serif italic font-bold text-2xl tracking-tighter">E</span>
                  <div className="flex flex-col -space-y-1">
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase text-slate-800 font-sans">
                      ECOTEX
                    </span>
                    <span className="text-[7px] font-bold tracking-[0.3em] uppercase text-slate-500 font-sans">
                      ORIGINALS
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 4 Thumbnails Gallery Strip */}
            <div className="mt-4 sm:mt-5 grid grid-cols-4 gap-3 sm:gap-4">
              {galleryImages.map((thumb, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white p-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-2 border-[#d97706] shadow-md ring-2 ring-amber-500/20 scale-102'
                        : 'border border-slate-200/90 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={thumb.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: EDITORIAL DETAILS, CONTROLS, SPECS
             ======================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Category Label, Stock Status & Rating */}
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#d97706]">
                {product.categoryLabel || 'SUSTAINABLE NON-WOVEN'}
              </span>
              {isOutOfStock && (
                <>
                  <span className="text-slate-300 font-light">—</span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    <span>Out of Stock · Sold Out</span>
                  </div>
                </>
              )}

              <span className="text-slate-300 font-light">—</span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#d97706]">
                <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                <span>{product.rating !== undefined ? product.rating.toFixed(1) : '4.9'}</span>
              </div>
            </div>

            {/* Product Title (Luxury Editorial Serif Font) */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#111827] tracking-tight leading-[1.12] [text-wrap:balance]">
              {product.name}
            </h1>

            {/* Article No. & Volume No. Metadata */}
            <div className="mt-4 flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider pb-4 border-b border-slate-200/70">
              <div>
                <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">
                  ARTICLE NO.
                </span>
                <span className="font-bold text-[#111827]">
                  {product.articleNo || `EP-${product.id.slice(0, 6).toUpperCase()}`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">
                  VOLUME NO.
                </span>
                <span className="font-bold text-[#111827]">
                  {product.volumeNo || `${product.gsm || 45} GSM LUXURY`}
                </span>
              </div>
            </div>

            {/* Product Editorial Description */}
            <p className="mt-5 text-sm sm:text-[15px] text-[#4b5563] leading-relaxed font-light">
              {product.description || 'Discover the pinnacle of elegance with this masterfully crafted piece. Part of our exclusive Heritage Collection, it embodies the perfect blend of traditional artistry and modern sophistication.'}
            </p>

            {/* Commercial Color Dye Variants (10 Industry Colors with Recommended Applications) */}
            <div className="mt-6 pt-5 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span>Color Dye:</span>
                  <span className="text-slate-900 font-extrabold capitalize text-sm">{selectedColor.name}</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  10 Commercial Options
                </span>
              </div>

              {/* 10 Swatch Circles */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
                {DYE_COLORS.map((c) => {
                  const isSelected = selectedColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      title={`${c.name} - ${c.bestFor}`}
                      className={`group relative aspect-square rounded-2xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                        isSelected 
                          ? 'ring-2 ring-offset-2 ring-[#0f172a] scale-105 shadow-md z-10' 
                          : 'hover:scale-105 opacity-90 hover:opacity-100 shadow-2xs'
                      }`}
                      style={{ 
                        backgroundColor: c.hex,
                        border: `1.5px solid ${c.borderColor || '#cbd5e1'}`
                      }}
                    >
                      {isSelected ? (
                        <Check 
                          className="w-4 h-4 stroke-[3]" 
                          style={{ color: c.textColor || '#ffffff' }}
                        />
                      ) : (
                        <span className="text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: c.textColor || '#ffffff' }}>
                          {c.name.slice(0, 3)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Color Guide: Best For & Recommended Print Spec Card */}
              <div className="mt-3 p-3.5 bg-gradient-to-r from-slate-50 via-emerald-50/20 to-stone-50 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs" 
                      style={{ backgroundColor: selectedColor.hex, border: `1px solid ${selectedColor.borderColor || '#cbd5e1'}` }} 
                    />
                    <span className="text-slate-500 font-medium">Best For:</span>
                    <strong className="text-slate-900">{product.bestFor || selectedColor.bestFor}</strong>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-start sm:items-center gap-2 text-[11px] text-slate-600">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <span className="text-slate-500 font-medium">Recommended Print: </span>
                    <span className="font-bold text-slate-900">{product.recommendedPrint || selectedColor.recommendedPrint}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Segmented Switcher Pill: RETAIL ORDER vs WHOLESALE ORDER */}
            <div className="mt-6 p-1 bg-[#f3f4f6] rounded-xl inline-flex w-full sm:w-auto self-start border border-slate-200/60">
              <button
                type="button"
                onClick={() => setOrderType('retail')}
                className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  orderType === 'retail'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-slate-500 hover:text-[#111827]'
                }`}
              >
                {product.retailTabLabel || 'Retail Order'}
              </button>
              <button
                type="button"
                onClick={() => setOrderType('wholesale')}
                className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  orderType === 'wholesale'
                    ? 'bg-white text-[#166534] shadow-sm'
                    : 'text-slate-500 hover:text-[#111827]'
                }`}
              >
                {product.wholesaleTabLabel || 'Wholesale Order'}
              </button>
            </div>

            {/* Unified Price & Packaging Specification Card */}
            <div className="mt-4 rounded-2xl border border-slate-200/90 bg-[#f8faf9] p-4 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-bold text-3xl sm:text-4xl text-[#d97706] font-mono tracking-tight">
                    ${currentPrice.toFixed(2)}
                  </span>
                  <span className="text-base font-mono text-slate-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    / Box
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {orderType === 'wholesale' ? (
                    <span className="text-xs font-bold text-[#166534] bg-emerald-100/90 border border-emerald-300/80 px-3 py-1 rounded-full font-mono shadow-2xs">
                      MOQ: {wholesaleMoq} Boxes
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                      Retail Order
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-divider & Box Capacity Breakdown */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-600">Packaging Spec:</span>
                  <span className="font-bold text-slate-900 bg-white border border-slate-200/90 px-2 py-0.5 rounded-md font-mono text-[11px] shadow-2xs">
                    1 Box = {pcsPerBox.toLocaleString()} Pcs
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-800 text-[11px] bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-md shadow-2xs">
                  ≈ ${(currentPrice / pcsPerBox).toFixed(3)} / pc
                </span>
              </div>
            </div>

            {/* Explicit Quantity Label & Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 whitespace-nowrap">
                    Order Quantity
                  </span>
                  {orderType === 'retail' ? (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      1 – {retailMaxBoxes} Boxes
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Multiples of {wholesaleMoq}
                    </span>
                  )}
                </div>
                <span className={`font-mono text-xs font-bold whitespace-nowrap ${isOutOfStock ? 'text-rose-600' : 'text-[#166534]'}`}>
                  {isOutOfStock ? '🔴 Out of Stock' : `Total: ${quantity.toLocaleString()} ${quantity === 1 ? 'box' : 'boxes'} (${((quantity || 1) * pcsPerBox).toLocaleString()} pcs)`}
                </span>
              </div>

              {/* Quantity Stepper & ADD TO CART Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Stepper with Editable Input */}
                <div className={`w-full sm:w-44 h-12 rounded-xl border border-slate-300 bg-white flex items-center justify-between px-2 shadow-xs ${isOutOfStock ? 'opacity-50 pointer-events-none bg-slate-50' : ''}`}>
                  <button
                    type="button"
                    disabled={isOutOfStock || quantity <= minQuantity}
                    onClick={handleDecrement}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isOutOfStock || quantity <= minQuantity
                        ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                        : 'text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer'
                    }`}
                    aria-label="Decrease quantity"
                    title={quantity <= minQuantity ? `Minimum order is ${minQuantity} box${minQuantity > 1 ? 'es' : ''}` : 'Decrease'}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    disabled={isOutOfStock}
                    step={orderType === 'wholesale' ? 5 : 1}
                    min={minQuantity}
                    max={maxQuantity}
                    value={isOutOfStock ? 0 : quantity}
                    onChange={(e) => {
                      if (isOutOfStock) return;
                      const val = parseInt(e.target.value);
                      if (isNaN(val)) {
                        setQuantity(minQuantity);
                      } else {
                        if (val > maxQuantity) {
                          setQuantity(maxQuantity);
                          setMoqWarning(
                            orderType === 'retail'
                              ? `Retail orders are limited to a maximum of ${retailMaxBoxes} boxes. For bulk orders, please select Wholesale Order.`
                              : `Stock limit reached: only ${availableStock} boxes available in stock.`
                          );
                          setTimeout(() => setMoqWarning(null), 4000);
                        } else if (val < minQuantity) {
                          setQuantity(minQuantity);
                          setMoqWarning(null);
                        } else {
                          setQuantity(val);
                          setMoqWarning(null);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (isOutOfStock) return;
                      if (quantity < minQuantity) {
                        setQuantity(minQuantity);
                      } else if (quantity > maxQuantity) {
                        setQuantity(maxQuantity);
                      } else if (orderType === 'wholesale' && quantity % 5 !== 0) {
                        const rounded = Math.min(maxQuantity, Math.max(5, Math.ceil(quantity / 5) * 5));
                        setQuantity(rounded);
                        setMoqWarning(`Wholesale orders must be in multiples of 5 (adjusted to ${rounded} boxes).`);
                        setTimeout(() => setMoqWarning(null), 4000);
                      }
                    }}
                    className="w-20 text-center font-mono font-bold text-sm text-[#111827] focus:outline-none bg-transparent"
                    aria-label="Quantity amount"
                  />
                  <button
                    type="button"
                    disabled={isOutOfStock || quantity >= maxQuantity}
                    onClick={handleIncrement}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isOutOfStock || quantity >= maxQuantity
                        ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                        : 'text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer'
                    }`}
                    aria-label="Increase quantity"
                    title={
                      quantity >= maxQuantity
                        ? (quantity >= availableStock ? `Stock limit reached (${availableStock} boxes available)` : 'Retail order limit is 5 boxes')
                        : (orderType === 'wholesale' ? 'Increase by 5 boxes' : 'Increase')
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* ADD TO CART Button (Disabled if Out of Stock, Solid Black if active) */}
                {isOutOfStock ? (
                  <button
                    type="button"
                    disabled={true}
                    className="w-full sm:flex-1 h-12 bg-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-not-allowed shadow-none"
                  >
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Out Of Stock (Sold Out)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    className="w-full sm:flex-1 h-12 bg-[#0f172a] hover:bg-[#166534] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart ({quantity.toLocaleString()} {quantity === 1 ? 'Box' : 'Boxes'} · {((quantity || 1) * pcsPerBox).toLocaleString()} pcs)</span>
                  </button>
                )}
              </div>

              {/* Wholesale Quick Select Presets (Disabled if exceeds availableStock) */}
              {orderType === 'wholesale' && !isOutOfStock && (
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick:</span>
                  {Array.from(new Set([wholesaleMoq, 10, 25, 50, 100, 250, 500, 1000].filter(n => n >= wholesaleMoq))).map((preset) => {
                    const isExceedingStock = preset > availableStock;
                    return (
                      <button
                        key={preset}
                        type="button"
                        disabled={isExceedingStock}
                        onClick={() => {
                          if (isExceedingStock) return;
                          setQuantity(preset);
                          setMoqWarning(null);
                        }}
                        title={isExceedingStock ? `Stock limit is ${availableStock} boxes (${preset} is unavailable)` : `Select ${preset} boxes`}
                        className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                          isExceedingStock
                            ? 'opacity-35 cursor-not-allowed line-through bg-slate-100 text-slate-400 border-slate-200'
                            : quantity === preset
                            ? 'bg-[#166534] text-white border-[#166534] font-bold shadow-xs cursor-pointer'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900 cursor-pointer'
                        }`}
                      >
                        {preset.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Out of Stock Notice Banner */}
              {isOutOfStock && (
                <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Yeh item abhi out of stock ho chuka hai</p>
                    <p className="mt-0.5 text-rose-700/90 leading-relaxed">
                      {product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Validation Warning Alert */}
              {moqWarning && (
                <div className="mt-2.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{moqWarning}</span>
                </div>
              )}

              {/* Retail Policy Banner */}
              {orderType === 'retail' && !moqWarning && !isOutOfStock && (
                <div className="mt-2 text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/70 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{product.retailPolicyText ? product.retailPolicyText : <>Retail order policy: <strong>1 se 5 boxes maximum</strong>. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar <strong>Wholesale Order</strong> select karein.</>}</span>
                </div>
              )}

              {/* Wholesale Policy Banner */}
              {orderType === 'wholesale' && !moqWarning && !isOutOfStock && (
                <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{product.wholesalePolicyText ? product.wholesalePolicyText : <>Wholesale order: starting <strong>5 boxes</strong> se hai aur sabhi orders <strong>5 ke multiples</strong> mein place hote hain (5, 10, 15, 20...).</>}</span>
                </div>
              )}
            </div>

            {/* EXPRESS CHECKOUT Button */}
            <div className="mt-3">
              {isOutOfStock ? (
                <button
                  type="button"
                  disabled={true}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Lock className="w-4 h-4 text-slate-300" />
                  <span>{product.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExpressCheckout}
                  className="w-full h-12 rounded-xl border-2 border-[#0f172a] hover:bg-[#0f172a] hover:text-white text-[#0f172a] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 cursor-pointer"
                >
                  <span>{product.checkoutButtonText || '→ Express Checkout'}</span>
                </button>
              )}
            </div>

            {/* Description / Specifications */}
            <div className="mt-8 pt-6 border-t border-slate-200/70">
              <div className="border-b border-slate-200/70 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] pb-2 border-b-2 border-[#d97706] inline-block">
                  {product.specsHeading || 'Description'}
                </span>
              </div>

              {/* Specifications Bullet List */}
              <div className="pt-5 text-xs text-slate-600 leading-relaxed">
                <ul className="space-y-2 font-light">
                  <li>• <strong className="font-semibold text-slate-800">BRAND NAME :</strong> {product.brandName || 'ECOTEX INC.'}</li>
                  <li>• <strong className="font-semibold text-slate-800">Fabric :</strong> {product.fabricDetails || `${product.gsm || 45} GSM Virgin Non-Woven Polypropylene`}</li>
                  <li>• <strong className="font-semibold text-slate-800">Dimensions :</strong> {product.dimensions || '11.5"W x 21"H x 6.5" Gusset'}</li>
                  <li>• <strong className="font-semibold text-slate-800">Handles :</strong> {product.handles || 'Ultrasonic Thermal Welded Loops'}</li>
                  <li>• <strong className="font-semibold text-slate-800">Printing :</strong> {product.printingMethod || 'High-Precision Flexographic / Gravure Custom Imprint'}</li>
                  <li>• <strong className="font-semibold text-slate-800">Compliance :</strong> {product.compliance || 'Certified California SB 270 & ASTM D6400'}</li>
                  <li>• <strong className="font-semibold text-slate-800">Bag & Picture Packing :</strong> {product.packingDetails || 'Export-Grade Heavy Duty Corrugated Cartons'}</li>
                  <li>• <strong className="font-semibold text-slate-800">Guaranteed Fabric :</strong> {product.guaranteedFabric || '100% Virgin Grade Recyclable Polypropylene'}</li>
                  <li>• <strong className="font-semibold text-slate-800">{product.enrouteQuality || 'Enroute to Quality Standard'}</strong></li>
                </ul>
              </div>
            </div>

            {/* 3 Trust Badges Row (Below Description) */}
            <div className="mt-8 pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {product.trustBadge1 || 'Fast Delivery'}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {product.trustBadge2 || 'Secure Store'}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {product.trustBadge3 || 'Easy Return'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          RELATED PRODUCTS (Full Width across screen)
         ======================================================== */}
      {relatedProducts.length > 0 && (
        <section className="w-full max-w-[1840px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mt-16 sm:mt-24 pt-12 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] mb-1 block">
                {product.relatedTag || 'Explore More Options'}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight">
                {product.relatedTitle || 'Related Products'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {product.relatedSubtitle || 'Frequently ordered together or alternative sizing options for your business.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d3419] hover:text-[#FF5722] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>{product.relatedBackBtnText || 'View Full Catalog'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5-Column Grid across full width */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-8">
            {relatedProducts.map((relProd) => {
              const relIsOutOfStock = relProd.inStock === false || (typeof relProd.stockQuantity === 'number' && relProd.stockQuantity <= 0);

              return (
                <div
                  key={relProd.id}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(relProd);
                    }
                  }}
                  className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      relIsOutOfStock ? 'bg-rose-600 text-white' : 'bg-[#0d3419] text-white'
                    }`}>
                      {relIsOutOfStock ? 'SOLD OUT' : (relProd.badge || 'ECO FABRIC')}
                    </span>
                    {relProd.gsm && (
                      <span className="text-[10px] font-bold text-slate-500">
                        {relProd.gsm} GSM
                      </span>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-full aspect-square bg-[#FAF8F5] rounded-xl flex items-center justify-center p-4 mb-3.5 overflow-hidden border border-slate-100">
                    <img
                      src={relProd.image || '/images/bag-green.png'}
                      alt={relProd.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/bag-green.png';
                      }}
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 select-none"
                      draggable={false}
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0d3419] transition-colors truncate mb-1">
                    {relProd.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-3.5">
                    {relProd.subtitle || relProd.dimensions || 'Industrial packaging'}
                  </p>

                  {/* Price & Action */}
                  <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <div>
                      <span className="font-extrabold text-base text-slate-900">
                        ${relProd.pricePerUnit.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium ml-1">
                        / box
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#FF5722] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Added to Cart Feedback Banner */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-[#22c55e]" />
          <span>Added {product.name} to Cart</span>
        </div>
      )}

      {/* Editor Saved Feedback Toast */}
      {editorToast && (
        <div className="fixed top-6 right-6 z-[99999] bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn border border-[#22c55e]/50">
          <Check className="w-4 h-4 text-[#22c55e]" />
          <span>{editorToast}</span>
        </div>
      )}

      {/* Floating Bottom Quick-Edit Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => setIsEditorOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold shadow-2xl border border-amber-400/50 hover:border-amber-400 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Edit this single product page (CMS Studio)"
        >
          <Edit3 className="w-4 h-4 text-amber-400" />
          <span>Edit Product Page</span>
        </button>
      </div>

      {/* Full Single Product Page Editor Modal */}
      {isEditorOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsEditorOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#0f172a]"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0f172a]">
                    Single Product Page Live CMS Editor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edit and customize every detail of &ldquo;{product.name}&rdquo; in real-time.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => setEditorTab('info')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  editorTab === 'info'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                General & Header
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('pricing')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  editorTab === 'pricing'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Pricing & Inventory
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('images')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  editorTab === 'images'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Showcase & Gallery
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('specs')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  editorTab === 'specs'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Specifications Table
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('badges')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  editorTab === 'badges'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Badges & Recommendations
              </button>
            </div>

            {/* Form Content Area */}
            <form onSubmit={handleSaveProductPage} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              
              {/* TAB 1: GENERAL & HEADER */}
              {editorTab === 'info' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Product Title / Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-semibold"
                        placeholder="e.g. The Ecotex Heavy-Duty Grocery Tote"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Category Tag / Badge
                      </label>
                      <input
                        type="text"
                        value={editForm.categoryLabel}
                        onChange={(e) => setEditForm({ ...editForm, categoryLabel: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 uppercase tracking-wider"
                        placeholder="e.g. SUSTAINABLE NON-WOVEN"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Article No.
                      </label>
                      <input
                        type="text"
                        value={editForm.articleNo}
                        onChange={(e) => setEditForm({ ...editForm, articleNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
                        placeholder="e.g. EP-TSHIRT-01"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Volume No. / GSM Tag
                      </label>
                      <input
                        type="text"
                        value={editForm.volumeNo}
                        onChange={(e) => setEditForm({ ...editForm, volumeNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 uppercase font-mono"
                        placeholder="e.g. 45 GSM LUXURY"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Customer Rating (0.0 - 5.0)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={editForm.rating}
                        onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) || 4.9 })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                        placeholder="4.9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Short Subtitle / Headline
                    </label>
                    <input
                      type="text"
                      value={editForm.subtitle}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                      placeholder="e.g. Engineered For High-Volume Supermarket Use"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Editorial Description Paragraph
                    </label>
                    <textarea
                      rows={4}
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 leading-relaxed"
                      placeholder="Enter the luxury editorial narrative describing the bag, fabric, and sustainability benefits..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & INVENTORY */}
              {editorTab === 'pricing' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Master Packaging Spec Card */}
                  <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/50 p-4 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span>Master Packaging Specification</span>
                      </h4>
                      <p className="text-[11px] text-emerald-800/80 mt-0.5">
                        Number of individual bag pieces packed inside 1 carton box.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-900 whitespace-nowrap">1 Box =</span>
                      <div className="relative w-32">
                        <input
                          type="number"
                          step="10"
                          min="1"
                          required
                          value={editForm.pcsPerBox}
                          onChange={(e) => setEditForm({ ...editForm, pcsPerBox: Math.max(1, Number(e.target.value) || 200) })}
                          className="w-full pl-3 pr-10 py-1.5 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-950 bg-white shadow-2xs focus:outline-none focus:border-emerald-600"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 font-mono">Pcs</span>
                      </div>
                    </div>
                  </div>

                  {/* Dual Mode Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 1. Wholesale Mode Card */}
                    <div className="bg-emerald-50/40 p-4 rounded-2xl border-2 border-emerald-200 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          <strong className="text-xs font-extrabold uppercase text-[#166534]">
                            Wholesale Order Mode
                          </strong>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          MOQ: {editForm.wholesaleMoq} Boxes
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-emerald-900 mb-1">
                            Wholesale Box Price ($) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">$</span>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={editForm.pricePerUnit}
                              onChange={(e) => setEditForm({ ...editForm, pricePerUnit: Number(e.target.value) || 0 })}
                              className="w-full pl-6 pr-2.5 py-1.5 rounded-xl border border-emerald-300 text-xs font-bold text-[#166534] bg-white focus:outline-none focus:border-emerald-600"
                              placeholder="59.99"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-emerald-700 mt-1 block">
                            ≈ ${( (Number(editForm.pricePerUnit) || 0) / (Number(editForm.pcsPerBox) || 200) ).toFixed(3)} / pc
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            Wholesale Strike Price ($)
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.originalPrice}
                              onChange={(e) => setEditForm({ ...editForm, originalPrice: Number(e.target.value) || 0 })}
                              className="w-full pl-6 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 bg-white"
                              placeholder="74.99"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Compare-At Strike</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Wholesale MOQ (Boxes)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.wholesaleMoq}
                            onChange={(e) => setEditForm({ ...editForm, wholesaleMoq: Math.max(1, Number(e.target.value) || 5) })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Tab Button Label
                          </label>
                          <input
                            type="text"
                            value={editForm.wholesaleTabLabel}
                            onChange={(e) => setEditForm({ ...editForm, wholesaleTabLabel: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] bg-white"
                            placeholder="Wholesale Order"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Retail Mode Card */}
                    <div className="bg-amber-50/40 p-4 rounded-2xl border-2 border-amber-200 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                          <strong className="text-xs font-extrabold uppercase text-amber-900">
                            Retail Order Mode
                          </strong>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Max: {editForm.retailMaxBoxes} Boxes
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-amber-950 mb-1">
                            Retail Box Price ($) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-700">$</span>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={editForm.retailPricePerUnit}
                              onChange={(e) => setEditForm({ ...editForm, retailPricePerUnit: Number(e.target.value) || 0 })}
                              className="w-full pl-6 pr-2.5 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-[#d97706] bg-white focus:outline-none focus:border-amber-600"
                              placeholder="86.99"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-amber-700 mt-1 block">
                            ≈ ${( (Number(editForm.retailPricePerUnit) || 0) / (Number(editForm.pcsPerBox) || 200) ).toFixed(3)} / pc
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            Retail Strike Price ($)
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.retailOriginalPrice}
                              onChange={(e) => setEditForm({ ...editForm, retailOriginalPrice: Number(e.target.value) || 0 })}
                              className="w-full pl-6 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 bg-white"
                              placeholder="108.73"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Compare-At Strike</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Retail Max Allowed (Boxes)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.retailMaxBoxes}
                            onChange={(e) => setEditForm({ ...editForm, retailMaxBoxes: Math.max(1, Number(e.target.value) || 5) })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-amber-200 text-xs font-bold bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Tab Button Label
                          </label>
                          <input
                            type="text"
                            value={editForm.retailTabLabel}
                            onChange={(e) => setEditForm({ ...editForm, retailTabLabel: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-amber-900 bg-white"
                            placeholder="Retail Order"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock Inventory & Availability */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">
                        Available Stock (Boxes)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.stockQuantity}
                        onChange={(e) => setEditForm({ ...editForm, stockQuantity: Math.max(0, Number(e.target.value) || 0) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-mono font-bold text-xs"
                        placeholder="50"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        0 boxes automatically activates &ldquo;Sold Out&rdquo; state.
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <strong className="block text-slate-800 font-bold text-xs">
                          Product Active & In Stock
                        </strong>
                        <span className="text-slate-500 text-[10px]">
                          Toggle live purchasing on / off.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.inStock && editForm.stockQuantity > 0}
                          onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: IMAGES & GALLERY */}
              {editorTab === 'images' && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Main Product Visual URL *
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        required
                        value={editForm.image}
                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value, gallery0: e.target.value })}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
                        placeholder="/images/bag-green.png"
                      />
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={editForm.image} alt="Preview" className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/bag-green.png'; }} />
                      </div>
                    </div>
                  </div>

                  {/* Quick Preset Selector */}
                  <div>
                    <label className="block font-bold text-slate-500 mb-2 text-[11px] uppercase tracking-wider">
                      Quick Visual Presets (Click to apply)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, image: preset.url, gallery0: preset.url })}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            editForm.image === preset.url
                              ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-8 h-8 object-contain" />
                          <span className="text-[10px] truncate max-w-full">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <label className="block font-bold text-slate-700 mb-3">
                      4 Thumbnails Gallery Strip (Shown under main showcase)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Thumbnail 1 (Front View)</span>
                        <input
                          type="text"
                          value={editForm.gallery0}
                          onChange={(e) => setEditForm({ ...editForm, gallery0: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
                          placeholder="Image URL"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Thumbnail 2 (Lifestyle Editorial)</span>
                        <input
                          type="text"
                          value={editForm.gallery1}
                          onChange={(e) => setEditForm({ ...editForm, gallery1: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
                          placeholder="Image URL"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Thumbnail 3 (Fabric & Seam Macro)</span>
                        <input
                          type="text"
                          value={editForm.gallery2}
                          onChange={(e) => setEditForm({ ...editForm, gallery2: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
                          placeholder="Image URL"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Thumbnail 4 (Production Workshop)</span>
                        <input
                          type="text"
                          value={editForm.gallery3}
                          onChange={(e) => setEditForm({ ...editForm, gallery3: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
                          placeholder="Image URL"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SPECIFICATIONS TABLE */}
              {editorTab === 'specs' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={editForm.brandName}
                        onChange={(e) => setEditForm({ ...editForm, brandName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="ECOTEX INC."
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Fabric Specification
                      </label>
                      <input
                        type="text"
                        value={editForm.fabricDetails}
                        onChange={(e) => setEditForm({ ...editForm, fabricDetails: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="45 GSM Virgin Non-Woven Polypropylene"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        value={editForm.dimensions}
                        onChange={(e) => setEditForm({ ...editForm, dimensions: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="11.5&quot;W x 21&quot;H x 6.5&quot; Gusset"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Handle Construction
                      </label>
                      <input
                        type="text"
                        value={editForm.handles}
                        onChange={(e) => setEditForm({ ...editForm, handles: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="Ultrasonic Thermal Welded Loops"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Printing Technology
                      </label>
                      <input
                        type="text"
                        value={editForm.printingMethod}
                        onChange={(e) => setEditForm({ ...editForm, printingMethod: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="High-Precision Flexographic / Gravure Custom Imprint"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Environmental Compliance
                      </label>
                      <input
                        type="text"
                        value={editForm.compliance}
                        onChange={(e) => setEditForm({ ...editForm, compliance: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="Certified California SB 270 & ASTM D6400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Export Packing Details
                      </label>
                      <input
                        type="text"
                        value={editForm.packingDetails}
                        onChange={(e) => setEditForm({ ...editForm, packingDetails: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="Export-Grade Heavy Duty Corrugated Cartons"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Fabric Guarantee
                      </label>
                      <input
                        type="text"
                        value={editForm.guaranteedFabric}
                        onChange={(e) => setEditForm({ ...editForm, guaranteedFabric: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="100% Virgin Grade Recyclable Polypropylene"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Quality Standard Banner
                      </label>
                      <input
                        type="text"
                        value={editForm.enrouteQuality}
                        onChange={(e) => setEditForm({ ...editForm, enrouteQuality: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="Enroute to Quality Standard"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: BADGES & RECOMMENDATIONS */}
              {editorTab === 'badges' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Best For Recommendation Tag
                      </label>
                      <input
                        type="text"
                        value={editForm.bestFor}
                        onChange={(e) => setEditForm({ ...editForm, bestFor: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="Supermarket grocers, retail boutiques"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Recommended Print Technique
                      </label>
                      <input
                        type="text"
                        value={editForm.recommendedPrint}
                        onChange={(e) => setEditForm({ ...editForm, recommendedPrint: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                        placeholder="2-Color Flexographic ink on Leaf Green"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <label className="block font-bold text-slate-800 mb-2">
                      3 Bottom Trust Badges (Shown below description)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Trust Badge 1 (Truck Icon)</span>
                        <input
                          type="text"
                          value={editForm.trustBadge1}
                          onChange={(e) => setEditForm({ ...editForm, trustBadge1: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                          placeholder="Fast Delivery"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Trust Badge 2 (Shield Icon)</span>
                        <input
                          type="text"
                          value={editForm.trustBadge2}
                          onChange={(e) => setEditForm({ ...editForm, trustBadge2: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                          placeholder="Secure Store"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Trust Badge 3 (Return Icon)</span>
                        <input
                          type="text"
                          value={editForm.trustBadge3}
                          onChange={(e) => setEditForm({ ...editForm, trustBadge3: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                          placeholder="Easy Return"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <label className="block font-bold text-slate-800">
                      Ordering Policies & Out of Stock Notification
                    </label>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1">Retail Order Policy Text</span>
                      <textarea
                        rows={2}
                        value={editForm.retailPolicyText}
                        onChange={(e) => setEditForm({ ...editForm, retailPolicyText: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                        placeholder="Retail policy notice..."
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1">Wholesale Order Policy Text</span>
                      <textarea
                        rows={2}
                        value={editForm.wholesalePolicyText}
                        onChange={(e) => setEditForm({ ...editForm, wholesalePolicyText: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                        placeholder="Wholesale policy notice..."
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-rose-700 block mb-1">Out of Stock Notice Text (When Stock is 0)</span>
                      <textarea
                        rows={2}
                        value={editForm.outOfStockNotice}
                        onChange={(e) => setEditForm({ ...editForm, outOfStockNotice: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-xs font-medium text-rose-900"
                        placeholder="Out of stock notification..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Live</span>
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default ProductDetailPage;
