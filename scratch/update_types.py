with open('frontend/src/types.ts', 'r', encoding='utf-8') as f:
    text = f.read()

is_crlf = '\r\n' in text
text = text.replace('\r\n', '\n')

old_prod = """  trustBadge3?: string;
  outOfStockNotice?: string;
}"""

new_prod = """  trustBadge3?: string;
  outOfStockNotice?: string;
  checkoutButtonText?: string;
  outOfStockButtonText?: string;
  retailTabLabel?: string;
  wholesaleTabLabel?: string;
  specsHeading?: string;
  relatedTag?: string;
  relatedTitle?: string;
  relatedSubtitle?: string;
  relatedBackBtnText?: string;
}"""

old_shop = """export interface ShopConfig {
  catalogTitle: string;
  catalogSubtitle: string;
  testimonials: TestimonialConfig[];
  galleryImages?: { url: string; caption: string }[];
}"""

new_shop = """export interface ShopConfig {
  catalogTitle: string;
  catalogSubtitle: string;
  testimonials: TestimonialConfig[];
  galleryImages?: { url: string; caption: string }[];
  // Home Page Shop Hero Banner
  heroBannerBadge?: string;
  heroBannerTitle?: string;
  heroBannerSubtitle?: string;
  heroBannerBtnText?: string;
  heroBannerImage?: string;
  heroBannerDiscountBadge?: string;
  valueProp1Title?: string;
  valueProp1Subtitle?: string;
  valueProp2Title?: string;
  valueProp2Subtitle?: string;
  valueProp3Title?: string;
  valueProp3Subtitle?: string;
  // 4-Item Value Propositions Strip
  trustBar1Title?: string;
  trustBar1Subtitle?: string;
  trustBar2Title?: string;
  trustBar2Subtitle?: string;
  trustBar3Title?: string;
  trustBar3Subtitle?: string;
  trustBar4Title?: string;
  trustBar4Subtitle?: string;
  // Section Headings & Buttons
  categoriesHeading?: string;
  categoriesSubheading?: string;
  newArrivalsHeading?: string;
  newArrivalsBtnText?: string;
  newArrivalsHideBtnText?: string;
}"""

if old_prod in text:
    text = text.replace(old_prod, new_prod, 1)
    print("Updated Product interface")
else:
    print("Could not find old_prod")

if old_shop in text:
    text = text.replace(old_shop, new_shop, 1)
    print("Updated ShopConfig interface")
else:
    print("Could not find old_shop")

if is_crlf:
    text = text.replace('\n', '\r\n')

with open('frontend/src/types.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("types.ts updated successfully")
