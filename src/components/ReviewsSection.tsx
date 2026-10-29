import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, Camera, Sparkles, MessageSquareHeart, ChevronRight, X } from 'lucide-react';
import { Review, Product } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  products: Product[];
  onOpenWriteReview: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  products,
  onOpenWriteReview,
  onSelectProduct,
}) => {
  const [filter, setFilter] = useState<'all' | 'photos' | '5stars'>('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  const handleHelpful = (id: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'photos') return r.customerPhotos && r.customerPhotos.length > 0;
    if (filter === '5stars') return r.rating === 5;
    return true;
  });

  // Extract all customer photos for the top gallery strip
  const allCustomerPhotos = reviews
    .flatMap((r) => (r.customerPhotos || []).map((img) => ({ img, author: r.author, title: r.title })))
    .slice(0, 8);

  return (
    <section id="reviews-section" className="py-16 bg-[#f7f2ea]/60 border-t border-b border-[#e8ded1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#8a5d3b] mb-1">
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>Patron Community & Unboxing Stories</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#241e1b]">
              Loved by Discerning Collectors
            </h2>
            <p className="text-sm text-[#6e5d4e] mt-1 max-w-xl">
              Real portraits, heirloom testimonials, and unboxing reflections from our verified studio patrons.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white p-3.5 rounded-2xl border border-[#e0d3c1] shadow-sm flex items-center gap-3">
              <div className="text-center border-r border-[#e8ded1] pr-3">
                <span className="font-serif text-2xl font-bold text-[#241e1b] block">4.9</span>
                <div className="flex text-[#a0683a]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <div className="text-xs text-[#5c4d3f]">
                <span className="font-semibold block text-[#241e1b]">100% Handcrafted</span>
                <span>99% Verified Fit Accuracy</span>
              </div>
            </div>

            <button
              onClick={onOpenWriteReview}
              className="px-5 py-3 rounded-xl bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer shrink-0"
            >
              + Write a Review
            </button>
          </div>
        </div>

        {/* Customer Photo Gallery Strip */}
        {allCustomerPhotos.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8a5d3b] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Patron Photo Gallery ({allCustomerPhotos.length} Worn Moments)</span>
              </span>
              <span className="text-xs text-[#8c7866]">Click photo to enlarge</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {allCustomerPhotos.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveLightboxImg(item.img)}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm border border-[#e0d3c1]"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[10px] text-white font-medium line-clamp-1">
                      By {item.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-[#241e1b] text-white shadow-sm'
                : 'bg-white text-[#5c4d3f] border border-[#d8c8b4] hover:bg-[#f0e8dc]'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('photos')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === 'photos'
                ? 'bg-[#241e1b] text-white shadow-sm'
                : 'bg-white text-[#5c4d3f] border border-[#d8c8b4] hover:bg-[#f0e8dc]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>With Photos</span>
          </button>
          <button
            onClick={() => setFilter('5stars')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === '5stars'
                ? 'bg-[#241e1b] text-white shadow-sm'
                : 'bg-white text-[#5c4d3f] border border-[#d8c8b4] hover:bg-[#f0e8dc]'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-[#a0683a] text-[#a0683a]" />
            <span>5-Star Stories Only</span>
          </button>
        </div>

        {/* Reviews Cards Masonry/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const product = products.find((p) => p.id === rev.productId);
            const totalHelpful = rev.helpfulCount + (helpfulVotes[rev.id] || 0);

            return (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-[#e8ded1] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {rev.avatar ? (
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-10 h-10 rounded-full object-cover border border-[#d8c8b4]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#f0e8dc] text-[#71543b] font-serif font-bold text-sm flex items-center justify-center border border-[#d8c8b4]">
                          {rev.author.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-[#241e1b]">{rev.author}</span>
                          {rev.verified && (
                            <span className="inline-flex items-center text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium" title="Verified Studio Purchase">
                              <CheckCircle className="w-3 h-3 text-emerald-600 mr-0.5" />
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#8c7866]">{rev.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8c7866]">{rev.date}</span>
                  </div>

                  {/* Rating & Fit tags */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-[#a0683a]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-[#d8c8b4]'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.fitFeedback && (
                      <span className="text-[10px] font-medium bg-[#faf8f5] px-2 py-0.5 rounded border border-[#e8ded1] text-[#6e5d4e]">
                        Fit: {rev.fitFeedback}
                      </span>
                    )}
                  </div>

                  {/* Headline & Comment */}
                  <h4 className="font-serif text-base font-semibold text-[#241e1b] mb-1 leading-snug">
                    "{rev.title}"
                  </h4>
                  <p className="text-xs text-[#5c4d3f] leading-relaxed mb-4">
                    {rev.comment}
                  </p>

                  {/* Attached Customer Photos */}
                  {rev.customerPhotos && rev.customerPhotos.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {rev.customerPhotos.map((photo, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveLightboxImg(photo)}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#d8c8b4] cursor-pointer group"
                        >
                          <img
                            src={photo}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Purchased Product Tag & Helpful Counter */}
                <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs">
                  {product ? (
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="text-[#8a5d3b] hover:text-[#241e1b] text-[11px] font-medium truncate max-w-[180px] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Item: {product.name}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#8c7866]">{rev.metalChosen}</span>
                  )}

                  <button
                    onClick={() => handleHelpful(rev.id)}
                    className="flex items-center gap-1 text-[11px] text-[#6e5d4e] hover:text-[#241e1b] px-2 py-1 rounded-lg hover:bg-[#faf8f5] transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({totalHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={activeLightboxImg} alt="Enlarged patron photo" className="w-full h-full object-contain max-h-[80vh]" />
          </div>
        </div>
      )}
    </section>
  );
};
