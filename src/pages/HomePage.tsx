import React from 'react';
import { ArrowRight, Sparkles, Star, Shield, Leaf, HeartHandshake, Flame } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { Product, CategoryId, PageView } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (catId: CategoryId) => void;
  onNavigate: (page: PageView) => void;
  onQuickAdd: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
  onSelectCategory,
  onNavigate,
  onQuickAdd,
}) => {
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.isNew || p.isEcoFriendly).slice(0, 4);
  const heroHoodie = PRODUCTS.find((p) => p.id === 'google-pixel-organic-hoodie') || PRODUCTS[0];

  return (
    <div className="space-y-10 pb-12">
      {/* Mobile-First Hero Section */}
      <section className="px-4 sm:px-6 pt-4">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-[#F8F9FA] via-white to-blue-50/40 border border-gray-100 p-6 sm:p-12 overflow-hidden relative shadow-xs">
          {/* Subtle Ambient Google colored dots */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1A73E8] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The 2025 Core Google Collection</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Designed for Googlers, Developers & Creators.
              </h1>

              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto sm:mx-0 leading-relaxed">
                Organic combed cotton, recycled tech accessories, and limited-edition Chrome Dino collectibles. Engineered for daily comfort and zero carbon emissions.
              </p>

              {/* Social Proof Star Pill */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-gray-600">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-gray-900">4.9/5</span>
                <span>from 14,000+ verified campus reviews</span>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  id="hero-shop-now-btn"
                  onClick={() => {
                    onSelectCategory('all');
                    onNavigate('catalog');
                  }}
                  className="px-6 py-3.5 rounded-full bg-[#1A73E8] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Shop All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-explore-hoodies-btn"
                  onClick={() => {
                    onSelectProduct(heroHoodie);
                    onNavigate('product-detail');
                  }}
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm border border-gray-200 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-[#EA4335]" />
                  <span>Pixel Organic Hoodie ($64)</span>
                </button>
              </div>
            </div>

            {/* Right Hero Product Feature Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                id="hero-feature-card"
                onClick={() => {
                  onSelectProduct(heroHoodie);
                  onNavigate('product-detail');
                }}
                className="relative cursor-pointer group max-w-sm w-full"
              >
                <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100">
                  <img
                    src={heroHoodie.images[0]}
                    alt={heroHoodie.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-bold text-gray-900 px-3 py-1 rounded-full shadow-xs">
                    ★ Best Seller
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-gray-100/80 flex items-center justify-between shadow-xs">
                    <div>
                      <div className="text-xs font-semibold text-gray-900 truncate">
                        {heroHoodie.name}
                      </div>
                      <div className="text-xs font-bold text-[#1A73E8]">${heroHoodie.price.toFixed(2)}</div>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      View Specs →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Bubbles for Mobile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Explore by Category</h2>
            <p className="text-xs text-gray-500">Tap to browse curated Google merchandise collections</p>
          </div>
          <button
            id="btn-see-all-categories"
            onClick={() => {
              onSelectCategory('all');
              onNavigate('catalog');
            }}
            className="text-xs font-bold text-[#1A73E8] hover:underline flex items-center gap-1"
          >
            See All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable / Grid Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`home-cat-card-${cat.id}`}
              onClick={() => {
                onSelectCategory(cat.id as CategoryId);
                onNavigate('catalog');
              }}
              className="p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-[#1A73E8] text-[#1A73E8] group-hover:text-white flex items-center justify-center transition-colors mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 group-hover:text-[#1A73E8] transition-colors leading-tight">
                  {cat.name}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">{cat.count} items</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Best Sellers (2-Column Mobile Product Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-0.5">
              <Flame className="w-4 h-4" />
              <span>Campus Favorites</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Best Sellers</h2>
          </div>
          <button
            id="btn-view-all-bestsellers"
            onClick={() => {
              onSelectCategory('all');
              onNavigate('catalog');
            }}
            className="text-xs font-bold text-[#1A73E8] hover:underline"
          >
            View All ({PRODUCTS.length})
          </button>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      </section>

      {/* Promotional Section - Google Sustainability & Developer Gear */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[#202124] text-white p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle Google Colors Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]" />

          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-medium">
              <Leaf className="w-3.5 h-3.5" />
              <span>Sustainable Mountain View Initiative</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              100% GOTS-Certified Organic & Recycled Polyester.
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Every hoodie, tumbler, and canvas tote is crafted using carbon-neutral production, water-based dyes, and plastic-free molded pulp packaging. Good for your daily sprint, better for the planet.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-gray-200">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Fair Wear Foundation Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>1% for Campus Green Initiatives</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-promo-eco-collection"
                onClick={() => {
                  onSelectCategory('eco');
                  onNavigate('catalog');
                }}
                className="px-5 py-2.5 rounded-full bg-white text-gray-900 hover:bg-gray-100 text-xs font-bold transition-all cursor-pointer"
              >
                Shop Eco Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals (2-Column Mobile Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#1A73E8] mb-0.5">
              Fresh Drops
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">New Arrivals</h2>
          </div>
          <button
            id="btn-view-all-new"
            onClick={() => {
              onSelectCategory('all');
              onNavigate('catalog');
            }}
            className="text-xs font-bold text-[#1A73E8] hover:underline"
          >
            Explore Catalog
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
