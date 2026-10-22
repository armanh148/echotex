import { Product, Order, QuoteSubmission, SiteSettings, CategoryItem, CustomerThread } from '../types';

export const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('ecotex_admin_token') || sessionStorage.getItem('ecotex_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  totalOrders: number;
  grossRevenue: number;
  totalQuotes: number;
  pendingQuotes: number;
  totalCategories: number;
  bagsDisplacedEstimate: number;
}

export const apiService = {
  // 0. Auth
  async login(username: string, password: string): Promise<{ success: boolean; token: string; user: { name: string; role: string; email: string } }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async updateCredentials(data: { email?: string; password?: string; name?: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/credentials`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update credentials');
    return res.json();
  },

  // 1. Stats
  async getStats(): Promise<DashboardStats> {

    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // 2. Products
  async getProducts(category?: string): Promise<Product[]> {
    const url = category && category !== 'all' 
      ? `${BASE_URL}/products?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/products`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async toggleStock(id: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}/toggle-stock`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to toggle stock');
    return res.json();
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // 3. Categories
  async getCategories(): Promise<CategoryItem[]> {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(category: Partial<CategoryItem>): Promise<CategoryItem> {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json();
  },

  // 4. Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createOrder(order: Partial<Order>): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  async deleteOrder(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
  },

  // 5. Quotes / RFQs
  async getQuotes(): Promise<QuoteSubmission[]> {
    const res = await fetch(`${BASE_URL}/quotes`);
    if (!res.ok) throw new Error('Failed to fetch quotes');
    return res.json();
  },

  async createQuote(quote: Partial<QuoteSubmission>): Promise<QuoteSubmission> {
    const res = await fetch(`${BASE_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    });
    if (!res.ok) throw new Error('Failed to create quote');
    return res.json();
  },

  async updateQuoteStatus(id: string, status: string): Promise<QuoteSubmission> {
    const res = await fetch(`${BASE_URL}/quotes/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update quote status');
    return res.json();
  },

  async deleteQuote(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/quotes/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete quote');
    return res.json();
  },

  // 6. Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // 7. Reset Database
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/reset`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset database');
    return res.json();
  },

  // 8. Messages
  async getMessages(): Promise<CustomerThread[]> {
    const res = await fetch(`${BASE_URL}/messages`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async saveMessageThread(thread: CustomerThread): Promise<{ success: boolean; thread: CustomerThread }> {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thread),
    });
    if (!res.ok) throw new Error('Failed to save message thread');
    return res.json();
  },

  async replyMessageThread(id: string, text: string): Promise<CustomerThread> {
    const res = await fetch(`${BASE_URL}/messages/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Failed to reply to message thread');
    return res.json();
  },

  // 9. File Upload
  async uploadFile(payload: { data: string; filename: string } | FormData): Promise<{ success: boolean; url: string; filename: string }> {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? payload : JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  }
};
