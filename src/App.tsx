import React, { useState, useEffect } from 'react';
import { JEWELRY_PRODUCTS, INITIAL_REVIEWS } from './data/jewelryData';
import { Product, Review, CartItem, Coupon, OrderConfirmation, CustomerUser, AdminSession } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizingGuideModal } from './components/SizingGuideModal';
import { VideoJewelSection } from './components/VideoJewelSection';
import { ReviewsSection } from './components/ReviewsSection';
import { WriteReviewModal } from './components/WriteReviewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { VisualScanModal } from './components/VisualScanModal';
import { AdminAccessModal } from './components/AdminAccessModal';
import { AdminPortal } from './components/AdminPortal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AuraChatbot } from './components/AuraChatbot';
import { Footer } from './components/Footer';
import { Sparkles, Ruler, ShieldCheck, HeartHandshake, Gem } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(JEWELRY_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Customer Authentication state (for regular shoppers & patrons)
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('aura_customer_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      // ignore
    }
    return null;
  });

  // Dedicated Administrator Session state (Strictly private & isolated from customers)
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const savedAdmin = sessionStorage.getItem('aura_admin_session');
      if (savedAdmin) return JSON.parse(savedAdmin);
    } catch (e) {
      // ignore
    }
    return null;
  });

  // Cart state with localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        product: JEWELRY_PRODUCTS[0],
        selectedSize: '7',
        quantity: 1,
      },
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [giftWrapping, setGiftWrapping] = useState<boolean>(false);
  const [giftMessage, setGiftMessage] = useState<string>('Handcrafted with love.');

  // Modal / Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizingOpen, setIsSizingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>(undefined);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewProductTarget, setReviewProductTarget] = useState<Product | null>(null);
  const [orderSuccessData, setOrderSuccessData] = useState<OrderConfirmation | null>(null);

  // Protected Admin Portal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVisualScanOpen, setIsVisualScanOpen] = useState(false);
  const [isAdminAccessModalOpen, setIsAdminAccessModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  // Sync customer user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('aura_customer_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('aura_customer_user');
      }
    } catch (e) {
      // ignore
    }
  }, [currentUser]);

  // Validate existing admin session with backend
  useEffect(() => {
    if (adminSession?.token) {
      fetch('/api/admin/check-session', {
        headers: {
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
      })
        .then((res) => {
          if (!res.ok) {
            sessionStorage.removeItem('aura_admin_session');
            setAdminSession(null);
            setIsAdminOpen(false);
          }
        })
        .catch(() => {
          // offline check fallback
        });
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  // Check URL query/hash for staff access (e.g. #admin or ?admin=true) & keyboard shortcut
  useEffect(() => {
    const checkStaffRoute = () => {
      const isStaff = window.location.hash === '#admin' || window.location.search.includes('admin');
      if (isStaff) {
        if (adminSession) {
          setIsAdminOpen(true);
        } else {
          setIsAdminAccessModalOpen(true);
        }
      }
    };

    checkStaffRoute();
    window.addEventListener('hashchange', checkStaffRoute);

    // Keyboard shortcut: Alt + A or Ctrl + Shift + A to open Admin Access
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        handleOpenAdminPortal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkStaffRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [adminSession]);

  // Fetch dynamic products from backend API (with fallback)
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.log('Using initial products catalog:', err));
  }, []);

  // Fetch latest reviews from backend if available
  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.log('Using initial reviews:', err));
  }, []);

  // Cart Operations
  const handleAddToCart = (product: Product, size?: string, quantity = 1) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, selectedSize: size, quantity }];
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Coupon application handler
  const handleApplyCoupon = async (code: string) => {
    const subtotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal: subtotal }),
      });
      const data = await res.json();
      if (data.valid && data.coupon) {
        setAppliedCoupon(data.coupon);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Invalid coupon code.' };
    } catch {
      return { success: false, message: 'Failed to validate coupon.' };
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // When order completes
  const handleOrderSuccess = (order: OrderConfirmation) => {
    setOrderSuccessData(order);
    setIsCheckoutOpen(false);
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const handleOpenChatWithQuery = (query: string) => {
    setChatInitialQuery(query);
    setIsChatOpen(true);
  };

  // Lock and sign out administrator session
  const handleLockAdmin = () => {
    try {
      sessionStorage.removeItem('aura_admin_session');
    } catch {
      // ignore
    }
    setAdminSession(null);
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Open admin gate or portal
  const handleOpenAdminPortal = () => {
    if (adminSession) {
      setIsAdminOpen(true);
    } else {
      setIsAdminAccessModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#241e1b] flex flex-col selection:bg-[#d8c8b4] selection:text-[#241e1b]">
      {isAdminOpen && adminSession ? (
        <AdminPortal
          onClose={() => setIsAdminOpen(false)}
          adminSession={adminSession}
          onLock={handleLockAdmin}
          onOpenAuthGate={() => setIsAdminAccessModalOpen(true)}
          products={products}
          onProductCreated={(newProduct) => {
            setProducts((prev) => [newProduct, ...prev]);
          }}
          onProductDeleted={(id) => {
            setProducts((prev) => prev.filter((p) => p.id !== id));
          }}
          onProductUpdated={(updated) => {
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          }}
          onViewProductInStore={(p) => {
            setQuickViewProduct(p);
            setIsAdminOpen(false);
          }}
        />
      ) : (
        <>
          {/* 1. Header / Navbar with Voice Search, Visual Scan, Customer Account & Cart */}
          <Navbar
            cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
            adminSession={adminSession}
            onOpenAdmin={handleOpenAdminPortal}
            onOpenSizing={() => setIsSizingOpen(true)}
            onOpenVisualScan={() => setIsVisualScanOpen(true)}
            onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
            onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 2. Hero Section */}
      <Hero
        onShopClick={() => {
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSizing={() => setIsSizingOpen(true)}
        onOpenChat={() => {
          setChatInitialQuery(undefined);
          setIsChatOpen(true);
        }}
      />

      {/* 3. Artisan Atelier Manifesto Strip */}
      <section className="bg-[#f0e8dc] py-6 border-b border-[#e5d9c7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-1.5 p-2">
              <Gem className="w-5 h-5 text-[#a0683a]" />
              <span className="font-serif text-sm font-semibold text-[#241e1b]">Natural & Raw Stones</span>
              <span className="text-[11px] text-[#6e5d4e]">Grade-AAA Keshi Pearls & Sapphires</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <ShieldCheck className="w-5 h-5 text-[#a0683a]" />
              <span className="font-serif text-sm font-semibold text-[#241e1b]">18k Fairmined Vermeil</span>
              <span className="text-[11px] text-[#6e5d4e]">Heavy 2.5µm Layer, Never Hollow</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <Ruler className="w-5 h-5 text-[#a0683a]" />
              <span className="font-serif text-sm font-semibold text-[#241e1b]">Precision Comfort Sizing</span>
              <span className="text-[11px] text-[#6e5d4e]">Free 30-Day Resizing Guarantee</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <HeartHandshake className="w-5 h-5 text-[#a0683a]" />
              <span className="font-serif text-sm font-semibold text-[#241e1b]">Aura AI Styling Advisor</span>
              <span className="text-[11px] text-[#6e5d4e]">Personalized Gift Guidance 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Product Catalog (Browsing is unrestricted for all customers before login) */}
      <main className="flex-1">
        <ProductGrid
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={handleAddToCart}
          onOpenSizing={() => setIsSizingOpen(true)}
        />

        {/* 5. Custom Sizing & Bespoke Consultation Callout Banner */}
        <section className="py-12 bg-gradient-to-r from-[#241e1b] via-[#382b24] to-[#241e1b] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs uppercase tracking-widest text-[#e0a96d] font-semibold flex items-center justify-center md:justify-start gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Unsure About Ring or Necklace Measurements?</span>
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  Find Your Flawless Fit with our Interactive Atelier Tools
                </h3>
                <p className="text-xs sm:text-sm text-[#d4c5b3] max-w-xl">
                  Place your favorite band on your screen or consult Aura AI to calculate sizing from millimeters. Every bespoke piece comes with our 30-day complimentary resizing promise.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <button
                  onClick={() => setIsSizingOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-[#e0a96d] hover:bg-[#f2bd8b] text-[#241e1b] text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Ruler className="w-4 h-4" />
                  <span>Open Interactive Sizer</span>
                </button>

                <button
                  onClick={() => {
                    setChatInitialQuery("Can you help me choose the best size for my ring?");
                    setIsChatOpen(true);
                  }}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#e0a96d]" />
                  <span>Ask Concierge</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. High-Definition Cinema Video Jewel Craftsmanship Showcase */}
        <VideoJewelSection
          onShopClick={() => {
            const el = document.getElementById('products-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenSizing={() => setIsSizingOpen(true)}
        />

        {/* 7. Customer Reviews & Community Testimonials Section */}
        <ReviewsSection
          reviews={reviews}
          products={products}
          onOpenWriteReview={() => {
            setReviewProductTarget(null);
            setIsWriteReviewOpen(true);
          }}
          onSelectProduct={(p) => setQuickViewProduct(p)}
        />
      </main>

      {/* 8. Footer (With discreet staff gatekeeper lock) */}
      <Footer
        onOpenSizing={() => setIsSizingOpen(true)}
        onOpenChat={() => {
          setChatInitialQuery(undefined);
          setIsChatOpen(true);
        }}
        onOpenAdmin={handleOpenAdminPortal}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Floating Aura AI Concierge Button */}
      {!isChatOpen && (
        <button
          onClick={() => {
            setChatInitialQuery(undefined);
            setIsChatOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#241e1b] text-[#f7f2ea] shadow-2xl hover:bg-[#a0683a] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer border border-[#e0a96d]/40"
          title="Chat with Aura AI Jeweler"
          aria-label="Open Aura AI Concierge"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#e0a96d] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#241e1b]" />
          </div>
          <span className="text-xs font-semibold tracking-wide pr-1 hidden sm:inline">
            Ask Aura AI Concierge
          </span>
        </button>
      )}
        </>
      )}

      {/* MODALS & DRAWERS */}

      {/* Customer Account Authentication Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
        onAdminLogin={(session) => {
          setAdminSession(session);
        }}
        onOpenAdmin={handleOpenAdminPortal}
      />

      {/* Visual Jewelry Lens & Scanner Modal */}
      <VisualScanModal
        isOpen={isVisualScanOpen}
        onClose={() => setIsVisualScanOpen(false)}
        products={products}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        onApplyCategoryFilter={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Secret Atelier Staff Gatekeeper Modal */}
      <AdminAccessModal
        isOpen={isAdminAccessModalOpen}
        onClose={() => setIsAdminAccessModalOpen(false)}
        onAuthorized={(session) => {
          setAdminSession(session);
          setIsAdminOpen(true);
          setIsAdminAccessModalOpen(false);
        }}
      />

      {/* Quick View / Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenSizing={() => setIsSizingOpen(true)}
        reviews={reviews}
        onWriteReview={(p) => {
          setReviewProductTarget(p);
          setIsWriteReviewOpen(true);
        }}
      />

      {/* Sizing Guide Modal */}
      <SizingGuideModal
        isOpen={isSizingOpen}
        onClose={() => setIsSizingOpen(false)}
        onOpenChatWithQuery={handleOpenChatWithQuery}
      />

      {/* Customer Delivery Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        products={products}
        selectedProduct={reviewProductTarget}
        onReviewSubmitted={(newRev) => {
          setReviews((prev) => [newRev, ...prev]);
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        giftWrapping={giftWrapping}
        setGiftWrapping={setGiftWrapping}
        giftMessage={giftMessage}
        setGiftMessage={setGiftMessage}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Multi-Step Checkout Modal (With Customer Account Gate) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currentUser={currentUser}
        onRequireLogin={() => setIsAuthModalOpen(true)}
        onLoginSuccess={(user) => setCurrentUser(user)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        giftWrapping={giftWrapping}
        giftMessage={giftMessage}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Modal */}
      <OrderSuccessModal
        order={orderSuccessData}
        onClose={() => setOrderSuccessData(null)}
      />

      {/* Aura AI Concierge Chatbot Drawer */}
      <AuraChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
        onOpenSizing={() => setIsSizingOpen(true)}
        onApplyCoupon={handleApplyCoupon}
        initialQuery={chatInitialQuery}
      />

    </div>
  );
}
