with open('frontend/src/admin/components/ProductCatalogManager.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

is_crlf = '\r\n' in text
text = text.replace('\r\n', '\n')

old_form_state = """    retailPolicyText: 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
    wholesalePolicyText: 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
    outOfStockNotice: 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.'
  });"""

new_form_state = """    retailPolicyText: 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
    wholesalePolicyText: 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
    outOfStockNotice: 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
    checkoutButtonText: '→ Express Checkout',
    outOfStockButtonText: 'Purchases Temporarily Closed (Sold Out)',
    retailTabLabel: 'Retail Order',
    wholesaleTabLabel: 'Wholesale Order',
    specsHeading: 'Description',
    relatedTag: 'Explore More Options',
    relatedTitle: 'Related Products',
    relatedSubtitle: 'Frequently ordered together or alternative sizing options for your business.',
    relatedBackBtnText: 'View Full Catalog'
  });"""

old_add_modal = """      retailPolicyText: 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
      wholesalePolicyText: 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
      outOfStockNotice: 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.'
    });
    setIsModalOpen(true);"""

new_add_modal = """      retailPolicyText: 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
      wholesalePolicyText: 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
      outOfStockNotice: 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
      checkoutButtonText: '→ Express Checkout',
      outOfStockButtonText: 'Purchases Temporarily Closed (Sold Out)',
      retailTabLabel: 'Retail Order',
      wholesaleTabLabel: 'Wholesale Order',
      specsHeading: 'Description',
      relatedTag: 'Explore More Options',
      relatedTitle: 'Related Products',
      relatedSubtitle: 'Frequently ordered together or alternative sizing options for your business.',
      relatedBackBtnText: 'View Full Catalog'
    });
    setIsModalOpen(true);"""

old_edit_modal = """      retailPolicyText: p.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
      wholesalePolicyText: p.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
      outOfStockNotice: p.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.'
    });
    setIsModalOpen(true);"""

new_edit_modal = """      retailPolicyText: p.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
      wholesalePolicyText: p.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
      outOfStockNotice: p.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
      checkoutButtonText: p.checkoutButtonText || '→ Express Checkout',
      outOfStockButtonText: p.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)',
      retailTabLabel: p.retailTabLabel || 'Retail Order',
      wholesaleTabLabel: p.wholesaleTabLabel || 'Wholesale Order',
      specsHeading: p.specsHeading || 'Description',
      relatedTag: p.relatedTag || 'Explore More Options',
      relatedTitle: p.relatedTitle || 'Related Products',
      relatedSubtitle: p.relatedSubtitle || 'Frequently ordered together or alternative sizing options for your business.',
      relatedBackBtnText: p.relatedBackBtnText || 'View Full Catalog'
    });
    setIsModalOpen(true);"""

old_payload = """      retailPolicyText: formData.retailPolicyText.trim(),
      wholesalePolicyText: formData.wholesalePolicyText.trim(),
      outOfStockNotice: formData.outOfStockNotice.trim()
    };"""

new_payload = """      retailPolicyText: formData.retailPolicyText.trim(),
      wholesalePolicyText: formData.wholesalePolicyText.trim(),
      outOfStockNotice: formData.outOfStockNotice.trim(),
      checkoutButtonText: formData.checkoutButtonText.trim(),
      outOfStockButtonText: formData.outOfStockButtonText.trim(),
      retailTabLabel: formData.retailTabLabel.trim(),
      wholesaleTabLabel: formData.wholesaleTabLabel.trim(),
      specsHeading: formData.specsHeading.trim(),
      relatedTag: formData.relatedTag.trim(),
      relatedTitle: formData.relatedTitle.trim(),
      relatedSubtitle: formData.relatedSubtitle.trim(),
      relatedBackBtnText: formData.relatedBackBtnText.trim()
    };"""

old_tab4_end = """                    <textarea
                      rows={2}
                      value={formData.outOfStockNotice}
                      onChange={(e) => setFormData({ ...formData, outOfStockNotice: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-rose-200 text-xs font-medium bg-white text-rose-900 focus:outline-none focus:border-rose-500"
                      placeholder="Product specifications aur details check ki ja sakti hain..."
                    />
                  </div>

                </div>
              )}"""

new_tab4_end = """                    <textarea
                      rows={2}
                      value={formData.outOfStockNotice}
                      onChange={(e) => setFormData({ ...formData, outOfStockNotice: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-rose-200 text-xs font-medium bg-white text-rose-900 focus:outline-none focus:border-rose-500"
                      placeholder="Product specifications aur details check ki ja sakti hain..."
                    />
                  </div>

                  {/* Buttons & Related Products Section Customizer */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#d97706]" />
                      <span>Single Product Page Buttons & Section Titles</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Checkout Button Text (When In Stock)
                        </label>
                        <input
                          type="text"
                          value={formData.checkoutButtonText}
                          onChange={(e) => setFormData({ ...formData, checkoutButtonText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#d97706]"
                          placeholder="→ Express Checkout"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Sold Out Button Text (When Stock is 0)
                        </label>
                        <input
                          type="text"
                          value={formData.outOfStockButtonText}
                          onChange={(e) => setFormData({ ...formData, outOfStockButtonText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500"
                          placeholder="Purchases Temporarily Closed (Sold Out)"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Retail Order Tab Label
                        </label>
                        <input
                          type="text"
                          value={formData.retailTabLabel}
                          onChange={(e) => setFormData({ ...formData, retailTabLabel: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="Retail Order"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Wholesale Order Tab Label
                        </label>
                        <input
                          type="text"
                          value={formData.wholesaleTabLabel}
                          onChange={(e) => setFormData({ ...formData, wholesaleTabLabel: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#166534]"
                          placeholder="Wholesale Order"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Specifications Heading
                        </label>
                        <input
                          type="text"
                          value={formData.specsHeading}
                          onChange={(e) => setFormData({ ...formData, specsHeading: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="Description"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Related Products Tag
                        </label>
                        <input
                          type="text"
                          value={formData.relatedTag}
                          onChange={(e) => setFormData({ ...formData, relatedTag: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="Explore More Options"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Related Products Title
                        </label>
                        <input
                          type="text"
                          value={formData.relatedTitle}
                          onChange={(e) => setFormData({ ...formData, relatedTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="Related Products"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Related Back Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.relatedBackBtnText}
                          onChange={(e) => setFormData({ ...formData, relatedBackBtnText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="View Full Catalog"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Related Products Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.relatedSubtitle}
                        onChange={(e) => setFormData({ ...formData, relatedSubtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                        placeholder="Frequently ordered together or alternative sizing options for your business."
                      />
                    </div>
                  </div>

                </div>
              )}"""

for name, o, n in [
    ("form_state", old_form_state, new_form_state),
    ("add_modal", old_add_modal, new_add_modal),
    ("edit_modal", old_edit_modal, new_edit_modal),
    ("payload", old_payload, new_payload),
    ("tab4", old_tab4_end, new_tab4_end),
]:
    if o in text:
        text = text.replace(o, n, 1)
        print(f"Applied {name}")
    else:
        print(f"NOT FOUND: {name}")

if is_crlf:
    text = text.replace('\n', '\r\n')

with open('frontend/src/admin/components/ProductCatalogManager.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("ProductCatalogManager.tsx updated with button customizers!")
