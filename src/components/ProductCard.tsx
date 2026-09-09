import React from 'react';
import { Star, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  isQuickAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  isQuickAdded,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-gray-100/90 overflow-hidden flex flex-col hover:shadow-md transition-all duration-200"
    >
      {/* Product Image Area with Badges */}
      <div
        className="relative aspect-square w-full bg-gray-50 overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-amber-800 px-2 py-0.5 rounded-full shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1A73E8] text-white px-2 py-0.5 rounded-full shadow-xs">
              New
            </span>
          )}
          {product.isEcoFriendly && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#34A853] text-white px-2 py-0.5 rounded-full shadow-xs">
              Eco-Conscious
            </span>
          )}
        </div>

        {/* Quick Add floating action button for quick mobile conversion */}
        {onQuickAdd && (
          <button
            id={`quick-add-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            aria-label={`Quick add ${product.name} to cart`}
            className={`absolute bottom-2.5 right-2.5 p-2 rounded-full shadow-md transition-all duration-200 cursor-pointer ${
              isQuickAdded
                ? 'bg-[#34A853] text-white scale-105'
                : 'bg-white/95 text-gray-800 hover:bg-[#1A73E8] hover:text-white backdrop-blur-xs'
            }`}
          >
            {isQuickAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Product Information */}
      <div
        className="p-3 sm:p-4 flex-1 flex flex-col justify-between cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <div>
          {/* Brand Tag & Rating */}
          <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
            <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">
              {product.brand}
            </span>
            <div className="flex items-center text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="ml-1 text-gray-700">{product.rating}</span>
              <span className="text-gray-400 ml-0.5 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1A73E8] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Bottom Section: Color Swatches & Price */}
        <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color preview dots */}
          <div className="flex items-center -space-x-1">
            {product.colors.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-white shadow-xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] text-gray-400 pl-1.5 font-medium">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
