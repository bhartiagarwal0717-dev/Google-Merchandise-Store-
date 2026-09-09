import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Truck,
  Sparkles
} from 'lucide-react';
import { CartItem, PageView, Product } from '../types';
import { analytics } from '../utils/analytics';
import { PRODUCTS } from '../data/products';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNavigate: (page: PageView) => void;
  onSelectProduct: (product: Product) => void;
  appliedDiscount: number;
  onApplyPromo: (code: string) => boolean;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  onSelectProduct,
  appliedDiscount,
  onApplyPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping threshold ($45)
  const freeShippingThreshold = 45.0;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedDiscount === 100;
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 4.99;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Discount calculation
  const discountAmount = (subtotal * appliedDiscount) / 100;

  // Estimated Tax (approx 8.5%)
  const estimatedTax = subtotal > 0 ? (subtotal - discountAmount) * 0.085 : 0;

  // Final Total
  const total = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const success = onApplyPromo(promoInput.trim().toUpperCase());
    if (success) {
      setPromoMessage({ text: `Promo code "${promoInput.toUpperCase()}" applied successfully!`, isError: false });
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try "GOOGLE10" for 10% off.', isError: true });
    }
  };

  const handleProceedToCheckout = () => {
    analytics.trackBeginCheckout(items, total);
    onNavigate('checkout-delivery');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 text-[#1A73E8] flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your shopping bag is empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Explore authentic Google Pixel apparel, recycled backpacks, and Chrome Dino collectibles.
          </p>
        </div>

        <button
          id="btn-empty-cart-shop"
          onClick={() => onNavigate('catalog')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A73E8] text-white font-bold text-xs hover:bg-blue-700 shadow-md transition-all cursor-pointer"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Quick suggestions */}
        <div className="pt-8 border-t border-gray-100 text-left">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Popular Right Now
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.slice(0, 2).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onNavigate('product-detail');
                }}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 cursor-pointer transition-all"
              >
                <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs font-bold text-[#1A73E8]">${p.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review your chosen items before guest checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Free shipping meter & Items list */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dynamic Free Shipping Threshold Meter */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <Truck className="w-4 h-4 text-[#1A73E8]" />
                {isFreeShipping ? (
                  <span className="text-emerald-700">
                    🎉 You've unlocked Free Carbon-Neutral Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#1A73E8]">${amountToFreeShipping.toFixed(2)}</strong> more for Free Shipping
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-gray-400">
                {progressPercent}%
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShipping ? 'bg-[#34A853]' : 'bg-[#1A73E8]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 shadow-2xs overflow-hidden">
            {items.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-center"
              >
                {/* Thumbnail */}
                <div
                  className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 cursor-pointer border border-gray-100"
                  onClick={() => {
                    onSelectProduct(item.product);
                    onNavigate('product-detail');
                  }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#1A73E8] uppercase tracking-wider">
                        {item.product.brand}
                      </span>
                      <h3
                        onClick={() => {
                          onSelectProduct(item.product);
                          onNavigate('product-detail');
                        }}
                        className="text-sm font-semibold text-gray-900 truncate hover:text-[#1A73E8] cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      id={`btn-remove-item-${item.id}`}
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Remove item from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Chosen Variant Badges */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-gray-300"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span>{item.selectedColor.name}</span>
                    </div>
                    {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                  </div>

                  {/* Quantity Stepper & Subtotal Row */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      {item.quantity > 1 && (
                        <div className="text-[10px] text-gray-400">
                          ${item.product.price.toFixed(2)} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reassurance note */}
          <div className="flex items-center gap-2 p-3 bg-blue-50/70 rounded-xl text-xs text-blue-900 font-medium">
            <Sparkles className="w-4 h-4 text-[#1A73E8]" />
            <span>Official Google merchandise with 30-day free campus returns.</span>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromoCode} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="promo-code-input"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder='Promo code (e.g. "GOOGLE10")'
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black font-bold text-xs transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {promoMessage && (
                <p
                  className={`text-[11px] font-medium flex items-center gap-1 ${
                    promoMessage.isError ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {promoMessage.isError ? '✕' : <Check className="w-3 h-3" />}
                  {promoMessage.text}
                </p>
              )}
            </form>

            {/* Price Line Breakdown */}
            <div className="border-t border-gray-100 pt-3 space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Google Promotion ({appliedDiscount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Estimated Shipping
                  <span className="text-[10px] text-gray-400">(Carbon-neutral)</span>
                </span>
                <span className="font-semibold text-gray-900">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-semibold text-gray-900">${estimatedTax.toFixed(2)}</span>
              </div>

              {/* Total Row */}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Estimated Total</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                  <div className="text-[10px] text-gray-400">USD (all duties included)</div>
                </div>
              </div>
            </div>

            {/* Primary Guest Checkout Button */}
            <button
              id="btn-proceed-checkout"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#1A73E8] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Proceed to Guest Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Reassurance */}
            <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>No account required • 256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
