import React, { useState, useEffect } from 'react';
import {
  Sparkles, PlusCircle, Package, ShoppingBag, Truck, CheckCircle2,
  DollarSign, ArrowLeft, Trash2, Edit3, Image, ShieldCheck, RefreshCw,
  ExternalLink, Eye, AlertCircle, Clock, Check
} from 'lucide-react';
import { Product, OrderConfirmation } from '../types';

interface AdminPortalProps {
  onClose: () => void;
  products: Product[];
  onProductCreated: (newProduct: Product) => void;
  onProductDeleted: (id: string) => void;
  onProductUpdated: (product: Product) => void;
  onViewProductInStore: (product: Product) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onClose,
  products,
  onProductCreated,
  onProductDeleted,
  onProductUpdated,
  onViewProductInStore,
}) => {
  const [activeTab, setActiveTab] = useState<'launch' | 'catalog' | 'orders'>('launch');
  const [orders, setOrders] = useState<OrderConfirmation[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // New Product Form State
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'bridal'>('rings');
  const [price, setPrice] = useState<number | ''>(195);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(240);
  const [materials, setMaterials] = useState('18k Fairmined Gold Vermeil on 925 Recycled Silver');
  const [finish, setFinish] = useState('Hand-hammered molten satin finish');
  const [gemstone, setGemstone] = useState('');
  const [stockCount, setStockCount] = useState<number>(10);
  const [badge, setBadge] = useState('New Studio Launch');
  const [description, setDescription] = useState(
    'Individually hand-forged in our studio over a steel horn stake. Designed with comfort-fit contouring and organic micro-facets that capture light beautifully.'
  );
  const [craftStory, setCraftStory] = useState(
    'Heated with an artisan jeweler torch and cold-hammered by master silversmiths to impart an enduring organic texture that ages gracefully.'
  );
  const [dimensions, setDimensions] = useState('Band width: 3.2mm; Thickness: 1.8mm');
  const [selectedSizesPreset, setSelectedSizesPreset] = useState<'rings' | 'necklaces' | 'cuffs' | 'none'>('rings');
  const [customSizes, setCustomSizes] = useState('5, 6, 7, 8, 9, 10');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [launchSuccessMsg, setLaunchSuccessMsg] = useState<string | null>(null);

  // Quick Curated Image Presets for rapid launch
  const curatedImagePresets = [
    {
      label: 'Hammered Gold Ring',
      url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      label: 'Baroque Pearl Choker',
      url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
    },
    {
      label: 'Raw Sapphire Ring',
      url: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=1000&q=80',
    },
    {
      label: 'Botanical Leaf Earrings',
      url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
    },
    {
      label: 'Textured Silver Cuff',
      url: 'https://images.unsplash.com/photo-1611591475152-47e2467d1656?auto=format&fit=crop&w=1000&q=80',
    },
    {
      label: 'Ancient Sun Medallion',
      url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  // Fetch orders from server
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Preset sizing change
  const handlePresetChange = (preset: 'rings' | 'necklaces' | 'cuffs' | 'none') => {
    setSelectedSizesPreset(preset);
    if (preset === 'rings') {
      setCustomSizes('5, 6, 7, 8, 9, 10');
      setCategory('rings');
    } else if (preset === 'necklaces') {
      setCustomSizes('16 inch (Choker), 18 inch (Princess), 20 inch (Matinee)');
      setCategory('necklaces');
    } else if (preset === 'cuffs') {
      setCustomSizes('Small (5.5"-6.2"), Medium (6.3"-7.0"), Large (7.1"-7.8")');
      setCategory('bracelets');
    } else {
      setCustomSizes('');
    }
  };

  // Handle Launch Product Submit
  const handleLaunchProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !description.trim()) {
      alert('Please fill out the product name, price, and description.');
      return;
    }

    setIsSubmitting(true);
    setLaunchSuccessMsg(null);

    const parsedSizes = customSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      subtitle: subtitle.trim() || 'Bespoke hand-forged edition',
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      materials,
      finish,
      gemstone: gemstone.trim() || undefined,
      stockCount: Number(stockCount) || 10,
      badge,
      description,
      craftStory,
      dimensions,
      sizes: parsedSizes.length > 0 ? parsedSizes : undefined,
      images: [imageUrl.trim()],
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.product) {
        onProductCreated(data.product);
        setLaunchSuccessMsg(`🎉 "${data.product.name}" has been successfully launched to the website! It is now live in your store.`);
        // Reset form for next launch
        setName('');
        setSubtitle('');
        setGemstone('');
        setTimeout(() => setLaunchSuccessMsg(null), 5000);
      } else {
        alert(data.error || 'Failed to launch product');
      }
    } catch (err) {
      console.error('Launch product error:', err);
      alert('Network error launching product to website.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delivery Status Change
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to remove "${prodName}" from the live catalog?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onProductDeleted(id);
      }
    } catch (e) {
      console.error('Failed to delete product:', e);
    }
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
  const totalItemsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#241e1b] flex flex-col animate-fadeIn">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-[#241e1b] text-white border-b border-[#3d3128] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#e0a96d] text-[#241e1b] flex items-center justify-center font-serif font-bold text-sm">
            A
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-medium tracking-wide flex items-center gap-2">
              <span>AURA Atelier Studio Admin</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-[#e0a96d] font-bold">
                Manager Portal
              </span>
            </h1>
            <p className="text-[11px] text-[#b8a695]">
              Product Launch • Orders & Delivery Hub • Real-Time Inventory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wide transition-all flex items-center gap-2 border border-white/20 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e0a96d]" />
            <span>Return to Customer Storefront</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#8c7866] uppercase font-bold block">Gross Revenue</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#241e1b]">
                ${totalRevenue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#8c7866] uppercase font-bold block">Studio Orders</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#241e1b]">
                {orders.length} Placed
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className="p-3 bg-stone-100 text-[#4a3f35] rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#8c7866] uppercase font-bold block">Active Pieces</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#241e1b]">
                {products.length} in Catalog
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#8c7866] uppercase font-bold block">Pieces Shipped</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#241e1b]">
                {totalItemsSold} Handcrafted
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#e8ded1] mb-6">
          <button
            onClick={() => setActiveTab('launch')}
            className={`py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'launch'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#a0683a]" />
            <span>Launch New Jewel (Website Launch)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#a0683a]" />
            <span>Orders & Delivery Tracker ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <Package className="w-4 h-4 text-[#a0683a]" />
            <span>Live Catalog & Inventory ({products.length})</span>
          </button>
        </div>

        {/* TAB 1: NEW PRODUCT LAUNCH WIZARD */}
        {activeTab === 'launch' && (
          <div className="space-y-6">
            {launchSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center justify-between shadow-sm animate-fadeIn">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>{launchSuccessMsg}</span>
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View on Website</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form Input Columns */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#e8ded1] shadow-sm space-y-5">
                <div>
                  <h3 className="font-serif text-2xl text-[#241e1b]">Launch New Handcrafted Piece</h3>
                  <p className="text-xs text-[#6e5d4e] mt-0.5">
                    Fill out the artisan specifications below to launch this jewel live onto your customer website.
                  </p>
                </div>

                <form onSubmit={handleLaunchProduct} className="space-y-4">
                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Jewel Name <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aurelia Sunburst Medallion"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Artisan Subtitle / Tagline:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hand-cast solar coin in 18k Fairmined vermeil"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                  </div>

                  {/* Category & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Category:
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      >
                        <option value="rings">Rings & Bands</option>
                        <option value="necklaces">Necklaces & Pendants</option>
                        <option value="earrings">Earrings & Drops</option>
                        <option value="bracelets">Cuffs & Bracelets</option>
                        <option value="bridal">Bridal & Bespoke</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Badge Callout:
                      </label>
                      <select
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      >
                        <option value="New Studio Launch">New Studio Launch</option>
                        <option value="Limited Studio Batch">Limited Studio Batch</option>
                        <option value="Artisan Bestseller">Artisan Bestseller</option>
                        <option value="One-of-a-Kind Stone">One-of-a-Kind Stone</option>
                        <option value="Staff Favorite">Staff Favorite</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Initial Batch Stock:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={stockCount}
                        onChange={(e) => setStockCount(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Selling Price ($ USD) <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="number"
                        required
                        min="5"
                        placeholder="195"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || '')}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] font-mono font-bold focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Original Compare Price ($ USD, optional):
                      </label>
                      <input
                        type="number"
                        min="5"
                        placeholder="240"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || '')}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] font-mono focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                  </div>

                  {/* Metallurgy & Gemstone */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Metals & Precious Materials:
                      </label>
                      <input
                        type="text"
                        value={materials}
                        onChange={(e) => setMaterials(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Gemstone (Optional):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Zambian Emerald"
                        value={gemstone}
                        onChange={(e) => setGemstone(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                  </div>

                  {/* Sizing Preset Selector */}
                  <div className="p-3.5 bg-[#f5efe6] rounded-2xl border border-[#e8ded1] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#241e1b]">
                        Available Sizing Options for Customers:
                      </label>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePresetChange('rings')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            selectedSizesPreset === 'rings'
                              ? 'bg-[#241e1b] text-white'
                              : 'bg-white text-[#5c4d3f]'
                          }`}
                        >
                          Ring Sizes
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePresetChange('necklaces')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            selectedSizesPreset === 'necklaces'
                              ? 'bg-[#241e1b] text-white'
                              : 'bg-white text-[#5c4d3f]'
                          }`}
                        >
                          Necklace Drops
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePresetChange('cuffs')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            selectedSizesPreset === 'cuffs'
                              ? 'bg-[#241e1b] text-white'
                              : 'bg-white text-[#5c4d3f]'
                          }`}
                        >
                          Cuff Diameters
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 5, 6, 7, 8, 9, 10 (comma-separated)"
                      value={customSizes}
                      onChange={(e) => setCustomSizes(e.target.value)}
                      className="w-full bg-white border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none"
                    />
                  </div>

                  {/* Image URL & 1-Click Presets */}
                  <div>
                    <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                      Product Photography Image URL:
                    </label>
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none"
                    />

                    {/* Quick photo presets */}
                    <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                      <span className="text-[#8c7866] shrink-0">Quick Presets:</span>
                      {curatedImagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#d8c8b4] hover:border-[#a0683a] text-[#5c4d3f] shrink-0 cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description & Craft Story */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Customer Description:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl p-2.5 text-xs text-[#241e1b] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#241e1b] mb-1">
                        Artisan Workshop Craft Story:
                      </label>
                      <textarea
                        rows={3}
                        value={craftStory}
                        onChange={(e) => setCraftStory(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl p-2.5 text-xs text-[#241e1b] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Launch Action */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-[#e0a96d]" />
                      <span>{isSubmitting ? 'Publishing to Website...' : '🚀 Launch Jewel Live on Website'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview Card */}
              <div className="lg:col-span-4 space-y-4">
                <span className="text-xs uppercase font-bold tracking-wider text-[#8a5d3b] block">
                  Customer Storefront Live Preview
                </span>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#d8c8b4] shadow-md">
                  <div className="relative aspect-square bg-[#f5efe6] overflow-hidden">
                    <img
                      src={imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-[#241e1b] text-white">
                      {badge}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#a0683a]">
                      {category}
                    </span>
                    <h4 className="font-serif text-lg font-medium text-[#241e1b]">
                      {name || 'New Artisan Piece Name'}
                    </h4>
                    <p className="text-xs text-[#6e5d4e] line-clamp-2">
                      {subtitle || 'Hand-hammered gold vermeil and natural stones.'}
                    </p>

                    <div className="pt-2 border-t border-[#f0e8dc] flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-lg font-bold text-[#241e1b]">
                          ${price || '0'}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-[#8c7866] line-through">
                            ${originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        {stockCount} in stock
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#f2ebd9]/70 rounded-2xl border border-[#dfd2be] text-xs text-[#5c4d3f] space-y-1.5">
                  <span className="font-bold text-[#241e1b] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#a0683a]" />
                    <span>Instant Synchronization</span>
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Once launched, this piece will immediately show on the homepage, in the category filters, in search queries, and in the Aura AI Concierge catalog.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: ORDERS & DELIVERY TRACKING */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8ded1]">
              <div>
                <h3 className="font-serif text-2xl text-[#241e1b]">Orders & Delivery Fulfillment</h3>
                <p className="text-xs text-[#6e5d4e] mt-0.5">
                  Update customer delivery stages, verify 3D-secure payments, and generate tracking receipts.
                </p>
              </div>

              <button
                onClick={fetchOrders}
                className="px-3.5 py-2 bg-[#faf8f5] hover:bg-[#ede5d8] border border-[#d8c8b4] rounded-xl text-xs font-semibold text-[#241e1b] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh Orders</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#8c7866]">
                No orders placed yet. Place a test order through the storefront to view here!
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 rounded-2xl border border-[#e8ded1] bg-[#faf8f5] hover:border-[#c5b19b] transition-all space-y-4"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e8ded1]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-[#241e1b]">
                            {order.orderId}
                          </span>
                          <span className="text-[10px] bg-[#241e1b] text-white px-2 py-0.5 rounded font-mono">
                            {order.orderDate}
                          </span>
                        </div>
                        <p className="text-xs text-[#5c4d3f] mt-0.5">
                          Patron: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city}, {order.shippingAddress.state || order.shippingAddress.country})
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-[#6e5d4e] font-semibold">Delivery Stage:</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                          className={`text-xs rounded-xl px-3 py-1.5 font-semibold focus:outline-none border cursor-pointer ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : order.status === 'dispatched'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : order.status === 'handcrafting'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-stone-100 text-[#241e1b] border-stone-300'
                          }`}
                        >
                          <option value="confirmed">1. Confirmed & Paid</option>
                          <option value="handcrafting">2. Bench Forging (In Studio)</option>
                          <option value="dispatched">3. Courier Dispatched</option>
                          <option value="delivered">4. Delivered to Patron</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Details & Items */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Items */}
                      <div className="space-y-1.5 md:col-span-1">
                        <span className="font-bold text-[#241e1b] block">Jewelry Pieces:</span>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img
                              src={item.product.images[0]}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold text-[#241e1b]">{item.product.name}</p>
                              <span className="text-[10px] text-[#8c7866]">
                                Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery & Address */}
                      <div className="space-y-1 text-[#5c4d3f]">
                        <span className="font-bold text-[#241e1b] block">Delivery Address:</span>
                        <p>{order.shippingAddress.street} {order.shippingAddress.apt}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <p className="text-[11px] text-[#8a5d3b]">
                          Method: {order.shippingMethod.name} ({order.shippingMethod.duration})
                        </p>
                        {order.giftMessage && (
                          <p className="text-[10px] bg-amber-50 p-1.5 rounded border border-amber-200 text-amber-900 mt-1 italic">
                            Gift note: "{order.giftMessage}"
                          </p>
                        )}
                      </div>

                      {/* Payment & Financials */}
                      <div className="space-y-1 text-[#5c4d3f] border-t md:border-t-0 md:border-l border-[#e8ded1] md:pl-4">
                        <span className="font-bold text-[#241e1b] block">Payment Summary:</span>
                        <p className="font-medium text-emerald-800 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{order.paymentMethod}</span>
                        </p>
                        <p>Total Paid: <strong className="font-serif text-sm text-[#241e1b]">${order.totals.total.toFixed(2)}</strong></p>
                        <p className="text-[10px] text-[#8c7866]">
                          FedEx Tracking: <strong className="font-mono text-[#241e1b]">{order.trackingNumber}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE CATALOG & INVENTORY MANAGEMENT */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8ded1]">
              <div>
                <h3 className="font-serif text-2xl text-[#241e1b]">Live Store Catalog</h3>
                <p className="text-xs text-[#6e5d4e]">Manage prices, stock status, and product listings.</p>
              </div>
              <button
                onClick={() => setActiveTab('launch')}
                className="px-4 py-2 bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Launch New Piece</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f5efe6] text-[#241e1b] uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Jewel Piece</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Stock Units</th>
                    <th className="py-3 px-3">Badge</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e8dc] text-[#5c4d3f]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-[#241e1b]">{p.name}</p>
                          <span className="text-[10px] text-[#8c7866] line-clamp-1">{p.materials}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px] font-bold text-[#8a5d3b]">
                        {p.category}
                      </td>
                      <td className="py-3 px-3 font-serif font-bold text-[#241e1b]">
                        ${p.price}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {p.stockCount} Available
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {p.badge && (
                          <span className="text-[10px] bg-[#241e1b] text-white px-2 py-0.5 rounded">
                            {p.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            onViewProductInStore(p);
                            onClose();
                          }}
                          className="p-1.5 text-[#5c4d3f] hover:text-[#241e1b] hover:bg-[#f0e8dc] rounded-lg transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete from Catalog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
