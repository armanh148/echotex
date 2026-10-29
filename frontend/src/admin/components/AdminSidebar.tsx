'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Sliders, 
  Package, 
  FileText, 
  Inbox, 
  MessageSquare,
  Image as ImageIcon,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Layers,
  Settings,
  FolderTree,
  Flame,
  Home
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export type AdminSection = 
  | 'overview'
  | 'homepage'
  | 'hero'
  | 'categories'
  | 'products'
  | 'offers'
  | 'content'
  | 'rfq-orders'
  | 'messages'
  | 'media'
  | 'settings';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onViewLiveSite: () => void;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  onViewLiveSite,
  onLogout,
  onToggleSidebar,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  const { products, orders, quotes, adminUser, categories } = useStore();

  const [unreadMessagesCount, setUnreadMessagesCount] = React.useState<number>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ecotex_customer_messages_v1') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter((t: { isUnread?: boolean }) => t.isUnread).length;
      }
    } catch {}
    return 1;
  });

  React.useEffect(() => {
    const updateCount = (threadsList?: any[]) => {
      try {
        const list = threadsList || JSON.parse(localStorage.getItem('ecotex_customer_messages_v1') || '[]');
        const count = list.filter((t: any) => t.isUnread).length;
        setUnreadMessagesCount(count);
      } catch {}
    };

    updateCount();
    const handleUpdated = (e: any) => updateCount(e.detail);
    const handleStorage = () => updateCount();

    window.addEventListener('ecotex_messages_updated', handleUpdated);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('ecotex_messages_updated', handleUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const navItems: { id: AdminSection; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'homepage', label: 'Homepage', icon: Home, badge: 'All Sections' },
    { id: 'categories', label: 'Categories', icon: FolderTree, badge: categories.filter(c => c.id !== 'all').length || categories.length },
    { id: 'products', label: 'Products & Single Pages', icon: Package, badge: products.length },
    { id: 'offers', label: 'Special Offers & Deals', icon: Flame, badge: 'HOT' },
    { id: 'rfq-orders', label: 'Orders & Quotes', icon: Inbox, badge: (quotes.filter(q => q.status === 'New').length + orders.filter(o => o.status === 'Pending').length) || undefined },
    { id: 'messages', label: 'Customer Messages', icon: MessageSquare, badge: unreadMessagesCount || undefined },
    { id: 'media', label: 'Media Library', icon: ImageIcon }
  ];

  const handleItemClick = (section: AdminSection) => {
    onSelectSection(section);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-white border-r border-[#B2E2C5]/30 select-none">
      
      {/* Top Header & Navigation Links */}
      <div className="p-4 sm:p-5 space-y-5">
        
        {/* Brand Logo & CMS Tag */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4E9F76] text-white flex items-center justify-center font-black shadow-md shadow-[#4E9F76]/20 shrink-0">
              E
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-[#0f172a] uppercase">
                ECO<span className="text-[#4E9F76]">TEX</span> CMS
              </div>
              <div className="text-[10px] text-[#86C59E] font-bold tracking-wider uppercase">
                Sanity-Style Studio
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#B2E2C5]/20 text-[#4E9F76] border border-[#B2E2C5]/40 shrink-0">
              v4.2
            </span>
          </div>
        </div>

        {/* Section Label */}
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
          Main Navigation
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? 'bg-[#4E9F76] text-white shadow-md shadow-[#4E9F76]/25 translate-x-0.5'
                    : 'text-slate-700 hover:bg-[#B2E2C5]/15 hover:text-[#4E9F76]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-[#86C59E]'
                  }`} />
                  <span className="whitespace-nowrap truncate text-left">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && (
                    <span className={`inline-flex items-center justify-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-normal shrink-0 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-[#B2E2C5]/20 text-[#4E9F76] group-hover:bg-[#B2E2C5]/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />}
                </div>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Settings & Quick Actions Zone */}
      <div className="p-4 border-t border-slate-100 bg-[#fbfdfb] space-y-2.5">
        
        {/* Quick Settings Action Card */}
        <button
          onClick={() => handleItemClick('settings')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer group ${
            activeSection === 'settings'
              ? 'bg-[#4E9F76] text-white shadow-md shadow-[#4E9F76]/25 translate-x-0.5'
              : 'text-slate-700 bg-white border border-slate-200/90 hover:border-[#4E9F76] hover:bg-[#B2E2C5]/15 hover:text-[#4E9F76]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Settings className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-90 ${
              activeSection === 'settings' ? 'text-white' : 'text-[#4E9F76]'
            }`} />
            <div className="text-left">
              <div className="font-bold text-xs leading-tight">Site Settings</div>
              <div className={`text-[10px] ${activeSection === 'settings' ? 'text-white/80' : 'text-slate-400'}`}>
                Favicon, Title, Account
              </div>
            </div>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeSection === 'settings' ? 'text-white' : 'text-slate-400'}`} />
        </button>

        {/* Minimal Session Signout Link */}
        <div className="flex items-center justify-between px-2 pt-1 text-[11px]">
          <span className="text-slate-400 font-medium truncate max-w-[150px]">
            {adminUser?.email || 'admin@ecotexinc.com'}
          </span>
          <button
            onClick={onLogout}
            title="Log out of session"
            className="flex items-center gap-1 font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

    </aside>
  );
};

export default AdminSidebar;
