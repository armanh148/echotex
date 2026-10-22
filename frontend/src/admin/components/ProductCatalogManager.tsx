'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Eye, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product, ProductCategory } from '../../types';
import { ImageUploader } from './ImageUploader';

export const ProductCatalogManager: React.FC = () => {
  const { 
    products, 
    categories,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductStock,
    addMediaAsset
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Lock body scroll and handle Escape key for modals
  useEffect(() => {
    if (!isModalOpen && !isDeleteModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        } else if (isModalOpen) {
          setIsModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, isDeleteModalOpen]);

  const dynamicCategories = React.useMemo(() => {
    const list = categories.filter(c => c.id !== 'all');
    if (list.length > 0) {
      return list.map(c => ({ id: c.id as ProductCategory, label: c.label }));
    }
    return [
      { id: 'non-woven' as ProductCategory, label: 'Non-Woven Totes' },
      { id: 't-shirt' as ProductCategory, label: 'T-Shirt Bags' },
      { id: 'laminated' as ProductCategory, label: 'Laminated Carriers' },
      { id: 'slider' as ProductCategory, label: 'Slider Bags' },
      { id: 'd-cut' as ProductCategory, label: 'D-Cut Handles' },
      { id: 'food' as ProductCategory, label: 'Food Item Bags' },
      { id: 'biodegradable' as ProductCategory, label: 'Biodegradable PLA' }
    ];
  }, [categories]);

  const categoriesList = dynamicCategories;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: (categoriesList[0]?.id || 'non-woven') as ProductCategory,
    categoryLabel: categoriesList[0]?.label || 'Non-Woven Totes',
    subtitle: '',
    pricePerUnit: 0.25,
    moq: 1000,
    gsm: 80,
    dimensions: '12"W x 14"H x 4"D',
    material: 'Virgin Non-Woven Polypropylene',
    capacity: 'Up to 25 lbs',
    badge: 'Eco Choice',
    image: '/images/bag-green.png',
    inStock: true,
    description: 'High tensile enterprise carrier bag manufactured for supermarkets, boutique retail, and trade exhibitions.'
  });

  const badgesList = [
    'Best Seller',
    'Eco Choice',
    'Factory Direct',
    '100% Recyclable',
    'Heavy Duty',
    'High Tensile'
  ];

  const PRODUCT_IMAGE_PRESETS = [
    { label: 'Leaf Green', url: '/images/bag-green.png' },
    { label: 'Cobalt Blue', url: '/images/bag-blue.png' },
    { label: 'Linen White', url: '/images/bag-white.png' },
    { label: 'Luxury Black', url: '/images/bag-black.png' },
    { label: 'Bio Amber', url: '/images/bag-orange.png' },
    { label: 'PLA Bio Jar', url: '/images/bite-hero-product.png' }
  ];

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || 
      p.category === selectedCategory || 
      (p.categoryLabel && p.categoryLabel.toLowerCase() === selectedCategory.toLowerCase());
    const matchesStock = 
      stockFilter === 'all' || 
      (stockFilter === 'in-stock' && p.inStock) || 
      (stockFilter === 'out-of-stock' && !p.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    const defaultCat = categoriesList[0] || { id: 'non-woven', label: 'Non-Woven Totes' };
    setFormData({
      name: '',
      category: defaultCat.id as ProductCategory,
      categoryLabel: defaultCat.label,
      subtitle: 'Commercial Wholesale Series',
      pricePerUnit: 0.25,
      moq: 1000,
      gsm: 80,
      dimensions: '12"W x 14"H x 4"D',
      material: 'Virgin Non-Woven Polypropylene',
      capacity: 'Up to 25 lbs',
      badge: 'Eco Choice',
      image: '/images/bag-green.png',
      inStock: true,
      description: 'High tensile enterprise carrier bag manufactured for supermarkets, boutique retail, and trade exhibitions.'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      categoryLabel: p.categoryLabel || 'Wholesale Packaging',
      subtitle: p.subtitle || '',
      pricePerUnit: p.pricePerUnit,
      moq: p.moq,
      gsm: p.gsm,
      dimensions: p.dimensions,
      material: p.material,
      capacity: p.capacity,
      badge: p.badge || 'Factory Direct',
      image: p.image || '/images/bag-green.png',
      inStock: p.inStock,
      description: p.description
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a product title.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        categoryLabel: formData.categoryLabel,
        subtitle: formData.subtitle,
        pricePerUnit: formData.pricePerUnit,
        moq: formData.moq,
        gsm: formData.gsm,
        dimensions: formData.dimensions,
        material: formData.material,
        capacity: formData.capacity,
        badge: formData.badge,
        image: formData.image,
        inStock: formData.inStock,
        description: formData.description
      });
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        categoryLabel: formData.categoryLabel,
        subtitle: formData.subtitle,
        pricePerUnit: formData.pricePerUnit,
        moq: formData.moq,
        gsm: formData.gsm,
        dimensions: formData.dimensions,
        material: formData.material,
        capacity: formData.capacity,
        badge: formData.badge,
        image: formData.image,
        inStock: formData.inStock,
        description: formData.description,
        certifications: ['GRS Certified', '100% Recyclable', 'FDA Compliant'],
        availableColors: [
          { name: 'Eco Green', hex: '#86C59E' },
          { name: 'Pure White', hex: '#FFFFFF' },
          { name: 'Deep Slate', hex: '#0f172a' }
        ],
        bestFor: 'Supermarkets, Retail & Events',
        ecoImpact: 'Displaces up to 250 single-use plastic carrier bags per unit lifetime.',
        leadTime: '2-4 Business Days',
        volumeTiers: [
          { minQty: formData.moq, price: formData.pricePerUnit },
          { minQty: formData.moq * 5, price: Number((formData.pricePerUnit * 0.9).toFixed(2)) },
          { minQty: formData.moq * 10, price: Number((formData.pricePerUnit * 0.8).toFixed(2)) }
        ],
        features: [
          'Ultrasonic welded stress-tested seams',
          'Tear-resistant reinforced handles',
          'Certified non-toxic eco inks',
          '100% Recyclable polypropylene'
        ]
      });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData(prev => ({ ...prev, image: result }));
        addMediaAsset({
          name: file.name,
          url: result,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          type: file.type
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-fadeInUp pb-12">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#B2E2C5]/20 text-[#4E9F76]">
              <Package className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#4E9F76]">
              Direct Factory Inventory
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
            Products & Wholesale Catalog Manager
          </h2>
          <p className="text-xs text-slate-500">
            Total active catalog: {products.length} models across 5 packaging manufacturing categories.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#86C59E] text-white text-xs font-bold transition-all shadow-md shadow-[#4E9F76]/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#B2E2C5]/30 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search products by model name, dimensions, or material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#86C59E] focus:ring-2 focus:ring-[#B2E2C5]/30"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-[#86C59E]"
            >
              <option value="all">All Categories</option>
              {categoriesList.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-[#86C59E]"
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Production / Stock</option>
            <option value="out-of-stock">Backordered / Inactive</option>
          </select>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#B2E2C5]/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Product & Image</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Base Price / MOQ</th>
                <th className="py-4 px-6">Badge</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No products found matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Thumbnail & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 p-1 flex items-center justify-center border border-slate-200/80 shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[#0f172a] text-xs sm:text-sm line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {p.dimensions} · {p.gsm} GSM
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-700 capitalize">
                        {p.category.replace('-', ' ')}
                      </span>
                    </td>

                    {/* Price & MOQ */}
                    <td className="py-4 px-6">
                      <div className="font-black text-[#4E9F76]">
                        ${p.pricePerUnit.toFixed(2)}
                        <span className="text-[10px] font-normal text-slate-400"> / pc</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        MOQ: {p.moq.toLocaleString()} pcs
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="py-4 px-6">
                      {p.badge ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#B2E2C5]/20 text-[#4E9F76] border border-[#B2E2C5]/40">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{p.badge}</span>
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* In-Stock Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleProductStock(p.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                          p.inStock
                            ? 'bg-[#86C59E]/15 text-[#4E9F76] hover:bg-[#86C59E]/25'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${p.inStock ? 'bg-[#86C59E]' : 'bg-red-500'}`} />
                        <span>{p.inStock ? 'In Production' : 'Inactive'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 rounded-xl text-slate-600 hover:text-[#4E9F76] hover:bg-[#B2E2C5]/15 transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(p);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create or Edit Product - Centered with Blurry Backdrop in Document Portal */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-4xl lg:max-w-5xl w-full max-h-[88vh] flex flex-col shadow-2xl shadow-black/50 border border-slate-200/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
          >
            
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-[#fbfdfb] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0f172a]">
                    {editingProduct ? 'Edit Catalog Product' : 'Add New Wholesale Product'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure wholesale specifications, pricing, and live catalog asset.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form id="product-form" onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                
                {/* Left Column: Product Specifications (Col 1-7) */}
                <div className="lg:col-span-7 space-y-3.5">
                  
                  {/* Product Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f172a] bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4E9F76] focus:ring-1 focus:ring-[#4E9F76] transition-all"
                      placeholder="e.g. Heavy-Duty Gusseted Supermarket Tote"
                    />
                  </div>

                  {/* Category & Highlight Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const cat = e.target.value as ProductCategory;
                          const found = categoriesList.find(c => c.id === cat);
                          setFormData({ 
                            ...formData, 
                            category: cat,
                            categoryLabel: found ? found.label : 'Wholesale Packaging'
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f172a] bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4E9F76] cursor-pointer transition-all"
                      >
                        {categoriesList.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Highlight Badge
                      </label>
                      <select
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f172a] bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4E9F76] cursor-pointer transition-all"
                      >
                        {badgesList.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price, MOQ, GSM with Unit Badges */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Price / Unit ($) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.pricePerUnit}
                          onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-6 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#4E9F76] bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4E9F76] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        MOQ (Min Order) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="100"
                          required
                          value={formData.moq}
                          onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) || 1000 })}
                          className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f172a] bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4E9F76] transition-all"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">pcs</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        GSM (Grammage)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.gsm}
                          onChange={(e) => setFormData({ ...formData, gsm: parseInt(e.target.value) || 80 })}
                          className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f172a] bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4E9F76] transition-all"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">g/m²</span>
                      </div>
                    </div>
                  </div>

                  {/* Dimensions & Material */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4E9F76] transition-all"
                        placeholder="e.g. 12W x 14H x 4D"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Material Specification
                      </label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4E9F76] transition-all"
                        placeholder="e.g. Virgin Non-Woven Polypropylene"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Wholesale packaging details, retail application, and durability specifications..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#4E9F76] resize-none transition-all"
                    />
                  </div>

                </div>

                {/* Right Column: Photography & Live Preview Mockup (Col 8-12) */}
                <div className="lg:col-span-5 space-y-3.5">
                  
                  {/* Image Uploader Box */}
                  <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
                    <ImageUploader
                      label="Product Photography"
                      description="Upload PNG with transparent background or photo"
                      value={formData.image}
                      onChange={(newUrl) => setFormData({ ...formData, image: newUrl })}
                      aspectRatio="square"
                    />

                    {/* Quick Presets Strip */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Quick Image Presets:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {PRODUCT_IMAGE_PRESETS.map((preset) => (
                          <button
                            type="button"
                            key={preset.url}
                            onClick={() => setFormData({ ...formData, image: preset.url })}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                              formData.image === preset.url
                                ? 'bg-[#4E9F76] text-white border-[#4E9F76]'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Storefront Mockup Card Preview */}
                  <div className="bg-[#fbfdfb] p-3 rounded-2xl border border-[#B2E2C5]/40 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Live Catalog Card Preview</span>
                      <span className="text-[#4E9F76] font-mono text-[9px]">Shop View</span>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 shadow-xs flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={formData.image || '/images/bag-green.png'}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/bag-green.png';
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#B2E2C5]/30 text-[#4E9F76]">
                            {formData.badge || 'Wholesale'}
                          </span>
                        </div>
                        <div className="font-bold text-xs text-[#0f172a] truncate mt-0.5">
                          {formData.name || 'Untitled Wholesale Product'}
                        </div>
                        <div className="flex items-center justify-between mt-0.5 text-[11px]">
                          <span className="font-black text-[#4E9F76]">
                            ${formData.pricePerUnit.toFixed(2)}/pc
                          </span>
                          <span className="text-slate-400 font-medium text-[10px]">
                            MOQ: {formData.moq.toLocaleString()} pcs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock Availability Toggle Card */}
                  <div
                    onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      formData.inStock
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                        formData.inStock ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0f172a]">
                          {formData.inStock ? 'In Production & Live' : 'Paused / Inactive'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formData.inStock ? 'Ready for wholesale ordering' : 'Hidden from active catalog'}
                        </div>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 text-[#4E9F76] rounded-md focus:ring-[#4E9F76] pointer-events-none"
                    />
                  </div>

                </div>

              </div>
            </form>

            {/* Modal Fixed Sticky Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Changes sync real-time across wholesale shop and RFQ calculators
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="product-form"
                  className="px-6 py-2 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white text-xs font-bold transition-all shadow-md shadow-[#4E9F76]/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal - Centered with Blurry Backdrop in Document Portal */}
      {isDeleteModalOpen && productToDelete && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl shadow-black/40 border border-red-200 space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 rounded-xl bg-red-50">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#0f172a]">
                Confirm Product Deletion
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <strong className="text-[#0f172a]">{productToDelete.name}</strong>? This model will be immediately removed from the live wholesale storefront.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Delete Model
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
