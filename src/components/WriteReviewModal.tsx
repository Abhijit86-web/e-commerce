import React, { useState } from 'react';
import { X, Star, Upload, Check, Camera } from 'lucide-react';
import { Product, Review } from '../types';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedProduct?: Product | null;
  onReviewSubmitted: (newReview: Review) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  products,
  selectedProduct,
  onReviewSubmitted,
}) => {
  if (!isOpen) return null;

  const [productId, setProductId] = useState<string>(
    selectedProduct ? selectedProduct.id : products[0]?.id || ''
  );
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [fitFeedback, setFitFeedback] = useState<'True to size' | 'Runs small' | 'Runs large'>('True to size');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [customerPhotos, setCustomerPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddPhoto = () => {
    if (photoUrlInput.trim()) {
      setCustomerPhotos([...customerPhotos, photoUrlInput.trim()]);
      setPhotoUrlInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !title || !comment) return;

    setIsSubmitting(true);
    try {
      const chosenProd = products.find((p) => p.id === productId);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          author,
          location,
          rating,
          title,
          comment,
          fitFeedback,
          customerPhotos,
          metalChosen: chosenProd ? chosenProd.name : 'Handcrafted Selection',
        }),
      });

      const data = await res.json();
      if (data.success && data.review) {
        onReviewSubmitted(data.review);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Review submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#faf8f5] w-full max-w-xl rounded-3xl shadow-2xl border border-[#e8ded1] overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e8ded1] bg-[#f5efe6]">
          <div>
            <h3 className="font-serif text-2xl text-[#241e1b]">Write a Patron Review</h3>
            <p className="text-xs text-[#6e5d4e]">Share your story, photos, and fit feedback with our community</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#eae0d2] text-[#4a3f35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-2xl text-[#241e1b]">Review Published!</h4>
            <p className="text-xs text-[#6e5d4e]">Thank you for supporting our slow artisanal craftsmanship.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
            {/* Product Picker */}
            <div>
              <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                Select Handcrafted Piece:
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.price})
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                Overall Rating:
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'text-[#a0683a] fill-current'
                          : 'text-[#d8c8b4]'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-[#6e5d4e] ml-2 font-medium">
                  {rating} of 5 stars
                </span>
              </div>
            </div>

            {/* Author & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#241e1b] mb-1">Your Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vivienne Sterling"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241e1b] mb-1">Location / City:</label>
                <input
                  type="text"
                  placeholder="e.g. Seattle, WA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                />
              </div>
            </div>

            {/* Sizing Fit Feedback */}
            <div>
              <label className="block text-xs font-semibold text-[#241e1b] mb-1">Fit Verdict:</label>
              <div className="flex gap-2">
                {(['Runs small', 'True to size', 'Runs large'] as const).map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setFitFeedback(fit)}
                    className={`flex-1 py-1.5 px-3 rounded-xl border text-xs transition-all ${
                      fitFeedback === fit
                        ? 'border-[#241e1b] bg-[#241e1b] text-white font-medium'
                        : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Headline & Body */}
            <div>
              <label className="block text-xs font-semibold text-[#241e1b] mb-1">Review Headline:</label>
              <input
                type="text"
                required
                placeholder="e.g. The hammer facets catch daylight like magic!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#241e1b] mb-1">Detailed Feedback:</label>
              <textarea
                required
                rows={3}
                placeholder="Tell other jewelry enthusiasts about the craftsmanship, metal feel, packaging, or customer service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
              />
            </div>

            {/* Customer Photo Upload / URL */}
            <div>
              <label className="block text-xs font-semibold text-[#241e1b] mb-1 flex items-center justify-between">
                <span>Customer Photos:</span>
                <span className="text-[10px] text-[#8c7866]">Showcase your styled jewelry</span>
              </label>

              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  placeholder="Paste image URL (or use default styled studio photo)"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  className="flex-1 bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-3 py-2 bg-[#f0e8dc] text-[#241e1b] text-xs font-semibold rounded-xl hover:bg-[#e4d8c7] transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Photos Preview */}
              {customerPhotos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {customerPhotos.map((url, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#d8c8b4] shrink-0">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCustomerPhotos(customerPhotos.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 text-[8px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-md cursor-pointer"
              >
                {isSubmitting ? 'Submitting to Atelier...' : 'Submit Verified Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
