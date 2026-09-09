import React from 'react';
import { Search, ShoppingBag, Menu, Sparkles, Activity } from 'lucide-react';
import { PageView } from '../types';

interface HeaderProps {
  currentPage: PageView;
  cartCount: number;
  onNavigate: (page: PageView) => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onToggleCaseStudy: () => void;
  onToggleAnalytics: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onNavigate,
  onOpenSearch,
  onOpenMenu,
  onToggleCaseStudy,
  onToggleAnalytics,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-200">
      {/* Top Value Proposition / Free Shipping Announcement Ticker */}
      <div className="bg-[#202124] text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden text-center">
          <span className="inline-block w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
          <span className="truncate">
            <strong className="text-[#8AB4F8] font-semibold">Free Carbon-Neutral Delivery</strong> on orders over $45 • 100% Official Gear
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-gray-300">
          <button
            id="btn-header-ux-insights-desktop"
            onClick={onToggleCaseStudy}
            className="hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            UX Case Study Notes
          </button>
          <button
            id="btn-header-analytics-desktop"
            onClick={onToggleAnalytics}
            className="hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full transition-colors"
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            Live Analytics
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            id="btn-mobile-menu"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Google Merch Store Brand Logo */}
          <button
            id="btn-brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left"
          >
            {/* Google G Emblem SVG */}
            <div className="w-7 h-7 flex-shrink-0 relative">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC04"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.16 0 10.02 0 12c0 1.98.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[17px] tracking-tight leading-tight text-[#202124] flex items-center gap-1">
                Google <span className="text-[#5F6368] font-normal text-sm">Merchandise</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#1A73E8]">
                Mobile UX Prototype
              </span>
            </div>
          </button>
        </div>

        {/* Center: Quick Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <button
            id="nav-link-home"
            onClick={() => onNavigate('home')}
            className="hover:text-[#1A73E8] transition-colors py-1"
          >
            Home
          </button>
          <button
            id="nav-link-catalog"
            onClick={() => onNavigate('catalog')}
            className="hover:text-[#1A73E8] transition-colors py-1"
          >
            All Products
          </button>
          <button
            id="nav-link-hoodies"
            onClick={() => {
              onNavigate('catalog');
            }}
            className="hover:text-[#1A73E8] transition-colors py-1 flex items-center gap-1"
          >
            Apparel & Hoodies
            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">Hot</span>
          </button>
          <button
            id="nav-link-eco"
            onClick={() => onNavigate('catalog')}
            className="hover:text-[#1A73E8] transition-colors py-1"
          >
            Eco Collection
          </button>
        </nav>

        {/* Right Actions: Search trigger, Case Study Pills (mobile), Cart icon */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger Bar */}
          <button
            id="btn-search-trigger"
            onClick={onOpenSearch}
            className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200/80 px-3 py-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search store products"
          >
            <Search className="w-4 h-4 text-gray-600" />
            <span className="hidden sm:inline text-xs text-gray-600">Search "hoodie", "tumbler"...</span>
          </button>

          {/* Mobile UX Case Study Pill */}
          <button
            id="btn-mobile-ux-notes"
            onClick={onToggleCaseStudy}
            title="View Mobile Conversion UX Decisions"
            className="md:hidden p-2 rounded-full text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Cart Icon with Counter Badge */}
          <button
            id="btn-cart-header"
            onClick={() => onNavigate('cart')}
            className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`View cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-6 h-6 text-gray-800" />
            {cartCount > 0 && (
              <span
                id="cart-badge-count"
                className="absolute -top-0.5 -right-0.5 bg-[#1A73E8] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scale-up"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
