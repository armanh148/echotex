with open('frontend/src/components/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

is_crlf = '\r\n' in text
text = text.replace('\r\n', '\n')

old_state = """    outOfStockNotice: product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
  });"""

new_state = """    outOfStockNotice: product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
    checkoutButtonText: product.checkoutButtonText || '→ Express Checkout',
    outOfStockButtonText: product.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)',
    retailTabLabel: product.retailTabLabel || 'Retail Order',
    wholesaleTabLabel: product.wholesaleTabLabel || 'Wholesale Order',
    specsHeading: product.specsHeading || 'Description',
    relatedTag: product.relatedTag || 'Explore More Options',
    relatedTitle: product.relatedTitle || 'Related Products',
    relatedSubtitle: product.relatedSubtitle || 'Frequently ordered together or alternative sizing options for your business.',
    relatedBackBtnText: product.relatedBackBtnText || 'View Full Catalog →',
  });"""

old_effect = """      outOfStockNotice: product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
    });
  }, [product]);"""

new_effect = """      outOfStockNotice: product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
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
  }, [product]);"""

old_save = """      retailPolicyText: editForm.retailPolicyText.trim(),
      wholesalePolicyText: editForm.wholesalePolicyText.trim(),
      outOfStockNotice: editForm.outOfStockNotice.trim(),
    };"""

new_save = """      retailPolicyText: editForm.retailPolicyText.trim(),
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
    };"""

old_tabs_jsx = """              <button
                type="button"
                onClick={() => setOrderType('retail')}
                className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  orderType === 'retail'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-slate-500 hover:text-[#111827]'
                }`}
              >
                Retail Order
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
                Wholesale Order
              </button>"""

new_tabs_jsx = """              <button
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
              </button>"""

old_btns_jsx = """                  <Lock className="w-4 h-4 text-slate-300" />
                  <span>Purchases Temporarily Closed (Sold Out)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExpressCheckout}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>→ Express Checkout</span>
                </button>"""

new_btns_jsx = """                  <Lock className="w-4 h-4 text-slate-300" />
                  <span>{product.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExpressCheckout}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>{product.checkoutButtonText || '→ Express Checkout'}</span>
                </button>"""

old_specs_title = """                <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] pb-2 border-b-2 border-[#d97706] inline-block">
                  Description
                </span>"""

new_specs_title = """                <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] pb-2 border-b-2 border-[#d97706] inline-block">
                  {product.specsHeading || 'Description'}
                </span>"""

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
              <span>View Full Catalog →</span>
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
              <span>{product.relatedBackBtnText || 'View Full Catalog →'}</span>
            </button>"""

for name, o, n in [
    ("state", old_state, new_state),
    ("effect", old_effect, new_effect),
    ("save", old_save, new_save),
    ("tabs", old_tabs_jsx, new_tabs_jsx),
    ("btns", old_btns_jsx, new_btns_jsx),
    ("specs_title", old_specs_title, new_specs_title),
    ("related", old_related, new_related),
]:
    if o in text:
        text = text.replace(o, n, 1)
        print(f"Applied {name}")
    else:
        print(f"NOT FOUND: {name}")

if is_crlf:
    text = text.replace('\n', '\r\n')

with open('frontend/src/components/ProductDetailPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("ProductDetailPage.tsx updated successfully!")
