import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, Sparkles, Check, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { CustomerUser, AdminSession } from '../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  onLoginSuccess: (user: CustomerUser) => void;
  onLogout: () => void;
  checkoutRedirect?: boolean;
  onAdminLogin?: (session: AdminSession) => void;
  onOpenAdmin?: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  checkoutRedirect = false,
  onAdminLogin,
  onOpenAdmin,
}) => {
  const [mode, setMode] = useState<'phone_otp' | 'login' | 'register'>('phone_otp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Phone OTP State
  const [otpPhone, setOtpPhone] = useState('+1 (555) 234-5678');
  const [otpName, setOtpName] = useState('Clara Vance');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDemoCode, setOtpDemoCode] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async () => {
    if (!otpPhone || otpPhone.trim().length < 6) {
      setErrorMsg('Please enter a valid phone number (at least 6 digits).');
      return;
    }
    setIsSendingOtp(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhone.trim(), fullName: otpName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpDemoCode(data.demoCode || '1234');
        setSuccessMsg(data.message || 'OTP sent successfully!');
      } else {
        setErrorMsg(data.error || 'Failed to send OTP code.');
      }
    } catch {
      setErrorMsg('Network error sending verification code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg('Please enter the 4-digit verification code.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: otpPhone.trim(),
          code: otpCode.trim(),
          fullName: otpName.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setSuccessMsg(data.message || 'Phone verified! Signed in.');
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 600);
      } else {
        setErrorMsg(data.error || 'Invalid or expired OTP code.');
      }
    } catch {
      setErrorMsg('Network error verifying code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { email, password } : { name, email, password, phone };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setSuccessMsg(data.message || 'Authenticated successfully');
        
        if (data.isAdmin && data.adminToken && onAdminLogin) {
          const session: AdminSession = {
            token: data.adminToken,
            email: data.user.email,
            name: data.user.name,
            role: 'super_admin',
            loginTime: new Date().toLocaleTimeString(),
          };
          try {
            sessionStorage.setItem('aura_admin_session', JSON.stringify(session));
          } catch {
            // ignore
          }
          onAdminLogin(session);
        }

        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 800);
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please verify your details.');
      }
    } catch {
      setErrorMsg('Network error connecting to atelier server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('clara.vance@gmail.com');
    setPassword('password123');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'clara.vance@gmail.com', password: 'password123' }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setSuccessMsg('Signed in as demo collector Clara Vance');
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 600);
      }
    } catch {
      setErrorMsg('Demo sign-in unavailable at this moment.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#faf8f5] w-full max-w-md rounded-3xl shadow-2xl border border-[#e8ded1] overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {currentUser ? (
          <>
            {/* Header */}
            <div className="p-6 bg-[#241e1b] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#e0a96d] text-[#241e1b] font-serif font-bold text-lg flex items-center justify-center border-2 border-white/20">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium">{currentUser.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#e0a96d] font-semibold">
                    {currentUser.vipTier || 'Atelier Patron'}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Details */}
            <div className="p-6 space-y-4 text-xs text-[#5c4d3f]">
              <div className="p-3.5 bg-white rounded-2xl border border-[#e8ded1] space-y-1.5 shadow-sm">
                <span className="font-semibold text-[#241e1b] block">Patron Contact</span>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#a0683a]" />
                  <span>{currentUser.email}</span>
                </p>
                {currentUser.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#a0683a]" />
                    <span>{currentUser.phone}</span>
                  </p>
                )}
              </div>

              <div className="p-3.5 bg-[#f5efe6] rounded-2xl border border-[#e0d3c1] space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#241e1b]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#a0683a]" />
                    <span>Collector Privileges</span>
                  </span>
                  <span className="text-emerald-700 font-bold">Active</span>
                </div>
                <p className="text-[11px] text-[#6e5d4e]">
                  Complimentary 30-day ring resizings, insured courier delivery, and private heirloom vault order history.
                </p>
              </div>

              {currentUser.role === 'admin' && onOpenAdmin && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="w-full py-3 bg-[#e0a96d] hover:bg-[#f2bd8b] text-[#241e1b] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Launch Atelier Administrator Console</span>
                  </button>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  onClick={onLogout}
                  className="flex-1 py-3 bg-white border border-[#d8c8b4] hover:bg-red-50 hover:text-red-700 text-[#5c4d3f] font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#241e1b] hover:bg-[#a0683a] text-white font-semibold rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
        {/* Header */}
        <div className="p-6 bg-[#f5efe6] border-b border-[#e8ded1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#241e1b] text-white rounded-xl">
              <User className="w-5 h-5 text-[#e0a96d]" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#241e1b]">
                {mode === 'login' ? 'Patron Sign In' : 'Create Customer Account'}
              </h3>
              <p className="text-xs text-[#6e5d4e]">
                {checkoutRedirect
                  ? 'Sign in or create account to complete your bespoke order'
                  : 'Track handcrafted deliveries and save ring measurements'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#eae0d2] text-[#4a3f35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#e8ded1] bg-[#faf8f5] text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('phone_otp');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              mode === 'phone_otp'
                ? 'border-[#241e1b] text-[#241e1b] bg-white'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            📱 Phone OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              mode === 'login'
                ? 'border-[#241e1b] text-[#241e1b] bg-white'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              mode === 'register'
                ? 'border-[#241e1b] text-[#241e1b] bg-white'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        {mode === 'phone_otp' ? (
          <div className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                  Full Name (for delivery & certificates):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clara Vance"
                  value={otpName}
                  onChange={(e) => setOtpName(e.target.value)}
                  className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                  Mobile Phone Number <span className="text-red-500">*</span>:
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+1 (555) 234-5678"
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
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

              {otpSent && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#241e1b] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Enter 4-Digit Code:</span>
                    </span>
                    {otpDemoCode && (
                      <button
                        type="button"
                        onClick={() => setOtpCode(otpDemoCode)}
                        className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
                      >
                        ⚡ Auto-Fill: {otpDemoCode}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="1234"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-28 bg-white border border-[#241e1b] rounded-xl px-3 py-2 text-center text-sm font-mono font-bold tracking-widest text-[#241e1b] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Verify & Sign In</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fast Demo */}
            <div className="pt-2 border-t border-[#f0e8dc] text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs text-[#8a5d3b] hover:text-[#241e1b] hover:underline font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>⚡ 1-Click Demo Login (Clara Vance)</span>
              </button>
              <p className="text-[10px] text-[#8c7866] mt-1">
                Instantly signs in as verified patron for seamless checkout.
              </p>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                Full Name <span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vivienne Montgomery"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#241e1b] mb-1">
              Email Address <span className="text-red-500">*</span>:
            </label>
            <input
              type="email"
              required
              placeholder="e.g. clara.vance@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#241e1b] mb-1">
              Password <span className="text-red-500">*</span>:
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                Phone Number (for Courier SMS, optional):
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : mode === 'login' ? (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#e0a96d]" />
                <span>Create Patron Account</span>
              </>
            )}
          </button>

          {/* 1-Click Fast Demo Login for instant testing */}
          <div className="pt-2 border-t border-[#f0e8dc] text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-[#8a5d3b] hover:text-[#241e1b] hover:underline font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <span>⚡ 1-Click Demo Login (Clara Vance)</span>
            </button>
            <p className="text-[10px] text-[#8c7866] mt-1">
              Bypasses registration for quick checkout evaluation.
            </p>
          </div>

          {onOpenAdmin && (
            <div className="pt-2 border-t border-[#e8ded1] text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="text-xs text-[#a0683a] hover:text-[#241e1b] font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer bg-[#faf4ec] py-1.5 px-3 rounded-lg border border-[#e0a96d]/40"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Store Administrator? Open Admin Portal</span>
              </button>
            </div>
          )}
        </form>
        )}
          </>
        )}
      </div>
    </div>
  );
};
