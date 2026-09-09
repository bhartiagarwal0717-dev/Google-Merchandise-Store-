import React, { useState } from 'react';
import { Truck, ShieldCheck, RefreshCw, Send, Check } from 'lucide-react';
import { PageView, CategoryId } from '../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenCaseStudy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectCategory,
  onOpenCaseStudy,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-gray-600">
      {/* Trust & Conversion Guarantees Strip */}
      <div className="border-b border-gray-100 bg-[#F8F9FA] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-full bg-blue-50 text-[#1A73E8]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Carbon-Neutral Shipping</h4>
              <p className="text-xs text-gray-500">Free delivery on orders over $45</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-full bg-emerald-50 text-[#34A853]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">100% Authentic Merch</h4>
              <p className="text-xs text-gray-500">Direct from Google Mountain View</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-full bg-amber-50 text-amber-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Hassle-Free 30-Day Returns</h4>
              <p className="text-xs text-gray-500">Pre-paid labels included in every box</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC04" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.16 0 10.02 0 12c0 1.98.45 3.84 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-base">Google Merchandise Store</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Conceptual mobile conversion redesign engineered for frictionless shopping, sub-second checkout, and Google aesthetic minimalism.
          </p>
          <div>
            <button
              onClick={onOpenCaseStudy}
              className="text-xs font-semibold text-[#1A73E8] hover:underline flex items-center gap-1"
            >
              Read Mobile UX Case Study Notes →
            </button>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
            Collections
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => { onSelectCategory('apparel'); onNavigate('catalog'); }}
                className="hover:text-[#1A73E8] transition-colors"
              >
                Apparel & Hoodies
              </button>
            </li>
            <li>
              <button
                onClick={() => { onSelectCategory('drinkware'); onNavigate('catalog'); }}
                className="hover:text-[#1A73E8] transition-colors"
              >
                Drinkware & Tumblers
              </button>
            </li>
            <li>
              <button
                onClick={() => { onSelectCategory('accessories'); onNavigate('catalog'); }}
                className="hover:text-[#1A73E8] transition-colors"
              >
                Backpacks & Tech Gear
              </button>
            </li>
            <li>
              <button
                onClick={() => { onSelectCategory('eco'); onNavigate('catalog'); }}
                className="hover:text-[#1A73E8] transition-colors"
              >
                Organic & Recycled Line
              </button>
            </li>
          </ul>
        </div>

        {/* Navigation & Flow */}
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
            Prototype Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-[#1A73E8] transition-colors">
                Homepage
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('catalog')} className="hover:text-[#1A73E8] transition-colors">
                Product Catalog (PLP)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('product-detail')} className="hover:text-[#1A73E8] transition-colors">
                Product Details (PDP)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('cart')} className="hover:text-[#1A73E8] transition-colors">
                Shopping Cart
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('checkout-delivery')} className="hover:text-[#1A73E8] transition-colors">
                Guest Delivery Checkout
              </button>
            </li>
          </ul>
        </div>

        {/* Newsletter / Early Drops */}
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
            Google Merch Early Drops
          </h4>
          <p className="text-xs text-gray-500 mb-3">
            Be first to know when limited Google I/O and Pixel merchandise drops.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                required
                placeholder="developer@google.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-[#1A73E8] text-white hover:bg-blue-700 flex items-center justify-center transition-colors"
                aria-label="Subscribe to newsletter"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
            {subscribed && (
              <p className="text-[11px] text-[#34A853] font-medium animate-fade-in">
                ✓ You're signed up for exclusive Google Merch releases!
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
        <p>© 2025 Google LLC Conceptual Redesign • Built with React & TypeScript for Mobile Conversion Evaluation</p>
        <div className="flex items-center gap-4">
          <span>Privacy Policy</span>
          <span>Terms of Sale</span>
          <span>Campus Pickup</span>
        </div>
      </div>
    </footer>
  );
};
