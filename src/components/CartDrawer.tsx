import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Gift, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  onRemoveCoupon: () => void;
  giftWrapping: boolean;
  setGiftWrapping: (wrap: boolean) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  giftWrapping,
  setGiftWrapping,
  giftMessage,
  setGiftMessage,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShip = Math.max(0, freeShippingThreshold - subtotal);

  const giftWrapCost = giftWrapping ? 8 : 0;
  const estimatedShipping = subtotal >= freeShippingThreshold || appliedCoupon?.code === 'FREESHIP' ? 0 : 15;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + giftWrapCost + (subtotal > 0 ? estimatedShipping : 0));

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponCodeInput;
    if (!code.trim()) return;

    setCouponLoading(true);
    setCouponFeedback(null);
    const result = await onApplyCoupon(code.trim());
    setCouponLoading(false);

    if (result.success) {
      setCouponFeedback({ message: result.message, isError: false });
      setCouponCodeInput('');
    } else {
      setCouponFeedback({ message: result.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#faf8f5] h-full shadow-2xl border-l border-[#e8ded1] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#e8ded1] bg-[#f5efe6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#241e1b]" />
            <h3 className="font-serif text-xl text-[#241e1b]">Your Jewelry Bag</h3>
            <span className="text-xs bg-[#241e1b] text-white px-2 py-0.5 rounded-full font-semibold">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#eae0d2] text-[#4a3f35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-5 py-3 bg-[#ede3d4] text-xs text-[#5c4d3f] border-b border-[#dfd2be]">
          {amountNeededForFreeShip === 0 ? (
            <div className="flex items-center gap-1.5 font-medium text-emerald-800">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>You have unlocked Free Insured Atelier Shipping!</span>
            </div>
          ) : (
            <div>
              <p>Add <strong>${amountNeededForFreeShip.toFixed(2)}</strong> more for Free Insured Ground Shipping</p>
              <div className="w-full bg-[#d8c8b4] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#a0683a] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-[#f0e8dc] rounded-full flex items-center justify-center mx-auto text-[#8c7866]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-lg text-[#241e1b]">Your bag is currently empty.</p>
              <p className="text-xs text-[#8c7866]">
                Discover our hand-hammered bands, baroque pearls, and custom talisman necklaces.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize || 'std'}-${idx}`}
                className="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-[#e8ded1] shadow-sm relative group"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-[#f5efe6] border border-[#e0d3c1] shrink-0"
                />

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm font-semibold text-[#241e1b] leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-[#8c7866] hover:text-red-700 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedSize && (
                      <span className="text-[11px] text-[#8a5d3b] block mt-0.5">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#f5efe6]">
                    <div className="flex items-center border border-[#d8c8b4] rounded-lg bg-[#faf8f5]">
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-[#5c4d3f] hover:bg-[#f0e8dc]"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#241e1b]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-[#5c4d3f] hover:bg-[#f0e8dc]"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif text-sm font-bold text-[#241e1b]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Coupon Code Section */}
          {cartItems.length > 0 && (
            <div className="pt-2">
              <div className="p-3.5 bg-white rounded-2xl border border-[#e8ded1] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#241e1b] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#a0683a]" />
                    <span>Atelier Promo or Gift Code</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      onClick={onRemoveCoupon}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <div>
                        <strong>{appliedCoupon.code}</strong>: {appliedCoupon.description}
                      </div>
                    </div>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. ARTISAN15"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-1.5 text-xs text-[#241e1b] uppercase focus:outline-none focus:border-[#241e1b]"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading}
                        className="px-4 py-1.5 bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? 'Checking...' : 'Apply'}
                      </button>
                    </div>

                    {/* Quick Coupon Suggestions */}
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#6e5d4e]">
                      <span>Suggested:</span>
                      <button
                        onClick={() => handleApplyCoupon('ARTISAN15')}
                        className="underline font-mono text-[#a0683a] hover:text-[#241e1b]"
                      >
                        ARTISAN15 (15% off)
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleApplyCoupon('SPARKLE10')}
                        className="underline font-mono text-[#a0683a] hover:text-[#241e1b]"
                      >
                        SPARKLE10 ($10 off)
                      </button>
                    </div>
                  </div>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-1 ${
                      couponFeedback.isError ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Gift Packaging Option */}
          {cartItems.length > 0 && (
            <div className="p-3.5 bg-white rounded-2xl border border-[#e8ded1] space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#241e1b]">
                <input
                  type="checkbox"
                  checked={giftWrapping}
                  onChange={(e) => setGiftWrapping(e.target.checked)}
                  className="rounded text-[#a0683a] focus:ring-[#a0683a]"
                />
                <Gift className="w-3.5 h-3.5 text-[#a0683a]" />
                <span>Add Heirloom Wax-Sealed Gift Wrap (+$8.00)</span>
              </label>

              {giftWrapping && (
                <div className="pl-6 pt-1 space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Personalized handwritten calligraphy message..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl p-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                  />
                  <p className="text-[10px] text-[#8c7866]">
                    Includes velvet embossed keepsake box, dried lavender sprig, and wax seal stamp.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#e8ded1] bg-[#f5efe6] space-y-3">
            <div className="space-y-1.5 text-xs text-[#5c4d3f]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {giftWrapping && (
                <div className="flex justify-between">
                  <span>Heirloom Gift Wrapping</span>
                  <span>+$8.00</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Insured Shipping</span>
                <span>
                  {estimatedShipping === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    `$${estimatedShipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#241e1b] pt-2 border-t border-[#e0d3c1]">
                <span>Estimated Total</span>
                <span>${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-xl bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#e0a96d]" />
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-[#8c7866]">
              256-Bit SSL Encrypted &bull; 30-Day Free Resizing Guarantee
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
