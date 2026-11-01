import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Sparkles, Ruler, Search, Menu, X, Heart,
  Truck, User, Mic, MicOff, Camera, UserCheck, ArrowRight, Lock
} from 'lucide-react';
import { CustomerUser, AdminSession } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  currentUser: CustomerUser | null;
  adminSession?: AdminSession | null;
  onOpenAdmin?: () => void;
  onOpenSizing: () => void;
  onOpenVisualScan: () => void;
  onOpenTrackOrder: () => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  currentUser,
  adminSession,
  onOpenAdmin,
  onOpenSizing,
  onOpenVisualScan,
  onOpenTrackOrder,
  onSelectCategory,
  activeCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Jewels' },
    { id: 'rings', label: 'Rings' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'earrings', label: 'Earrings' },
    { id: 'bracelets', label: 'Cuffs & Bracelets' },
    { id: 'bridal', label: 'Ceremonial & Bridal' },
  ];

  // Voice Search Recognition using Web Speech API
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Voice search is not supported in this browser. Please type in the search box or use photo scanner.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsVoiceListening(true);
      setVoiceNotice('Listening... Speak a jewel or metal (e.g. "baroque pearl", "gold ring")');

      recognition.onresult = (event: any) => {
        try {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setSearchQuery(transcript);
            setVoiceNotice(`Searched for: "${transcript}"`);
            const el = document.getElementById('products-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => setVoiceNotice(null), 3500);
          }
        } catch {
          // Ignore parsing issues
        }
        setIsVoiceListening(false);
      };

      recognition.onerror = (event: any) => {
        setIsVoiceListening(false);
        const errType = event?.error || 'unknown';
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          setVoiceNotice('Microphone access is not permitted in this preview window. You can type in the search bar or use photo scan.');
        } else if (errType === 'no-speech') {
          setVoiceNotice('No voice detected. Please try speaking again.');
        } else {
          setVoiceNotice('Voice input paused. You can use keyboard search or photo scanning.');
        }
        setTimeout(() => setVoiceNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognition.start();
    } catch {
      setIsVoiceListening(false);
      setVoiceNotice('Voice search unavailable in this environment. Please type or use photo scan.');
      setTimeout(() => setVoiceNotice(null), 4000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8ded1] transition-all">
      {/* Announcement Bar (Clean for Customers - No Public Admin Buttons) */}
      <div className="bg-[#241e1b] text-[#f7f2ea] text-xs py-2 px-4 text-center font-medium tracking-wider flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-[11px] text-[#d4c5b3]">
          <span>Handmade in Small Studio Batches</span>
        </div>

        <div className="flex items-center justify-center gap-2 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#e0a96d]" />
          <span>Code <strong className="text-[#e0a96d] font-semibold underline decoration-dotted">ARTISAN15</strong> for 15% off &bull; Free insured delivery on orders $150+</span>
        </div>

        {/* Utility Links: Delivery Tracking & Staff Admin Access */}
        <div className="flex items-center gap-3 text-[11px]">
          <button
            onClick={onOpenTrackOrder}
            className="text-[#d4c5b3] hover:text-[#e0a96d] transition-colors cursor-pointer flex items-center gap-1"
          >
            <Truck className="w-3 h-3 text-[#e0a96d]" />
            <span>Track Order</span>
          </button>

          <span className="text-white/20">|</span>

          <button
            onClick={onOpenAdmin}
            className="text-[#e0a96d] hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            title="Atelier Administrator Console (Staff Access)"
          >
            <Lock className="w-3 h-3 text-[#e0a96d]" />
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

          {/* Action Icons: Enhanced Search, Sizing, Customer Account & Bag */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Integrated Search with Voice & Visual Product Scanning */}
            <div className="relative">
              <div className="flex items-center bg-[#f0e8dc] rounded-full px-2.5 sm:px-3 py-1.5 border border-[#d8c8b4] shadow-inner">
                <Search className="w-4 h-4 text-[#8c7866] mr-1.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rings, pearl, sapphire..."
                  className="bg-transparent text-xs text-[#241e1b] focus:outline-none w-28 sm:w-44 md:w-56 placeholder-[#8c7866]"
                />

                {/* Clear search if text exists */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-[#8c7866] hover:text-[#241e1b] text-xs mr-1 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Voice Search Mic Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    isVoiceListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-[#5c4d3f] hover:text-[#241e1b] hover:bg-[#e4d8c7]'
                  }`}
                  title="Voice Search (Speak into microphone)"
                >
                  {isVoiceListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>

                {/* Visual Jewelry Lens / Photo Scanner Button */}
                <button
                  type="button"
                  onClick={onOpenVisualScan}
                  className="p-1.5 ml-0.5 rounded-full text-[#a0683a] hover:bg-[#e4d8c7] hover:text-[#241e1b] transition-all cursor-pointer"
                  title="Visual Jewelry Scanner: Snap or upload photo to match pieces"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Listening feedback bubble */}
              {voiceNotice && (
                <div className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-[#241e1b] text-white text-[11px] rounded-xl shadow-lg z-30 text-center animate-fadeIn">
                  {voiceNotice}
                </div>
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

            {/* PRIMARY CUSTOMER ACCOUNT OPTION (Replaces upper Ask Aura AI) */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer ${
                currentUser
                  ? 'bg-white border border-[#a0683a] text-[#241e1b] hover:bg-[#faf8f5]'
                  : 'bg-[#241e1b] hover:bg-[#a0683a] text-[#f7f2ea]'
              }`}
              title={currentUser ? `Signed in as ${currentUser.name}` : 'Sign In or Create Customer Account'}
            >
              {currentUser ? (
                <>
                  <div className="w-4 h-4 rounded-full bg-[#a0683a] text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-[#e0a96d]" />
                  <span>Create Account</span>
                </>
              )}
            </button>

            {/* Authenticated Admin Console Switch - ONLY visible to authenticated admin */}
            {adminSession && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e1916] text-[#e0a96d] border border-[#e0a96d]/40 text-xs font-bold uppercase tracking-wider hover:bg-[#2b221e] transition-all cursor-pointer shadow-sm"
                title="Return to Studio Administrator Console"
              >
                <Lock className="w-3.5 h-3.5 text-[#e0a96d]" />
                <span>Admin Console</span>
              </button>
            )}

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
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-[#241e1b] font-semibold py-2.5 px-3 rounded-lg bg-[#ede3d4]"
            >
              <User className="w-4 h-4 text-[#a0683a]" />
              <span>{currentUser ? `Account: ${currentUser.name}` : 'Sign In / Create Account'}</span>
            </button>

            <button
              onClick={() => {
                onOpenVisualScan();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-[#4a3f35] py-2 px-3 rounded-lg hover:bg-[#ede5d8]"
            >
              <Camera className="w-4 h-4 text-[#a0683a]" />
              <span>Visual Jewelry Photo Scanner</span>
            </button>

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
              className="flex items-center gap-2 text-sm text-[#e0a96d] bg-[#1a1513] font-semibold py-2.5 px-3 rounded-lg hover:bg-[#2b221e] border border-[#e0a96d]/30 mt-1 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#e0a96d]" />
              <span>Admin Portal (Staff Only)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
