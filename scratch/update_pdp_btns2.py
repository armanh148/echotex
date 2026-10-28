with open('frontend/src/components/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

is_crlf = '\r\n' in text
text = text.replace('\r\n', '\n')

old_btns = """                  <Lock className="w-4 h-4 text-slate-300" />
                  <span>Purchases Temporarily Closed (Sold Out)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExpressCheckout}
                  className="w-full h-12 rounded-xl border-2 border-[#0f172a] hover:bg-[#0f172a] hover:text-white text-[#0f172a] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 cursor-pointer"
                >
                  <span>→ Express Checkout</span>
                </button>"""

new_btns = """                  <Lock className="w-4 h-4 text-slate-300" />
                  <span>{product.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExpressCheckout}
                  className="w-full h-12 rounded-xl border-2 border-[#0f172a] hover:bg-[#0f172a] hover:text-white text-[#0f172a] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 cursor-pointer"
                >
                  <span>{product.checkoutButtonText || '→ Express Checkout'}</span>
                </button>"""

old_related = """              <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] mb-1 block">
                Explore More Options
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight">
                Related Products
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Frequently ordered together or alternative sizing options for your business.
              </p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d3419] hover:text-[#FF5722] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>"""

new_related = """              <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] mb-1 block">
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
            </button>"""

if old_btns in text:
    text = text.replace(old_btns, new_btns, 1)
    print("Applied btns")
else:
    print("btns NOT FOUND")

if old_related in text:
    text = text.replace(old_related, new_related, 1)
    print("Applied related")
else:
    print("related NOT FOUND")

if is_crlf:
    text = text.replace('\n', '\r\n')

with open('frontend/src/components/ProductDetailPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("ProductDetailPage updated successfully")
