export interface DyeColor {
  id: string;
  name: string;
  hex: string;
  borderColor?: string;
  bestFor: string;
  recommendedPrint: string;
  textColor?: string;
}

export const DYE_COLORS: DyeColor[] = [
  {
    id: 'white',
    name: 'White',
    hex: '#FFFFFF',
    borderColor: '#cbd5e1',
    bestFor: 'Pharmacy, Medical, Luxury Retail',
    recommendedPrint: 'Any color (High contrast for intricate logos)',
    textColor: '#0f172a'
  },
  {
    id: 'black',
    name: 'Black',
    hex: '#18181b',
    borderColor: '#27272a',
    bestFor: 'Electronics, Apparel, Premium Branding',
    recommendedPrint: 'White, Silver, Gold, Neon colors',
    textColor: '#ffffff'
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    hex: '#2563eb',
    borderColor: '#1d4ed8',
    bestFor: 'Corporate Events, Tech Brands, Exhibitions',
    recommendedPrint: 'White, Silver, Yellow',
    textColor: '#ffffff'
  },
  {
    id: 'red',
    name: 'Red',
    hex: '#dc2626',
    borderColor: '#b91c1c',
    bestFor: 'Festive Sales, Food Outlets, E-commerce',
    recommendedPrint: 'White, Black, Yellow',
    textColor: '#ffffff'
  },
  {
    id: 'dark-green',
    name: 'Dark Green',
    hex: '#166534',
    borderColor: '#14532d',
    bestFor: 'Eco-friendly Campaigns, Organic Brands',
    recommendedPrint: 'White, Cream, Light Yellow',
    textColor: '#ffffff'
  },
  {
    id: 'navy-blue',
    name: 'Navy Blue',
    hex: '#1e3a8a',
    borderColor: '#172554',
    bestFor: 'Banks, Corporate Gifting, Seminars',
    recommendedPrint: 'White, Gold, Light Blue',
    textColor: '#ffffff'
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#eab308',
    borderColor: '#ca8a04',
    bestFor: "Supermarkets, Bakeries, Kid's Brands",
    recommendedPrint: 'Black, Red, Dark Blue',
    textColor: '#0f172a'
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#ea580c',
    borderColor: '#c2410c',
    bestFor: 'Promotional Giveaways, Sports Events',
    recommendedPrint: 'Black, White, Dark Blue',
    textColor: '#ffffff'
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    hex: '#38bdf8',
    borderColor: '#0284c7',
    bestFor: 'Healthcare, Travel, Summer Promos',
    recommendedPrint: 'Navy Blue, White, Black',
    textColor: '#0f172a'
  },
  {
    id: 'beige-cream',
    name: 'Beige / Cream',
    hex: '#f5ecd7',
    borderColor: '#d6c7a1',
    bestFor: 'Boutiques, Cosmetic Brands, Eco-Aesthetics',
    recommendedPrint: 'Dark Brown, Forest Green, Black',
    textColor: '#0f172a'
  }
];
