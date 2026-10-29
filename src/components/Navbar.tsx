import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Ruler, Search, Menu, X, Heart, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  onOpenSizing: () => void;
  onOpenAdmin: () => void;
  onOpenTrackOrder: () => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenChat,
  onOpenSizing,
  onOpenAdmin,
  onOpenTrackOrder,
  onSelectCategory,
  activeCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Jewels' },
    { id: 'rings', label: 'Rings' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'earrings', label: 'Earrings' },
    { id: 'bracelets', label: 'Cuffs & Bracelets' },
    { id: 'bridal', label: 'Ceremonial & Bridal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8ded1] transition-all">
      {/* Announcement Bar */}
      <div className="bg-[#241e1b] text-[#f7f2ea] text-xs py-2 px-4 text-center font-medium tracking-wider flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-[11px] text-[#d4c5b3]">
          <span>Handmade in Small Atelier Batches</span>
        </div>

        <div className="flex items-center justify-center gap-2 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#e0a96d]" />
          <span>Code <strong className="text-[#e0a96d] font-semibold underline decoration-dotted">ARTISAN15</strong> for 15% off &bull; Free insured delivery on orders $150+</span>
        </div>

        {/* Quick Admin & Track Order Links in top bar */}
        <div className="flex items-center gap-3 text-[11px]">
          <button
            onClick={onOpenTrackOrder}
            className="text-[#d4c5b3] hover:text-[#e0a96d] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Track Order</span>
          </button>
          <span className="text-[#5c4d3f]">&bull;</span>
          <button
            onClick={onOpenAdmin}
            className="text-[#e0a96d] hover:text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4a3f35] hover:text-[#241e1b] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Atelier Identity */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex flex-col text-left group">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-[#241e1b] font-normal uppercase group-hover:text-[#a0683a] transition-colors">
                AURA
              </span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#8c7866] -mt-1 font-medium">
                Artisanal Atelier
              </span>
            </a>
          </div>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center space-x-7">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`text-sm tracking-wide transition-all relative py-1 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'text-[#241e1b] font-semibold'
                    : 'text-[#6e5d4e] hover:text-[#241e1b]'
                }`}
              >
                {cat.label}
                {activeCategory === cat.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a0683a] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Input Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-[#f0e8dc] rounded-full px-3 py-1.5 border border-[#d8c8b4] animate-fadeIn">
                  <Search className="w-4 h-4 text-[#8c7866] mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rings, pearls, gold..."
                    className="bg-transparent text-xs text-[#241e1b] focus:outline-none w-32 sm:w-48 placeholder-[#8c7866]"
                    autoFocus
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-[#8c7866] hover:text-[#241e1b] text-xs ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#4a3f35] hover:text-[#241e1b] rounded-full hover:bg-[#ede5d8] transition-colors"
                  title="Search jewelry"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sizing Tool Button */}
            <button
              onClick={onOpenSizing}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d8c8b4] bg-[#f5ede0]/60 hover:bg-[#efe4d4] text-xs font-medium text-[#4a3f35] transition-colors cursor-pointer"
              title="Interactive Ring & Necklace Sizing Guide"
            >
              <Ruler className="w-3.5 h-3.5 text-[#a0683a]" />
              <span>Sizing Guide</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#d8c8b4] bg-[#faf8f5] hover:bg-[#241e1b] hover:text-white text-xs font-semibold text-[#241e1b] transition-all cursor-pointer"
              title="Atelier Admin Portal: Launch New Products & Manage Orders"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Launch</span>
            </button>

            {/* Aura AI Concierge Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#241e1b] to-[#4a3c31] text-[#f7f2ea] hover:shadow-md text-xs font-medium transition-all group cursor-pointer"
              title="Ask Aura AI Concierge for recommendations & sizing"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e0a96d] animate-pulse" />
              <span className="hidden sm:inline">Ask Aura AI</span>
              <span className="sm:hidden">Aura</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#241e1b] hover:text-[#a0683a] rounded-full hover:bg-[#ede5d8] transition-colors cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#a0683a] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e8ded1] bg-[#faf8f5] px-4 pt-3 pb-6 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8c7866] mb-1">
            Collections
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#ede5d8] text-[#241e1b] font-semibold'
                    : 'text-[#5c4d3f] hover:bg-[#f3ece0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#e8ded1] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSizing();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-[#4a3f35] py-2 px-3 rounded-lg hover:bg-[#ede5d8]"
            >
              <Ruler className="w-4 h-4 text-[#a0683a]" />
              <span>Interactive Sizing Guide (Rings & Necklaces)</span>
            </button>
            <button
              onClick={() => {
                onOpenTrackOrder();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-[#4a3f35] py-2 px-3 rounded-lg hover:bg-[#ede5d8]"
            >
              <Truck className="w-4 h-4 text-[#a0683a]" />
              <span>Track Atelier Delivery Status</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-[#241e1b] font-semibold py-2 px-3 rounded-lg bg-[#f0e8dc] hover:bg-[#e4d8c7]"
            >
              <Sparkles className="w-4 h-4 text-[#a0683a]" />
              <span>Atelier Admin: Launch New Jewel</span>
            </button>
            <button
              onClick={() => {
                onOpenChat();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-[#241e1b] font-medium py-2 px-3 rounded-lg bg-[#efe4d4]"
            >
              <Sparkles className="w-4 h-4 text-[#a0683a]" />
              <span>Aura AI Jewelry Concierge</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
