import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, Truck, CreditCard, Gift, Check, ArrowRight, ArrowLeft, Tag, Smartphone, User, Sparkles, QrCode, Building, Banknote } from 'lucide-react';
import { CartItem, Coupon, ShippingMethod, OrderConfirmation, CustomerUser } from '../types';
import { SHIPPING_METHODS, AVAILABLE_COUPONS } from '../data/jewelryData';
import { formatINR } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: CustomerUser | null;
  onRequireLogin: () => void;
  onLoginSuccess?: (user: CustomerUser) => void;
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
  currentUser,
  onRequireLogin,
  onLoginSuccess,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  giftWrapping,
  giftMessage,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'delivery' | 'payment'>('delivery');

  // Contact & Address initialized with currentUser if present
  const [email, setEmail] = useState(currentUser?.email || 'aarav.sharma@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [fullName, setFullName] = useState(currentUser?.name || 'Aarav Sharma');
  const [street, setStreet] = useState('42 Silver Oak Avenue, Bandra West');
  const [apt, setApt] = useState('Flat 4B, Emerald Heights');

  // Phone OTP Quick Account Creation State
  const [otpPhoneInput, setOtpPhoneInput] = useState(currentUser?.phone || '+91 98765 43210');
  const [otpNameInput, setOtpNameInput] = useState(currentUser?.name || 'Aarav Sharma');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpDemoCode, setOtpDemoCode] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [zipCode, setZipCode] = useState('400050');
  const [country, setCountry] = useState('India');

  // Update contact when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
      setFullName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Shipping Method
  const [selectedShippingId, setSelectedShippingId] = useState<string>('ship-standard');
  const [waxSealColor, setWaxSealColor] = useState('Antique Gold');

  // Payment Method: Default to UPI for Indian luxury commerce
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod' | 'applepay' | 'paypal'>('upi');
  const [upiId, setUpiId] = useState('aarav.sharma@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 5521');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardholderName, setCardholderName] = useState('Aarav Sharma');

  // Coupon inside checkout
  const [checkoutCouponInput, setCheckoutCouponInput] = useState('');
  const [checkoutCouponMsg, setCheckoutCouponMsg] = useState('');

  // Processing & Error states
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Calculations in INR (₹)
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
  const shippingCost = subtotal >= 5000 || appliedCoupon?.code === 'FREESHIP' ? 0 : selectedShipping.price;
  const giftWrapCost = giftWrapping ? 350 : 0;
  // 3% Indian GST on handcrafted fine jewelry
  const tax = Math.round((subtotal - discount) * 0.03 * 100) / 100;
  const grandTotal = Math.max(0, subtotal - discount + shippingCost + giftWrapCost + tax);

  const handleApplyCouponFromCheckout = async () => {
    if (!checkoutCouponInput.trim()) return;
    const res = await onApplyCoupon(checkoutCouponInput.trim());
    setCheckoutCouponMsg(res.message);
    if (res.success) setCheckoutCouponInput('');
  };

  // Phone OTP: Send code to customer's mobile number
  const handleSendOtp = async () => {
    if (!otpPhoneInput || otpPhoneInput.trim().length < 6) {
      setOtpError('Please enter a valid phone number with area code.');
      return;
    }
    setIsSendingOtp(true);
    setOtpError(null);
    setOtpMessage(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: otpPhoneInput.trim(),
          fullName: otpNameInput.trim() || fullName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpDemoCode(data.demoCode || '1234');
        setOtpMessage(data.message || `Code sent to ${otpPhoneInput}`);
        setPhone(otpPhoneInput.trim());
      } else {
        setOtpError(data.error || 'Failed to send OTP code. Please check your phone number.');
      }
    } catch {
      setOtpError('Network error requesting verification code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Phone OTP: Verify code and link/create customer account
  const handleVerifyOtp = async () => {
    if (!otpCodeInput || otpCodeInput.trim().length < 4) {
      setOtpError('Please enter the 4-digit verification code.');
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: otpPhoneInput.trim(),
          code: otpCodeInput.trim(),
          fullName: otpNameInput.trim() || fullName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setOtpMessage(`Phone verified! Logged in as ${data.user.name}.`);
        setFullName(data.user.name);
        setPhone(data.user.phone || otpPhoneInput.trim());
        if (data.user.email) setEmail(data.user.email);
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      } else {
        setOtpError(data.error || 'Invalid verification code. Please check or use auto-fill.');
      }
    } catch {
      setOtpError('Network error verifying code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleProcessOrder = async () => {
    if (!currentUser) {
      setStep('delivery');
      setCheckoutError('Please enter your phone number and verify the OTP code below to create your patron account before ordering.');
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);

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
            paymentMethod === 'upi'
              ? `UPI Instant (${upiId || 'GPay / PhonePe'})`
              : paymentMethod === 'card'
              ? 'RuPay / Visa / Mastercard (3D Secure 2.0)'
              : paymentMethod === 'netbanking'
              ? `NetBanking (${selectedBank})`
              : paymentMethod === 'cod'
              ? 'Cash on Delivery (OTP Verified)'
              : paymentMethod === 'applepay'
              ? 'Apple / Google Pay Express'
              : 'PayPal Express',
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
        setCheckoutError(data.error || 'Failed to process order. Please check payment details.');
      }
    } catch {
      setIsProcessing(false);
      setCheckoutError('Network error authorizing checkout. Please try again.');
    }
  };

  if (!isOpen) return null;

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
                setEmail('aarav.sharma@gmail.com');
                setPhone('+91 98765 43210');
                setFullName('Aarav Sharma');
                setStreet('42 Silver Oak Avenue, Bandra West');
                setApt('Flat 4B, Emerald Heights');
                setCity('Mumbai');
                setState('Maharashtra');
                setZipCode('400050');
                setCardholderName('Aarav Sharma');
                setCardNumber('•••• •••• •••• 5521');
                setCardExpiry('09/29');
                setCardCvv('782');
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

        {checkoutError && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center justify-between">
            <span>{checkoutError}</span>
            <button
              onClick={() => setCheckoutError(null)}
              className="text-red-700 hover:text-red-900 font-bold ml-2 cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 space-y-6">
              
              {step === 'delivery' ? (
                /* STEP 1: DELIVERY & COURIER OPTIONS */
                <div className="space-y-5">
                  {/* Customer Phone OTP Account Verification (Required Before Ordering) */}
                  {currentUser ? (
                    <div className="p-4 bg-emerald-50/90 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-950 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow">
                          {currentUser.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#241e1b] text-sm">{currentUser.name}</span>
                            <span className="text-[10px] uppercase font-bold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-mono">
                              ✓ Verified Patron
                            </span>
                          </div>
                          <span className="text-[11px] text-[#5c4d3f]">
                            {currentUser.phone || currentUser.email} &bull; {currentUser.vipTier || 'Atelier Patron'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onRequireLogin}
                        className="text-[11px] text-[#8a5d3b] hover:text-[#241e1b] font-semibold underline cursor-pointer"
                      >
                        Account Details
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 bg-gradient-to-br from-[#faf4ec] to-[#f5efe6] border-2 border-[#e0a96d] rounded-2xl space-y-4 shadow-sm text-xs">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-[#241e1b] text-[#e0a96d] rounded-xl shadow-sm">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-serif text-base font-bold text-[#241e1b]">
                              Step 0: Instant Phone Account Setup
                            </h4>
                            <p className="text-[11px] text-[#6e5d4e]">
                              Type your mobile number to receive a 4-digit OTP. Your patron account will be created instantly so you can order smoothly.
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-[#241e1b] text-[#e0a96d] rounded-md shrink-0">
                          Required to Order
                        </span>
                      </div>

                      {/* Phone & Name inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                            Your Full Name:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Clara Vance"
                            value={otpNameInput}
                            onChange={(e) => setOtpNameInput(e.target.value)}
                            className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                            Mobile Phone Number:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="tel"
                              placeholder="+1 (555) 234-5678"
                              value={otpPhoneInput}
                              onChange={(e) => setOtpPhoneInput(e.target.value)}
                              className="flex-1 bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                            />
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={isSendingOtp}
                              className="px-3.5 py-2 bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
                            >
                              {isSendingOtp ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <span>{otpSent ? 'Resend' : 'Send OTP'}</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* OTP Code Input Drawer */}
                      {otpSent && (
                        <div className="p-3.5 bg-white border border-[#e8ded1] rounded-xl space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#241e1b] flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-700" />
                              <span>Enter 4-Digit SMS Code:</span>
                            </span>
                            {otpDemoCode && (
                              <button
                                type="button"
                                onClick={() => setOtpCodeInput(otpDemoCode)}
                                className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
                                title="Click to auto-fill code"
                              >
                                ⚡ Auto-Fill Code: {otpDemoCode}
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="e.g. 1234"
                              value={otpCodeInput}
                              onChange={(e) => setOtpCodeInput(e.target.value)}
                              className="w-32 bg-[#faf8f5] border-2 border-[#241e1b] rounded-xl px-3 py-2 text-center text-sm font-mono font-bold tracking-widest text-[#241e1b] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isVerifyingOtp}
                              className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              {isVerifyingOtp ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Verify & Create Account</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Status / Error / Success notices */}
                      {otpError && (
                        <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex justify-between items-center">
                          <span>{otpError}</span>
                          <button onClick={() => setOtpError(null)} className="font-bold text-red-900 ml-2">&times;</button>
                        </div>
                      )}

                      {otpMessage && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                          <Check className="w-3.5 h-3.5" />
                          <span>{otpMessage}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-[#8c7866] pt-1 border-t border-[#e8ded1]">
                        <span>Takes only 5 seconds &bull; No password needed</span>
                        <button
                          type="button"
                          onClick={onRequireLogin}
                          className="text-[#8a5d3b] hover:text-[#241e1b] underline font-medium cursor-pointer"
                        >
                          Or sign in with existing email
                        </button>
                      </div>
                    </div>
                  )}

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
                        const isFree = subtotal >= 5000 && method.id === 'ship-standard';
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
                              {price === 0 ? 'FREE' : formatINR(price)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) {
                        setCheckoutError('Please type your phone number and verify OTP above to create your patron account before proceeding to payment.');
                        return;
                      }
                      setStep('payment');
                    }}
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
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'border-[#241e1b] bg-[#241e1b] text-white shadow-sm ring-1 ring-[#e0a96d]'
                          : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-[#e0a96d]" />
                      <span className="text-[11px] font-bold">UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-[#241e1b] bg-[#241e1b] text-white shadow-sm ring-1 ring-[#e0a96d]'
                          : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#e0a96d]" />
                      <span className="text-[11px] font-bold">RuPay / Cards</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'netbanking'
                          ? 'border-[#241e1b] bg-[#241e1b] text-white shadow-sm ring-1 ring-[#e0a96d]'
                          : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                      }`}
                    >
                      <Building className="w-5 h-5 text-[#e0a96d]" />
                      <span className="text-[11px] font-bold">NetBanking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-[#241e1b] bg-[#241e1b] text-white shadow-sm ring-1 ring-[#e0a96d]'
                          : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                      }`}
                    >
                      <Banknote className="w-5 h-5 text-[#e0a96d]" />
                      <span className="text-[11px] font-bold">Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('applepay')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'applepay'
                          ? 'border-[#241e1b] bg-[#241e1b] text-white shadow-sm ring-1 ring-[#e0a96d]'
                          : 'border-[#d8c8b4] bg-white text-[#4a3f35] hover:border-[#a0683a]'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-[#e0a96d]" />
                      <span className="text-[11px] font-bold">GPay / Apple</span>
                    </button>
                  </div>

                  {/* Selected Payment Method Form View */}
                  {paymentMethod === 'upi' && (
                    <div className="p-5 bg-white rounded-2xl border border-[#e8ded1] space-y-4 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-[#f0e8dc]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                            INSTANT ZERO FEE
                          </span>
                          <span className="text-xs text-[#6e5d4e]">Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">₹0 Convenience Fee</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#241e1b] mb-1">
                          Enter your Virtual Payment Address (VPA / UPI ID):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. mobile@upi or username@okhdfcbank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="flex-1 bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs font-mono text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                          />
                          <button
                            type="button"
                            onClick={() => setUpiId('aarav.sharma@okhdfcbank')}
                            className="px-3 py-1.5 bg-[#f5efe6] border border-[#d8c8b4] text-[#8a5d3b] hover:bg-[#ede3d4] text-[11px] font-semibold rounded-xl"
                          >
                            Demo VPA
                          </button>
                        </div>
                      </div>

                      {/* Or Scan QR */}
                      <div className="p-3.5 bg-[#fcfbf9] border border-dashed border-[#d8c8b4] rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white border border-[#e0d3c1] rounded-lg p-1.5 flex items-center justify-center shrink-0">
                            <QrCode className="w-full h-full text-[#241e1b]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#241e1b] block">Or Scan Dynamic UPI QR</span>
                            <span className="text-[11px] text-[#6e5d4e]">Open any UPI app and scan to pay {formatINR(grandTotal)}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                          ✓ Auto-Detect
                        </span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#f0e8dc]">
                        <span className="text-xs font-semibold text-[#241e1b]">Domestic & International Cards</span>
                        <span className="text-[10px] text-[#8c7866] font-mono">RuPay &bull; Visa &bull; Mastercard</span>
                      </div>
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
                            CVV / CVC:
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
                        <span>Protected by RBI-Mandated Two-Factor OTP & 3D Secure 2.0.</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="p-5 bg-white rounded-2xl border border-[#e8ded1] space-y-4">
                      <label className="block text-xs font-semibold text-[#241e1b]">
                        Choose from 50+ Verified Indian Banks:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              selectedBank === bank
                                ? 'border-[#241e1b] bg-[#241e1b] text-white font-semibold'
                                : 'border-[#d8c8b4] bg-[#faf8f5] text-[#4a3f35] hover:border-[#a0683a]'
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#6e5d4e]">
                        Selected: <strong className="text-[#241e1b]">{selectedBank}</strong>. You will be redirected to secure retail banking portal for instant authorization.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                        <Banknote className="w-4 h-4 text-amber-700" />
                        <span>Cash on Delivery (COD) Available</span>
                      </div>
                      <p className="text-xs text-[#5c4d3f] leading-relaxed">
                        Pay in cash or via mobile UPI QR scan to the BlueDart courier executive at your doorstep when receiving the sealed parcel.
                      </p>
                      <div className="text-[11px] text-[#8a5d3b] bg-white/70 p-2.5 rounded-xl border border-amber-100">
                        ✓ Studio tamper-evident seal check before delivery &bull; OTP verification at delivery
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'applepay' && (
                    <div className="p-6 bg-white rounded-2xl border border-[#e8ded1] text-center space-y-3">
                      <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto text-xl">
                        
                      </div>
                      <h5 className="font-semibold text-sm text-[#241e1b]">One-Touch Express Mobile Authorization</h5>
                      <p className="text-xs text-[#6e5d4e]">
                        Authorize directly with Google Pay or Apple Pay using biometric face or fingerprint confirmation.
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
                        <span>Authorizing 3D-Secure Transaction in ₹ INR...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#e0a96d]" />
                        <span>Authorize & Place Order • {formatINR(grandTotal)}</span>
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
                      {formatINR(item.product.price * item.quantity)}
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
                    <span className="font-bold">-{formatINR(discount)}</span>
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
                  <span>{formatINR(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Courier ({selectedShipping.name})</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : formatINR(shippingCost)}</span>
                </div>
                {giftWrapping && (
                  <div className="flex justify-between">
                    <span>Wax-Sealed Keepsake Packaging</span>
                    <span>+₹350</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated GST (3% Jewel Standard)</span>
                  <span>{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#241e1b] pt-2 border-t border-[#e0d3c1]">
                  <span>Total Amount</span>
                  <span>{formatINR(grandTotal)}</span>
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
