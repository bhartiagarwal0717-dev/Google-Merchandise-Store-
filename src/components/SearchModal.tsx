import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { analytics } from '../utils/analytics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const POPULAR_SEARCHES = ['hoodie', 'backpack', 'dino tumbler', 'organic tee', 'dash plush', 'cap'];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'apparel' | 'drinkware' | 'accessories'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedFilter('all');
    }
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesFilter = selectedFilter === 'all' || p.category === selectedFilter;
      if (!matchesFilter) return false;

      if (!q) return true;

      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [query, selectedFilter]);

  // Track search in analytics when user has typed at least 2 chars
  useEffect(() => {
    if (query.trim().length >= 2) {
      const timer = setTimeout(() => {
        analytics.trackSearch(query, filteredProducts.length, selectedFilter);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [query, filteredProducts.length, selectedFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="relative min-h-screen px-4 pt-4 pb-20 sm:p-6 flex justify-center items-start">
        <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-10 animate-scale-up">
          {/* Search Header Bar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              id="search-input-modal"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products (try 'hoodie', 'backpack', 'dino')..."
              className="flex-1 bg-transparent border-none text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
            />
            {query && (
              <button
                id="btn-clear-search"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              id="btn-close-search-modal"
              onClick={onClose}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>

          {/* Quick Filters */}
          <div className="px-4 py-2.5 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Filter:
            </span>
            {(['all', 'apparel', 'drinkware', 'accessories'] as const).map((filter) => (
              <button
                key={filter}
                id={`search-filter-${filter}`}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter
                    ? 'bg-[#1A73E8] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Quick Popular Autocomplete Suggestions */}
          {!query && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    id={`popular-search-${term}`}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-[#1A73E8] text-xs font-medium text-gray-700 transition-colors"
                  >
                    "{term}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-sm font-semibold text-gray-800 mb-1">No products found for "{query}"</p>
                <p className="text-xs text-gray-500 mb-4">
                  Check spelling or try popular keywords like "hoodie" or "tumbler"
                </p>
                <button
                  id="btn-reset-search-query"
                  onClick={() => {
                    setQuery('hoodie');
                    setSelectedFilter('all');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A73E8] bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                >
                  Search for "hoodie" <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-400 mb-2">
                  {query ? `Found ${filteredProducts.length} matching item${filteredProducts.length === 1 ? '' : 's'}` : 'Suggested Merchandise'}
                </div>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    id={`search-result-item-${product.id}`}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group transition-all"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                          {product.brand}
                        </span>
                        {product.isBestSeller && (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                            Best Seller
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#1A73E8] transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <div className="flex items-center text-[11px] text-amber-500 ml-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                          <span className="ml-0.5 text-gray-600 font-medium">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#1A73E8] group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
