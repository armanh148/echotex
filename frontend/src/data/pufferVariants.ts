export interface ProductVariant {
  id: string;
  colorName: string;
  colorLabel: string;
  themeColor: string;
  isLight: boolean;
  price: number;
  originalPrice: number;
  heroImage: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  sizes: string[];
  specs: {
    fillPower: string;
    waterproof: string;
    temperature: string;
  };
}

export const PRODUCT_VARIANTS: ProductVariant[] = [
  {
    id: 'variant-orange',
    colorName: 'Terracotta Ochre',
    colorLabel: 'Orange',
    themeColor: '#c44f12',
    isLight: false,
    price: 149,
    originalPrice: 199,
    heroImage: '/images/bag-orange.png',
    title: 'Stand out Without trying',
    subtitle: "It's not just about staying warm. It's about stepping outside and instantly feeling confident, comfortable, and completely yourself.",
    tagline: 'Confidence, wrapped in warmth',
    badge: 'SIGNATURE · AW26',
    sizes: ['36', '38', '40', '42'],
    specs: {
      fillPower: '800+ Goose Down',
      waterproof: 'DWR Ripstop 20K',
      temperature: '-15°C Arctic Tested',
    },
  },
  {
    id: 'variant-white',
    colorName: 'Pristine Alpine',
    colorLabel: 'Pristine White',
    themeColor: '#e5e7eb',
    isLight: true,
    price: 149,
    originalPrice: 199,
    heroImage: '/images/bag-white.png',
    title: 'Stand out Without trying',
    subtitle: "Pure minimalist insulation engineered with ultra-dense micro-baffles and zero visual noise for effortless arctic elegance.",
    tagline: 'Confidence, wrapped in warmth',
    badge: 'LIMITED EDITION · BLANC',
    sizes: ['36', '38', '40', '42'],
    specs: {
      fillPower: '850+ Pure White Down',
      waterproof: 'Nano-Shield Hydrophobic',
      temperature: '-20°C Summit Tested',
    },
  },
  {
    id: 'variant-charcoal',
    colorName: 'Deep Obsidian',
    colorLabel: 'Obsidian Black',
    themeColor: '#18181b',
    isLight: false,
    price: 159,
    originalPrice: 209,
    heroImage: '/images/bag-black.png',
    title: 'Stand out Without trying',
    subtitle: "Stealth weather protection coated with matte textured ripstop weave. Designed for midnight cityscapes and untamed sub-zero winds.",
    tagline: 'Confidence, wrapped in warmth',
    badge: 'BLACKOUT · TECHWEAR',
    sizes: ['36', '38', '40', '42'],
    specs: {
      fillPower: '800+ Thermal Core',
      waterproof: 'Carbon Matte Weave',
      temperature: '-18°C Sub-Zero Rated',
    },
  },
  {
    id: 'variant-green',
    colorName: 'Forest Emerald',
    colorLabel: 'Forest Green',
    themeColor: '#1b4329',
    isLight: false,
    price: 149,
    originalPrice: 199,
    heroImage: '/images/bag-green.png',
    title: 'Stand out Without trying',
    subtitle: "A statement silhouette saturated in rich carmine pigment. High-loft down chambers delivering supreme warmth and unmistakable presence.",
    tagline: 'Confidence, wrapped in warmth',
    badge: 'ECOTEX · FOREST',
    sizes: ['36', '38', '40', '42'],
    specs: {
      fillPower: '800+ Ultra Loft',
      waterproof: 'Storm-Barrier DWR',
      temperature: '-15°C Cold Defiance',
    },
  },
  {
    id: 'variant-blue',
    colorName: 'Oceanic Navy',
    colorLabel: 'Navy Blue',
    themeColor: '#1e3a5f',
    isLight: false,
    price: 149,
    originalPrice: 199,
    heroImage: '/images/bag-blue.png',
    title: 'Stand out Without trying',
    subtitle: "Triple-reinforced heavy duty shopping tote built with contrast webbed handles and certified circular lifecycle performance.",
    tagline: 'Confidence, wrapped in warmth',
    badge: 'PREMIUM · NAVY',
    sizes: ['36', '38', '40', '42'],
    specs: {
      fillPower: '800+ Ultra Loft',
      waterproof: 'Storm-Barrier DWR',
      temperature: '-15°C Cold Defiance',
    },
  },
];
