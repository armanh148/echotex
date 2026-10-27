'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Inbox, 
  FileText, 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  Building, 
  Eye, 
  X, 
  ChevronRight,
  Send,
  Calendar,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { QuoteSubmission, Order } from '../../types';
import { StatusBadgeDropdown } from './ui/StatusBadgeDropdown';
import { CustomSelect } from './ui/CustomSelect';

export const RfqOrdersInbox: React.FC = () => {
  const { 
    quotes, 
    orders, 
    fetchOrders,
    fetchQuotes,
    updateQuoteStatus, 
    updateOrderStatus 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'quotes' | 'orders'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-sync from backend on mount
  useEffect(() => {
    fetchOrders?.();
    fetchQuotes?.();
  }, [fetchOrders, fetchQuotes]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchOrders ? fetchOrders() : Promise.resolve(),
        fetchQuotes ? fetchQuotes() : Promise.resolve()
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  // Selected Detail Modal
  const [selectedQuote, setSelectedQuote] = useState<QuoteSubmission | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Lock body scroll and handle Escape key for modals
  useEffect(() => {
    if (!selectedQuote && !selectedOrder) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedQuote(null);
        setSelectedOrder(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedQuote, selectedOrder]);

  // Filter Quotes
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.company && q.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter Orders
  const filteredOrders = orders.filter(o => {
    const custName = (o.customerName || o.buyerName || '').toLowerCase();
    const custEmail = (o.customerEmail || o.email || '').toLowerCase();
    const custCompany = (o.customerCompany || o.companyName || '').toLowerCase();
    const orderId = (o.id || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = 
      custName.includes(query) ||
      custEmail.includes(query) ||
      custCompany.includes(query) ||
      orderId.includes(query);
    
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const newQuotesCount = quotes.filter(q => q.status === 'New').length;

  return (
    <div className="space-y-6 animate-fadeInUp pb-12">
      
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#B2E2C5]/20 text-[#4E9F76]">
              <Inbox className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#4E9F76]">
              Procurement & Sales Desk
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
            RFQ & Production Orders Inbox
          </h2>
          <p className="text-xs text-slate-500">
            Review live storefront orders, customer details, line items, and incoming wholesale quote submissions.
          </p>
        </div>

        {/* Tab Switcher & Manual Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('orders');
                setStatusFilter('all');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-[#4E9F76] shadow-xs'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Wholesale Orders</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                pendingOrdersCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-[#B2E2C5]/20 text-[#4E9F76]'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('quotes');
                setStatusFilter('all');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quotes'
                  ? 'bg-white text-[#4E9F76] shadow-xs'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>RFQ Quotes</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                newQuotesCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-[#B2E2C5]/20 text-[#4E9F76]'
              }`}>
                {quotes.length}
              </span>
            </button>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh Orders from Server"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-[#86C59E] hover:bg-slate-50 text-slate-600 hover:text-[#4E9F76] transition-all shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#4E9F76]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#B2E2C5]/30 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={activeTab === 'quotes' ? "Search inquiries by buyer name, company, email, or RFQ ID..." : "Search orders by order ID, buyer, or company..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#86C59E] focus:ring-2 focus:ring-[#B2E2C5]/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <CustomSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={
              activeTab === 'quotes' ? [
                { value: 'all', label: 'All Statuses' },
                { value: 'New', label: 'New', dot: 'bg-emerald-500' },
                { value: 'In Review', label: 'In Review', dot: 'bg-amber-500' },
                { value: 'Quotation Sent', label: 'Quotation Sent', dot: 'bg-blue-500' },
                { value: 'Approved', label: 'Approved', dot: 'bg-emerald-600' },
                { value: 'Declined', label: 'Declined', dot: 'bg-rose-500' }
              ] : [
                { value: 'all', label: 'All Statuses' },
                { value: 'Pending', label: 'Pending', dot: 'bg-amber-500' },
                { value: 'In Production', label: 'In Production', dot: 'bg-purple-500' },
                { value: 'Shipped', label: 'Shipped', dot: 'bg-sky-500' },
                { value: 'Completed', label: 'Completed', dot: 'bg-emerald-500' }
              ]
            }
          />
        </div>
      </div>

      {/* Tab 1: Quotes Table */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-3xl border border-[#B2E2C5]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">RFQ ID & Date</th>
                  <th className="py-4 px-6">Buyer & Organization</th>
                  <th className="py-4 px-6">Product & Quantity / Volume</th>
                  <th className="py-4 px-6">Printing Requirement</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      No quotation requests matching your filter.
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* ID & Date */}
                      <td className="py-4 px-6">
                        <div className="font-black text-[#0f172a]">{q.id}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{q.date}</div>
                      </td>

                      {/* Buyer */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#0f172a]">{q.name}</div>
                        <div className="text-[11px] text-[#4E9F76] font-medium">{q.company || 'Enterprise Wholesaler'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{q.email}</div>
                      </td>

                      {/* Product & Quantity / Volume */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 capitalize">
                          {q.category || q.bagType || 'Wholesale Packaging'}
                        </div>
                        <div className="text-[11px] font-black text-[#4E9F76] mt-0.5 flex items-center gap-1">
                          <span className="text-slate-400 font-normal">Qty:</span>
                          <span>{q.volume || (q.quantity ? `${Number(q.quantity).toLocaleString()} units` : '1,000 units')}</span>
                        </div>
                      </td>

                      {/* Printing */}
                      <td className="py-4 px-6">
                        <span className="text-slate-600 font-medium">
                          {q.printing || 'Standard'}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-6">
                        <StatusBadgeDropdown
                          value={q.status}
                          onChange={(val) => updateQuoteStatus(q.id, val)}
                          options={['New', 'In Review', 'Quotation Sent', 'Approved', 'Declined']}
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#B2E2C5]/20 text-slate-700 hover:text-[#4E9F76] font-bold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Detail</span>
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#B2E2C5]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Order ID & Date</th>
                  <th className="py-4 px-6">Customer & Company</th>
                  <th className="py-4 px-6">Items & Quantity</th>
                  <th className="py-4 px-6">Total & Payment</th>
                  <th className="py-4 px-6">Production Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      No production orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      <td className="py-4 px-6">
                        <div className="font-black text-[#0f172a]">{o.id}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{o.date}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-[#0f172a]">{o.customerName || o.buyerName || 'Commercial Buyer'}</div>
                        <div className="text-[11px] text-[#4E9F76] font-medium">{o.customerCompany || o.companyName || 'Wholesale Client'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{o.customerEmail || o.email || '—'}</div>
                      </td>

                      <td className="py-4 px-6">
                        {o.items && o.items.length > 0 ? (
                          o.items.map((item, idx) => (
                            <div key={idx} className="line-clamp-1 font-medium text-slate-700 flex items-center gap-1.5">
                              <span className="font-bold text-[#4E9F76]">
                                {(Number(item.quantity) || 1).toLocaleString()}x
                              </span>
                              <span>{item.productName || item.name || 'Custom Bag'}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500 font-medium">Qty: 1,000x Custom Spec Packaging</div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-black text-[#4E9F76]">
                          ${(o.total || o.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{o.paymentTerms}</div>
                      </td>

                      <td className="py-4 px-6">
                        <StatusBadgeDropdown
                          value={o.status}
                          onChange={(val) => updateOrderStatus(o.id, val)}
                          options={['Pending', 'In Production', 'Shipped', 'Completed']}
                        />
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#B2E2C5]/20 text-slate-700 hover:text-[#4E9F76] font-bold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Detail</span>
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quote Detail Modal - Centered with Blurry Backdrop in Document Portal */}
      {selectedQuote && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setSelectedQuote(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-black/40 border border-slate-200/80 space-y-6 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#4E9F76] bg-[#B2E2C5]/20 px-2 py-0.5 rounded-full">
                  RFQ Inbound Dossier
                </span>
                <h3 className="text-lg font-black text-[#0f172a] mt-1">
                  Quote {selectedQuote.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-slate-400 font-semibold block">Buyer Name</span>
                  <span className="font-bold text-[#0f172a] text-sm">{selectedQuote.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Company / Chain</span>
                  <span className="font-bold text-[#4E9F76] text-sm">{selectedQuote.company || 'Not Specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Contact Email</span>
                  <span className="font-medium text-slate-700">{selectedQuote.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Phone</span>
                  <span className="font-medium text-slate-700">{selectedQuote.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="p-4 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Packaging Category:</span>
                  <span className="font-bold text-[#0f172a] capitalize">{selectedQuote.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Order Quantity / Volume:</span>
                  <span className="font-black text-[#4E9F76]">
                    {selectedQuote.volume || (selectedQuote.quantity ? `${Number(selectedQuote.quantity).toLocaleString()} units` : '1,000 units')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Printing Specification:</span>
                  <span className="font-medium text-slate-700">{selectedQuote.printing}</span>
                </div>
              </div>

              {selectedQuote.message && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                  <span className="text-slate-400 font-semibold block">Client Specifications / Note:</span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {selectedQuote.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <StatusBadgeDropdown
                value={selectedQuote.status}
                onChange={(val) => {
                  updateQuoteStatus(selectedQuote.id, val);
                  setSelectedQuote({ ...selectedQuote, status: val as any });
                }}
                options={['New', 'In Review', 'Quotation Sent', 'Approved', 'Declined']}
              />

              <button
                onClick={() => setSelectedQuote(null)}
                className="px-5 py-2 rounded-xl bg-[#4E9F76] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Order Detail Modal - Centered with Blurry Backdrop in Document Portal */}
      {selectedOrder && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-black/40 border border-slate-200/80 space-y-6 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#86C59E] bg-[#86C59E]/15 px-2 py-0.5 rounded-full">
                  Wholesale Freight Order
                </span>
                <h3 className="text-lg font-black text-[#0f172a] mt-1">
                  Order {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-semibold block">Customer Name</span>
                  <span className="font-bold text-[#0f172a]">{selectedOrder.customerName || selectedOrder.buyerName || 'Commercial Buyer'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Company</span>
                  <span className="font-bold text-[#4E9F76]">{selectedOrder.customerCompany || selectedOrder.companyName || 'Wholesale Client'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Email</span>
                  <span className="text-slate-600 truncate block">{selectedOrder.customerEmail || selectedOrder.email || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Payment Terms</span>
                  <span className="text-slate-600 font-semibold">{selectedOrder.paymentTerms || 'Credit Card / Instant ACH'}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 font-semibold block">Shipping Destination</span>
                  <span className="text-slate-700 font-medium">{selectedOrder.shippingAddress || selectedOrder.address || 'Standard Freight Dispatch'}</span>
                </div>
              </div>

              {(selectedOrder as any).notifications && (
                <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Automated Notifications:
                  </span>
                  <span className="text-emerald-700 font-semibold">
                    {(selectedOrder as any).notifications?.whatsapp?.enabled ? 'WhatsApp Dispatched' : ''}
                    {(selectedOrder as any).notifications?.email?.enabled ? ' · Email Alert Sent' : ''}
                  </span>
                </div>
              )}

              {/* Items List */}
              <div className="border border-slate-200/80 rounded-2xl p-4 divide-y divide-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-2">
                  Line Items Queued
                </span>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => {
                    const unitP = item.price || item.unitPrice || 0;
                    const qty = item.quantity || 1;
                    return (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#0f172a]">{item.productName || item.name || 'Custom Bag'}</div>
                          <div className="text-slate-400 text-[11px]">
                            Qty: {qty.toLocaleString()} pcs @ ${unitP.toFixed(2)}/pc
                          </div>
                        </div>
                        <div className="font-black text-[#4E9F76]">
                          ${(qty * unitP).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-2 text-slate-400 italic text-[11px]">Wholesale Bag Consignment</div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-[#B2E2C5]/15 rounded-2xl">
                <span className="font-bold text-[#0f172a]">Wholesale Total:</span>
                <span className="text-base font-black text-[#4E9F76]">
                  ${(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <StatusBadgeDropdown
                value={selectedOrder.status}
                onChange={(val) => {
                  updateOrderStatus(selectedOrder.id, val);
                  setSelectedOrder({ ...selectedOrder, status: val as any });
                }}
                options={['Pending', 'In Production', 'Shipped', 'Completed']}
              />

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-[#4E9F76] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
