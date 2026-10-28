with open('frontend/src/admin/components/PageContentEditor.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

is_crlf = '\r\n' in text
text = text.replace('\r\n', '\n')

old_tab_type = """type EditorTab =
  | 'logo'
  | 'navbar'
  | 'versatility'
  | 'about'
  | 'contact'
  | 'footer'
  | 'single-product';"""

new_tab_type = """type EditorTab =
  | 'logo'
  | 'navbar'
  | 'shop'
  | 'versatility'
  | 'about'
  | 'contact'
  | 'footer'
  | 'single-product';"""

old_tabs_list = """    { id: 'footer', label: 'Footer & Legal', icon: Globe, desc: 'Links, copyright & badges' },
    { id: 'single-product', label: 'Single Product Page', icon: Package, desc: 'Specs, gallery & policies' },"""

new_tabs_list = """    { id: 'shop', label: 'Homepage Shop & Banners', icon: Tag, desc: 'Hero banner, trust bar & headings' },
    { id: 'footer', label: 'Footer & Legal', icon: Globe, desc: 'Links, copyright & badges' },
    { id: 'single-product', label: 'Single Product Page', icon: Package, desc: 'Specs, gallery & policies' },"""

old_pdp_state = """        retailPolicyText: activeSelectedProduct.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
        wholesalePolicyText: activeSelectedProduct.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
        outOfStockNotice: activeSelectedProduct.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.'
      });"""

new_pdp_state = """        retailPolicyText: activeSelectedProduct.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
        wholesalePolicyText: activeSelectedProduct.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
        outOfStockNotice: activeSelectedProduct.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
        checkoutButtonText: activeSelectedProduct.checkoutButtonText || '→ Express Checkout',
        outOfStockButtonText: activeSelectedProduct.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)',
        retailTabLabel: activeSelectedProduct.retailTabLabel || 'Retail Order',
        wholesaleTabLabel: activeSelectedProduct.wholesaleTabLabel || 'Wholesale Order',
        specsHeading: activeSelectedProduct.specsHeading || 'Description',
        relatedTag: activeSelectedProduct.relatedTag || 'Explore More Options',
        relatedTitle: activeSelectedProduct.relatedTitle || 'Related Products',
        relatedSubtitle: activeSelectedProduct.relatedSubtitle || 'Frequently ordered together or alternative sizing options for your business.',
        relatedBackBtnText: activeSelectedProduct.relatedBackBtnText || 'View Full Catalog'
      });"""

old_pdp_save = """      retailPolicyText: pdpForm.retailPolicyText.trim(),
      wholesalePolicyText: pdpForm.wholesalePolicyText.trim(),
      outOfStockNotice: pdpForm.outOfStockNotice.trim()
    });"""

new_pdp_save = """      retailPolicyText: pdpForm.retailPolicyText.trim(),
      wholesalePolicyText: pdpForm.wholesalePolicyText.trim(),
      outOfStockNotice: pdpForm.outOfStockNotice.trim(),
      checkoutButtonText: (pdpForm.checkoutButtonText || '').trim(),
      outOfStockButtonText: (pdpForm.outOfStockButtonText || '').trim(),
      retailTabLabel: (pdpForm.retailTabLabel || '').trim(),
      wholesaleTabLabel: (pdpForm.wholesaleTabLabel || '').trim(),
      specsHeading: (pdpForm.specsHeading || '').trim(),
      relatedTag: (pdpForm.relatedTag || '').trim(),
      relatedTitle: (pdpForm.relatedTitle || '').trim(),
      relatedSubtitle: (pdpForm.relatedSubtitle || '').trim(),
      relatedBackBtnText: (pdpForm.relatedBackBtnText || '').trim()
    });"""

# Add 'shop' tab rendering right before footer tab
old_footer_tab = "{/* TAB 6: FOOTER & LEGAL */}"

new_shop_tab_jsx = """{/* TAB: HOMEPAGE SHOP & BANNERS */}
        {activeTab === 'shop' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 1. Shop Hero Panoramic Banner */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#d97706]" />
                <span>Shop Page Top Hero Banner & Podium</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pill Badge Text</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.heroBannerBadge || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, heroBannerBadge: e.target.value }
                    })}
                    placeholder="LIMITED TIME ONLY"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Floating Discount Badge</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.heroBannerDiscountBadge || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, heroBannerDiscountBadge: e.target.value }
                    })}
                    placeholder="UP TO 50% OFF"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Headline (Supports line break with \\n)</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.heroBannerTitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, heroBannerTitle: e.target.value }
                    })}
                    placeholder="Shop More,\\nSave More!"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.heroBannerBtnText || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, heroBannerBtnText: e.target.value }
                    })}
                    placeholder="EXPLORE COLLECTION"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={formData.shopConfig?.heroBannerSubtitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    shopConfig: { ...formData.shopConfig!, heroBannerSubtitle: e.target.value }
                  })}
                  placeholder="Discover amazing deals on your favorite sustainable products..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                />
              </div>

              <ImageUploader
                label="Shop Hero Podium Showcase Image"
                description="Upload custom photography for the shop hero podium."
                value={formData.shopConfig?.heroBannerImage || '/images/shop-hero-podium.jpg'}
                onChange={(newUrl) => setFormData({
                  ...formData,
                  shopConfig: { ...formData.shopConfig!, heroBannerImage: newUrl }
                })}
                aspectRatio="wide"
              />

              {/* 3 Value Props */}
              <div className="pt-2 border-t border-slate-200/60">
                <label className="block text-xs font-bold text-slate-800 mb-2">3 Value Proposition Badges</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Badge 1</span>
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp1Title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp1Title: e.target.value }
                      })}
                      placeholder="Best Prices"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp1Subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp1Subtitle: e.target.value }
                      })}
                      placeholder="Guaranteed"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Badge 2</span>
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp2Title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp2Title: e.target.value }
                      })}
                      placeholder="Secure"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp2Subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp2Subtitle: e.target.value }
                      })}
                      placeholder="Payments"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Badge 3</span>
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp3Title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp3Title: e.target.value }
                      })}
                      placeholder="Fast Delivery"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp3Subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp3Subtitle: e.target.value }
                      })}
                      placeholder="Worldwide"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 4-Item Trust Bar Strip */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>4-Item Trust Propositions Bar</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item 1 (Truck)</span>
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar1Title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar1Title: e.target.value }
                    })}
                    placeholder="Free Shipping"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar1Subtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar1Subtitle: e.target.value }
                    })}
                    placeholder="On orders over $75"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item 2 (Returns)</span>
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar2Title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar2Title: e.target.value }
                    })}
                    placeholder="Easy Returns"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar2Subtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar2Subtitle: e.target.value }
                    })}
                    placeholder="30-day returns"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item 3 (Quality)</span>
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar3Title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar3Title: e.target.value }
                    })}
                    placeholder="Premium Quality"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar3Subtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar3Subtitle: e.target.value }
                    })}
                    placeholder="100% original products"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item 4 (Support)</span>
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar4Title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar4Title: e.target.value }
                    })}
                    placeholder="24/7 Support"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar4Subtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar4Subtitle: e.target.value }
                    })}
                    placeholder="We're here to help"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Section Titles & Buttons */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#d97706]" />
                <span>Section Headers, Catalog Titles & Buttons</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categories Section Title</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.categoriesHeading || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, categoriesHeading: e.target.value }
                    })}
                    placeholder="Shop By Category"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categories Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.categoriesSubheading || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, categoriesSubheading: e.target.value }
                    })}
                    placeholder="Explore our full range of certified industrial & retail packaging collections."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Arrivals Title</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.newArrivalsHeading || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, newArrivalsHeading: e.target.value }
                    })}
                    placeholder="New Arrivals"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Arrivals View All Button</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.newArrivalsBtnText || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, newArrivalsBtnText: e.target.value }
                    })}
                    placeholder="View All"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Catalog Title</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.catalogTitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, catalogTitle: e.target.value }
                    })}
                    placeholder="Full Manufacturing & Retail Catalog"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Catalog Subtitle</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.catalogSubtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, catalogSubtitle: e.target.value }
                    })}
                    placeholder="Explore our full manufacturing catalog with wholesale pricing tiers."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: FOOTER & LEGAL */}"""

if old_tab_type in text:
    text = text.replace(old_tab_type, new_tab_type, 1)
    print("Applied tab_type")
else:
    print("tab_type NOT FOUND")

if old_tabs_list in text:
    text = text.replace(old_tabs_list, new_tabs_list, 1)
    print("Applied tabs_list")
else:
    print("tabs_list NOT FOUND")

if old_pdp_state in text:
    text = text.replace(old_pdp_state, new_pdp_state, 1)
    print("Applied pdp_state")
else:
    print("pdp_state NOT FOUND")

if old_pdp_save in text:
    text = text.replace(old_pdp_save, new_pdp_save, 1)
    print("Applied pdp_save")
else:
    print("pdp_save NOT FOUND")

if old_footer_tab in text:
    text = text.replace(old_footer_tab, new_shop_tab_jsx, 1)
    print("Applied shop_tab_jsx")
else:
    print("footer_tab NOT FOUND")

if is_crlf:
    text = text.replace('\n', '\r\n')

with open('frontend/src/admin/components/PageContentEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("PageContentEditor updated successfully with Homepage Shop & Banners tab!")
