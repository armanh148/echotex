'use client';

import React from 'react';
import { 
  Users, 
  FileText, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AdminSection } from './AdminSidebar';

interface DashboardOverviewProps {
  onNavigateToSection: (section: AdminSection) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateToSection
}) => {
  const { analytics, products, orders, quotes, updateQuoteStatus, updateOrderStatus } = useStore();

  const totalCatalogCount = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const newQuotes = quotes.filter(q => q.status === 'New');
  const recentOrders = orders.slice(0, 4);

  const statsCards = [
    {
      title: 'Active B2B Sessions',
      value: analytics.activeVisitors.toLocaleString(),
      subtext: '+18.4% from last week',
      icon: Users,
      trend: 'up',
      badgeColor: 'bg-[#B2E2C5]/20 text-[#4E9F76]'
    },
    {
      title: 'Quote Requests (RFQ)',
      value: quotes.length.toString(),
      subtext: `${newQuotes.length} pending review`,
      icon: FileText,
      trend: 'neutral',
      badgeColor: 'bg-[#B2E2C5]/25 text-[#4E9F76]'
    },
    {
      title: 'Wholesale Catalog',
      value: `${inStockCount}/${totalCatalogCount}`,
      subtext: 'Active production models',
      icon: Package,
      trend: 'up',
      badgeColor: 'bg-[#86C59E]/15 text-[#4E9F76]'
    },
    {
      title: 'Gross Pipeline Value',
      value: `$${analytics.grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
      subtext: 'Direct mill contracts',
      icon: DollarSign,
      trend: 'up',
      badgeColor: 'bg-[#4E9F76]/15 text-[#4E9F76]'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeInUp">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4E9F76] via-[#007018] to-[#0f172a] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#B2E2C5] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B2E2C5]" />
            <span>Industrial Facility Direct · Sanity-Style CMS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Wholesale Operations & Dynamic CMS Studio
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
            Real-time management for live hero colorways, wholesale product catalog, ESG metric counters, and incoming supermarket bag RFQs.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateToSection('products')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#86C59E] hover:bg-[#B2E2C5] text-[#0f172a] font-bold text-xs transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => onNavigateToSection('hero')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-[#B2E2C5]" />
              <span>Customize Hero 3D Showcase</span>
            </button>
            <button
              onClick={() => onNavigateToSection('messages')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4 text-[#B2E2C5]" />
              <span>Customer Messages</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#86C59E]/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i}
              className="bg-white rounded-2xl p-5 border border-[#B2E2C5]/30 shadow-xs hover:shadow-md transition-all hover:border-[#86C59E]/60 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.badgeColor} transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#4E9F76]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#86C59E]" />
                  <span>{stat.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent RFQ Submissions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent RFQ Inbox Preview */}
        <div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#B2E2C5]/20 text-[#4E9F76] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0f172a]">Recent RFQ Sample Inquiries</h3>
                  <p className="text-[11px] text-slate-400">Customer requests for enterprise bag quotes</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToSection('rfq-orders')}
                className="text-xs font-bold text-[#4E9F76] hover:text-[#86C59E] flex items-center gap-1 transition-colors"
              >
                <span>View All ({quotes.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {quotes.slice(0, 3).map((q) => (
                <div key={q.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#0f172a]">{q.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium">({q.company || 'Enterprise'})</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        q.status === 'New' 
                          ? 'bg-[#B2E2C5]/30 text-[#4E9F76] border border-[#B2E2C5]' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {q.volume} · {q.printing} · {q.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <select
                      value={q.status}
                      onChange={(e) => updateQuoteStatus(q.id, e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-[#86C59E]"
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Quotation Sent">Quotation Sent</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigateToSection('rfq-orders')}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#B2E2C5]/15 text-slate-700 hover:text-[#4E9F76] text-xs font-bold transition-all text-center"
            >
              Open Complete Quotes & Sample Inbox
            </button>
          </div>
        </div>

        {/* Recent Wholesale Production Orders */}
        <div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0f172a]">Production & Freight Orders</h3>
                  <p className="text-[11px] text-slate-400">Live factory orders queued for shipment</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToSection('rfq-orders')}
                className="text-xs font-bold text-[#4E9F76] hover:text-[#86C59E] flex items-center gap-1 transition-colors"
              >
                <span>View All ({orders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentOrders.map((o) => (
                <div key={o.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#0f172a]">{o.id}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{o.customerCompany || o.companyName || o.customerName || o.buyerName || 'Wholesale Client'}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      ${(o.total || o.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} · {o.paymentTerms}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      o.status === 'Completed'
                        ? 'bg-[#B2E2C5]/20 text-[#4E9F76]'
                        : o.status === 'In Production'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigateToSection('rfq-orders')}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#B2E2C5]/15 text-slate-700 hover:text-[#4E9F76] text-xs font-bold transition-all text-center"
            >
              Manage Wholesale Freight Orders
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
