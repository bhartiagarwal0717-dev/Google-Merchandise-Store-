export type CategoryId = 'all' | 'apparel' | 'drinkware' | 'accessories' | 'stationery' | 'eco';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: 'Google Pixel' | 'Google Cloud' | 'Android' | 'Chrome' | 'Google' | 'YouTube';
  category: CategoryId;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  isEcoFriendly?: boolean;
  stockCount: number;
  description: string;
  features: string[];
  materials: string;
  shippingNote: string;
}

export interface CartItem {
  id: string; // unique item id based on product.id + color + size
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface DeliveryAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  aptSuite?: string;
  city: string;
  state: string;
  pinCode: string;
  shippingMethod: 'standard' | 'express';
}

export type PaymentMethodType = 'google_pay' | 'card' | 'upi' | 'apple_pay';

export interface PaymentDetails {
  method: PaymentMethodType;
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  upiId?: string;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  estimatedTax: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethodType;
  estimatedDeliveryDate: string;
  trackingStatus: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
}

export type PageView =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout-delivery'
  | 'checkout-payment'
  | 'order-confirmation';

export interface AnalyticsEvent {
  id: string;
  eventName: 'Product View' | 'Search' | 'Add to Cart' | 'Begin Checkout' | 'Payment Started' | 'Purchase';
  timestamp: string;
  metadata: Record<string, unknown>;
}
