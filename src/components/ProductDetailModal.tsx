import React, { useState } from 'react';
import { X, Star, ShieldCheck, Ruler, Truck, RotateCcw, Sparkles, Check, Heart, ShoppingBag } from 'lucide-react';
import { Product, Review } from '../types';
import { formatINR } from '../utils/currency';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, quantity?: number) => void;
  onOpenSizing: () => void;
  reviews: Review[];
  onWriteReview: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenSizing,
  reviews,
  onWriteReview,
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize || undefined, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#faf8f5] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#e8ded1] overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-[#4a3f35] hover:text-[#241e1b] hover:bg-white shadow-md transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Multi-photo Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f0e8dc] border border-[#e0d3c1] shadow-inner">
                <img
                  src={product.images[activeImgIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-semibold tracking-wider uppercase bg-[#241e1b] text-white shadow">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImgIndex === idx
                          ? 'border-[#241e1b] ring-2 ring-[#a0683a]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Craft Atelier Guarantee */}
              <div className="p-4 rounded-2xl bg-[#f2ebd9]/70 border border-[#dfd2be] text-xs text-[#5c4d3f] space-y-2">
                <div className="flex items-center gap-2 font-semibold text-[#241e1b]">
                  <Sparkles className="w-4 h-4 text-[#a0683a]" />
                  <span>The Artisan Craft Promise</span>
                </div>
                <p className="leading-relaxed">
                  {product.craftStory}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-[#7d6855] border-t border-[#dfd2be]/60">
                  <span>Dimensions: {product.dimensions}</span>
                  <span className="font-semibold text-emerald-800">Fairmined Certified</span>
                </div>
              </div>
            </div>

            {/* Right: Info, Sizing, Purchasing */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-[#a0683a]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-current' : 'text-[#d8c8b4]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#241e1b]">{product.rating}</span>
                  <span className="text-xs text-[#8c7866]">({product.reviewCount} customer reviews)</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#241e1b] font-normal leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-[#8a5d3b] font-medium tracking-wide mt-1">
                  {product.materials}
                </p>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-[#e8ded1]">
                <span className="font-serif text-3xl font-bold text-[#241e1b]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#8c7866] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-[#a0683a] bg-[#f5ede0] px-2.5 py-1 rounded-md font-semibold">
                  Hand-finished in studio
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5c4d3f] leading-relaxed">
                {product.description}
              </p>

              {/* Sizing selector if applicable */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#241e1b]">Select Size / Length:</span>
                    <button
                      onClick={onOpenSizing}
                      className="text-[#a0683a] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Interactive Sizing Guide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-2 text-xs rounded-xl border text-center transition-all ${
                          selectedSize === size
                            ? 'border-[#241e1b] bg-[#241e1b] text-white font-semibold shadow-sm'
                            : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Bag */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#d8c8b4] bg-white rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2.5 text-[#5c4d3f] hover:bg-[#f5efe6] font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#241e1b]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2.5 text-[#5c4d3f] hover:bg-[#f5efe6] font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`flex-1 py-3.5 px-6 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                      added
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#241e1b] hover:bg-[#3d322c] text-[#f7f2ea] active:scale-98'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag • {formatINR(product.price * quantity)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#e8ded1] text-xs text-[#6e5d4e]">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-[#a0683a] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#241e1b] block">Insured Studio Courier</span>
                    <span className="text-[11px]">Free delivery on orders ₹5,000+</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <RotateCcw className="w-4 h-4 text-[#a0683a] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#241e1b] block">30-Day Atelier Returns</span>
                    <span className="text-[11px]">Complimentary size exchanges</span>
                  </div>
                </div>
              </div>

              {/* Care Instructions Accordion / Note */}
              <div className="bg-[#f5efe6] p-3 rounded-xl border border-[#e5d9c7] text-xs text-[#5c4d3f]">
                <span className="font-semibold text-[#241e1b] block mb-0.5">Artisan Care Note:</span>
                <p className="text-[11px] leading-relaxed">{product.careGuide}</p>
              </div>

              {/* Product specific reviews snippet */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#241e1b]">Patron Reviews for this piece ({productReviews.length})</span>
                  <button
                    onClick={() => {
                      onClose();
                      onWriteReview(product);
                    }}
                    className="text-xs text-[#a0683a] hover:underline font-medium cursor-pointer"
                  >
                    + Write a Review
                  </button>
                </div>

                {productReviews.length > 0 ? (
                  <div className="space-y-2">
                    {productReviews.slice(0, 2).map((rev) => (
                      <div key={rev.id} className="p-3 bg-white rounded-xl border border-[#e8ded1] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#241e1b]">{rev.author}</span>
                          <span className="text-[10px] text-[#8c7866]">{rev.date}</span>
                        </div>
                        <p className="text-[#5c4d3f] italic font-serif">"{rev.title}"</p>
                        <p className="text-[11px] text-[#6e5d4e] line-clamp-2">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8c7866] italic">Be the first verified patron to review this handcrafted jewel.</p>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
