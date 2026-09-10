import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Ruler,
  ShoppingBag,
  Zap,
  ArrowLeft,
  Heart,
  Plus,
  Minus
} from 'lucide-react';
import { Product, ProductColor, PageView } from '../types';
import { PRODUCTS } from '../data/products';
import { analytics } from '../utils/analytics';
import { StickyAddToCart } from '../components/StickyAddToCart';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  onBuyNow: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: PageView) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onNavigate,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'One Size');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Accordion states
  const [openSection, setOpenSection] = useState<'details' | 'materials' | 'shipping' | null>('details');

  // Track product view in analytics
  useEffect(() => {
    analytics.trackProductView(product, 'pdp_mount');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[0] || 'One Size');
    setQuantity(1);
    setIsAdded(false);
  }, [product]);

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedColor, selectedSize, quantity);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.isBestSeller)).slice(0, 4);

  return (
    <div className="pb-24 lg:pb-16">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-gray-500">
        <button
          id="btn-back-to-catalog"
          onClick={() => onNavigate('catalog')}
          className="flex items-center gap-1 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
            title="Share product link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
              isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-500'
            }`}
            title="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Product Image */}
          <div className="relative aspect-square sm:aspect-4/3 w-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-2xs">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isBestSeller && (
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/95 text-amber-800 px-3 py-1 rounded-full shadow-xs">
                  ★ Best Seller
                </span>
              )}
              {product.isEcoFriendly && (
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#34A853] text-white px-3 py-1 rounded-full shadow-xs">
                  Eco-Conscious
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#1A73E8] shadow-sm scale-105'
                      : 'border-gray-200/80 hover:border-gray-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details, Selection & Add-to-Cart */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Brand */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A73E8] bg-blue-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                In Stock ({product.stockCount} left)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Social Proof */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-900">{product.rating}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 underline font-medium cursor-pointer">
                {product.reviewCount} customer reviews
              </span>
            </div>
          </div>

          {/* Pricing & Value Proposition */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100/90 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <div className="text-[11px] text-gray-500 text-right">
              Free shipping over $45
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">
                Color: <span className="text-[#1A73E8] font-semibold">{selectedColor.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((color) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    id={`color-swatch-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedColor(color)}
                    className={`relative p-1 rounded-full border-2 transition-all cursor-pointer ${
                      isSelected ? 'border-[#1A73E8] scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="block w-7 h-7 rounded-full shadow-xs border border-black/10"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900">
                  Size: <span className="text-gray-600">{selectedSize}</span>
                </span>
                <button
                  id="btn-size-guide"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-[#1A73E8] font-semibold hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      id={`size-btn-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A73E8] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Add to Cart Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-2xs">
                <button
                  id="btn-qty-minus"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  id="btn-qty-plus"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 text-gray-500 hover:text-gray-900 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Desktop Add to Cart */}
              <button
                id="btn-pdp-add-to-cart"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isAdded
                    ? 'bg-[#34A853] text-white'
                    : 'bg-[#1A73E8] hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant Buy Now Button (Bypasses Cart to Guest Checkout) */}
            <button
              id="btn-pdp-buy-now"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#202124] hover:bg-black text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Instant Buy Now (Guest Checkout)</span>
            </button>
          </div>

          {/* Delivery & Assurance Badges */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-white space-y-2.5 text-xs text-gray-600 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#1A73E8] flex-shrink-0" />
              <span>
                <strong>Free Standard Delivery:</strong> Estimated arrival in 2–4 business days.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#34A853] flex-shrink-0" />
              <span>
                <strong>30-Day Campus Returns:</strong> Free prepaid return packaging included.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Authentic Google Merch:</strong> Certified genuine hardware & software gear.
              </span>
            </div>
          </div>

          {/* Accordion Sections for Specifications & Materials */}
          <div className="border-t border-gray-100 divide-y divide-gray-100 text-xs">
            {/* Description & Features */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
                className="w-full py-3.5 flex items-center justify-between font-bold text-gray-900 text-left"
              >
                <span>Product Overview & Features</span>
                {openSection === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'details' && (
                <div className="pb-4 space-y-2 text-gray-600 leading-relaxed">
                  <p>{product.description}</p>
                  <ul className="list-disc pl-5 space-y-1 pt-1 text-gray-700">
                    {product.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Materials & Sustainability */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'materials' ? null : 'materials')}
                className="w-full py-3.5 flex items-center justify-between font-bold text-gray-900 text-left"
              >
                <span>Eco Materials & Sustainability</span>
                {openSection === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'materials' && (
                <div className="pb-4 text-gray-600 leading-relaxed">
                  <p>{product.materials}</p>
                  <p className="mt-1 text-[11px] text-emerald-700 font-medium">
                    🌱 Manufactured with renewable energy and zero single-use plastics.
                  </p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                className="w-full py-3.5 flex items-center justify-between font-bold text-gray-900 text-left"
              >
                <span>Shipping & Return Policy</span>
                {openSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'shipping' && (
                <div className="pb-4 text-gray-600 leading-relaxed">
                  <p>{product.shippingNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 pt-10 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Verified Customer Reviews</h2>
            <p className="text-xs text-gray-500">Based on {product.reviewCount} verified purchases</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900">{product.rating}</span>
            <div className="text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-gray-500">97% would recommend</span>
            </div>
          </div>
        </div>

        {/* Sample Customer Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">Sarah T. (Software Engineer)</span>
              <span className="text-emerald-600 font-medium">✓ Verified Buyer</span>
            </div>
            <div className="flex text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              "The fit is superb and the organic cotton feels extraordinarily soft. The embroidery is subtle enough to wear to team standups and out in the city."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">Devon M. (DevOps Lead)</span>
              <span className="text-emerald-600 font-medium">✓ Verified Buyer</span>
            </div>
            <div className="flex text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              "Delivered in less than 48 hours in fully recyclable packaging. True to size and holds up perfectly after washing."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">Elena K. (UX Designer)</span>
              <span className="text-emerald-600 font-medium">✓ Verified Buyer</span>
            </div>
            <div className="flex text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              "Colors match the official Google Pixel 9 palette seamlessly. Worth every cent for official merchandise."
            </p>
          </div>
        </div>
      </section>

      {/* Recommended / You May Also Like */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <h2 className="text-lg font-bold text-gray-900 mb-4">You May Also Like</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Sticky Mobile Add to Cart Bottom Bar */}
      <StickyAddToCart
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isAdded={isAdded}
      />

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#1A73E8]" />
                <h3 className="font-bold text-gray-900 text-base">Standard Size Chart (Inches)</h3>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto text-xs text-gray-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-2 font-bold">Size</th>
                    <th className="p-2 font-bold">Chest (in)</th>
                    <th className="p-2 font-bold">Length (in)</th>
                    <th className="p-2 font-bold">Sleeve (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-2 font-semibold">XS</td><td className="p-2">34-36</td><td className="p-2">26</td><td className="p-2">32</td></tr>
                  <tr><td className="p-2 font-semibold">S</td><td className="p-2">36-38</td><td className="p-2">27</td><td className="p-2">33</td></tr>
                  <tr><td className="p-2 font-semibold">M</td><td className="p-2">38-40</td><td className="p-2">28</td><td className="p-2">34</td></tr>
                  <tr><td className="p-2 font-semibold">L</td><td className="p-2">40-42</td><td className="p-2">29</td><td className="p-2">35</td></tr>
                  <tr><td className="p-2 font-semibold">XL</td><td className="p-2">44-46</td><td className="p-2">30</td><td className="p-2">36</td></tr>
                  <tr><td className="p-2 font-semibold">2XL</td><td className="p-2">48-50</td><td className="p-2">31</td><td className="p-2">37</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-gray-500">
              *All items are pre-shrunk. For an oversized streetwear aesthetic, order one size up.
            </p>

            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#1A73E8] text-white font-bold text-xs"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
