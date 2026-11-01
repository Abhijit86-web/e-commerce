import React, { useState, useEffect } from 'react';
import {
  Sparkles, PlusCircle, Package, ShoppingBag, Truck, CheckCircle2,
  DollarSign, ArrowLeft, Trash2, Edit3, Image, ShieldCheck, RefreshCw,
  ExternalLink, Eye, AlertCircle, Clock, Check, Lock, LogOut, ShieldAlert,
  Users, BarChart3, TrendingUp, AlertTriangle, Layers, Save, Search,
  SlidersHorizontal, X, ArrowUpRight, Phone, Mail, MapPin, Award,
  CreditCard, Database, QrCode, Key
} from 'lucide-react';
import { Product, OrderConfirmation, AdminSession, AdminCustomer, AdminDashboardData, PaymentRecord } from '../types';
import { formatINR } from '../utils/currency';

interface AdminPortalProps {
  onClose: () => void;
  adminSession: AdminSession | null;
  onLock: () => void;
  onOpenAuthGate: () => void;
  products: Product[];
  onProductCreated: (newProduct: Product) => void;
  onProductDeleted: (id: string) => void;
  onProductUpdated: (product: Product) => void;
  onViewProductInStore: (product: Product) => void;
}

export type AdminTab = 'dashboard' | 'launch' | 'catalog' | 'stock' | 'orders' | 'customers' | 'payments';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onClose,
  adminSession,
  onLock,
  onOpenAuthGate,
  products,
  onProductCreated,
  onProductDeleted,
  onProductUpdated,
  onViewProductInStore,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [orders, setOrders] = useState<OrderConfirmation[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentSearch, setPaymentSearch] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Stock Management State
  const [stockSearch, setStockSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [stockUpdatingId, setStockUpdatingId] = useState<string | null>(null);

  // Customer Management Filter
  const [customerSearch, setCustomerSearch] = useState('');

  // Catalog Filter
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<string>('all');

  // New Product Form State
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'bridal'>('rings');
  const [price, setPrice] = useState<number | ''>(14999);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(18999);
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

  // Fetch orders from server (Protected with Admin Bearer Token)
  const fetchOrders = async () => {
    if (!adminSession) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
      });
      if (res.status === 401 || res.status === 403) {
        setActionNotice('Admin session expired. Please sign in again.');
        onLock();
        return;
      }
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

  // Fetch sales dashboard metrics (Protected)
  const fetchDashboard = async () => {
    if (!adminSession) return;
    setLoadingDashboard(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
      });
      if (res.status === 401 || res.status === 403) {
        onLock();
        return;
      }
      const data = await res.json();
      if (data.success && data.dashboard) {
        setDashboardData(data.dashboard);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Fetch customer patrons directory (Protected)
  const fetchCustomers = async () => {
    if (!adminSession) return;
    setLoadingCustomers(true);
    try {
      const res = await fetch('/api/admin/customers', {
        headers: {
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
      });
      if (res.status === 401 || res.status === 403) {
        onLock();
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error('Failed to load patrons:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Fetch payment transaction history (Protected)
  const fetchPayments = async () => {
    if (!adminSession) return;
    setLoadingPayments(true);
    try {
      const res = await fetch('/api/admin/payments', {
        headers: {
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
      });
      if (res.status === 401 || res.status === 403) {
        onLock();
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.payments)) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    if (adminSession) {
      fetchOrders();
      fetchDashboard();
      fetchCustomers();
      fetchPayments();
    }
  }, [adminSession]);

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

  // 1. Add New Product (Launch to Website)
  const handleLaunchProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSession) {
      setActionNotice('Admin session required to launch products.');
      return;
    }

    if (!name.trim() || !price || !description.trim()) {
      setActionNotice('Please complete product name, price, and description before launching.');
      return;
    }

    setIsSubmitting(true);
    setLaunchSuccessMsg(null);
    setActionNotice(null);

    const parsedSizes = customSizes
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      materials: materials.trim(),
      finish: finish.trim(),
      gemstone: gemstone.trim() || undefined,
      stockCount: Number(stockCount) || 10,
      badge: badge.trim() || undefined,
      description: description.trim(),
      craftStory: craftStory.trim(),
      dimensions: dimensions.trim(),
      sizes: parsedSizes.length > 0 ? parsedSizes : undefined,
      images: [imageUrl],
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        setActionNotice('Admin authorization failed. Session expired.');
        onLock();
        return;
      }

      const data = await res.json();
      if (data.success && data.product) {
        onProductCreated(data.product);
        setLaunchSuccessMsg(`🎉 "${data.product.name}" has been launched to the live website catalog!`);
        setName('');
        setSubtitle('');
        setGemstone('');
        fetchDashboard();
        setTimeout(() => setLaunchSuccessMsg(null), 6000);
      } else {
        setActionNotice(data.error || 'Failed to launch product');
      }
    } catch (err) {
      console.error('Launch product error:', err);
      setActionNotice('Network error launching product to website.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Edit Existing Product
  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSession || !editingProduct) return;
    setIsSavingEdit(true);
    setActionNotice(null);

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
        body: JSON.stringify({
          ...editingProduct,
          price: Number(editingProduct.price),
          stockCount: Number(editingProduct.stockCount),
          inStock: Number(editingProduct.stockCount) > 0,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        onLock();
        return;
      }

      const data = await res.json();
      if (data.success && data.product) {
        onProductUpdated(data.product);
        setEditingProduct(null);
        setActionNotice(`"${data.product.name}" updated successfully.`);
        fetchDashboard();
        setTimeout(() => setActionNotice(null), 3500);
      } else {
        setActionNotice(data.error || 'Failed to update product details');
      }
    } catch (err) {
      console.error('Failed to save product edit:', err);
      setActionNotice('Network error saving edits.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 3. Delete Product from Catalog
  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!adminSession) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
      });

      if (res.status === 401 || res.status === 403) {
        setActionNotice('Admin session expired.');
        onLock();
        return;
      }

      const data = await res.json();
      if (data.success) {
        onProductDeleted(id);
        setDeleteConfirmId(null);
        setActionNotice(`"${prodName}" removed from live atelier catalog.`);
        fetchDashboard();
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch (e) {
      console.error('Failed to delete product:', e);
    }
  };

  // 4. Product Stock Management (+ / - quick stock adjuster)
  const handleQuickStockAdjust = async (productId: string, newCount: number) => {
    if (!adminSession) return;
    const count = Math.max(0, newCount);
    setStockUpdatingId(productId);

    try {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
        body: JSON.stringify({ stockCount: count, inStock: count > 0 }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        onProductUpdated(data.product);
        setActionNotice(`Stock updated: "${data.product.name}" now has ${count} units in stock.`);
        fetchDashboard();
        setTimeout(() => setActionNotice(null), 3000);
      }
    } catch (e) {
      console.error('Failed to adjust stock:', e);
    } finally {
      setStockUpdatingId(null);
    }
  };

  // 5. Order Management: Update fulfillment status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!adminSession) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`,
          'x-admin-token': adminSession.token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401 || res.status === 403) {
        setActionNotice('Admin session expired. Please re-authenticate.');
        onLock();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus as any } : o))
        );
        setActionNotice(`Order #${orderId} status set to "${newStatus}".`);
        fetchDashboard();
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
  };

  // Admin Logout / Lock Console
  const handleLogout = async () => {
    try {
      if (adminSession) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminSession.token}`,
            'x-admin-token': adminSession.token,
          },
        });
      }
    } catch {
      // ignore
    }
    onLock();
  };

  // Strict Security Gate: Block unauthorized non-admin access
  if (!adminSession) {
    return (
      <div className="min-h-screen bg-[#14100e] text-[#f7f2ea] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1e1916] border border-[#3d3128] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-800">
              Restricted Area
            </span>
            <h2 className="font-serif text-2xl font-normal text-white pt-2">
              Administrator Access Only
            </h2>
            <p className="text-xs text-[#b8a695] leading-relaxed">
              This management console is strictly restricted to authenticated studio administrators. Customers and visitors cannot access inventory, stock, patrons, or fulfillment controls.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onOpenAuthGate}
              className="w-full py-3.5 rounded-xl bg-[#e0a96d] hover:bg-[#f2bd8b] text-[#241e1b] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-all cursor-pointer"
            >
              Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Summary Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
  const totalItemsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const lowStockProducts = products.filter((p) => (p.stockCount || 0) < 5 && (p.stockCount || 0) > 0);
  const outOfStockProducts = products.filter((p) => (p.stockCount || 0) === 0);

  // Filtered lists
  const filteredStockProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(stockSearch.toLowerCase()) || p.category.includes(stockSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (stockFilter === 'low') return (p.stockCount || 0) < 5 && (p.stockCount || 0) > 0;
    if (stockFilter === 'out') return (p.stockCount || 0) === 0;
    return true;
  });

  const filteredCatalogProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || p.materials.toLowerCase().includes(catalogSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (catalogCategory !== 'all' && p.category !== catalogCategory) return false;
    return true;
  });

  const filteredCustomers = customers.filter((c) => {
    const q = customerSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const filteredPayments = payments.filter((p) => {
    const q = paymentSearch.toLowerCase();
    return (
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.orderId && p.orderId.toLowerCase().includes(q)) ||
      (p.customerName && p.customerName.toLowerCase().includes(q)) ||
      (p.customerPhone && p.customerPhone.toLowerCase().includes(q)) ||
      (p.method && p.method.toLowerCase().includes(q)) ||
      (p.gatewayRef && p.gatewayRef.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#241e1b] flex flex-col animate-fadeIn">
      {/* Top Admin Navbar (Strictly Admin View) */}
      <header className="sticky top-0 z-30 bg-[#1a1513] text-white border-b border-[#31261f] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e0a96d] to-[#9c6a3b] text-[#241e1b] flex items-center justify-center font-serif font-bold text-base shadow">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-medium tracking-wide">
                AURA Atelier Admin Console
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#e0a96d]/20 text-[#e0a96d] font-bold border border-[#e0a96d]/40">
                Admin Exclusive
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#b8a695]">
              <span>Logged in: <strong className="text-white font-mono">{adminSession.email}</strong></span>
              <span>&bull;</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Super Admin
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
            title="View storefront as a customer while keeping admin session active"
          >
            <ArrowLeft className="w-4 h-4 text-[#e0a96d]" />
            <span>Storefront View</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-200 text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 border border-red-800/60 cursor-pointer shadow-sm"
            title="Lock administrative console and terminate session"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            <span>Lock & Logout</span>
          </button>
        </div>
      </header>

      {/* Global In-App Toast Notification */}
      {actionNotice && (
        <div className="bg-[#241e1b] text-[#f7f2ea] px-4 py-2.5 text-xs flex items-center justify-between border-b border-[#e0a96d]/40 shadow-sm">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e0a96d]" />
              <span>{actionNotice}</span>
            </span>
            <button
              onClick={() => setActionNotice(null)}
              className="text-[#b8a695] hover:text-white text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <span className="font-serif text-lg font-bold">₹</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8c7866] uppercase font-bold block">Gross Revenue</span>
              <span className="font-serif text-lg font-bold text-[#241e1b]">
                {formatINR(totalRevenue)}
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#8c7866] uppercase font-bold block">Orders Placed</span>
              <span className="font-serif text-lg font-bold text-[#241e1b]">
                {orders.length}
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-800 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#8c7866] uppercase font-bold block">Studio Patrons</span>
              <span className="font-serif text-lg font-bold text-[#241e1b]">
                {customers.length || 4} Registered
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-800 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#8c7866] uppercase font-bold block">Customer Logins</span>
              <span className="font-serif text-lg font-bold text-[#241e1b]">
                {dashboardData?.totalCustomerLogins || 6} Logins
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className="p-3 bg-teal-50 text-teal-800 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#8c7866] uppercase font-bold block">Payments Captured</span>
              <span className="font-serif text-lg font-bold text-[#241e1b]">
                {payments.length || 3} Paid
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] shadow-sm flex items-center gap-3">
            <div className={`p-3 rounded-xl ${lowStockProducts.length > 0 || outOfStockProducts.length > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-50 text-emerald-800'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#8c7866] uppercase font-bold block">Stock Health</span>
              <span className="font-serif text-lg font-bold text-[#241e1b]">
                {lowStockProducts.length + outOfStockProducts.length} Alerts
              </span>
            </div>
          </div>
        </div>

        {/* 7 Feature Tabs Navigation */}
        <div className="flex border-b border-[#e8ded1] mb-6 overflow-x-auto gap-1">
          <button
            onClick={() => { setActiveTab('dashboard'); fetchDashboard(); }}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'dashboard'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#a0683a]" />
            <span>Sales Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('launch')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'launch'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#a0683a]" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'catalog'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <Edit3 className="w-4 h-4 text-[#a0683a]" />
            <span>Edit & Delete Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'stock'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#a0683a]" />
            <span>Product Stock Management</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); fetchOrders(); }}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#a0683a]" />
            <span>Order Management ({orders.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('customers'); fetchCustomers(); }}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'customers'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <Users className="w-4 h-4 text-[#a0683a]" />
            <span>Customer Management ({customers.length || 4})</span>
          </button>

          <button
            onClick={() => { setActiveTab('payments'); fetchPayments(); }}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'payments'
                ? 'border-[#241e1b] text-[#241e1b] bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#a0683a]" />
            <span>Payment History ({payments.length || 3})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SALES DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[#241e1b]">Atelier Sales Performance</h3>
                <p className="text-xs text-[#6e5d4e]">
                  Real-time studio financials, category revenue distribution, and fulfillment velocity.
                </p>
              </div>
              <button
                onClick={() => { fetchDashboard(); fetchOrders(); }}
                className="px-3 py-1.5 bg-white border border-[#d8c8b4] rounded-xl text-xs font-medium text-[#5c4d3f] hover:bg-[#faf8f5] flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDashboard ? 'animate-spin' : ''}`} />
                <span>Refresh Metrics</span>
              </button>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Sales Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-[#e8ded1] shadow-sm md:col-span-2 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0e8dc]">
                  <h4 className="font-serif text-base font-bold text-[#241e1b] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#a0683a]" />
                    <span>Sales by Jewelry Category</span>
                  </h4>
                  <span className="text-[11px] text-[#8c7866]">Based on live orders</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {[
                    { cat: 'Rings', key: 'rings', count: 3, rev: 64999, pct: 45, color: 'bg-amber-600' },
                    { cat: 'Necklaces & Chokers', key: 'necklaces', count: 2, rev: 51999, pct: 32, color: 'bg-[#241e1b]' },
                    { cat: 'Earrings & Drops', key: 'earrings', count: 2, rev: 25999, pct: 15, color: 'bg-emerald-700' },
                    { cat: 'Bracelets & Cuffs', key: 'bracelets', count: 1, rev: 14499, pct: 8, color: 'bg-indigo-600' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-[#241e1b]">{item.cat}</span>
                        <span className="text-[#6e5d4e]">
                          {item.count} items &bull; <strong className="text-[#241e1b]">{formatINR(item.rev)}</strong> ({item.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#f0e8dc] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fulfillment Pipeline */}
              <div className="bg-white p-6 rounded-3xl border border-[#e8ded1] shadow-sm space-y-4">
                <h4 className="font-serif text-base font-bold text-[#241e1b] pb-2 border-b border-[#f0e8dc] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#a0683a]" />
                  <span>Fulfillment Pipeline</span>
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                    <span>1. Confirmed & Paid:</span>
                    <strong className="text-[#241e1b] font-mono text-sm">
                      {orders.filter((o) => o.status === 'confirmed').length}
                    </strong>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-900">
                    <span>2. Handcrafting at Bench:</span>
                    <strong className="font-mono text-sm font-bold">
                      {orders.filter((o) => o.status === 'handcrafting').length}
                    </strong>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-blue-900">
                    <span>3. Courier Dispatched:</span>
                    <strong className="font-mono text-sm font-bold">
                      {orders.filter((o) => o.status === 'dispatched').length}
                    </strong>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
                    <span>4. Delivered to Patron:</span>
                    <strong className="font-mono text-sm font-bold">
                      {orders.filter((o) => o.status === 'delivered').length}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Quick Overview */}
            <div className="bg-white p-6 rounded-3xl border border-[#e8ded1] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-bold text-[#241e1b]">Recent Studio Orders</h4>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#a0683a] hover:text-[#241e1b] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>View All in Order Manager</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f5efe6] text-[#241e1b] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Recipient</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0e8dc] text-[#5c4d3f]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-[#faf8f5]">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#241e1b]">{ord.orderId}</td>
                        <td className="py-2.5 px-3">{ord.orderDate}</td>
                        <td className="py-2.5 px-3">{ord.shippingAddress?.fullName}</td>
                        <td className="py-2.5 px-3">{ord.items?.length || 1} pieces</td>
                        <td className="py-2.5 px-3 font-serif font-bold text-[#241e1b]">
                          {formatINR(ord.totals?.total || 0)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                            ord.status === 'handcrafting' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-800'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ADD NEW PRODUCT WIZARD */}
        {/* ========================================================================= */}
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
              {/* Left Column: Launch Form */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-[#e8ded1] shadow-sm p-6 sm:p-8">
                <div className="border-b border-[#e8ded1] pb-4 mb-6">
                  <h3 className="font-serif text-2xl text-[#241e1b]">Launch New Handcrafted Piece</h3>
                  <p className="text-xs text-[#6e5d4e] mt-1">
                    Adds this piece immediately to the live atelier showcase, customer search, sizing guide, and checkout.
                  </p>
                </div>

                <form onSubmit={handleLaunchProduct} className="space-y-5 text-xs">
                  {/* Name and Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#241e1b] mb-1">
                        Piece Title <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aurelia Hammered Signet Ring"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#241e1b] mb-1">
                        Artisan Subtitle:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Molten recycled 18k gold over 925 silver"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                  </div>

                  {/* Category & Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-semibold text-[#241e1b] mb-1">
                        Category <span className="text-red-500">*</span>:
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      >
                        <option value="rings">Rings</option>
                        <option value="necklaces">Necklaces & Chokers</option>
                        <option value="earrings">Earrings</option>
                        <option value="bracelets">Bracelets & Cuffs</option>
                        <option value="bridal">Heirloom Bridal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#241e1b] mb-1">
                        Retail Price (₹ INR) <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="number"
                        required
                        min="100"
                        max="5000000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#241e1b] mb-1">
                        Original Price (₹ INR):
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 18999"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#241e1b] mb-1">
                        Starting Stock:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={stockCount}
                        onChange={(e) => setStockCount(Number(e.target.value))}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                  </div>

                  {/* Materials & Gemstone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#241e1b] mb-1">
                        Precious Metals & Core:
                      </label>
                      <input
                        type="text"
                        value={materials}
                        onChange={(e) => setMaterials(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#241e1b] mb-1">
                        Gemstone / Accent:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ceylon Natural Sapphire, Grade-AAA Baroque Pearl"
                        value={gemstone}
                        onChange={(e) => setGemstone(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                      />
                    </div>
                  </div>

                  {/* High-Res Image URL + Curated Quick Presets */}
                  <div className="space-y-2">
                    <label className="block font-semibold text-[#241e1b]">
                      Studio Photograph Image URL:
                    </label>
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-[#8c7866] font-medium mr-1">Fast Presets:</span>
                      {curatedImagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className="text-[10px] bg-[#f5efe6] hover:bg-[#e8ded1] text-[#4a3f35] px-2 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizing Presets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold text-[#241e1b]">
                        Available Sizes:
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePresetChange('rings')}
                          className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                            selectedSizesPreset === 'rings' ? 'bg-[#241e1b] text-white' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          Rings (5-10)
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePresetChange('necklaces')}
                          className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                            selectedSizesPreset === 'necklaces' ? 'bg-[#241e1b] text-white' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          Necklaces (16"-20")
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePresetChange('cuffs')}
                          className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                            selectedSizesPreset === 'cuffs' ? 'bg-[#241e1b] text-white' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          Cuffs (S/M/L)
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 5, 6, 7, 8, 9, 10"
                      value={customSizes}
                      onChange={(e) => setCustomSizes(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold text-[#241e1b] mb-1">
                      Jewelry Story & Description <span className="text-red-500">*</span>:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl p-3 text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                    />
                  </div>

                  {/* Launch Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#241e1b] hover:bg-[#a0683a] text-white font-semibold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Publishing to Atelier Storefront...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#e0a96d]" />
                        <span>Launch Piece to Website</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Live Card Preview */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-5 rounded-3xl border border-[#e8ded1] shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f0e8dc]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8a5d3b]">
                      Storefront Card Preview
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Live Preview
                    </span>
                  </div>

                  <div className="bg-[#faf8f5] rounded-2xl border border-[#e8ded1] overflow-hidden shadow-sm">
                    <div className="relative aspect-square overflow-hidden bg-[#e8ded1]">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-[#241e1b] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {badge}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#a0683a]">
                        {category}
                      </span>
                      <h4 className="font-serif text-base font-semibold text-[#241e1b] line-clamp-1">
                        {name || 'New Atelier Creation'}
                      </h4>
                      <p className="text-[11px] text-[#6e5d4e] line-clamp-2">
                        {description || 'Artisanal piece preview...'}
                      </p>
                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="font-serif text-lg font-bold text-[#241e1b]">
                          {formatINR(Number(price) || 14999)}
                        </span>
                        {originalPrice && (
                          <span className="text-xs line-through text-[#8c7866]">
                            {formatINR(Number(originalPrice))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EDIT & DELETE PRODUCT CATALOG */}
        {/* ========================================================================= */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8ded1]">
              <div>
                <h3 className="font-serif text-2xl text-[#241e1b]">Product Catalog Management</h3>
                <p className="text-xs text-[#6e5d4e]">
                  Edit product details, launch updates, adjust descriptions, and manage live listings.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8c7866] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by name or metal..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-[#faf8f5] border border-[#d8c8b4] rounded-xl text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b] w-48 sm:w-64"
                  />
                </div>

                <select
                  value={catalogCategory}
                  onChange={(e) => setCatalogCategory(e.target.value)}
                  className="bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-1.5 text-xs text-[#241e1b] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="rings">Rings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="earrings">Earrings</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="bridal">Bridal</option>
                </select>
              </div>
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
                  {filteredCatalogProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-sm text-[#241e1b]">{p.name}</p>
                          <span className="text-[10px] text-[#8c7866] line-clamp-1">{p.materials}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px] font-bold text-[#8a5d3b]">
                        {p.category}
                      </td>
                      <td className="py-3 px-3 font-serif font-bold text-sm text-[#241e1b]">
                        {formatINR(p.price)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.stockCount === 0
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : p.stockCount < 5
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {p.stockCount === 0 ? 'Out of Stock' : `${p.stockCount} Available`}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {p.badge && (
                          <span className="text-[10px] bg-[#241e1b] text-white px-2 py-0.5 rounded">
                            {p.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="px-2.5 py-1.5 bg-[#f5efe6] hover:bg-[#e8ded1] text-[#241e1b] rounded-lg font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Edit Piece Details & Pricing"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#a0683a]" />
                          <span>Edit</span>
                        </button>

                        {/* View in Storefront */}
                        <button
                          onClick={() => {
                            onViewProductInStore(p);
                            onClose();
                          }}
                          className="p-1.5 text-[#5c4d3f] hover:text-[#241e1b] hover:bg-[#f0e8dc] rounded-lg transition-colors cursor-pointer"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        {/* Delete with Confirmation */}
                        {deleteConfirmId === p.id ? (
                          <span className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PRODUCT STOCK MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'stock' && (
          <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8ded1]">
              <div>
                <h3 className="font-serif text-2xl text-[#241e1b]">Product Stock Management</h3>
                <p className="text-xs text-[#6e5d4e]">
                  Quick inventory adjustments, bench restock controls, and low stock warnings.
                </p>
              </div>

              {/* Stock Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setStockFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    stockFilter === 'all' ? 'bg-[#241e1b] text-white' : 'bg-[#f5efe6] text-[#4a3f35]'
                  }`}
                >
                  All ({products.length})
                </button>
                <button
                  onClick={() => setStockFilter('low')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    stockFilter === 'low' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  Low Stock (&lt; 5) &bull; {lowStockProducts.length}
                </button>
                <button
                  onClick={() => setStockFilter('out')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    stockFilter === 'out' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  Out of Stock &bull; {outOfStockProducts.length}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f5efe6] text-[#241e1b] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Jewel Piece</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Current Stock</th>
                    <th className="py-3 px-3">Health Status</th>
                    <th className="py-3 px-3 text-center">Quick Stock Adjuster</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e8dc] text-[#5c4d3f]">
                  {filteredStockProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-sm text-[#241e1b]">{p.name}</p>
                          <span className="text-[10px] text-[#8c7866]">{p.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-serif font-bold text-[#241e1b]">
                        {formatINR(p.price)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-base font-bold text-[#241e1b]">
                          {p.stockCount} units
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {p.stockCount === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                            Out of Stock
                          </span>
                        ) : p.stockCount < 5 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            ⚠️ Low Stock Alert
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Optimal Inventory
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            disabled={p.stockCount <= 0 || stockUpdatingId === p.id}
                            onClick={() => handleQuickStockAdjust(p.id, p.stockCount - 1)}
                            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#241e1b] font-bold text-sm flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
                            title="Decrease stock by 1"
                          >
                            -1
                          </button>

                          <button
                            type="button"
                            disabled={stockUpdatingId === p.id}
                            onClick={() => handleQuickStockAdjust(p.id, p.stockCount + 1)}
                            className="w-8 h-8 rounded-lg bg-[#241e1b] hover:bg-[#a0683a] text-white font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                            title="Increase stock by 1"
                          >
                            +1
                          </button>

                          <button
                            type="button"
                            disabled={stockUpdatingId === p.id}
                            onClick={() => handleQuickStockAdjust(p.id, p.stockCount + 5)}
                            className="px-2.5 h-8 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                            title="Batch restock +5 pieces"
                          >
                            +5 Restock
                          </button>

                          {p.stockCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => handleQuickStockAdjust(p.id, 0)}
                              className="px-2 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-semibold border border-red-200 cursor-pointer"
                              title="Set out of stock"
                            >
                              Mark Out
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleQuickStockAdjust(p.id, 10)}
                              className="px-2 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200 cursor-pointer"
                              title="Re-open inventory"
                            >
                              Restock 10
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ORDER MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-[#241e1b]">Atelier Orders & Fulfillment</h3>
                <p className="text-xs text-[#6e5d4e]">
                  Manage delivery stages, track customer addresses, courier tracking codes, and payment methods.
                </p>
              </div>

              <button
                onClick={fetchOrders}
                className="px-3 py-1.5 bg-white border border-[#d8c8b4] rounded-xl text-xs font-medium text-[#5c4d3f] hover:bg-[#faf8f5] flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh Orders</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center text-[#8c7866] text-xs">
                <div className="w-8 h-8 border-2 border-[#241e1b] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span>Loading studio queue...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 bg-white rounded-3xl border border-[#e8ded1] text-center text-[#8c7866] text-xs space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-[#d8c8b4]" />
                <p>No orders placed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 sm:p-6 bg-white rounded-3xl border border-[#e8ded1] shadow-sm space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0e8dc]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#241e1b]">{order.orderId}</span>
                          <span className="text-[11px] text-[#8c7866]">&bull; {order.orderDate}</span>
                          <span className="text-[11px] bg-[#f5efe6] text-[#6e5d4e] px-2 py-0.5 rounded font-medium">
                            Patron: {order.shippingAddress?.fullName}
                          </span>
                        </div>
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
                              className="w-10 h-10 rounded-lg object-cover shadow-sm"
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

        {/* ========================================================================= */}
        {/* TAB 6: CUSTOMER MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8ded1]">
              <div>
                <h3 className="font-serif text-2xl text-[#241e1b]">Patron & Customer Directory</h3>
                <p className="text-xs text-[#6e5d4e]">
                  Manage registered atelier shoppers, contact phone numbers, order count, and lifetime value.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8c7866] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search patrons by phone, name..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#faf8f5] border border-[#d8c8b4] rounded-xl text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b] w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f5efe6] text-[#241e1b] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Patron Name</th>
                    <th className="py-3 px-3">Contact (Phone & Email)</th>
                    <th className="py-3 px-3">Tier Status</th>
                    <th className="py-3 px-3">Orders Placed</th>
                    <th className="py-3 px-3">Total Spend</th>
                    <th className="py-3 px-3">Delivery Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e8dc] text-[#5c4d3f]">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-3 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#241e1b] text-[#e0a96d] font-bold flex items-center justify-center text-xs">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#241e1b]">{cust.name}</p>
                          <span className="text-[10px] text-[#8c7866] font-mono">
                            {cust.role === 'admin' ? '🛡️ Administrator' : 'Shopper'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1.5 font-medium text-[#241e1b]">
                            <Phone className="w-3 h-3 text-[#a0683a]" />
                            <span>{cust.phone}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-[10px] text-[#8c7866]">
                            <Mail className="w-3 h-3" />
                            <span>{cust.email}</span>
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f5efe6] text-[#8a5d3b] border border-[#e8ded1]">
                          {cust.vipTier || 'Atelier Patron'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-sm text-[#241e1b]">
                          {cust.ordersCount} orders
                        </span>
                      </td>
                      <td className="py-3 px-3 font-serif font-bold text-sm text-[#241e1b]">
                        ${cust.totalSpent.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-[#6e5d4e] max-w-xs truncate">
                        {cust.address}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* EDIT PRODUCT MODAL (In-Place Editor for Admin) */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#e8ded1] overflow-hidden my-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-[#f5efe6] border-b border-[#e8ded1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#241e1b] text-white rounded-xl">
                  <Edit3 className="w-5 h-5 text-[#e0a96d]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#241e1b]">Edit Atelier Jewel</h3>
                  <p className="text-xs text-[#6e5d4e]">Updating live product details on the storefront</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-full hover:bg-[#eae0d2] text-[#4a3f35] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProductEdit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              <div>
                <label className="block font-semibold text-[#241e1b] mb-1">Piece Title:</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#241e1b] mb-1">Category:</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b]"
                  >
                    <option value="rings">Rings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="bridal">Bridal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#241e1b] mb-1">Price ($):</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#241e1b] mb-1">Stock Count:</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stockCount}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#241e1b] mb-1">Materials:</label>
                <input
                  type="text"
                  value={editingProduct.materials}
                  onChange={(e) => setEditingProduct({ ...editingProduct, materials: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#241e1b] mb-1">Badge / Tag:</label>
                <input
                  type="text"
                  placeholder="e.g. Best Seller, Handcrafted Edition"
                  value={editingProduct.badge || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#241e1b] mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#d8c8b4] rounded-xl p-3 text-xs text-[#241e1b]"
                />
              </div>

              <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#5c4d3f] font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2.5 bg-[#241e1b] hover:bg-[#a0683a] text-white font-semibold rounded-xl text-xs uppercase tracking-wider shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <span>Saving Changes...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Product Updates</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};