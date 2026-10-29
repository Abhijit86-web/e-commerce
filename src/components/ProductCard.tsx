import React, { useState } from 'react';
import { Star, Eye, ShoppingBag, Check, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onOpenSizing: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onOpenSizing,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize || undefined);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e8ded1] hover:border-[#c5b19b] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Showcase */}
      <div
        className="relative aspect-square overflow-hidden bg-[#f5efe6]"
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-[#241e1b]/90 backdrop-blur-sm text-[#f7f2ea] shadow-sm">
              {product.badge}
            </span>
          )}
          {product.originalPrice && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#8a5d3b] text-white shadow-sm">
              Save ${product.originalPrice - product.price}
            </span>
          )}
        </div>

        {/* Favorite Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 text-[#5c4d3f] hover:bg-white hover:text-rose-600 shadow-sm'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-0 bottom-3 px-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 px-3 rounded-xl bg-white/95 backdrop-blur-sm text-[#241e1b] text-xs font-semibold tracking-wide shadow-md hover:bg-[#241e1b] hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Craft Story & Details</span>
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-[#a0683a]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-[#d8c8b4]'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-[#4a3f35]">{product.rating}</span>
            <span className="text-xs text-[#8c7866]">({product.reviewCount})</span>
          </div>

          {/* Title & Subtitle */}
          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#241e1b] group-hover:text-[#a0683a] transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-[#6e5d4e] mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Material Tag */}
          <div className="mt-2 text-[11px] text-[#8a5d3b] bg-[#f7f2ea] px-2.5 py-1 rounded-md inline-block font-medium border border-[#ebdccb]">
            {product.materials.split(',')[0]}
          </div>
        </div>

        {/* Sizing & Purchase Actions */}
        <div className="mt-4 pt-3 border-t border-[#f0e8dc]">
          {/* Quick Size Select if available */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-[11px] text-[#6e5d4e] mb-1">
                <span>Select Size:</span>
                <button
                  type="button"
                  onClick={onOpenSizing}
                  className="text-[#a0683a] hover:underline cursor-pointer"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.slice(0, 5).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-2 py-0.5 text-xs rounded border transition-all ${
                      selectedSize === size
                        ? 'border-[#241e1b] bg-[#241e1b] text-white font-medium'
                        : 'border-[#d8c8b4] bg-[#faf8f5] text-[#4a3f35] hover:border-[#a0683a]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
                {product.sizes.length > 5 && (
                  <span className="text-[10px] text-[#8c7866] self-center">
                    +{product.sizes.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Pricing & Add to Cart Button */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg font-bold text-[#241e1b]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-[#8c7866] line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium block">
                In Stock &bull; Ready to ship
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={addedAnimation}
              className={`p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-sm ${
                addedAnimation
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#241e1b] hover:bg-[#a0683a] text-white active:scale-95'
              }`}
              title="Add to shopping bag"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
