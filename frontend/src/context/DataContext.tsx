import React, { createContext, useContext, ReactNode } from 'react';
import { Product, Order, QuoteSubmission, SiteSettings, CategoryItem } from '../types';
import { DashboardStats } from '../services/apiService';
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

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const settings = useStore((state) => state.siteSettings);
  const orders = useStore((state) => state.orders);
  const quotes = useStore((state) => state.quotes);
  const analytics = useStore((state) => state.analytics);

  const stats: DashboardStats = {
    totalProducts: products.length,
    inStockProducts: products.filter(p => p.inStock !== false).length,
    totalOrders: orders.length,
    grossRevenue: analytics.grossRevenue,
    totalQuotes: quotes.length,
    pendingQuotes: quotes.filter(q => q.status === 'New').length,
    totalCategories: categories.filter(c => c.id !== 'all').length,
    bagsDisplacedEstimate: analytics.bagsDisplaced || 50000000
  };

  const refreshData = async () => {
    await useStore.getState().fetchAllData();
  };

  const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    const store = useStore.getState();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || 'New Custom Carrier Bag',
      category: productData.category || 'non-woven',
      categoryLabel: productData.categoryLabel || 'Non-Woven Totes',
      subtitle: productData.subtitle || '',
      pricePerUnit: productData.pricePerUnit || 0.25,
      moq: productData.moq || 1000,
      pcsPerBox: productData.pcsPerBox || 200,
      stockQuantity: productData.stockQuantity || 50,
      gsm: productData.gsm || 80,
      dimensions: productData.dimensions || '12"W x 14"H x 4"D',
      material: productData.material || 'Virgin Non-Woven Polypropylene',
      capacity: productData.capacity || 'Up to 25 lbs',
      certifications: productData.certifications || ['GRS Certified', '100% Recyclable'],
      availableColors: productData.availableColors || [
        { name: 'Leaf Green', hex: '#4E9F76' },
        { name: 'Pure White', hex: '#FFFFFF' }
      ],
      description: productData.description || 'High tensile enterprise carrier bag.',
      features: productData.features || ['Ultrasonic Welded Seams', 'Recyclable Polypropylene'],
      bestFor: productData.bestFor || 'Supermarkets, Retail, Trade Shows',
      ecoImpact: productData.ecoImpact || 'Replaces 125+ single-use shopping bags',
      inStock: productData.inStock !== false,
      leadTime: productData.leadTime || '2-4 Days',
      volumeTiers: productData.volumeTiers || [
        { minQty: 1000, price: productData.pricePerUnit || 0.25 },
        { minQty: 5000, price: (productData.pricePerUnit || 0.25) * 0.9 }
      ],
      image: productData.image || '/images/bag-green.png',
      badge: productData.badge || 'Eco Choice'
    };
    store.addProduct(newProduct);
    return newProduct;
  };

  const editProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    const store = useStore.getState();
    store.updateProduct(id, updates);
    return { ...store.products.find(p => p.id === id)!, ...updates };
  };

  const removeProduct = async (id: string): Promise<void> => {
    useStore.getState().deleteProduct(id);
  };

  const toggleStock = async (id: string): Promise<void> => {
    useStore.getState().toggleProductStock(id);
  };

  const addCategory = async (catData: Partial<CategoryItem>): Promise<CategoryItem> => {
    const store = useStore.getState();
    const newCat: CategoryItem = {
      id: catData.id || `cat-${Date.now()}`,
      label: catData.label || 'New Category',
      subtitle: catData.subtitle || 'Custom Collection',
      tag: catData.tag || 'NEW',
      count: catData.count || '0 Models',
      image: catData.image || '/images/bag-green.png',
      description: catData.description || '',
      size: catData.size || '12" x 15"',
      gsm: catData.gsm || '80 GSM'
    };
    store.addCategory(newCat);
    return newCat;
  };

  const editCategory = async (id: string, updates: Partial<CategoryItem>): Promise<CategoryItem> => {
    const store = useStore.getState();
    store.updateCategory(id, updates);
    return { ...store.categories.find(c => c.id === id)!, ...updates };
  };

  const removeCategory = async (id: string): Promise<void> => {
    useStore.getState().deleteCategory(id);
  };

  const saveSettings = async (updates: Partial<SiteSettings>): Promise<SiteSettings> => {
    const store = useStore.getState();
    store.updateSiteSettings(updates);
    return { ...store.siteSettings, ...updates };
  };

  const changeOrderStatus = async (id: string, status: string): Promise<void> => {
    useStore.getState().updateOrderStatus(id, status);
  };

  const removeOrder = async (id: string): Promise<void> => {
    useStore.getState().deleteOrder(id);
  };

  const changeQuoteStatus = async (id: string, status: string): Promise<void> => {
    useStore.getState().updateQuoteStatus(id, status);
  };

  const removeQuote = async (id: string): Promise<void> => {
    useStore.getState().deleteQuote(id);
  };

  const submitOrder = async (orderData: Partial<Order>): Promise<Order> => {
    return await useStore.getState().createOrder(orderData);
  };

  const submitQuote = async (quoteData: Partial<QuoteSubmission>): Promise<QuoteSubmission> => {
    return await useStore.getState().createQuote(quoteData);
  };

  const resetToFactory = async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.reload();
    }
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
        loading: false,
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
