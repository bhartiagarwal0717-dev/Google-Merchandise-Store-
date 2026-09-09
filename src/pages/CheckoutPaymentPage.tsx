import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Sparkles,
  Smartphone,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  CartItem,
  DeliveryAddress,
  PaymentMethodType,
  PaymentDetails,
  PageView,
  Order
} from '../types';
import { CheckoutProgress } from '../components/CheckoutProgress';
import { analytics } from '../utils/analytics';

interface CheckoutPaymentPageProps {
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  subtotal: number;
  discount: number;
  onNavigate: (page: PageView) => void;
  onCompleteOrder: (order: Order) => void;
}

export const CheckoutPaymentPage: React.FC<CheckoutPaymentPageProps> = ({
  items,
  deliveryAddress,
  subtotal,
  discount,
  onNavigate,
  onCompleteOrder,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('google_pay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card details state
  const [cardName, setCardName] = useState('Alex Chen');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8492');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('321');

  // UPI state
  const [upiId, setUpiId] = useState('alex.chen@okhdfcbank');

  const shippingCost = deliveryAddress.shippingMethod === 'express' ? 9.99 : subtotal >= 45 ? 0 : 4.99;
  const estimatedTax = (subtotal - discount) * 0.085;
  const total = Math.max(0, subtotal - discount + shippingCost + estimatedTax);

  // Track Payment Started event on mount and method change
  useEffect(() => {
    analytics.trackPaymentStarted(selectedMethod, total);
  }, [selectedMethod, total]);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate authentic network verification & authorization delay
    setTimeout(() => {
      const orderNumber = 'GMS-' + Math.floor(100000 + Math.random() * 900000);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (deliveryAddress.shippingMethod === 'express' ? 2 : 4));

      const finalOrder: Order = {
        orderNumber,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...items],
        subtotal,
        discount,
        shippingCost,
        estimatedTax,
        total,
        deliveryAddress,
        paymentMethod: selectedMethod,
        estimatedDeliveryDate: deliveryDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }),
        trackingStatus: 'confirmed',
      };

      analytics.trackPurchase(finalOrder);
      setIsProcessing(false);
      onCompleteOrder(finalOrder);
      onNavigate('order-confirmation');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Checkout Progress Stepper */}
      <CheckoutProgress currentStep="payment" />

      {/* Simulated Notice Banner */}
      <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Interactive Prototype Simulation:</strong> No real payment will be charged.
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
          Safe Mode
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Payment Method Selection & Form */}
        <div className="lg:col-span-8 space-y-5">
          {/* Delivery Snapshot with Edit Shortcut */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex items-center justify-between">
            <div className="text-xs">
              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                <span>Deliver to: {deliveryAddress.fullName}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                  {deliveryAddress.shippingMethod === 'express' ? 'Express' : 'Standard'}
                </span>
              </div>
              <p className="text-gray-500 mt-0.5 truncate max-w-md">
                {deliveryAddress.addressLine}, {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.pinCode}
              </p>
            </div>
            <button
              onClick={() => onNavigate('checkout-delivery')}
              className="text-xs font-semibold text-[#1A73E8] hover:underline flex items-center gap-1 flex-shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* Payment Methods Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Select Payment Method</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Choose your preferred simulated mobile payment provider.
              </p>
            </div>

            {/* Payment Method Tabs / Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {/* Google Pay */}
              <button
                type="button"
                id="tab-payment-google-pay"
                onClick={() => setSelectedMethod('google_pay')}
                className={`p-3 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'google_pay'
                    ? 'border-[#1A73E8] bg-blue-50/50 text-[#1A73E8] ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-sm">
                  <span className="text-blue-600">G</span>
                  <span className="text-gray-800">Pay</span>
                </div>
                <span className="text-[10px] text-gray-500 font-normal">Fast 1-Tap</span>
              </button>

              {/* Credit / Debit Card */}
              <button
                type="button"
                id="tab-payment-card"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'card'
                    ? 'border-[#1A73E8] bg-blue-50/50 text-[#1A73E8] ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-gray-700" />
                <span className="text-xs font-semibold">Credit/Debit</span>
              </button>

              {/* UPI */}
              <button
                type="button"
                id="tab-payment-upi"
                onClick={() => setSelectedMethod('upi')}
                className={`p-3 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'upi'
                    ? 'border-[#1A73E8] bg-blue-50/50 text-[#1A73E8] ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold">UPI / VPA</span>
              </button>

              {/* Apple Pay */}
              <button
                type="button"
                id="tab-payment-apple-pay"
                onClick={() => setSelectedMethod('apple_pay')}
                className={`p-3 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'apple_pay'
                    ? 'border-[#1A73E8] bg-blue-50/50 text-[#1A73E8] ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-sm font-semibold"> Pay</span>
                <span className="text-[10px] text-gray-500 font-normal">Touch/Face ID</span>
              </button>
            </div>

            {/* Dynamic Form per Method */}
            <form onSubmit={handleSimulatePayment} className="space-y-4 text-xs">
              {/* Method 1: Google Pay */}
              {selectedMethod === 'google_pay' && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Connected Google Account:</span>
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ready for 1-Tap Authorization
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      G
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{deliveryAddress.email || 'alex.chen@google.com'}</p>
                      <p className="text-[11px] text-gray-400">Default: Visa ending in ••42</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Google Pay automatically secures card details and delivers instant fraud protection.
                  </p>
                </div>
              )}

              {/* Method 2: Card */}
              {selectedMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Security Code (CVV)</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Method 3: UPI */}
              {selectedMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                    />
                  </div>
                  {/* Quick Handle pills */}
                  <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
                    <span className="text-gray-400">Quick handles:</span>
                    {['@okhdfcbank', '@okaxis', '@oksbi', '@paytm'].map((h) => (
                      <button
                        type="button"
                        key={h}
                        onClick={() => setUpiId((prev) => prev.split('@')[0] + h)}
                        className="px-2 py-0.5 rounded-md bg-white border border-gray-200 hover:border-blue-400 text-gray-700"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Method 4: Apple Pay */}
              {selectedMethod === 'apple_pay' && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-center">
                  <span className="text-2xl font-bold"> Pay</span>
                  <p className="text-xs text-gray-600">
                    Use Face ID or Touch ID on supported Apple devices to authorize payment.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('checkout-delivery')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Delivery</span>
                </button>

                <button
                  id="btn-confirm-payment"
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs bg-[#1A73E8] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ${total.toFixed(2)} with {selectedMethod === 'google_pay' ? 'Google Pay' : selectedMethod === 'upi' ? 'UPI' : selectedMethod === 'apple_pay' ? 'Apple Pay' : 'Card'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Detailed Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold text-gray-900 text-sm">Order Review</h3>

            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promotion</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-semibold text-gray-900">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-bold text-gray-900">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl space-y-1 text-emerald-900 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Google Payment Protection</span>
              </div>
              <p className="text-emerald-800/90 leading-tight">
                Simulated transaction is protected by mock biometric authorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
