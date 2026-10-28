with open('frontend/src/components/ShopSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

is_crlf = '\r\n' in text
text = text.replace('\r\n', '\n')

# 1. Shop hero pill
old_pill = """                {/* Pill Badge: LIMITED TIME ONLY */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a2c16]/90 border border-emerald-500/35 text-emerald-300 text-[11px] font-bold tracking-widest uppercase mb-6 self-start shadow-inner">
                  <span>LIMITED TIME ONLY</span>
                </div>"""

new_pill = """                {/* Pill Badge: LIMITED TIME ONLY */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a2c16]/90 border border-emerald-500/35 text-emerald-300 text-[11px] font-bold tracking-widest uppercase mb-6 self-start shadow-inner">
                  <span>{siteSettings?.shopConfig?.heroBannerBadge || 'LIMITED TIME ONLY'}</span>
                </div>"""

# 2. Shop hero headline & subtitle
old_headline = """                {/* Headline: Shop More, Save More! */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.06] mb-5">
                  Shop More,<br />
                  <span className="text-[#FF5722]">Save More!</span>
                </h1>

                {/* Subtitle */}
                <p className="text-emerald-100/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-9 font-normal">
                  Discover amazing deals on your favorite sustainable products & eco-friendly essentials.
                </p>"""

new_headline = """                {/* Headline: Shop More, Save More! */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.06] mb-5 whitespace-pre-line">
                  {siteSettings?.shopConfig?.heroBannerTitle || "Shop More,\\nSave More!"}
                </h1>

                {/* Subtitle */}
                <p className="text-emerald-100/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-9 font-normal">
                  {siteSettings?.shopConfig?.heroBannerSubtitle || 'Discover amazing deals on your favorite sustainable products & eco-friendly essentials.'}
                </p>"""

# 3. Value props
old_vprops = """                  {/* 1. Best Prices */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-sm shrink-0">
                      <Tag className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-white">Best Prices</p>
                      <p className="text-emerald-200/80 text-[10px]">Guaranteed</p>
                    </div>
                  </div>

                  {/* 2. Secure Payments */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-sm shrink-0">
                      <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-white">Secure</p>
                      <p className="text-emerald-200/80 text-[10px]">Payments</p>
                    </div>
                  </div>

                  {/* 3. Fast Delivery */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-sm shrink-0">
                      <Truck className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-white">Fast Delivery</p>
                      <p className="text-emerald-200/80 text-[10px]">Worldwide</p>
                    </div>
                  </div>"""

new_vprops = """                  {/* 1. Best Prices */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-sm shrink-0">
                      <Tag className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-white">{siteSettings?.shopConfig?.valueProp1Title || 'Best Prices'}</p>
                      <p className="text-emerald-200/80 text-[10px]">{siteSettings?.shopConfig?.valueProp1Subtitle || 'Guaranteed'}</p>
                    </div>
                  </div>

                  {/* 2. Secure Payments */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-sm shrink-0">
                      <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-white">{siteSettings?.shopConfig?.valueProp2Title || 'Secure'}</p>
                      <p className="text-emerald-200/80 text-[10px]">{siteSettings?.shopConfig?.valueProp2Subtitle || 'Payments'}</p>
                    </div>
                  </div>

                  {/* 3. Fast Delivery */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-sm shrink-0">
                      <Truck className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-white">{siteSettings?.shopConfig?.valueProp3Title || 'Fast Delivery'}</p>
                      <p className="text-emerald-200/80 text-[10px]">{siteSettings?.shopConfig?.valueProp3Subtitle || 'Worldwide'}</p>
                    </div>
                  </div>"""

# 4. CTA button
old_btn = """                {/* CTA Button: EXPLORE COLLECTION -> */}
                <div>
                  <button
                    onClick={scrollToCategories}
                    className="bg-[#FF5722] hover:bg-[#e64a19] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-full inline-flex items-center gap-3 shadow-xl shadow-[#FF5722]/40 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                  </button>
                </div>"""

new_btn = """                {/* CTA Button: EXPLORE COLLECTION -> */}
                <div>
                  <button
                    onClick={scrollToCategories}
                    className="bg-[#FF5722] hover:bg-[#e64a19] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-full inline-flex items-center gap-3 shadow-xl shadow-[#FF5722]/40 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                  >
                    <span>{siteSettings?.shopConfig?.heroBannerBtnText || 'EXPLORE COLLECTION'}</span>
                    <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                  </button>
                </div>"""

# 5. Podium Image & Badge
old_podium = """                  <img
                    src="/images/shop-hero-podium.jpg"
                    alt="Ecotex Signature Collection Podium"
                    className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 select-none"
                    draggable={false}
                  />

                  {/* Soft Gradient Overlay on left edge for seamless banner integration */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a2c17] to-transparent opacity-75" />

                  {/* Floating Circular Orange Badge: UP TO 50% OFF */}
                  <div className="absolute top-5 right-5 sm:top-7 sm:right-7 w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-[#FF5722] text-white flex flex-col items-center justify-center shadow-2xl shadow-[#FF5722]/50 font-extrabold uppercase text-center border-2 border-white/30 transform hover:scale-110 transition-transform duration-300 pointer-events-none select-none z-20">
                    <span className="text-[10px] sm:text-[11px] tracking-widest text-white/90 leading-none">UP TO</span>
                    <span className="text-2xl sm:text-3xl font-black leading-none my-1">50%</span>
                    <span className="text-[10px] sm:text-[11px] tracking-widest text-white/90 leading-none">OFF</span>
                  </div>"""

new_podium = """                  <img
                    src={siteSettings?.shopConfig?.heroBannerImage || "/images/shop-hero-podium.jpg"}
                    alt="Ecotex Signature Collection Podium"
                    className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 select-none"
                    draggable={false}
                  />

                  {/* Soft Gradient Overlay on left edge for seamless banner integration */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a2c17] to-transparent opacity-75" />

                  {/* Floating Circular Orange Badge */}
                  <div className="absolute top-5 right-5 sm:top-7 sm:right-7 w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-[#FF5722] text-white flex flex-col items-center justify-center shadow-2xl shadow-[#FF5722]/50 font-extrabold uppercase text-center border-2 border-white/30 transform hover:scale-110 transition-transform duration-300 pointer-events-none select-none z-20">
                    <span className="text-xs sm:text-sm font-black leading-tight text-center px-2">
                      {siteSettings?.shopConfig?.heroBannerDiscountBadge || 'UP TO 50% OFF'}
                    </span>
                  </div>"""

# 6. Trust bar
old_trust = """            {/* 1. Free Shipping */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <Truck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">Free Shipping</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">On orders over $75</p>
              </div>
            </div>

            {/* 2. Easy Returns */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <RotateCcw className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">Easy Returns</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">30-day returns</p>
              </div>
            </div>

            {/* 3. Premium Quality */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">Premium Quality</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">100% original products</p>
              </div>
            </div>

            {/* 4. 24/7 Support */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <Headphones className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">24/7 Support</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">We're here to help</p>
              </div>
            </div>"""

new_trust = """            {/* 1. Free Shipping */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <Truck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">{siteSettings?.shopConfig?.trustBar1Title || 'Free Shipping'}</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{siteSettings?.shopConfig?.trustBar1Subtitle || 'On orders over $75'}</p>
              </div>
            </div>

            {/* 2. Easy Returns */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <RotateCcw className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">{siteSettings?.shopConfig?.trustBar2Title || 'Easy Returns'}</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{siteSettings?.shopConfig?.trustBar2Subtitle || '30-day returns'}</p>
              </div>
            </div>

            {/* 3. Premium Quality */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">{siteSettings?.shopConfig?.trustBar3Title || 'Premium Quality'}</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{siteSettings?.shopConfig?.trustBar3Subtitle || '100% original products'}</p>
              </div>
            </div>

            {/* 4. 24/7 Support */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <Headphones className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">{siteSettings?.shopConfig?.trustBar4Title || '24/7 Support'}</h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{siteSettings?.shopConfig?.trustBar4Subtitle || "We're here to help"}</p>
              </div>
            </div>"""

# 7. Category section
old_cat = """          {/* Section Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              Shop By Category
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-medium">
              Explore our full range of certified industrial & retail packaging collections.
            </p>
          </div>"""

new_cat = """          {/* Section Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              {siteSettings?.shopConfig?.categoriesHeading || 'Shop By Category'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-medium">
              {siteSettings?.shopConfig?.categoriesSubheading || 'Explore our full range of certified industrial & retail packaging collections.'}
            </p>
          </div>"""

# 8. New Arrivals
old_arr = """          {/* Header Row: Title & View All Link */}
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-200">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              New Arrivals
            </h2>
            <button
              onClick={() => {
                setShowFullCatalog(!showFullCatalog);
                setActiveCategory('all');
                setTimeout(() => {
                  catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm sm:text-base font-bold text-[#FF5722] hover:text-[#e64a19] flex items-center gap-2 transition-colors cursor-pointer group"
            >
              <span>{showFullCatalog ? 'Hide Full Catalog' : 'View All'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>"""

new_arr = """          {/* Header Row: Title & View All Link */}
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-200">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              {siteSettings?.shopConfig?.newArrivalsHeading || 'New Arrivals'}
            </h2>
            <button
              onClick={() => {
                setShowFullCatalog(!showFullCatalog);
                setActiveCategory('all');
                setTimeout(() => {
                  catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm sm:text-base font-bold text-[#FF5722] hover:text-[#e64a19] flex items-center gap-2 transition-colors cursor-pointer group"
            >
              <span>{showFullCatalog ? (siteSettings?.shopConfig?.newArrivalsHideBtnText || 'Hide Full Catalog') : (siteSettings?.shopConfig?.newArrivalsBtnText || 'View All')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>"""

for name, o, n in [
    ("pill", old_pill, new_pill),
    ("headline", old_headline, new_headline),
    ("vprops", old_vprops, new_vprops),
    ("btn", old_btn, new_btn),
    ("podium", old_podium, new_podium),
    ("trust", old_trust, new_trust),
    ("cat", old_cat, new_cat),
    ("arr", old_arr, new_arr),
]:
    if o in text:
        text = text.replace(o, n, 1)
        print(f"Applied {name}")
    else:
        print(f"NOT FOUND: {name}")

if is_crlf:
    text = text.replace('\n', '\r\n')

with open('frontend/src/components/ShopSection.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("ShopSection.tsx updated successfully!")
