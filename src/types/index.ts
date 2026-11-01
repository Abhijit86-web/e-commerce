export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'bridal';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  materials: string;
  finish: string;
  gemstone?: string;
  description: string;
  craftStory: string;
  sizes?: string[]; // e.g. ["5", "6", "7", "8", "9"] or ["16 inch", "18 inch", "20 inch"]
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isArtisanPick?: boolean;
  badge?: string;
  careGuide: string;
  dimensions: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  location: string;
  avatar?: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  fitFeedback?: 'Runs small' | 'True to size' | 'Runs large';
  metalChosen?: string;
  customerPhotos?: string[];
  helpfulCount: number;
}

export interface CartItem {
  product: Product;
  selectedSize?: string;
  selectedMetal?: string;
  engraving?: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  description: string;
  expiresText: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  icon: string;
}

export interface CheckoutDetails {
  contact: {
    email: string;
    phone: string;
    newsletter: boolean;
  };
  shippingAddress: {
    fullName: string;
    street: string;
    apt: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethodId: string;
  giftWrapping: boolean;
  giftMessage: string;
  waxSealStamp: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod' | 'applepay' | 'paypal' | 'klarna';
  cardDetails?: {
    cardNumber: string;
    cardholderName: string;
    expiry: string;
    cvv: string;
  };
  upiDetails?: {
    upiId: string;
    app?: string;
  };
  netbankingBank?: string;
  appliedCoupon: Coupon | null;
}

export interface OrderConfirmation {
  orderId: string;
  orderDate: string;
  status: 'confirmed' | 'handcrafting' | 'dispatched' | 'delivered';
  trackingNumber: string;
  estimatedDeliveryDate: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    giftWrap: number;
    tax: number;
    total: number;
  };
  shippingAddress: CheckoutDetails['shippingAddress'];
  shippingMethod: ShippingMethod;
  giftMessage?: string;
  paymentMethod: string;
}

export interface AdminSession {
  token: string;
  email: string;
  name: string;
  role: 'super_admin' | 'atelier_director';
  loginTime: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  role?: 'customer' | 'admin';
  phone?: string;
  avatar?: string;
  joinedDate: string;
  loginCount?: number;
  lastLogin?: string;
  addresses?: Array<{
    fullName: string;
    street: string;
    apt?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }>;
  vipTier?: 'Atelier Patron' | 'Collector Silver' | 'Haute Joaillerie Gold';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
  actionSuggestion?: {
    type: 'size_guide' | 'view_product' | 'apply_coupon';
    value: string;
    label: string;
  };
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  joinedDate: string;
  vipTier: string;
  loginCount: number;
  lastLogin: string;
  ordersCount: number;
  totalSpent: number; // in INR
  lastOrderDate: string;
  lastOrderId: string | null;
  address: string;
}

export interface PaymentRecord {
  paymentId: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  amountINR: number;
  paymentMethod: string;
  gatewayRef: string;
  status: 'SUCCESS' | 'CAPTURED' | 'PENDING';
  dateStr: string;
  timestamp: string;
}

export interface LoginRecord {
  loginId: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  loginMethod: 'Phone OTP (SMS)' | 'Email & Password' | 'Master Admin Key';
  status: 'SUCCESS';
  dateStr: string;
  timestamp: string;
}

export interface DatabaseOverview {
  totalCustomers: number;
  totalLogins: number;
  totalPayments: number;
  totalRevenueINR: number;
  totalOrders: number;
  storageType: string;
  lastSyncedAt: string;
}

export interface AdminDashboardData {
  grossRevenue: number; // in INR
  totalOrders: number;
  averageOrderValue: number; // in INR
  totalUnitsSold: number;
  totalCustomerLogins: number;
  totalPaymentsCaptured: number;
  ordersByStatus: {
    confirmed: number;
    handcrafting: number;
    dispatched: number;
    delivered: number;
  };
  categoryStats: Record<string, { count: number; revenue: number }>;
  inventorySummary: {
    totalProducts: number;
    totalUnitsInStock: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  topProducts: Array<{
    name: string;
    units: number;
    revenue: number;
    image: string;
  }>;
  recentOrders: OrderConfirmation[];
}


