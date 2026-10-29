import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, SlidersHorizontal, Flame, Award, Clock } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onOpenSizing: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onQuickView,
  onAddToCart,
  onOpenSizing,
}) => {
  const [curationFilter, setCurationFilter] = useState<'all' | 'bestsellers' | 'new' | 'artisan'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        // Curation badge filter
        if (curationFilter === 'bestsellers' && !p.isBestSeller) return false;
        if (curationFilter === 'new' && !p.isNewArrival) return false;
        if (curationFilter === 'artisan' && !p.isArtisanPick) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSub = p.subtitle.toLowerCase().includes(q);
          const matchMat = p.materials.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchSub && !matchMat && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured original order
      });
  }, [products, activeCategory, curationFilter, searchQuery, sortBy]);

  return (
    <section id="products-section" className="py-12 lg:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#8a5d3b] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Crafted Catalog</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#241e1b]">
            Handcrafted Jewelry Collection
          </h2>
          <p className="text-sm text-[#6e5d4e] mt-1">
            Each bespoke jewel is formed from 100% recycled fairmined precious metals & genuine stones.
          </p>
        </div>

        {/* Sort & Search info */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-[#6e5d4e] font-medium hidden sm:inline">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-[#241e1b] focus:outline-none focus:border-[#a0683a] shadow-sm cursor-pointer"
          >
            <option value="featured">Featured Atelier Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Patron Rating</option>
          </select>
        </div>
      </div>

      {/* Curation Quick Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-3 border-b border-[#e8ded1]">
        <button
          onClick={() => setCurationFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            curationFilter === 'all'
              ? 'bg-[#241e1b] text-white shadow-sm'
              : 'bg-[#f0e8dc] text-[#5c4d3f] hover:bg-[#e7dccb]'
          }`}
        >
          All Studio Pieces ({products.length})
        </button>

        <button
          onClick={() => setCurationFilter('bestsellers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            curationFilter === 'bestsellers'
              ? 'bg-[#a0683a] text-white shadow-sm'
              : 'bg-[#f0e8dc] text-[#5c4d3f] hover:bg-[#e7dccb]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Top Bestsellers</span>
        </button>

        <button
          onClick={() => setCurationFilter('new')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            curationFilter === 'new'
              ? 'bg-[#241e1b] text-white shadow-sm'
              : 'bg-[#f0e8dc] text-[#5c4d3f] hover:bg-[#e7dccb]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>New Studio Arrivals</span>
        </button>

        <button
          onClick={() => setCurationFilter('artisan')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            curationFilter === 'artisan'
              ? 'bg-[#241e1b] text-white shadow-sm'
              : 'bg-[#f0e8dc] text-[#5c4d3f] hover:bg-[#e7dccb]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Elena’s Artisan Picks</span>
        </button>

        {searchQuery && (
          <div className="ml-auto text-xs text-[#8c7866] flex items-center gap-2">
            <span>Filtering by: "{searchQuery}"</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#a0683a] underline font-medium cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Grid of Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onOpenSizing={onOpenSizing}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e8ded1] p-8">
          <p className="text-base font-serif text-[#241e1b]">No jewels found matching your criteria.</p>
          <p className="text-xs text-[#8c7866] mt-1">Try resetting your search or exploring our full catalog.</p>
          <button
            onClick={() => {
              onSelectCategory('all');
              setCurationFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-[#241e1b] text-white text-xs font-medium rounded-xl hover:bg-[#a0683a] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
