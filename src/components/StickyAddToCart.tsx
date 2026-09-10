import React from 'react';
import { ShoppingBag, Zap, Check } from 'lucide-react';
import { Product, ProductColor } from '../types';

interface StickyAddToCartProps {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAdded: boolean;
}

export const StickyAddToCart: React.FC<StickyAddToCartProps> = ({
  product,
  selectedColor,
  selectedSize,
  onAddToCart,
  onBuyNow,
  isAdded,
}) => {
  return (
    <aside
      id="sticky-mobile-pdp-bar"
      aria-label="Product actions"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-4 py-3 shadow-lg lg:hidden"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Price */}
        <div className="flex items-center gap-2.5 min-w-0 flex-shrink">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-11 h-11 object-cover rounded-lg border border-gray-100 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-gray-900 truncate">
              ${product.price.toFixed(2)}
            </div>
            <div className="text-[10px] text-gray-500 truncate flex items-center gap-1">
              <span
                className="inline-block w-2 h-2 rounded-full border border-gray-300"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <span>{selectedColor.name}</span>
              {selectedSize && <span>• {selectedSize}</span>}
            </div>
          </div>
        </div>

        {/* Right: Add to Cart and Quick Buy Buttons */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            id="btn-sticky-add-cart"
            onClick={onAddToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              isAdded
                ? 'bg-[#34A853] text-white'
                : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-sm'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            id="btn-sticky-buy-now"
            onClick={onBuyNow}
            className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl font-bold text-xs bg-[#202124] text-white hover:bg-black transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">Instant</span> Buy
          </button>
        </div>
      </div>
    </aside>
  );
};
