'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Tag, 
  Image as ImageIcon,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  Check
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CategoryItem, Product } from '../../types';
import { ImageUploader } from './ImageUploader';

export const CategoriesManager: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [selectedCatForProducts, setSelectedCatForProducts] = useState<CategoryItem | null>(null);

  // Lock body scroll and handle Escape key for modals
  useEffect(() => {
    if (!isModalOpen && !selectedCatForProducts) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedCatForProducts) setSelectedCatForProducts(null);
        if (isModalOpen) setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, selectedCatForProducts]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    subtitle: '',
    tag: '',
    count: '',
    image: '',
    description: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Image Presets from available warehouse product assets
  const IMAGE_PRESETS = [
    { label: 'Leaf Green Tote', url: '/images/bag-green.png' },
    { label: 'Cobalt Blue Tote', url: '/images/bag-blue.png' },
    { label: 'Linen White Tote', url: '/images/bag-white.png' },
    { label: 'Luxury Black Matte', url: '/images/bag-black.png' },
    { label: 'Bio Amber Orange', url: '/images/bag-orange.png' },
    { label: 'Bio Jar PLA', url: '/images/bite-hero-product.png' }
  ];

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      id: '',
      label: '',
      subtitle: '',
      tag: 'NEW LINE',
      count: '0 Models',
      image: '/images/bag-green.png',
      description: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      id: cat.id,
      label: cat.label,
      subtitle: cat.subtitle || '',
      tag: cat.tag || '',
      count: cat.count || '',
      image: cat.image || '/images/bag-green.png',
      description: cat.description || ''
    });
    setIsModalOpen(true);
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        label: formData.label.trim(),
        subtitle: formData.subtitle.trim(),
        tag: formData.tag.trim(),
        image: formData.image.trim() || '/images/bag-green.png',
        description: formData.description.trim()
      });
      showToast(`Category "${formData.label}" updated successfully`);
    } else {
      const slug = formData.id.trim() || formData.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      addCategory({
        id: slug,
        label: formData.label.trim(),
        subtitle: formData.subtitle.trim() || 'Wholesale Packaging Line',
        tag: formData.tag.trim() || 'NEW',
        count: formData.count.trim() || '0 Models',
        image: formData.image.trim() || '/images/bag-green.png',
        description: formData.description.trim() || `Certified wholesale packaging series for ${formData.label}.`
      });
      showToast(`New category "${formData.label}" created successfully`);
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (cat: CategoryItem) => {
    if (cat.id === 'all') {
      alert('The root "All Collections" category cannot be removed.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the category "${cat.label}"?`)) {
      deleteCategory(cat.id);
      showToast(`Category "${cat.label}" deleted`);
    }
  };

  // Filter Categories
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        (c.tag && c.tag.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  // Count products per category
  const getProductCount = (catId: string) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  // Get products for active modal
  const assignedProducts = useMemo(() => {
    if (!selectedCatForProducts) return [];
    if (selectedCatForProducts.id === 'all') return products;
    return products.filter((p) => p.category === selectedCatForProducts.id);
  }, [selectedCatForProducts, products]);

  return (
    <div className="space-y-6 animate-fadeInUp pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#B2E2C5]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76]">
              <FolderTree className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
                Product Categories & Collections
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#B2E2C5]/25 text-[#4E9F76] border border-[#B2E2C5]/40">
                {categories.length} Categories
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure packaging categories, promotional badges, catalog thumbnails, and collection taxonomies displayed on the wholesale store.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white font-bold text-xs shadow-md shadow-[#4E9F76]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Categories</div>
            <div className="text-xl font-black text-[#0f172a] mt-0.5">{categories.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Products</div>
            <div className="text-xl font-black text-[#4E9F76] mt-0.5">{products.length} Models</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Storefront Shop Sync</div>
            <div className="text-xs font-black text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Real-Time Live</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product Coverage</div>
            <div className="text-xl font-black text-slate-700 mt-0.5">100%</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories by name, tag, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 font-semibold hidden sm:block">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const productCount = getProductCount(cat.id);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#4E9F76]/60 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Strip: Thumbnail + Badges */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#F4F9F5] border border-slate-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={cat.image || '/images/bag-green.png'}
                      alt={cat.label}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/bag-green.png';
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                        #{cat.id}
                      </span>
                      {cat.tag && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#B2E2C5]/30 text-[#4E9F76] border border-[#B2E2C5]/50">
                          {cat.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-base text-[#0f172a] mt-0.5 leading-snug truncate">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {cat.subtitle || 'Packaging Line'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3.5 leading-relaxed line-clamp-2">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              {/* Bottom Actions & Product Counter */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCatForProducts(cat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#B2E2C5]/15 text-slate-700 hover:text-[#4E9F76] text-xs font-bold transition-all cursor-pointer"
                  title="View Products in Category"
                >
                  <Package className="w-3.5 h-3.5 text-[#4E9F76]" />
                  <span>{productCount} Products</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#4E9F76] hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {cat.id !== 'all' && (
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================
          MODAL: ADD / EDIT CATEGORY - Centered with Blurry Backdrop in Portal
         ======================================================== */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/40 border border-slate-200/80 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0f172a]">
                  {editingCategory ? 'Edit Packaging Category' : 'Create Packaging Category'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingCategory ? `Updating #${editingCategory.id}` : 'Add a new collection to your wholesale catalog'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Category Label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name / Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Cotton & Canvas Bags"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                />
              </div>

              {/* Slug ID (only editable when creating) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category ID / Slug {editingCategory && '(Fixed)'}
                </label>
                <input
                  type="text"
                  disabled={!!editingCategory}
                  placeholder="e.g. cotton-canvas (leave blank for auto)"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-3 py-2 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                />
              </div>

              {/* Subtitle & Badge Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heavy Duty Reusable"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Promotional Tag Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BESTSELLER, 100% ORGANIC"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                  />
                </div>
              </div>

              {/* Image Uploader & Quick Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Category Thumbnail Image
                </label>
                
                <ImageUploader
                  currentImageUrl={formData.image}
                  onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                  label="Upload Category Image"
                />

                <input
                  type="text"
                  placeholder="/images/bag-green.png or https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76]"
                />

                {/* Quick Presets Strip */}
                <div className="mt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Or Choose Fast Preset:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {IMAGE_PRESETS.map((p) => (
                      <button
                        type="button"
                        key={p.url}
                        onClick={() => setFormData({ ...formData, image: p.url })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                          formData.image === p.url
                            ? 'bg-[#4E9F76] text-white border-[#4E9F76]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of materials, manufacturing technology, and typical retail use-cases..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4E9F76] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white font-bold text-xs shadow-md shadow-[#4E9F76]/20 transition-all cursor-pointer"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================
          MODAL: VIEW ASSIGNED PRODUCTS - Centered with Blurry Backdrop in Portal
         ======================================================== */}
      {selectedCatForProducts && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setSelectedCatForProducts(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/40 border border-slate-200/80 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setSelectedCatForProducts(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0f172a]">
                  Products in "{selectedCatForProducts.label}"
                </h3>
                <p className="text-xs text-slate-500">
                  {assignedProducts.length} wholesale models assigned to #{selectedCatForProducts.id}
                </p>
              </div>
            </div>

            {assignedProducts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">No products assigned to this category yet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  You can assign products to this category in the Products Catalog manager.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {assignedProducts.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={p.image || '/images/bag-green.png'}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#0f172a] truncate">{p.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{p.dimensions} · {p.material}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-xs text-[#4E9F76]">
                        ${p.pricePerUnit.toFixed(2)}/unit
                      </div>
                      <div className="text-[10px] text-slate-400">MOQ: {p.moq.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCatForProducts(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default CategoriesManager;
