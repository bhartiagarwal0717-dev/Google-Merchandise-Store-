import { AnalyticsEvent, Product, CartItem, Order } from '../types';

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
  }
}

function sumWithQuantity(sum: number, item: CartItem): number {
  return sum + item.quantity;
}

export const analytics = new AnalyticsManager();
