import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const { products } = useStore();

  if (!isOpen) return null;

  const results = products.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.material && p.material.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2.5 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-xl bg-white rounded-2xl shadow-2xl border border-[#dce6d3] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[#edf3e8]">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search bags, compostable materials, GSM weights..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 sm:py-4 pl-2.5 pr-3 text-xs sm:text-sm text-[#142817] placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="py-6 px-4 text-xs text-slate-500">
              <span className="font-semibold text-[#1b4329] block mb-2">Popular Searches:</span>
              <div className="flex flex-wrap gap-2">
                {['T-Shirt Bags', 'Biodegradable D-Cut', '80 GSM Tote', 'Laminated Gift', 'Industrial Rags'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 rounded bg-[#f2f7ec] hover:bg-[#e4edd9] text-[#1b4329] font-medium transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-full p-3 text-left rounded-xl hover:bg-[#f6f9f2] transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5b754f]">
                      <span>{product.categoryLabel}</span>
                      <span>·</span>
                      <span className="font-mono">{product.gsm} GSM</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#142817] group-hover:text-[#7ea242] transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-xs text-slate-500 line-clamp-1">{product.subtitle}</span>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <span className="font-mono text-sm font-bold text-[#1b4329]">
                      ${product.pricePerUnit.toFixed(2)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1b4329] group-hover:translate-x-1 transition-all mt-1 ml-auto" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching products found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
