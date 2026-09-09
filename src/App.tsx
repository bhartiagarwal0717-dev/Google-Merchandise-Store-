/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { SearchModal } from './components/SearchModal';
import { UXCaseStudyDrawer } from './components/UXCaseStudyDrawer';
import { AnalyticsDrawer } from './components/AnalyticsDrawer';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutDeliveryPage } from './pages/CheckoutDeliveryPage';
import { CheckoutPaymentPage } from './pages/CheckoutPaymentPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

import { PRODUCTS } from './data/products';
import {
  PageView,
  CategoryId,
  Product,
  CartItem,
  DeliveryAddress,
  Order,
  ProductColor,
} from './types';
import { analytics } from './utils/analytics';
import { Sparkles, Activity, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Cart & Commerce State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'google-pixel-organic-hoodie-heather-grey-m',
      product: PRODUCTS[0],
      selectedColor: PRODUCTS[0].colors[0],
      selectedSize: 'M',
      quantity: 1,
    },
  ]);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Delivery Address State
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+1 (650) 253-0000',
    addressLine: '1600 Amphitheatre Parkway',
    aptSuite: 'Building 43',
    city: 'Mountain View',
    state: 'CA',
    pinCode: '94043',
    shippingMethod: 'standard',
  });

  // Completed Order State
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Toast notification for Add to Bag
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const showToast = (title: string, subtitle: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add to Cart handler
  const handleAddToCart = (
    product: Product,
    color: ProductColor,
    size: string,
    quantity: number = 1
  ) => {
    const itemId = `${product.id}-${color.name.toLowerCase().replace(/\s+/g, '-')}-${size.toLowerCase()}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity,
        },
      ];
    });

    // Fire required Analytics Event: Add to Cart
    analytics.trackAddToCart({
      product,
      color: color.name,
      size,
      quantity,
    });

    showToast(`Added to Bag`, `${product.name} (${color.name}, ${size})`);
  };

  // Quick Add from product cards (defaults to first color & size)
  const handleQuickAdd = (product: Product) => {
    const color = product.colors[0];
    const size = product.sizes[0] || 'One Size';
    handleAddToCart(product, color, size, 1);
  };

  // Buy Now handler (direct bypass into guest checkout)
  const handleBuyNow = (
    product: Product,
    color: ProductColor,
    size: string,
    quantity: number = 1
  ) => {
    handleAddToCart(product, color, size, quantity);
    const orderTotal = product.price * quantity;
    analytics.trackBeginCheckout(cartItems, orderTotal);
    setCurrentPage('checkout-delivery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Remove Item
  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Apply Promo code
  const handleApplyPromo = (code: string): boolean => {
    if (code === 'GOOGLE10') {
      setAppliedDiscount(10);
      return true;
    }
    if (code === 'FREESHIP') {
      setAppliedDiscount(5);
      return true;
    }
    return false;
  };

  // Navigation helper
  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Product and open PDP
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('product-detail');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#202124]">
      {/* Sticky Mobile & Desktop Navigation Header */}
      <Header
        currentPage={currentPage}
        cartCount={cartCount}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onToggleCaseStudy={() => setIsCaseStudyOpen(true)}
        onToggleAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* Horizontally Scrollable Category Bar (Shown on Home and Catalog pages) */}
      {(currentPage === 'home' || currentPage === 'catalog') && (
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (currentPage !== 'catalog') {
              navigateTo('catalog');
            }
          }}
        />
      )}

      {/* Main Pages Switcher */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              navigateTo('catalog');
            }}
            onNavigate={navigateTo}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
            appliedDiscount={appliedDiscount}
            onApplyPromo={handleApplyPromo}
          />
        )}

        {currentPage === 'checkout-delivery' && (
          <CheckoutDeliveryPage
            items={cartItems}
            deliveryAddress={deliveryAddress}
            onSaveAddress={(addr) => setDeliveryAddress(addr)}
            onNavigate={navigateTo}
            subtotal={subtotal}
            discount={(subtotal * appliedDiscount) / 100}
          />
        )}

        {currentPage === 'checkout-payment' && (
          <CheckoutPaymentPage
            items={cartItems}
            deliveryAddress={deliveryAddress}
            subtotal={subtotal}
            discount={(subtotal * appliedDiscount) / 100}
            onNavigate={navigateTo}
            onCompleteOrder={(order) => {
              setLastOrder(order);
              setCartItems([]); // clear cart on purchase
            }}
          />
        )}

        {currentPage === 'order-confirmation' && (
          <OrderConfirmationPage
            order={lastOrder}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Clean Google Store Footer */}
      <Footer
        onNavigate={navigateTo}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          navigateTo('catalog');
        }}
        onOpenCaseStudy={() => setIsCaseStudyOpen(true)}
      />

      {/* Search Modal with "hoodie" autocomplete */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Mobile Drawer Menu */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onNavigate={navigateTo}
        onToggleCaseStudy={() => setIsCaseStudyOpen(true)}
        onToggleAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* UX Conversion Case Study Drawer */}
      <UXCaseStudyDrawer
        isOpen={isCaseStudyOpen}
        onClose={() => setIsCaseStudyOpen(false)}
      />

      {/* Real-time Analytics Event Inspector Drawer */}
      <AnalyticsDrawer
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <aside
          id="cart-toast-notification"
          aria-label="Notification"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#202124] text-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-700/60 max-w-sm animate-slide-up"
        >
          <div className="w-8 h-8 rounded-full bg-[#34A853] text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white">{toastMessage.title}</p>
            <p className="text-[11px] text-gray-300 truncate">{toastMessage.subtitle}</p>
          </div>
          <button
            onClick={() => navigateTo('cart')}
            className="text-xs font-bold text-[#8AB4F8] hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>View Bag</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Floating Bottom Quick-Switcher for UX Reviewers */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1.5 bg-[#202124]/90 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full shadow-lg border border-white/10">
        <span className="text-gray-400 font-semibold uppercase tracking-wider pr-1">
          Case Study Flow:
        </span>
        {(
          [
            { id: 'home', label: '1. Home' },
            { id: 'catalog', label: '2. Catalog' },
            { id: 'product-detail', label: '3. PDP' },
            { id: 'cart', label: '4. Cart' },
            { id: 'checkout-delivery', label: '5. Delivery' },
            { id: 'checkout-payment', label: '6. Payment' },
            { id: 'order-confirmation', label: '7. Confirm' },
          ] as const
        ).map((step) => (
          <button
            key={step.id}
            onClick={() => navigateTo(step.id)}
            className={`px-2 py-0.5 rounded-full transition-colors font-medium cursor-pointer ${
              currentPage === step.id
                ? 'bg-[#1A73E8] text-white font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  );
}
