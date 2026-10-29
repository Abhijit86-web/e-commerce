import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Ruler, Star, CheckCircle } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onOpenSizing: () => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onOpenSizing, onOpenChat }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f5eee6] via-[#faf8f5] to-[#faf8f5] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#e8ded1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text / Editorial Intro */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ede5d8] border border-[#d8c8b4] text-[#71543b] text-xs font-medium tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#a0683a]" />
              <span>Bespoke Studio Edition &bull; Ethical Fine Jewelry</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#241e1b] font-normal leading-[1.12] tracking-tight">
              Sculpted by Hand, <br />
              <span className="italic font-light text-[#8a5d3b]">Cherished for Generations.</span>
            </h1>

            <p className="text-[#5c4d3f] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Every ring, pendant, and cuff is individually hand-forged in our coastal atelier using fairmined recycled gold, sterling silver, and raw luminous gemstones. No mass casting, never hollow.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onShopClick}
                className="px-7 py-3.5 rounded-full bg-[#241e1b] text-[#f7f2ea] text-sm font-medium hover:bg-[#3d322c] hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Studio Pieces</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenSizing}
                className="px-5 py-3.5 rounded-full bg-[#f0e6d8] hover:bg-[#e7d9c6] text-[#4a3f35] text-sm font-medium border border-[#d8c8b4] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Ruler className="w-4 h-4 text-[#a0683a]" />
                <span>Interactive Sizing</span>
              </button>

              <button
                onClick={onOpenChat}
                className="px-5 py-3.5 rounded-full bg-white hover:bg-[#fbf7f1] text-[#241e1b] text-sm font-medium border border-[#d8c8b4] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#a0683a]" />
                <span>Styling Concierge</span>
              </button>
            </div>

            {/* Micro Credibility Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[#e8ded1] text-xs text-[#6e5d4e]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#a0683a] shrink-0" />
                <span>100% Recycled Fairmined Gold & Silver</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#a0683a] shrink-0" />
                <span>Lifetime Atelier Prong & Craft Warranty</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="flex text-[#a0683a]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span>4.9 / 5.0 (180+ Reviews)</span>
              </div>
            </div>

          </div>

          {/* Right Imagery Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Feature Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80"
                  alt="Sol Invictus Hammered Gold Ring on anvil"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating caption card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-white/40 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#8a5d3b] font-semibold">Featured Masterpiece</p>
                      <h4 className="font-serif text-base font-semibold text-[#241e1b]">Sol Invictus Hammered Band</h4>
                    </div>
                    <span className="font-serif text-base font-bold text-[#241e1b]">$185</span>
                  </div>
                  <p className="text-[11px] text-[#6e5d4e] mt-1 line-clamp-1">Cold-hammered over steel horn stake in 18k fairmined vermeil.</p>
                </div>
              </div>

              {/* Secondary Floating Mini Card */}
              <div className="hidden sm:block absolute -top-5 -left-8 bg-[#faf8f5] p-3 rounded-xl shadow-xl border border-[#e0d3c1] w-48 animate-bounce-slow">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80"
                    alt="Baroque pearl detail"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#a0683a]">Studio Favorite</span>
                    <p className="text-xs font-semibold text-[#241e1b] leading-tight">Luna Keshi Pearl</p>
                    <span className="text-xs text-[#6e5d4e]">$240</span>
                  </div>
                </div>
              </div>

              {/* Special Seasonal Coupon Callout */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-[#241e1b] text-[#f7f2ea] py-2 px-3.5 rounded-xl shadow-xl border border-[#4a3c31] flex items-center gap-2">
                <span className="text-xs">Seasonal Offer:</span>
                <span className="text-xs font-mono font-bold text-[#e0a96d] bg-black/40 px-2 py-0.5 rounded">ARTISAN15</span>
                <span className="text-[11px] text-[#d4c5b3]">(-15%)</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
