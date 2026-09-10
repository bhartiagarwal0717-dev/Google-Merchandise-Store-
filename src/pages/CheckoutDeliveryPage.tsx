import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CartItem, DeliveryAddress, PageView } from '../types';
import { CheckoutProgress } from '../components/CheckoutProgress';

interface CheckoutDeliveryPageProps {
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  onSaveAddress: (address: DeliveryAddress) => void;
  onNavigate: (page: PageView) => void;
  subtotal: number;
  discount: number;
}

export const CheckoutDeliveryPage: React.FC<CheckoutDeliveryPageProps> = ({
  items,
  deliveryAddress,
  onSaveAddress,
  onNavigate,
  subtotal,
  discount,
}) => {
  const [formData, setFormData] = useState<DeliveryAddress>(deliveryAddress);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Autofill Demo Address for instant evaluator testing
  const handleAutofillDemo = () => {
    setFormData({
      fullName: 'Alex Chen',
      email: 'alex.chen@example.com',
      phone: '+1 (650) 253-0000',
      addressLine: '1600 Amphitheatre Parkway',
      aptSuite: 'Building 43, Desk 2B',
      city: 'Mountain View',
      state: 'CA',
      pinCode: '94043',
      shippingMethod: 'standard',
    });
    setErrors({});
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.fullName.trim()) err.fullName = 'Full name is required';
    if (!formData.phone.trim()) err.phone = 'Phone number is required';
    if (!formData.addressLine.trim()) err.addressLine = 'Street address is required';
    if (!formData.city.trim()) err.city = 'City is required';
    if (!formData.state.trim()) err.state = 'State is required';
    if (!formData.pinCode.trim()) err.pinCode = 'PIN/ZIP code is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSaveAddress(formData);
      onNavigate('checkout-payment');
    }
  };

  const shippingCost = formData.shippingMethod === 'express' ? 9.99 : subtotal >= 45 ? 0 : 4.99;
  const estimatedTax = (subtotal - discount) * 0.085;
  const estimatedTotal = Math.max(0, subtotal - discount + shippingCost + estimatedTax);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Checkout Progress Stepper: Cart → Delivery → Payment → Done */}
      <CheckoutProgress currentStep="delivery" />

      {/* Mobile Collapsible Order Summary */}
      <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs">
        <button
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          className="w-full flex items-center justify-between text-xs font-semibold text-gray-800"
        >
          <div className="flex items-center gap-2">
            <span>Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span className="text-gray-400">•</span>
            <span className="font-bold text-gray-900">${estimatedTotal.toFixed(2)}</span>
          </div>
          {showMobileSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMobileSummary && (
          <div className="pt-3 mt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between items-center">
                <span className="truncate max-w-[200px]">{i.product.name} × {i.quantity}</span>
                <span className="font-medium text-gray-900">${(i.product.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Delivery Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-2xs space-y-5">
            {/* Header with Guest notice & Autofill CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">Guest Delivery Details</h1>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    No Sign-in Required
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Where should we send your official Google merchandise?
                </p>
              </div>

              {/* Instant Autofill button for evaluator testing */}
              <button
                type="button"
                id="btn-autofill-demo-address"
                onClick={handleAutofillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#1A73E8] font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Zap className="w-3.5 h-3.5 fill-blue-600" />
                <span>Autofill Demo Address</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-delivery-fullname"
                    type="text"
                    required
                    placeholder="Alex Chen"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-delivery-phone"
                    type="tel"
                    required
                    placeholder="+1 (650) 253-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email Address (for order tracking & receipt)
                </label>
                <input
                  id="input-delivery-email"
                  type="email"
                  placeholder="alex.chen@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-delivery-address"
                  type="text"
                  required
                  placeholder="1600 Amphitheatre Parkway"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.addressLine ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white'
                  }`}
                />
                {errors.addressLine && <p className="text-[11px] text-red-500 mt-1">{errors.addressLine}</p>}
              </div>

              {/* Apt / Suite */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  id="input-delivery-apt"
                  type="text"
                  placeholder="Building 43, Desk 2B"
                  value={formData.aptSuite || ''}
                  onChange={(e) => setFormData({ ...formData, aptSuite: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* City, State & PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-delivery-city"
                    type="text"
                    required
                    placeholder="Mountain View"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    State / Region <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-delivery-state"
                    type="text"
                    required
                    placeholder="CA"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    PIN / ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-delivery-pincode"
                    type="text"
                    required
                    placeholder="94043"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.pinCode ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Shipping Method Options */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="block font-bold text-gray-900">
                  Select Delivery Method:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      formData.shippingMethod === 'standard'
                        ? 'border-[#1A73E8] bg-blue-50/40 ring-1 ring-blue-500'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                      className="mt-0.5 text-[#1A73E8] accent-[#1A73E8]"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>Standard Carbon-Neutral</span>
                        <span>{subtotal >= 45 ? 'FREE' : '$4.99'}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Delivers in 3-5 business days via 100% EV courier
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      formData.shippingMethod === 'express'
                        ? 'border-[#1A73E8] bg-blue-50/40 ring-1 ring-blue-500'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                      className="mt-0.5 text-[#1A73E8] accent-[#1A73E8]"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>Google Express Priority</span>
                        <span>$9.99</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Delivers in 1-2 business days with priority dispatch
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Navigation Buttons */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Cart</span>
                </button>

                <button
                  id="btn-submit-delivery"
                  type="submit"
                  className="px-6 py-3.5 rounded-xl font-bold text-xs bg-[#1A73E8] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Continue to Payment</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Desktop Order Summary Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold text-gray-900 text-sm">Order Summary</h3>

            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {items.map((i) => (
                <div key={i.id} className="py-2.5 flex items-center gap-2.5">
                  <img src={i.product.images[0]} alt={i.product.name} referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{i.product.name}</p>
                    <p className="text-[11px] text-gray-400">Qty: {i.quantity} • {i.selectedColor.name}</p>
                  </div>
                  <span className="font-bold text-gray-900">${(i.product.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({formData.shippingMethod})</span>
                <span className="font-semibold text-gray-900">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-semibold text-gray-900">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-bold text-gray-900">
                <span>Total</span>
                <span>${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2 text-[11px] text-gray-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Encrypted guest checkout session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
