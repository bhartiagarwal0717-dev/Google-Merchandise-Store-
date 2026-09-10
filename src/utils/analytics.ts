import { AnalyticsEvent, Product, CartItem, Order } from '../types';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-8HJ1CLD8CP';

function sendGAEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      send_to: GA_MEASUREMENT_ID,
    });
  }
}

type AnalyticsListener = (events: AnalyticsEvent[]) => void;

class AnalyticsManager {
  private events: AnalyticsEvent[] = [];
  private listeners: Set<AnalyticsListener> = new Set();

  private logEvent(
    eventName: AnalyticsEvent['eventName'],
    metadata: Record<string, unknown>
  ) {
    const event: AnalyticsEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      eventName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      metadata,
    };

    this.events = [event, ...this.events.slice(0, 49)];
    // Output clearly to console for analytics auditing
    console.log(`[Analytics: ${eventName}]`, metadata);

    this.listeners.forEach((listener) => listener([...this.events]));
  }

  public subscribe(listener: AnalyticsListener): () => void {
    this.listeners.add(listener);
    listener([...this.events]);
    return () => this.listeners.delete(listener);
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
    this.listeners.forEach((listener) => listener([]));
  }

  /**
   * Track Page View in GA4
   */
  public trackPageView(pageTitle: string, pagePath: string) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath,
        page_location: window.location.origin + pagePath,
        send_to: GA_MEASUREMENT_ID,
      });
    }
  }

  /**
   * Analytics Placeholder 1: Product View
   * Fired whenever a user opens a product detail page or expands preview
   */
  public trackProductView(product: Product, source: string = 'product_page') {
    this.logEvent('Product View', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      source,
    });
    sendGAEvent('view_item', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        },
      ],
    });
  }

  /**
   * Analytics Placeholder 2: Search
   * Fired when a user searches for a query e.g. "hoodie"
   */
  public trackSearch(query: string, resultCount: number, filterCategory?: string) {
    this.logEvent('Search', {
      query,
      resultCount,
      filterCategory: filterCategory || 'all',
    });
    sendGAEvent('search', {
      search_term: query,
    });
  }

  /**
   * Analytics Placeholder 3: Add to Cart
   * Fired when an item is added to the shopping bag with chosen color and size
   */
  public trackAddToCart(item: { product: Product; color: string; size: string; quantity: number }) {
    this.logEvent('Add to Cart', {
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      selectedColor: item.color,
      selectedSize: item.size,
      quantity: item.quantity,
      value: item.product.price * item.quantity,
    });
    sendGAEvent('add_to_cart', {
      currency: 'USD',
      value: item.product.price * item.quantity,
      items: [
        {
          item_id: item.product.id,
          item_name: item.product.name,
          item_category: item.product.category,
          item_variant: `${item.color} / ${item.size}`,
          price: item.product.price,
          quantity: item.quantity,
        },
      ],
    });
  }

  /**
   * Analytics Placeholder 4: Begin Checkout
   * Fired when a user clicks Proceed to Checkout from the cart
   */
  public trackBeginCheckout(items: CartItem[], totalAmount: number) {
    this.logEvent('Begin Checkout', {
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      totalValue: totalAmount,
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        qty: i.quantity,
      })),
    });
    sendGAEvent('begin_checkout', {
      currency: 'USD',
      value: totalAmount,
      items: items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.name,
        item_category: i.product.category,
        item_variant: `${i.selectedColor.name} / ${i.selectedSize}`,
        price: i.product.price,
        quantity: i.quantity,
      })),
    });
  }

  /**
   * Analytics Placeholder 5: Payment Started
   * Fired when a user arrives at the payment step and selects a payment method
   */
  public trackPaymentStarted(method: string, totalAmount: number) {
    this.logEvent('Payment Started', {
      paymentMethod: method,
      totalAmount,
    });
    sendGAEvent('add_payment_info', {
      currency: 'USD',
      value: totalAmount,
      payment_type: method,
    });
  }

  /**
   * Analytics Placeholder 6: Purchase
   * Fired upon successful order authorization and generation of confirmation
   */
  public trackPurchase(order: Order) {
    this.logEvent('Purchase', {
      orderId: order.orderNumber,
      total: order.total,
      subtotal: order.subtotal,
      shipping: order.shippingCost,
      itemCount: order.items.reduce((s, i) => sumWithQuantity(s, i), 0),
      paymentMethod: order.paymentMethod,
    });
    sendGAEvent('purchase', {
      transaction_id: order.orderNumber,
      value: order.total,
      currency: 'USD',
      tax: order.estimatedTax,
      shipping: order.shippingCost,
      items: order.items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.name,
        item_category: i.product.category,
        item_variant: `${i.selectedColor.name} / ${i.selectedSize}`,
        price: i.product.price,
        quantity: i.quantity,
      })),
    });
  }
}

function sumWithQuantity(sum: number, item: CartItem): number {
  return sum + item.quantity;
}

export const analytics = new AnalyticsManager();
