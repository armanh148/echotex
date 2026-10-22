import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'deal-smart-watch-pro',
    name: 'Smart Watch Pro',
    category: 'electronics',
    categoryLabel: 'Electronics & Smart Gear',
    subtitle: 'Fitness & Health Tracking with high-accuracy biometric monitoring',
    pricePerUnit: 59.99,
    moq: 1,
    gsm: 45,
    dimensions: '44mm x 38mm x 10.7mm',
    material: 'Aerospace-Grade Recycled Aluminum & Fluoroelastomer Strap',
    capacity: 'Water-Resistant 50M',
    certifications: ['CE Certified', 'RoHS Compliant', 'IP68 Waterproof'],
    availableColors: [
      { name: 'Midnight Black', hex: '#111827' },
      { name: 'Silver Aluminum', hex: '#e2e8f0' },
      { name: 'Rose Gold', hex: '#f43f5e' }
    ],
    description: 'Precision engineered smart watch with high-resolution OLED display, heart rate tracking, oxygen saturation sensors, sleep analytics, and 7-day battery life.',
    features: [
      'Continuous 24/7 Heart Rate & SpO2 Tracking',
      'Over 40 Dedicated Sports & Workout Modes',
      'Vibrant Ultra-Retina Always-On Display',
      'Ultra-Fast Wireless Magnetic Charging'
    ],
    bestFor: 'Everyday fitness tracking, active lifestyles, health monitoring',
    ecoImpact: 'Crafted with 100% recycled aluminum chassis and zero toxic brominated flame retardants',
    inStock: true,
    leadTime: 'In Stock - Dispatches within 24 hours',
    volumeTiers: [
      { minQty: 1, price: 59.99 },
      { minQty: 5, price: 54.99 },
      { minQty: 20, price: 49.99 }
    ],
    image: '/images/deal-smart-watch.jpg',
    badge: '50% OFF'
  },
  {
    id: 'prod-essential-hoodie',
    name: 'Essential Hoodie',
    category: 'men',
    categoryLabel: 'Organic Cotton Streetwear',
    subtitle: '450 GSM heavyweight organic combed cotton brushed fleece hoodie',
    pricePerUnit: 39.99,
    moq: 1,
    gsm: 450,
    dimensions: 'Unisex S - XXL Standard Fit',
    material: '100% GOTS Certified Organic Combed Cotton',
    capacity: 'Standard Fit',
    certifications: ['GOTS Certified Organic', 'OEKO-TEX Standard 100', 'Fair Trade Certified'],
    availableColors: [
      { name: 'Warm Camel Sand', hex: '#c5a074' },
      { name: 'Ecotex Forest', hex: '#166534' },
      { name: 'Midnight Heather', hex: '#1f2937' },
      { name: 'Bone White', hex: '#f5f5f4' }
    ],
    description: 'Crafted from sustainable ultra-heavyweight combed organic cotton fleece. Features double-lined hood, hidden phone pocket, durable metal aglets, and zero-shrink pre-washed finish.',
    features: [
      'Preshrunk heavyweight 450 GSM luxury brushed fleece',
      'Double-stitched kangaroo pocket with reinforced stress points',
      'Tonal drawstrings with matte steel finished aglets',
      'Dyed using closed-loop zero-effluent plant inks'
    ],
    bestFor: 'Daily lifestyle wear, chilly evenings, minimalist streetwear',
    ecoImpact: 'Conserves ~2,100 liters of water vs conventional pesticide cotton',
    inStock: true,
    leadTime: 'Immediate Dispatch',
    volumeTiers: [
      { minQty: 1, price: 39.99 },
      { minQty: 10, price: 34.99 },
      { minQty: 50, price: 29.99 }
    ],
    image: '/images/essential-hoodie.jpg',
    badge: 'NEW'
  },
  {
    id: 'prod-leather-handbag',
    name: 'Leather Handbag',
    category: 'women',
    categoryLabel: 'Luxury Eco-Leather',
    subtitle: 'Structured artisan top-handle tote handbag with removable crossbody strap',
    pricePerUnit: 59.99,
    moq: 1,
    gsm: 280,
    dimensions: '14"W x 10"H x 5"D',
    material: 'Vegetable-Tanned Bio-Based Eco Leather with Recycled Suede Lining',
    capacity: 'Up to 15 lbs (holds 13" laptop)',
    certifications: ['LWG Gold Rated Leather', 'Reach Compliant', 'Zero Chrome VI'],
    availableColors: [
      { name: 'Chestnut Brown', hex: '#78350f' },
      { name: 'Olive Hunter', hex: '#3f6212' },
      { name: 'Jet Onyx', hex: '#18181b' }
    ],
    description: 'Timeless luxury tote handbag with golden brass hardware, dual rolled leather carry handles, and magnetic zipper closures. Engineered to age with an exquisite natural patina.',
    features: [
      'Full-grain vegetable tanned finish that patinas with wear',
      'Reinforced base studs for structural protection on surfaces',
      'Dedicated padded tech sleeve and zip organizer pockets',
      'Detachable and adjustable padded leather shoulder strap'
    ],
    bestFor: 'Work, travel, evening events, upscale boutique shopping',
    ecoImpact: 'Zero toxic chrome tanning agents used; 100% circular biological leather recovery',
    inStock: true,
    leadTime: 'In Stock - Dispatches in 24 hours',
    volumeTiers: [
      { minQty: 1, price: 59.99 },
      { minQty: 5, price: 52.99 },
      { minQty: 25, price: 46.99 }
    ],
    image: '/images/leather-handbag.jpg',
    badge: 'NEW'
  },
  {
    id: 'prod-classic-sneakers',
    name: 'Classic Sneakers',
    category: 'men',
    categoryLabel: 'Sustainable Footwear',
    subtitle: 'Low-top minimalist tennis sneakers crafted with bio-leather and wild Amazonian rubber',
    pricePerUnit: 49.99,
    moq: 1,
    gsm: 200,
    dimensions: 'US Men 7 - 13 / EU 40 - 46',
    material: 'Certified Vegan Bio-Leather Upper & Natural Wild Rubber Sole',
    capacity: 'All-Day Orthotic Support',
    certifications: ['PETA-Approved Vegan', 'FSC Certified Rubber', 'B-Corp Certified'],
    availableColors: [
      { name: 'Crisp Studio White', hex: '#ffffff' },
      { name: 'White & Emerald Accent', hex: '#166534' }
    ],
    description: 'Clean, versatile silhouette that effortlessly transitions from tailored suits to casual denim. Ergonomic recycled EVA insole provides cloud-like cushioning all day.',
    features: [
      'Scuff-resistant bio-leather upper that wipes clean easily',
      'Vulcanized natural rubber cupsole with superior wet traction',
      'Removable contoured arch-support orthotic insole',
      'Waxed organic cotton laces with reinforced eyelets'
    ],
    bestFor: 'Urban walking, business casual office, weekend strolls',
    ecoImpact: 'Reduces carbon emissions by 65% compared to synthetic polyurethane sneakers',
    inStock: true,
    leadTime: 'Immediate Dispatch',
    volumeTiers: [
      { minQty: 1, price: 49.99 },
      { minQty: 10, price: 42.99 },
      { minQty: 50, price: 38.99 }
    ],
    image: '/images/classic-sneakers.jpg',
    badge: 'NEW'
  },
  {
    id: 'prod-eau-de-parfum',
    name: 'Eau de Parfum',
    category: 'beauty',
    categoryLabel: 'Botanical Fine Fragrance',
    subtitle: 'Artisanal organic botanical fragrance with amber, sandalwood and floral notes',
    pricePerUnit: 29.99,
    moq: 1,
    gsm: 100,
    dimensions: '50 ml / 1.7 fl. oz. Spray Flacon',
    material: 'Organic Sugar Cane Alcohol & 100% Pure Botanical Extracts',
    capacity: '50 ml Glass Flacon',
    certifications: ['Leaping Bunny Cruelty-Free', 'IFRA Certified', 'Zero Phthalates & Parabens'],
    availableColors: [
      { name: 'Golden Amber Essence', hex: '#d97706' }
    ],
    description: 'Captivating sensual blend of warm golden amber, sun-drenched bergamot, velvet jasmine petals, and creamy sustainable Mysore sandalwood. Long-lasting 10-hour sillage.',
    features: [
      'Infused with 22% concentrated natural botanical parfum oils',
      'Clean formulation with zero synthetic endocrine disruptors',
      'Fine Italian glass flacon with magnetic gold-plated cap',
      'Eco-conscious refillable bottle design'
    ],
    bestFor: 'Signature daily fragrance, special occasions, luxury gifting',
    ecoImpact: 'Harvested from sustainably managed ethical cooperatives with 100% biodegradable essence',
    inStock: true,
    leadTime: 'Immediate Dispatch',
    volumeTiers: [
      { minQty: 1, price: 29.99 },
      { minQty: 5, price: 26.99 },
      { minQty: 25, price: 22.99 }
    ],
    image: '/images/eau-de-parfum.jpg',
    badge: 'NEW'
  },
  {
    id: 'eco-tshirt-bag',
    name: 'Eco-Loop Reusable T-Shirt Bag',
    category: 't-shirt',
    categoryLabel: 'Reusable T-Shirt Bags',
    subtitle: 'The modern eco-alternative to grocery supermarket single-use plastic bags',
    pricePerUnit: 0.18,
    moq: 1000,
    gsm: 45,
    dimensions: '11.5"W x 21"H x 6.5" Gusset',
    material: 'Virgin & Pre-Consumer Recycled Polypropylene (Non-Woven)',
    capacity: 'Up to 22 lbs (10 kg)',
    certifications: ['100% Recyclable', 'FDA Food Contact Safe', 'Lead & Heavy Metal Free'],
    availableColors: [
      { name: 'Forest Green', hex: '#1b4329' },
      { name: 'Olive Green', hex: '#7ea242' },
      { name: 'Natural Sand', hex: '#e8e2d5' },
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Midnight Charcoal', hex: '#262626' }
    ],
    description: 'Engineered specifically for supermarkets, convenience chains, and retail grocers aiming to comply with single-use plastic bans without blowing operating budgets. Ultrasonic heat-sealed handles offer extraordinary tensile strength.',
    features: [
      'Reusable over 125+ trips under ASTM testing',
      'Ultrasonic heat-welded seams prevent bottom bursting',
      'Water-repellent and easily wipe-clean interior',
      'High-speed flexographic custom branding available'
    ],
    bestFor: 'Grocery stores, supermarkets, takeout food, farmers markets',
    ecoImpact: 'Replaces ~300 standard single-use plastic grocery sacks over lifetime',
    inStock: true,
    leadTime: '3-5 business days for blank stock, 2-3 weeks for custom printed',
    volumeTiers: [
      { minQty: 1000, price: 0.22 },
      { minQty: 5000, price: 0.19 },
      { minQty: 10000, price: 0.18 },
      { minQty: 50000, price: 0.15 }
    ]
  },
  {
    id: 'eco-dcut-biodegradable',
    name: 'Compostable Bio-Corn D-Cut Bag',
    category: 'biodegradable',
    categoryLabel: 'Biodegradable & Compostable',
    subtitle: '100% plant-based PLA & PBAT bag certified for home and industrial composting',
    pricePerUnit: 0.28,
    moq: 1000,
    gsm: 55,
    dimensions: '12"W x 15"H with 3" Bottom Gusset',
    material: 'Cornstarch-derived PLA (Polylactic Acid) & PBAT Blend',
    capacity: 'Up to 15 lbs (7 kg)',
    certifications: ['OK Compost HOME', 'BPI Certified', 'ASTM D6400', 'EN 13432'],
    availableColors: [
      { name: 'Natural Earth Tint', hex: '#d9d5c5' },
      { name: 'Soft Olive', hex: '#8ea853' },
      { name: 'Botanical Sage', hex: '#5b8250' }
    ],
    description: 'Crafted from renewable corn and plant starches, this silky-soft matte die-cut handle bag breaks down into organic biomass and water in soil within 180 days. Zero toxic microplastics left behind.',
    features: [
      'Silky, non-crinkling soft matte handfeel',
      'Smooth die-cut oval handle reinforced for comfortable carrying',
      'Printed with water-based soy and algae inks',
      'Composts in commercial municipal compost facilities in 90 days'
    ],
    bestFor: 'Apparel boutiques, organic bakeries, lifestyle brands, trade exhibitions',
    ecoImpact: '100% bio-based carbon, complete soil return with zero microplastics',
    inStock: true,
    leadTime: '4-7 business days for stock, 3 weeks for custom printing',
    volumeTiers: [
      { minQty: 1000, price: 0.34 },
      { minQty: 5000, price: 0.30 },
      { minQty: 10000, price: 0.28 },
      { minQty: 25000, price: 0.24 }
    ]
  },
  {
    id: 'eco-tote-heavy-duty',
    name: 'Signature Box-Tote Heavy-Duty Shopper',
    category: 'non-woven',
    categoryLabel: 'Non-Woven Totes',
    subtitle: 'Reinforced 80 GSM non-woven polypropylene tote with full side gussets & cross-stitched handles',
    pricePerUnit: 0.42,
    moq: 500,
    gsm: 80,
    dimensions: '13"W x 15"H x 8" Deep Gusset',
    material: 'Premium 80 GSM Polypropylene Non-Woven Fabric with Removable Bottom Board',
    capacity: 'Up to 35 lbs (16 kg)',
    certifications: ['GRS Certified', 'CalRecycle Reusable Compliant (125+ uses)', 'OEKO-TEX Standard 100'],
    availableColors: [
      { name: 'Ecotex Forest', hex: '#1b4329' },
      { name: 'Eco Olive', hex: '#77933c' },
      { name: 'Navy Blue', hex: '#1e3a5f' },
      { name: 'Warm Cream', hex: '#f0ece1' },
      { name: 'Ruby Clay', hex: '#993d3d' }
    ],
    description: 'The industry-standard retail powerhouse. Built with extra-long 22" cross-stitched webbed handles that slip comfortably over the shoulder, with an 8-inch deep gusset designed to hold rigid grocery boxes, apparel, and hardware goods.',
    features: [
      'Includes recycled PE stiffener bottom insert for upright standing',
      'Double X-box reinforced handle stitching prevents tear-out',
      'Washable and sanitized with simple antibacterial wipes',
      'Massive two-sided printing surface (10" x 10" print window)'
    ],
    bestFor: 'Supermarkets, department stores, university bookshops, promotional events',
    ecoImpact: 'Certified to endure 200+ heavy grocery loads, preventing 400+ plastic bags',
    inStock: true,
    leadTime: 'Immediate shipping for blank stock; 10-14 days for branded',
    volumeTiers: [
      { minQty: 500, price: 0.52 },
      { minQty: 2000, price: 0.46 },
      { minQty: 5000, price: 0.42 },
      { minQty: 20000, price: 0.36 }
    ]
  },
  {
    id: 'eco-laminated-gift-bag',
    name: 'Gloss & Matte Laminated Eco Gift Tote',
    category: 'gift-bags',
    categoryLabel: 'Reusable Gift Bags',
    subtitle: 'Waterproof, tear-resistant photo-grade laminated reusable bag for upscale retail & corporate gifting',
    pricePerUnit: 0.65,
    moq: 500,
    gsm: 110,
    dimensions: '10"W x 12"H x 4"D with Soft Woven Poly Handles',
    material: 'Laminated Non-Woven Polypropylene with Recycled BOPP Film Barrier',
    capacity: 'Up to 28 lbs (13 kg)',
    certifications: ['Waterproof Grade 4', 'FDA Food Contact Safe', 'Prop 65 Compliant'],
    availableColors: [
      { name: 'High-Gloss Emerald', hex: '#164a27' },
      { name: 'Matte Earth Olive', hex: '#6b8337' },
      { name: 'Champagne Pearl', hex: '#e8dfcb' },
      { name: 'Onyx Black', hex: '#1a1a1a' }
    ],
    description: 'Combines the reusability of non-woven fabric with the vivid, photographic color reproduction of rotogravure laminated film. Spills wipe off effortlessly, and the structure holds crisp folds for high-end boutique presentations.',
    features: [
      'Edge-to-edge full bleed photographic 4-color print capability',
      'Moisture-proof barrier prevents contents from rain or leaking bottles',
      'Premium tubular soft-touch handles for comfortable hand grip',
      'Rigid turn-top rim for clean structural silhouette'
    ],
    bestFor: 'Wine & spirits merchants, cosmetic brands, conferences, corporate gift bundles',
    ecoImpact: 'Keeps gift recipients from using disposable single-use holiday wrap',
    inStock: true,
    leadTime: 'Stock items ship in 48 hours; custom full-print in 3 weeks',
    volumeTiers: [
      { minQty: 500, price: 0.79 },
      { minQty: 2500, price: 0.70 },
      { minQty: 5000, price: 0.65 },
      { minQty: 15000, price: 0.55 }
    ]
  },
  {
    id: 'eco-insulated-cooler-bag',
    name: 'Thermal insulated Non-Woven Grocery Bag',
    category: 'non-woven',
    categoryLabel: 'Non-Woven Totes',
    subtitle: 'Triple-layer insulated thermal bag keeping perishables cold for up to 4 hours',
    pricePerUnit: 1.15,
    moq: 300,
    gsm: 120,
    dimensions: '12"W x 14"H x 7"D with Full Zipper Closure',
    material: 'Outer 90 GSM Non-Woven + 2mm EPE Foam Core + Reflective Aluminum Film Lining',
    capacity: 'Up to 30 lbs (holds six 750ml bottles or 16 beverage cans)',
    certifications: ['Food Contact Grade Aluminum', 'Lead Free', 'Thermal Tested ASTM F2111'],
    availableColors: [
      { name: 'Deep Spruce', hex: '#193e25' },
      { name: 'Classic Olive', hex: '#77933c' },
      { name: 'Steel Slate', hex: '#374151' },
      { name: 'Ocean Navy', hex: '#1e3a5f' }
    ],
    description: 'Designed for cold chain grocery pickup, pharmaceutical delivery, and catering. Features a heavy-duty zipper closure and reflective interior lining that locks in temperatures for over 4 hours.',
    features: [
      'Heavy-duty nylon zipper with smooth metal pull',
      'Leak-resistant ultrasonic welded interior corners',
      'Reinforced perimeter binding tape for longevity',
      'Collapses completely flat for compact trunk storage'
    ],
    bestFor: 'Meal kit delivery, gourmet deli counters, frozen grocery pickup, seafood markets',
    ecoImpact: 'Replaces EPS Styrofoam shipping coolers and disposable silver insulation bubble mailers',
    inStock: true,
    leadTime: '1-3 days for blank, 2-3 weeks for branded',
    volumeTiers: [
      { minQty: 300, price: 1.45 },
      { minQty: 1000, price: 1.25 },
      { minQty: 3000, price: 1.15 },
      { minQty: 10000, price: 0.98 }
    ]
  },
  {
    id: 'eco-industrial-wiping-rags',
    name: 'CircuTex™ Reclaimed Industrial Wiping Cloths',
    category: 'recycled-textiles',
    categoryLabel: 'Recycled Industrial Textiles',
    subtitle: '100% pre-laundered recycled cotton wiping rags for automotive, maintenance & printshops',
    pricePerUnit: 1.85, // per 5 lb compressed bale
    moq: 10, // 10 boxes (50 lbs)
    gsm: 160,
    dimensions: 'Mixed Cuts: ~16" x 16" to 18" x 20" Average',
    material: '100% Reclaimed Post-Consumer & Post-Industrial Cotton Knit',
    capacity: 'Absorbs 4x its weight in oils, coolants, and solvents',
    certifications: ['Clean Green Certified', 'Zero Metal Contaminants Tested', 'Low-Lint Spec'],
    availableColors: [
      { name: 'Mixed Heather / White Cotton', hex: '#e3dfd3' },
      { name: 'Dark Indigo & Grey Cotton', hex: '#404952' }
    ],
    description: 'Our circular textile division diverts thousands of tons of discarded post-industrial cotton jerseys from landfills. Stripped of all buttons, zippers, and hard fasteners, then washed and compressed into efficient 5-lb, 25-lb, and 50-lb dispensing cartons.',
    features: [
      'Metal-detector passed for total workshop safety',
      'Pre-washed and sanitarily dried for immediate maximum absorbency',
      'Low-lint performance ideal for glass, tooling, and screen cleaning',
      'Significant cost savings vs disposable blue shop towels'
    ],
    bestFor: 'Auto repair shops, CNC machining, screen printers, aerospace paint booths, facilities',
    ecoImpact: 'Diverts 1.2 tons of textile waste per 1,000 lbs of rags consumed',
    inStock: true,
    leadTime: 'Same-day dispatch from our Corona, CA warehouse',
    volumeTiers: [
      { minQty: 10, price: 2.25 },
      { minQty: 50, price: 1.95 },
      { minQty: 200, price: 1.85 },
      { minQty: 1000, price: 1.55 }
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Catalog', count: 6 },
  { id: 'non-woven', label: 'Non-Woven Totes', count: 2 },
  { id: 'biodegradable', label: 'Biodegradable D-Cut', count: 1 },
  { id: 'gift-bags', label: 'Laminated Gift Bags', count: 1 },
  { id: 't-shirt', label: 'Reusable T-Shirt Bags', count: 1 },
  { id: 'recycled-textiles', label: 'Recycled Textiles & Rags', count: 1 }
];

export const CERTIFICATIONS = [
  {
    name: 'GRS Certified',
    standard: 'Global Recycled Standard 4.0',
    description: 'Verifies recycled content across chain of custody with social and environmental criteria.'
  },
  {
    name: 'ASTM D6400',
    standard: 'Standard Spec for Solid Biodegradable Plastics',
    description: 'Confirms material breaks down completely without toxic residues in industrial compost.'
  },
  {
    name: 'FDA 21 CFR 177',
    standard: 'Direct Food Contact Safety',
    description: 'Ensures polymers and pigments are safe for fresh produce and grocery groceries.'
  },
  {
    name: 'CalRecycle Compliant',
    standard: 'California SB 270 Standard',
    description: 'Certified to endure 125+ washings/uses without degradation or handle failure.'
  }
];

export const ENTERPRISE_TESTIMONIALS = [
  {
    quote: "Switching our 42 regional grocery locations to Ecotex's reinforced non-woven t-shirt bags reduced our packaging overhead by 28% while helping us exceed state single-use plastic mandates ahead of deadline.",
    author: "Elena Vasquez",
    role: "Director of Retail Supply Chain",
    company: "SunWest Markets California",
    metric: "1.4M Plastic Bags Displaced"
  },
  {
    quote: "Our boutique clients expect sustainability without sacrificing luxury presentation. The custom laminated matte bags with our gold foil logo delivered an unmistakable premium tactile feel that our shoppers reuse daily.",
    author: "Marcus Vance",
    role: "VP of Brand Operations",
    company: "Artisan Living Brands",
    metric: "100% Brand Retention Rating"
  },
  {
    quote: "Ecotex's reclaimed wiping rags have completely replaced disposable synthetic towels in our Corona maintenance fleet. High absorbency, low lint, and reliable delivery right out of their Southern California warehouse.",
    author: "Derrick Chen",
    role: "Fleet Maintenance Operations",
    company: "Inland Fleet Systems",
    metric: "40% Cost Savings vs Disposables"
  }
];
