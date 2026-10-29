import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Truck, CreditCard, Gift, Check, ArrowRight, ArrowLeft, Tag, Smartphone } from 'lucide-react';
import { CartItem, Coupon, ShippingMethod, OrderConfirmation } from '../types';
import { SHIPPING_METHODS, AVAILABLE_COUPONS } from '../data/jewelryData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  onRemoveCoupon: () => void;
  giftWrapping: boolean;
  giftMessage: string;
  onOrderSuccess: (order: OrderConfirmation) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  giftWrapping,
  giftMessage,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'delivery' | 'payment'>('delivery');

  // Contact & Address
  const [email, setEmail] = useState('clara.vance@gmail.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [fullName, setFullName] = useState('Clara Vance');
  const [street, setStreet] = useState('742 Evergreen Terrace');
  const [apt, setApt] = useState('Apt 4B');
  const [city, setCity] = useState('Portland');
  const [state, setState] = useState('OR');
  const [zipCode, setZipCode] = useState('97201');
  const [country, setCountry] = useState('United States');

  // Shipping Method
  const [selectedShippingId, setSelectedShippingId] = useState<string>('ship-standard');
  const [waxSealColor, setWaxSealColor] = useState('Antique Gold');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paypal' | 'klarna'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardholderName, setCardholderName] = useState('Clara Vance');

  // Coupon inside checkout
  const [checkoutCouponInput, setCheckoutCouponInput] = useState('');
  const [checkoutCouponMsg, setCheckoutCouponMsg] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const selectedShipping = SHIPPING_METHODS.find((s) => s.id === selectedShippingId) || SHIPPING_METHODS[0];
  const shippingCost = subtotal >= 150 || appliedCoupon?.code === 'FREESHIP' ? 0 : selectedShipping.price;
  const giftWrapCost = giftWrapping ? 8 : 0;
  const tax = Math.round((subtotal - discount) * 0.0825 * 100) / 100;
  const grandTotal = Math.max(0, subtotal - discount + shippingCost + giftWrapCost + tax);

  const handleApplyCouponFromCheckout = async () => {
    if (!checkoutCouponInput.trim()) return;
    const res = await onApplyCoupon(checkoutCouponInput.trim());
    setCheckoutCouponMsg(res.message);
    if (res.success) setCheckoutCouponInput('');
  };

  const handleProcessOrder = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: {
            fullName,
            street,
            apt,
            city,
            state,
            zipCode,
            country,
          },
          shippingMethod: {
            ...selectedShipping,
            price: shippingCost,
          },
          paymentMethod:
            paymentMethod === 'card'
              ? 'Credit Card (3D Secure Authenticated)'
              : paymentMethod === 'applepay'
              ? 'Apple Pay (Biometric Authorization)'
              : paymentMethod === 'paypal'
              ? 'PayPal Express'
              : 'Klarna Pay-in-4',
          appliedCoupon,
          giftWrapping,
          giftMessage,
        }),
      });

      const data = await response.json();
      if (data.success && data.order) {
        setTimeout(() => {
          setIsProcessing(false);
          onOrderSuccess(data.order);
        }, 1200);
      } else {
        setIsProcessing(false);
        alert(data.error || 'Failed to process order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setIsProcessing(false);
      alert('Network error authorizing checkout.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#faf8f5] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#e8ded1] overflow-hidden my-4 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#e8ded1] bg-[#f5efe6]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#241e1b] text-white rounded-xl">
              <Lock className="w-5 h-5 text-[#e0a96d]" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#241e1b]">Atelier Secure Checkout</h3>
              <p className="text-xs text-[#6e5d4e] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>256-Bit Bank-Grade Encryption &bull; Insured Delivery</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('clara.vance@gmail.com');
                setPhone('+1 (555) 234-5678');
                setFullName('Clara Vance');
                setStreet('742 Evergreen Terrace');
                setApt('Apt 4B');
                setCity('Portland');
                setState('OR');
                setZipCode('97201');
                setCardholderName('Clara Vance');
                setCardNumber('•••• •••• •••• 4242');
                setCardExpiry('08/28');
                setCardCvv('883');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#241e1b] text-white hover:bg-[#a0683a] text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
              title="Auto-fill demo delivery and payment details in 1 click"
            >
              <span>⚡ Fast-Fill</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#eae0d2] text-[#4a3f35] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-[#e8ded1] bg-[#faf8f5] px-6 text-xs justify-between items-center">
          <div className="flex">
            <button
              onClick={() => setStep('delivery')}
              className={`py-3 px-4 font-semibold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                step === 'delivery'
                  ? 'border-[#241e1b] text-[#241e1b]'
                  : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#241e1b] text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Delivery & Courier</span>
            </button>

            <button
              onClick={() => setStep('payment')}
              className={`py-3 px-4 font-semibold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                step === 'payment'
                  ? 'border-[#241e1b] text-[#241e1b]'
                  : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#a0683a] text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Payment & Authorization</span>
            </button>
          </div>

          <span className="hidden sm:inline text-[11px] text-[#8a5d3b] font-medium">
            3D-Secure 2.0 &bull; Free Returns
          </span>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 space-y-6">
              
              {step === 'delivery' ? (
                /* STEP 1: DELIVERY & COURIER OPTIONS */
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#8a5d3b]">
                        1. Contact Information
                      </h4>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        Dispatched in Tamper-Proof Pouch
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                          Email Address (for tracking):
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                          Mobile Phone (delivery SMS):
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8a5d3b]">
                      2. Shipping Address
                    </h4>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                        Recipient Full Name:
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                          Street Address:
                        </label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                          Apt / Suite:
                        </label>
                        <input
                          type="text"
                          value={apt}
                          onChange={(e) => setApt(e.target.value)}
                          className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">City:</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">State / Prov:</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">ZIP / Postal:</label>
                        <input
                          type="text"
                          required
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Courier Options */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8a5d3b]">
                      3. Select Insured Courier Method
                    </h4>
                    <div className="space-y-2">
                      {SHIPPING_METHODS.map((method) => {
                        const isFree = subtotal >= 150 && method.id === 'ship-standard';
                        const price = isFree ? 0 : method.price;

                        return (
                          <label
                            key={method.id}
                            className={`flex items-start justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              selectedShippingId === method.id
                                ? 'border-[#241e1b] bg-[#f5efe6] shadow-sm ring-1 ring-[#241e1b]'
                                : 'border-[#e8ded1] bg-white hover:border-[#a0683a]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="shippingMethod"
                                checked={selectedShippingId === method.id}
                                onChange={() => setSelectedShippingId(method.id)}
                                className="mt-1 accent-[#241e1b]"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-[#241e1b]">{method.name}</span>
                                  <span className="text-[10px] bg-[#e8ded1] text-[#5c4d3f] px-2 py-0.5 rounded-full font-medium">
                                    {method.duration}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#6e5d4e] mt-0.5">{method.description}</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-[#241e1b] shrink-0 ml-2">
                              {price === 0 ? 'FREE' : `$${price.toFixed(2)}`}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="w-full py-3.5 rounded-xl bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
                  >
                    <span>Continue to Payment Method</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* STEP 2: MULTIPLE PAYMENT METHODS INTEGRATION */
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8a5d3b]">
                      Select Payment Method
                    </h4>
                    <button
                      type="button"
                      onClick={() => setStep('delivery')}
                      className="text-xs text-[#6e5d4e] hover:text-[#241e1b] flex items-center gap-1 font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Address</span>
                    </button>
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'border-[#241e1b] bg-[#241e1b] text-white shadow-sm'
                          : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-[11px] font-semibold">Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('applepay')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'applepay'
                          ? 'border-[#241e1b] bg-[#241e1b] text-white shadow-sm'
                          : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span className="text-[11px] font-semibold">Apple / GPay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'paypal'
                          ? 'border-[#241e1b] bg-[#241e1b] text-white shadow-sm'
                          : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                      }`}
                    >
                      <span className="font-serif italic font-bold text-sm">P</span>
                      <span className="text-[11px] font-semibold">PayPal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('klarna')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'klarna'
                          ? 'border-[#241e1b] bg-[#241e1b] text-white shadow-sm'
                          : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                      }`}
                    >
                      <span className="font-bold text-xs bg-pink-200 text-pink-800 px-1 rounded">K.</span>
                      <span className="text-[11px] font-semibold">Klarna (4x)</span>
                    </button>
                  </div>

                  {/* Selected Payment Method Form View */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                          Cardholder Name:
                        </label>
                        <input
                          type="text"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                          Card Number:
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs font-mono text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                            Expiration (MM/YY):
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs font-mono text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                            Security CVV:
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs font-mono text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8c7866] pt-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Mock 3D-Secure 2.0 sandbox enabled. No live charge will occur.</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'applepay' && (
                    <div className="p-6 bg-white rounded-2xl border border-[#e8ded1] text-center space-y-3">
                      <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto text-xl">
                        
                      </div>
                      <h5 className="font-semibold text-sm text-[#241e1b]">One-Touch Express Checkout</h5>
                      <p className="text-xs text-[#6e5d4e]">
                        Authorize directly with Touch ID or Face ID. Your shipping address and billing card are automatically linked.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="p-6 bg-white rounded-2xl border border-[#e8ded1] text-center space-y-3">
                      <div className="w-12 h-12 bg-[#003087] text-white rounded-2xl flex items-center justify-center mx-auto font-bold font-serif text-lg">
                        PayPal
                      </div>
                      <h5 className="font-semibold text-sm text-[#241e1b]">PayPal Express Checkout</h5>
                      <p className="text-xs text-[#6e5d4e]">
                        Pay using your PayPal balance, bank account, or linked rewards. Buyer Protection included.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'klarna' && (
                    <div className="p-5 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-900">Pay in 4 interest-free installments</span>
                        <span className="text-xs font-mono font-bold text-pink-900">
                          ${(grandTotal / 4).toFixed(2)} / bi-weekly
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        <div className="p-2 bg-white rounded-lg border border-pink-200">
                          <span className="block font-bold">Today</span>
                          <span>${(grandTotal / 4).toFixed(2)}</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-pink-200">
                          <span className="block font-bold">2 Wks</span>
                          <span>${(grandTotal / 4).toFixed(2)}</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-pink-200">
                          <span className="block font-bold">4 Wks</span>
                          <span>${(grandTotal / 4).toFixed(2)}</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-pink-200">
                          <span className="block font-bold">6 Wks</span>
                          <span>${(grandTotal / 4).toFixed(2)}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-pink-800">
                        No credit score impact &bull; Zero interest when paid on time.
                      </p>
                    </div>
                  )}

                  {/* Final Authorize Button */}
                  <button
                    type="button"
                    onClick={handleProcessOrder}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl bg-[#241e1b] hover:bg-[#a0683a] text-white text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Authorizing 3D-Secure Transaction...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#e0a96d]" />
                        <span>Authorize & Place Order • ${grandTotal.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Coupon Injection */}
            <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-[#e8ded1] shadow-sm space-y-4">
              <h4 className="font-serif text-lg text-[#241e1b] pb-2 border-b border-[#f0e8dc]">
                Order Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h4>

              {/* Items scroll */}
              <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#f5efe6] border border-[#e8ded1] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#241e1b] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-[#8c7866]">
                        Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-serif font-bold text-[#241e1b]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Option inside Checkout */}
              <div className="pt-2 border-t border-[#f0e8dc] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#241e1b] flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#a0683a]" />
                    <span>Coupon / Voucher</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={onRemoveCoupon}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex justify-between items-center">
                    <span>
                      Code <strong>{appliedCoupon.code}</strong> applied
                    </span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. ARTISAN15"
                        value={checkoutCouponInput}
                        onChange={(e) => setCheckoutCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-2.5 py-1.5 text-xs text-[#241e1b] uppercase focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCouponFromCheckout}
                        className="px-3 py-1.5 bg-[#241e1b] text-white text-xs font-semibold rounded-xl hover:bg-[#a0683a]"
                      >
                        Apply
                      </button>
                    </div>
                    {checkoutCouponMsg && (
                      <p className="text-[10px] text-[#8a5d3b] mt-1">{checkoutCouponMsg}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="pt-2 border-t border-[#f0e8dc] space-y-1.5 text-xs text-[#5c4d3f]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Courier ({selectedShipping.name})</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                {giftWrapping && (
                  <div className="flex justify-between">
                    <span>Wax-Sealed Keepsake Packaging</span>
                    <span>+$8.00</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Sales Tax (8.25%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#241e1b] pt-2 border-t border-[#e0d3c1]">
                  <span>Total Amount</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Security reassurance */}
              <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8ded1] text-[11px] text-[#6e5d4e] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>30-Day complimentary resizing & insurance coverage included.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
