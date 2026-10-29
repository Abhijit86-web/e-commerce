import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Heart, Truck, Check, Mail, Lock } from 'lucide-react';

interface FooterProps {
  onOpenSizing: () => void;
  onOpenChat: () => void;
  onOpenAdmin: () => void;
  onOpenTrackOrder: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSizing,
  onOpenChat,
  onOpenAdmin,
  onOpenTrackOrder,
  onSelectCategory,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#241e1b] text-[#f7f2ea] border-t border-[#3d3128] pt-16 pb-12">
      {/* Atelier Trust Highlights Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#3d3128]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#3d3128] text-[#e0a96d] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-white">Hand-Forged in Small Batches</h4>
              <p className="text-xs text-[#b8a695] mt-1 leading-relaxed">
                Individually hand-hammered and file-finished over steel stakes by master silversmiths.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#3d3128] text-[#e0a96d] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-white">Fairmined 18k Gold & Silver</h4>
              <p className="text-xs text-[#b8a695] mt-1 leading-relaxed">
                100% recycled certified precious metals and ethically sourced conflict-free gems.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#3d3128] text-[#e0a96d] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-white">Carbon-Neutral Delivery</h4>
              <p className="text-xs text-[#b8a695] mt-1 leading-relaxed">
                Every package is insured, tamper-sealed, and delivered in our signature velvet pouch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#3d3128] text-[#e0a96d] shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-white">Lifetime Atelier Guarantee</h4>
              <p className="text-xs text-[#b8a695] mt-1 leading-relaxed">
                Complimentary annual stone prong checks, size exchanges, and ultrasonic cleans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Atelier Brand column */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-serif text-3xl tracking-[0.2em] uppercase text-white font-normal block">
              AURA
            </span>
            <p className="text-xs text-[#b8a695] leading-relaxed max-w-sm">
              An independent fine jewelry atelier celebrating the intimacy of slow craftsmanship. Each piece is designed to be an enduring talisman that tells your story.
            </p>
            <div className="text-xs text-[#d4c5b3] space-y-1">
              <p>Studio Address: 418 Artisan Wharf, Carmel-by-the-Sea, CA</p>
              <p>Direct Concierge: concierge@aurajewelry.com</p>
            </div>
          </div>

          {/* Collections */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#e0a96d]">
              Collections
            </h5>
            <ul className="text-xs space-y-2 text-[#b8a695]">
              <li>
                <button onClick={() => onSelectCategory('rings')} className="hover:text-white transition-colors">
                  Hand-Forged Rings
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('necklaces')} className="hover:text-white transition-colors">
                  Baroque Pearl Talismans
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('earrings')} className="hover:text-white transition-colors">
                  Botanical Drop Earrings
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bracelets')} className="hover:text-white transition-colors">
                  Recycled Silver Cuffs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bridal')} className="hover:text-white transition-colors">
                  Bespoke Bridal & Nesting
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Services */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#e0a96d]">
              Atelier Care
            </h5>
            <ul className="text-xs space-y-2 text-[#b8a695]">
              <li>
                <button onClick={onOpenSizing} className="hover:text-white transition-colors text-left">
                  Interactive Ring Sizer
                </button>
              </li>
              <li>
                <button onClick={onOpenChat} className="hover:text-white transition-colors text-left">
                  Consult Aura AI Concierge
                </button>
              </li>
              <li>
                <a href="#reviews-section" className="hover:text-white transition-colors block">
                  Patron Reviews & Photos
                </a>
              </li>
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-white transition-colors text-left cursor-pointer">
                  Track Delivery Status
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#e0a96d] hover:text-white transition-colors text-left font-semibold cursor-pointer">
                  Atelier Admin Portal (Launch Jewels)
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Studio Trunk Shows */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#e0a96d]">
              The Atelier Journal
            </h5>
            <p className="text-xs text-[#b8a695] leading-relaxed">
              Receive private invitations to one-of-a-kind stone drops, seasonal artisan trunk shows, and secret collector coupon codes.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#3d3128] border border-[#a0683a] rounded-xl text-xs text-[#e0a96d] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#e0a96d]" />
                <span>You are on our private studio guestbook.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-[#1a1513] border border-[#3d3128] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e0a96d]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#e0a96d] hover:bg-[#f0bd88] text-[#241e1b] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}

            <div className="pt-2 flex items-center gap-2 text-[10px] text-[#8c7866]">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>We never spam or share collector contacts.</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#3d3128] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c7866]">
        <p>&copy; {new Date().getFullYear()} AURA Artisanal Fine Jewelry Atelier. All rights reserved.</p>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-wider uppercase font-medium">Payment Partners:</span>
          <div className="flex items-center gap-2">
            <span className="bg-[#3d3128] px-2 py-0.5 rounded text-[10px] text-[#d4c5b3] font-semibold">VISA</span>
            <span className="bg-[#3d3128] px-2 py-0.5 rounded text-[10px] text-[#d4c5b3] font-semibold">Mastercard</span>
            <span className="bg-[#3d3128] px-2 py-0.5 rounded text-[10px] text-[#d4c5b3] font-semibold">AMEX</span>
            <span className="bg-[#3d3128] px-2 py-0.5 rounded text-[10px] text-[#d4c5b3] font-semibold">Apple Pay</span>
            <span className="bg-[#3d3128] px-2 py-0.5 rounded text-[10px] text-[#d4c5b3] font-semibold">PayPal</span>
            <span className="bg-pink-900/60 px-2 py-0.5 rounded text-[10px] text-pink-200 font-semibold">Klarna</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
