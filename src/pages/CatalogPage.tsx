import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Check, Search, Sparkles } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { Product, CategoryId } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CatalogPageProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

type SortOption = 'featured' | 'bestselling' | 'price-asc' | 'price-desc' | 'rating';

export const CatalogPage: React.FC<CatalogPageProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(120);
  const [ecoOnly, setEcoOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedColorFilter, setSelectedColorFilter] = useState<string | null>(null);

  // Active category details
  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'eco') {
        list = list.filter((p) => p.isEcoFriendly);
      } else {
        list = list.filter((p) => p.category === selectedCategory);
      }
    }

    // Search query filter (e.g. typing "hoodie")
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Price filter
    list = list.filter((p) => p.price <= maxPrice);

    // Eco filter
    if (ecoOnly) {
      list = list.filter((p) => p.isEcoFriendly);
    }

    // In Stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.stockCount > 0);
    }

    // Color filter
    if (selectedColorFilter) {
      list = list.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase().includes(selectedColorFilter.toLowerCase()))
      );
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'bestselling':
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0; // featured default ordering
      }
    });

    return list;
  }, [selectedCategory, searchQuery, maxPrice, ecoOnly, inStockOnly, selectedColorFilter, sortBy]);

  const activeFilterCount =
    (maxPrice < 120 ? 1 : 0) +
    (ecoOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (selectedColorFilter ? 1 : 0);

  const resetFilters = () => {
    setMaxPrice(120);
    setEcoOnly(false);
    setInStockOnly(false);
    setSelectedColorFilter(null);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Category Header & Item Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {activeCategoryObj.name}
            </h1>
            <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
              {filteredProducts.length} items
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Official Google merchandise, developer gear, and sustainable campus essentials.
          </p>
        </div>

        {/* Search within catalog */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="catalog-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Filter catalog (e.g. "hoodie")...'
            className="w-full pl-9 pr-8 py-2 rounded-full bg-white border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Search Autocomplete Tag suggestions */}
      {!searchQuery && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs text-gray-500">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Popular:
          </span>
          {['hoodie', 'backpack', 'dino', 'plush', 'tee', 'tumbler'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-[#1A73E8] transition-colors whitespace-nowrap text-[11px] font-medium text-gray-700"
            >
              "{tag}"
            </button>
          ))}
        </div>
      )}

      {/* Controls Bar: Mobile Filters Button & Sort Select */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
        <button
          id="btn-open-catalog-filters"
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            activeFilterCount > 0
              ? 'bg-blue-50 border-blue-200 text-[#1A73E8]'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#1A73E8] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Active Filter Chips */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto text-xs">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-medium">
              Search: "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </span>
          )}
          {ecoOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium">
              Eco-Conscious Only
              <X className="w-3 h-3 cursor-pointer" onClick={() => setEcoOnly(false)} />
            </span>
          )}
          {selectedColorFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-[11px] font-medium">
              Color: {selectedColorFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedColorFilter(null)} />
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 underline ml-2"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            id="catalog-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer pr-2"
          >
            <option value="featured">Featured First</option>
            <option value="bestselling">Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* 2-Column Mobile Product Grid (Responsive to 3 and 4 on larger screens) */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No products match your criteria</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
            Try adjusting your search query, increasing your price range, or clearing applied filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-full bg-[#1A73E8] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      )}

      {/* Mobile Filter Slide-over Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-slide-left">
            {/* Filter Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-700" />
                <h3 className="font-bold text-gray-900 text-sm">Filter Products</h3>
              </div>
              <button
                id="btn-close-filter-sheet"
                onClick={() => setIsFilterOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-gray-700">
              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Max Price</span>
                  <span className="text-[#1A73E8] font-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1A73E8]"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>$15</span>
                  <span>$120+</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-gray-800">Eco-Conscious Only</span>
                  <input
                    type="checkbox"
                    checked={ecoOnly}
                    onChange={(e) => setEcoOnly(e.target.checked)}
                    className="w-4 h-4 text-[#1A73E8] rounded focus:ring-blue-500 accent-[#1A73E8]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-gray-800">In Stock Ready to Ship</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-[#1A73E8] rounded focus:ring-blue-500 accent-[#1A73E8]"
                  />
                </label>
              </div>

              {/* Color Tones */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="font-semibold text-gray-900 block">Color Palette</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Black', 'Grey', 'White', 'Blue', 'Green', 'Red'].map((colorName) => {
                    const isSelected = selectedColorFilter === colorName;
                    return (
                      <button
                        key={colorName}
                        onClick={() =>
                          setSelectedColorFilter(isSelected ? null : colorName)
                        }
                        className={`p-2 rounded-xl border text-left font-medium flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-[#1A73E8]'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span>{colorName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filter Footer Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="w-1/3 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-2/3 py-2.5 rounded-xl bg-[#1A73E8] text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
