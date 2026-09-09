import React from 'react';
import { X, ChevronRight, Sparkles, Activity, ShieldCheck, Truck, RefreshCw, HelpCircle } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { PageView, CategoryId } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (catId: CategoryId) => void;
  onNavigate: (page: PageView) => void;
  onToggleCaseStudy: () => void;
  onToggleAnalytics: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onNavigate,
  onToggleCaseStudy,
  onToggleAnalytics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 left-0 max-w-[320px] w-full bg-white shadow-2xl flex flex-col z-10 animate-slide-right">
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC04" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.16 0 10.02 0 12c0 1.98.45 3.84 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-base">Google Store</span>
          </div>
          <button
            id="btn-close-drawer"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 divide-y divide-gray-100">
          <div className="pb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
              Browse Categories
            </p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  id={`drawer-category-${cat.id}`}
                  onClick={() => {
                    onSelectCategory(cat.id as CategoryId);
                    onNavigate('catalog');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-[#1A73E8] transition-colors"
                >
                  <span>{cat.name}</span>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">
                      {cat.count}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Flow Jump (PRD Flow Verification) */}
          <div className="py-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
              Prototype Pages
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => { onNavigate('home'); onClose(); }}
                className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-left font-medium text-gray-700"
              >
                1. Homepage
              </button>
              <button
                onClick={() => { onNavigate('catalog'); onClose(); }}
                className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-left font-medium text-gray-700"
              >
                2. Catalog
              </button>
              <button
                onClick={() => { onNavigate('product-detail'); onClose(); }}
                className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-left font-medium text-gray-700"
              >
                3. Product Page
              </button>
              <button
                onClick={() => { onNavigate('cart'); onClose(); }}
                className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-left font-medium text-gray-700"
              >
                4. Cart
              </button>
              <button
                onClick={() => { onNavigate('checkout-delivery'); onClose(); }}
                className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-left font-medium text-gray-700"
              >
                5. Delivery
              </button>
              <button
                onClick={() => { onNavigate('checkout-payment'); onClose(); }}
                className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-left font-medium text-gray-700"
              >
                6. Payment
              </button>
            </div>
          </div>

          {/* Case Study & Analytics Inspect Buttons */}
          <div className="pt-4 space-y-2">
            <button
              onClick={() => {
                onToggleCaseStudy();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Mobile Conversion Rationale
              </span>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </button>

            <button
              onClick={() => {
                onToggleAnalytics();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Live Analytics Stream
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Drawer Footer Guarantees */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#1A73E8]" />
            <span>Carbon-Neutral Worldwide Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34A853]" />
            <span>100% Genuine Google Brand Merchandise</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#EA4335]" />
            <span>30-Day Hassle-Free Campus Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};
