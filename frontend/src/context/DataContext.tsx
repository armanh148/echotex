import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, QuoteSubmission, SiteSettings, CategoryItem } from '../types';
import { apiService, DashboardStats } from '../services/apiService';
import { PRODUCTS } from '../data/products';
import { useStore } from '../store/useStore';

interface DataContextType {
  products: Product[];
  categories: CategoryItem[];
  settings: SiteSettings;
  orders: Order[];
  quotes: QuoteSubmission[];
  stats: DashboardStats | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<Product>;
  editProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  removeProduct: (id: string) => Promise<void>;
  toggleStock: (id: string) => Promise<void>;
  addCategory: (category: Partial<CategoryItem>) => Promise<CategoryItem>;
  editCategory: (id: string, updates: Partial<CategoryItem>) => Promise<CategoryItem>;
  removeCategory: (id: string) => Promise<void>;
  saveSettings: (updates: Partial<SiteSettings>) => Promise<SiteSettings>;
  changeOrderStatus: (id: string, status: string) => Promise<void>;
  removeOrder: (id: string) => Promise<void>;
  changeQuoteStatus: (id: string, status: string) => Promise<void>;
  removeQuote: (id: string) => Promise<void>;
  submitOrder: (order: Partial<Order>) => Promise<Order>;
  submitQuote: (quote: Partial<QuoteSubmission>) => Promise<QuoteSubmission>;
  resetToFactory: () => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'Ecotex Inc.',
  tagline: 'Certified Sustainable Wholesale Packaging Direct From Manufacturer',
  heroTitle: 'Industrial-Scale Sustainable Packaging',
  heroSubtitle: 'Custom engineered non-woven, bio-compostable and laminated wholesale carrier bags for retail chains, distributors, and global brands.',
  announcement: '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility',
  phone: '(951) 555-ECOTEX',
  email: 'orders@ecotexinc.com',
  facilityAddress: '1200 Industrial Parkway, Corona, CA 92881',
  minOrderNotice: 'Free pallet freight on continental US orders over $1,000',
  leadTimeBlank: '2-4 Business Days',
  leadTimeCustom: '10-14 Business Days'
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    label: 'All Collections',
    subtitle: 'Complete Catalog',
    tag: '64 STYLES',
    count: '64 Models',
    image: '/images/bag-green.png',
    description: 'Explore our full manufacturing catalog of certified eco-friendly industrial & retail packaging with wholesale pricing tiers.'
  },
  {
    id: 't-shirt',
    label: 'T-Shirt Bags',
    subtitle: 'High-Volume Retail',
    tag: 'REUSABLE',
    count: '12 Models',
    image: '/images/bag-green.png',
    description: 'High-tensile vest-handle grocery & supermarket bags engineered for high load bearing and fast automated packaging.'
  },
  {
    id: 'non-woven',
    label: 'Non-Woven Totes',
    subtitle: 'Boutique & Retail',
    tag: 'HEAVY DUTY',
    count: '18 Models',
    image: '/images/bag-white.png',
    description: 'Ultrasonic-welded & cross-stitched shopping carriers with optional gloss/matte lamination and custom flexo printing.'
  },
  {
    id: 'd-cut',
    label: 'D-Cut Punch Bags',
    subtitle: 'Die-Cut Luxury Flat',
    tag: 'BIO-PLA / POLY',
    count: '14 Models',
    image: '/images/bag-orange.png',
    description: 'Clean oval die-cut handle bags ideal for fashion apparel, trade exhibitions, and luxury retail counters.'
  },
  {
    id: 'slider',
    label: 'Slider Zipper Bags',
    subtitle: 'Airtight Seal & Zip',
    tag: 'WATERPROOF',
    count: '9 Models',
    image: '/images/bag-blue.png',
    description: 'Resealable frosted EVA and transparent PE slider zipper pouches for garment protection, dry goods, and cosmetics.'
  },
  {
    id: 'food',
    label: 'Food Item Bags',
    subtitle: 'Cold-Chain & Fresh',
    tag: 'FDA FOOD-GRADE',
    count: '11 Models',
    image: '/images/bag-black.png',
    description: 'Thermal insulated multi-layer foil bags and grease-resistant carriers tested for food-contact compliance and temperature retention.'
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [prodsRes, catsRes, setsRes, ordsRes, qtsRes, statsRes] = await Promise.allSettled([
        apiService.getProducts(),
        apiService.getCategories(),
        apiService.getSettings(),
        apiService.getOrders(),
        apiService.getQuotes(),
        apiService.getStats()
      ]);

      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value)) {
        setProducts(prodsRes.value);
        useStore.setState({ products: prodsRes.value });
        try { localStorage.setItem('ecotex_products', JSON.stringify(prodsRes.value)); } catch {}
      }
      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) {
        setCategories(catsRes.value);
        useStore.setState({ categories: catsRes.value });
        try { localStorage.setItem('ecotex_categories', JSON.stringify(catsRes.value)); } catch {}
      }
      if (setsRes.status === 'fulfilled' && setsRes.value) {
        setSettings(setsRes.value);
        useStore.setState((state) => ({ 
          siteSettings: { ...state.siteSettings, ...setsRes.value },
          heroConfig: setsRes.value.heroConfig ? { ...state.heroConfig, ...setsRes.value.heroConfig } : state.heroConfig
        }));
        try { localStorage.setItem('ecotex_site_settings', JSON.stringify(setsRes.value)); } catch {}
      }
      if (ordsRes.status === 'fulfilled' && Array.isArray(ordsRes.value)) {
        setOrders(ordsRes.value);
        useStore.setState({ orders: ordsRes.value });
        try { localStorage.setItem('ecotex_orders', JSON.stringify(ordsRes.value)); } catch {}
      }
      if (qtsRes.status === 'fulfilled' && Array.isArray(qtsRes.value)) {
        setQuotes(qtsRes.value);
        useStore.setState({ quotes: qtsRes.value });
        try { localStorage.setItem('ecotex_quotes', JSON.stringify(qtsRes.value)); } catch {}
      }
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value);
        useStore.setState((state) => ({
          analytics: {
            ...state.analytics,
            totalOrdersCount: typeof statsRes.value.totalOrders === 'number' ? statsRes.value.totalOrders : state.analytics.totalOrdersCount,
            grossRevenue: typeof statsRes.value.grossRevenue === 'number' ? statsRes.value.grossRevenue : state.analytics.grossRevenue,
            quoteRequestsCount: typeof statsRes.value.totalQuotes === 'number' ? statsRes.value.totalQuotes : state.analytics.quoteRequestsCount,
            bagsDisplaced: typeof statsRes.value.bagsDisplacedEstimate === 'number' ? statsRes.value.bagsDisplacedEstimate : state.analytics.bagsDisplaced
          }
        }));
      }
    } catch (err) {
      console.warn('Backend API sync fallback, serving cached/static data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addProduct = async (productData: Partial<Product>) => {
    const created = await apiService.createProduct(productData);
    setProducts(prev => [created, ...prev]);
    useStore.setState((state) => {
      const updated = [created, ...state.products.filter(p => p.id !== created.id)];
      try { localStorage.setItem('ecotex_products', JSON.stringify(updated)); } catch {}
      return { products: updated };
    });
    refreshData();
    return created;
  };

  const editProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await apiService.updateProduct(id, updates);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    useStore.setState((state) => {
      const prods = state.products.map(p => p.id === id ? { ...p, ...updated } : p);
      try { localStorage.setItem('ecotex_products', JSON.stringify(prods)); } catch {}
      return { products: prods };
    });
    refreshData();
    return updated;
  };

  const removeProduct = async (id: string) => {
    await apiService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    useStore.setState((state) => {
      const prods = state.products.filter(p => p.id !== id);
      try { localStorage.setItem('ecotex_products', JSON.stringify(prods)); } catch {}
      return { products: prods };
    });
    refreshData();
  };

  const toggleStock = async (id: string) => {
    const updated = await apiService.toggleStock(id);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    useStore.setState((state) => {
      const prods = state.products.map(p => p.id === id ? updated : p);
      try { localStorage.setItem('ecotex_products', JSON.stringify(prods)); } catch {}
      return { products: prods };
    });
  };

  const addCategory = async (catData: Partial<CategoryItem>) => {
    const created = await apiService.createCategory(catData);
    setCategories(prev => [...prev, created]);
    useStore.setState((state) => {
      const cats = [...state.categories, created];
      try { localStorage.setItem('ecotex_categories', JSON.stringify(cats)); } catch {}
      return { categories: cats };
    });
    return created;
  };

  const editCategory = async (id: string, updates: Partial<CategoryItem>) => {
    const updated = await apiService.updateCategory(id, updates);
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    useStore.setState((state) => {
      const cats = state.categories.map(c => c.id === id ? { ...c, ...updated } : c);
      try { localStorage.setItem('ecotex_categories', JSON.stringify(cats)); } catch {}
      return { categories: cats };
    });
    return updated;
  };

  const removeCategory = async (id: string) => {
    await apiService.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    useStore.setState((state) => {
      const cats = state.categories.filter(c => c.id !== id);
      try { localStorage.setItem('ecotex_categories', JSON.stringify(cats)); } catch {}
      return { categories: cats };
    });
  };

  const saveSettings = async (updates: Partial<SiteSettings>) => {
    const updated = await apiService.updateSettings(updates);
    setSettings(updated);
    useStore.getState().updateSiteSettings(updated);
    return updated;
  };

  const changeOrderStatus = async (id: string, status: string) => {
    const updated = await apiService.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
    useStore.setState((state) => {
      const ords = state.orders.map(o => o.id === id ? updated : o);
      try { localStorage.setItem('ecotex_orders', JSON.stringify(ords)); } catch {}
      return { orders: ords };
    });
    refreshData();
  };

  const removeOrder = async (id: string) => {
    await apiService.deleteOrder(id);
    setOrders(prev => prev.filter(o => o.id !== id));
    useStore.setState((state) => {
      const ords = state.orders.filter(o => o.id !== id);
      try { localStorage.setItem('ecotex_orders', JSON.stringify(ords)); } catch {}
      return { orders: ords };
    });
    refreshData();
  };

  const changeQuoteStatus = async (id: string, status: string) => {
    const updated = await apiService.updateQuoteStatus(id, status);
    setQuotes(prev => prev.map(q => q.id === id ? updated : q));
    useStore.setState((state) => {
      const qts = state.quotes.map(q => q.id === id ? updated : q);
      try { localStorage.setItem('ecotex_quotes', JSON.stringify(qts)); } catch {}
      return { quotes: qts };
    });
    refreshData();
  };

  const removeQuote = async (id: string) => {
    await apiService.deleteQuote(id);
    setQuotes(prev => prev.filter(q => q.id !== id));
    useStore.setState((state) => {
      const qts = state.quotes.filter(q => q.id !== id);
      try { localStorage.setItem('ecotex_quotes', JSON.stringify(qts)); } catch {}
      return { quotes: qts };
    });
    refreshData();
  };

  const submitOrder = async (orderData: Partial<Order>) => {
    const created = await apiService.createOrder(orderData);
    setOrders(prev => [created, ...prev]);
    useStore.setState((state) => {
      const existingIdx = state.orders.findIndex(o => o.id === created.id);
      const updated = existingIdx >= 0 
        ? state.orders.map(o => o.id === created.id ? created : o)
        : [created, ...state.orders];
      try { localStorage.setItem('ecotex_orders', JSON.stringify(updated)); } catch {}
      return { 
        orders: updated,
        analytics: {
          ...state.analytics,
          totalOrdersCount: updated.length,
          grossRevenue: state.analytics.grossRevenue + (Number(created.total || created.totalAmount) || 0)
        }
      };
    });
    refreshData();
    return created;
  };

  const submitQuote = async (quoteData: Partial<QuoteSubmission>) => {
    const created = await apiService.createQuote(quoteData);
    setQuotes(prev => [created, ...prev]);
    useStore.setState((state) => {
      const existingIdx = state.quotes.findIndex(q => q.id === created.id);
      const updated = existingIdx >= 0
        ? state.quotes.map(q => q.id === created.id ? created : q)
        : [created, ...state.quotes];
      try { localStorage.setItem('ecotex_quotes', JSON.stringify(updated)); } catch {}
      return { 
        quotes: updated,
        analytics: {
          ...state.analytics,
          quoteRequestsCount: updated.length
        }
      };
    });
    refreshData();
    return created;
  };

  const resetToFactory = async () => {
    await apiService.resetDatabase();
    await refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        settings,
        orders,
        quotes,
        stats,
        loading,
        refreshData,
        addProduct,
        editProduct,
        removeProduct,
        toggleStock,
        addCategory,
        editCategory,
        removeCategory,
        saveSettings,
        changeOrderStatus,
        removeOrder,
        changeQuoteStatus,
        removeQuote,
        submitOrder,
        submitQuote,
        resetToFactory
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
