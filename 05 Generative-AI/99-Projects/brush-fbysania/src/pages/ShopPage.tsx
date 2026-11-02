import React, { useState, useMemo } from 'react';
import { Product, Category, SiteContent } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, Search, Sparkles, X, ChevronDown, Check } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCustomize: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  siteContent: SiteContent;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onOpenCustomize,
  onAddToCart,
  siteContent,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);

  // Extract unique fabric types from available products
  const fabricTypes = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.fabric_type) set.add(p.fabric_type);
    });
    return Array.from(set);
  }, [products]);

  // Extract unique occasions
  const occasions = ['Bridal', 'Festive', 'Partywear', 'Casual', 'Luxury'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
        return false;
      }
      // Fabric filter
      if (selectedFabric !== 'all' && p.fabric_type !== selectedFabric) {
        return false;
      }
      // Occasion filter
      if (selectedOccasion !== 'all' && p.occasion !== selectedOccasion) {
        return false;
      }
      // Customizable only
      if (onlyCustomizable && !p.is_customizable) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabric_type.toLowerCase().includes(q) ||
          p.work_type.toLowerCase().includes(q) ||
          p.available_colors.some(c => c.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedFabric, selectedOccasion, onlyCustomizable, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedFabric('all');
    setSelectedOccasion('all');
    setOnlyCustomizable(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedFabric !== 'all' ||
    selectedOccasion !== 'all' ||
    onlyCustomizable ||
    searchQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF0F3] border border-[#F3C5D4] text-[#BE185D] text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Artisanal Handcrafted Dupattas</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#3D2C2E]">
          The Dupatta Collection
        </h1>
        <p className="text-sm text-[#7A5A62] font-sans-clean leading-relaxed">
          Explore our range of hand-painted organza, pure crinkle chiffon, gotta-embellished bridal veils, and raw silk shawls. Every piece can be customized to match your dress.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#FCE7EB] shadow-xs space-y-4">
        
        {/* Top Row: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#9D7983] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by flower, color, fabric (e.g. Organza, Rose, Nikkah)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#FCE7EB] text-xs bg-[#FFF8F9]/50 focus:bg-white focus:border-[#BE185D] focus:outline-hidden text-[#3D2C2E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9D7983] hover:text-[#BE185D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <label className="flex items-center gap-2 text-xs text-[#831843] font-medium cursor-pointer select-none bg-[#FFF0F3] px-3.5 py-2 rounded-xl border border-[#F3C5D4]/60">
              <input
                type="checkbox"
                checked={onlyCustomizable}
                onChange={(e) => setOnlyCustomizable(e.target.checked)}
                className="rounded text-[#BE185D] focus:ring-[#BE185D]"
              />
              <span>Customizable Only</span>
            </label>

            <div className="flex items-center gap-1.5 text-xs text-[#5C3A42]">
              <span className="text-[#9D7983] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] font-medium focus:border-[#BE185D] focus:outline-hidden"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Category Pill Filters */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#831843] text-white shadow-xs'
                : 'bg-[#FFF0F3] text-[#831843] hover:bg-[#FCE7EB]'
            }`}
          >
            All Dupattas ({products.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = products.filter(p => p.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#831843] text-white shadow-xs'
                    : 'bg-[#FFF0F3] text-[#831843] hover:bg-[#FCE7EB]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Fabric & Occasion Dropdowns */}
        <div className="pt-2 border-t border-[#FCE7EB] flex flex-wrap items-center gap-3 text-xs">
          
          {/* Fabric Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#9D7983] font-medium">Fabric:</span>
            <select
              value={selectedFabric}
              onChange={(e) => setSelectedFabric(e.target.value)}
              className="p-1.5 rounded-lg border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:outline-hidden"
            >
              <option value="all">All Fabrics</option>
              {fabricTypes.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Occasion Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#9D7983] font-medium">Occasion:</span>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="p-1.5 rounded-lg border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:outline-hidden"
            >
              <option value="all">All Occasions</option>
              {occasions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs text-[#BE185D] hover:text-[#831843] font-semibold underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#FCE7EB] p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 stroke-1" />
          </div>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#3D2C2E]">
            No matching dupattas found
          </h3>
          <p className="text-sm text-[#7A5A62] max-w-md mx-auto">
            We specialize in bespoke custom creations! If you don't see what you are looking for, message Sania directly on WhatsApp with your design idea.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-full bg-[#BE185D] text-white text-xs font-semibold hover:bg-[#831843] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onOpenCustomize={onOpenCustomize}
              onAddToCart={onAddToCart}
              whatsappNumber={siteContent.whatsapp_number}
            />
          ))}
        </div>
      )}

      {/* Floating Bottom Help Note */}
      <div className="bg-[#FFF0F3] rounded-2xl p-4 sm:p-6 border border-[#F3C5D4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#831843]">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <span>
            <strong>Need a customized color or urgent date?</strong> All dupattas are hand-painted by Sania. Custom requests take 4–7 business days to craft with care.
          </span>
        </div>
        <a
          href={`https://wa.me/${siteContent.whatsapp_number || '923716747099'}?text=${encodeURIComponent('Salam Sania! 🌸 I am browsing your shop catalog and need help choosing a dupatta.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white font-semibold shrink-0 shadow-2xs hover:bg-[#20BA5A] transition-colors"
        >
          <span>Ask Sania on WhatsApp</span>
        </a>
      </div>

    </div>
  );
};
