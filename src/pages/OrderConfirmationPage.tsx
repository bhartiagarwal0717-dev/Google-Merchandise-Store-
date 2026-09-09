import React, { useState } from 'react';
import {
  CheckCircle,
  Truck,
  Package,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  X,
  Sparkles
} from 'lucide-react';
import { Order, PageView } from '../types';
import { CheckoutProgress } from '../components/CheckoutProgress';

interface OrderConfirmationPageProps {
  order: Order | null;
  onNavigate: (page: PageView) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigate,
}) => {
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [downloadedReceipt, setDownloadedReceipt] = useState(false);

  // Fallback if accessed without prior checkout flow
  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">No active order found</h2>
        <p className="text-xs text-gray-500">
          You haven't completed an order in this session yet. Explore the merchandise catalog to simulate an order.
        </p>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-6 py-2.5 rounded-full bg-[#1A73E8] text-white font-bold text-xs hover:bg-blue-700 transition-colors"
        >
          Go to Catalog
        </button>
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    setDownloadedReceipt(true);
    setTimeout(() => setDownloadedReceipt(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Checkout Progress Stepper (Done stage active) */}
      <CheckoutProgress currentStep="confirmation" />

      {/* Hero Confirmation Banner */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-2xs text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#34A853] flex items-center justify-center mx-auto shadow-sm animate-scale-up">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            ✓ Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 pt-1">
            Thank you for your order!
          </h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            A confirmation receipt and carbon-neutral tracking link has been sent to{' '}
            <strong className="text-gray-800">{order.deliveryAddress.email || 'your email'}</strong>.
          </p>
        </div>

        {/* Quick Details Strip */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs">
          <div>
            <span className="text-[11px] text-gray-400 font-medium block">Order Number</span>
            <span className="font-bold text-gray-900">#{order.orderNumber}</span>
          </div>

          <div>
            <span className="text-[11px] text-gray-400 font-medium block">Delivery Estimate</span>
            <span className="font-bold text-emerald-700">{order.estimatedDeliveryDate}</span>
          </div>

          <div>
            <span className="text-[11px] text-gray-400 font-medium block">Total Paid</span>
            <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
          </div>

          <div>
            <span className="text-[11px] text-gray-400 font-medium block">Payment Method</span>
            <span className="font-bold text-gray-900 uppercase">{order.paymentMethod.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-track-order"
            onClick={() => setShowTrackingModal(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1A73E8] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order</span>
          </button>

          <button
            id="btn-continue-shopping"
            onClick={() => onNavigate('catalog')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-download-receipt"
            onClick={handleDownloadReceipt}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadedReceipt ? 'Receipt Downloaded!' : 'Download Receipt'}</span>
          </button>
        </div>
      </div>

      {/* Purchased Products Breakdown */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-gray-900">Purchased Products ({order.items.length})</h2>

        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center gap-3">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-14 h-14 object-cover rounded-xl border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#1A73E8] uppercase tracking-wider">
                  {item.product.brand}
                </span>
                <h4 className="text-xs font-semibold text-gray-900 truncate">
                  {item.product.name}
                </h4>
                <p className="text-[11px] text-gray-500">
                  Qty: {item.quantity} • {item.selectedColor.name} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary table */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Applied Promo</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span>${order.estimatedTax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm text-gray-900">
            <span>Total Paid</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Destination Address */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-2xs flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-blue-50 text-[#1A73E8]">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <h3 className="font-bold text-gray-900 text-sm">Shipping Destination</h3>
          <p className="font-semibold text-gray-800">{order.deliveryAddress.fullName}</p>
          <p className="text-gray-500">
            {order.deliveryAddress.addressLine}
            {order.deliveryAddress.aptSuite ? `, ${order.deliveryAddress.aptSuite}` : ''}
          </p>
          <p className="text-gray-500">
            {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pinCode}
          </p>
          <p className="text-gray-500">Phone: {order.deliveryAddress.phone}</p>
        </div>
      </div>

      {/* Interactive Track Order Drawer / Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#1A73E8]" />
                <h3 className="font-bold text-gray-900 text-base">Live Order Tracking</h3>
              </div>
              <button
                id="btn-close-tracking-modal"
                onClick={() => setShowTrackingModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-500">Tracking Code: GMS-TRK-98310940</div>
              <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                Estimated Delivery: {order.estimatedDeliveryDate}
              </div>
            </div>

            {/* Carrier Milestones Timeline */}
            <div className="space-y-4 text-xs pl-2 border-l-2 border-blue-200 ml-4">
              {/* Step 1 */}
              <div className="relative pl-6">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-[#34A853] text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <div className="font-bold text-gray-900">Order Confirmed & Payment Authorized</div>
                <p className="text-[11px] text-gray-500">Mountain View Fulfillment System</p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-6">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-[#1A73E8] text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                  2
                </div>
                <div className="font-bold text-blue-900">Packed in 100% Recyclable Packaging</div>
                <p className="text-[11px] text-blue-800/80">Campus Logistics Hub (In Progress)</p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-6">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                  3
                </div>
                <div className="font-semibold text-gray-400">Handed to Carbon-Neutral Fleet</div>
                <p className="text-[11px] text-gray-400">Pending Carrier Dispatch</p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-6">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                  4
                </div>
                <div className="font-semibold text-gray-400">Delivered to Destination</div>
                <p className="text-[11px] text-gray-400">{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
              </div>
            </div>

            <button
              onClick={() => setShowTrackingModal(false)}
              className="w-full py-3 rounded-xl bg-[#1A73E8] text-white font-bold text-xs"
            >
              Done Tracking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
