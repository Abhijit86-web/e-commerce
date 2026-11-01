import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JEWELRY_PRODUCTS, INITIAL_REVIEWS } from './jewelryData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'studio_database.json');

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'admin';
  joinedDate: string;
  loginCount: number;
  lastLogin: string;
  vipTier: 'Atelier Patron' | 'Collector Silver' | 'Haute Joaillerie Gold';
  totalSpendINR: number;
  ordersCount: number;
  addresses: Array<{
    fullName: string;
    street: string;
    apt?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }>;
}

export interface LoginLog {
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

export interface PaymentLog {
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

export interface StudioDatabase {
  customers: CustomerRecord[];
  logins: LoginLog[];
  payments: PaymentLog[];
  orders: any[];
  products: any[];
}

// Initial realistic dataset with Indian patrons and historical records
const INITIAL_DATABASE: StudioDatabase = {
  customers: [
    {
      id: 'user-clara',
      name: 'Clara Vance',
      email: 'clara.vance@gmail.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 98765 43210',
      joinedDate: 'Oct 2026',
      loginCount: 8,
      lastLogin: 'Nov 1, 2026, 11:30 AM',
      vipTier: 'Atelier Patron',
      totalSpendINR: 33998,
      ordersCount: 2,
      addresses: [
        {
          fullName: 'Clara Vance',
          street: '42 Lotus Boulevard, Indiranagar',
          apt: 'Apartment 4B',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India',
          isDefault: true,
        }
      ]
    },
    {
      id: 'cust-aarav',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 98201 12345',
      joinedDate: 'Oct 2026',
      loginCount: 5,
      lastLogin: 'Oct 31, 2026, 06:15 PM',
      vipTier: 'Collector Silver',
      totalSpendINR: 22999,
      ordersCount: 1,
      addresses: [
        {
          fullName: 'Aarav Sharma',
          street: '18 Marine Drive, Nariman Point',
          apt: 'Tower 2, Flat 12A',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400021',
          country: 'India',
          isDefault: true,
        }
      ]
    },
    {
      id: 'cust-priya',
      name: 'Priya Patel',
      email: 'priya.patel@gmail.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 97112 88990',
      joinedDate: 'Oct 2026',
      loginCount: 4,
      lastLogin: 'Oct 30, 2026, 02:45 PM',
      vipTier: 'Atelier Patron',
      totalSpendINR: 11499,
      ordersCount: 1,
      addresses: [
        {
          fullName: 'Priya Patel',
          street: '7B Green Park Main',
          apt: '',
          city: 'New Delhi',
          state: 'Delhi',
          zipCode: '110016',
          country: 'India',
          isDefault: true,
        }
      ]
    },
    {
      id: 'admin-atelier',
      name: 'Atelier Director (Admin)',
      email: 'admin@aurajewelry.com',
      password: 'admin',
      role: 'admin',
      phone: '+91 98000 11111',
      joinedDate: 'Jan 2026',
      loginCount: 15,
      lastLogin: 'Today, 09:00 AM',
      vipTier: 'Haute Joaillerie Gold',
      totalSpendINR: 0,
      ordersCount: 0,
      addresses: []
    },
    {
      id: 'admin-maity',
      name: 'Abhijit Maity (Admin)',
      email: 'maityabhijit769@gmail.com',
      password: 'admin',
      role: 'admin',
      phone: '+91 99999 77777',
      joinedDate: 'Jan 2026',
      loginCount: 19,
      lastLogin: 'Just now',
      vipTier: 'Haute Joaillerie Gold',
      totalSpendINR: 0,
      ordersCount: 0,
      addresses: []
    }
  ],
  logins: [
    {
      loginId: 'LOG-994821',
      customerId: 'admin-maity',
      customerName: 'Abhijit Maity (Admin)',
      phone: '+91 99999 77777',
      email: 'maityabhijit769@gmail.com',
      loginMethod: 'Master Admin Key',
      status: 'SUCCESS',
      dateStr: 'Nov 1, 2026, 09:01 AM',
      timestamp: new Date().toISOString()
    },
    {
      loginId: 'LOG-883192',
      customerId: 'user-clara',
      customerName: 'Clara Vance',
      phone: '+91 98765 43210',
      email: 'clara.vance@gmail.com',
      loginMethod: 'Phone OTP (SMS)',
      status: 'SUCCESS',
      dateStr: 'Nov 1, 2026, 11:30 AM',
      timestamp: new Date().toISOString()
    },
    {
      loginId: 'LOG-772910',
      customerId: 'cust-aarav',
      customerName: 'Aarav Sharma',
      phone: '+91 98201 12345',
      email: 'aarav.sharma@gmail.com',
      loginMethod: 'Phone OTP (SMS)',
      status: 'SUCCESS',
      dateStr: 'Oct 31, 2026, 06:15 PM',
      timestamp: '2026-10-31T12:45:00.000Z'
    },
    {
      loginId: 'LOG-661840',
      customerId: 'cust-priya',
      customerName: 'Priya Patel',
      phone: '+91 97112 88990',
      email: 'priya.patel@gmail.com',
      loginMethod: 'Email & Password',
      status: 'SUCCESS',
      dateStr: 'Oct 30, 2026, 02:45 PM',
      timestamp: '2026-10-30T09:15:00.000Z'
    }
  ],
  payments: [
    {
      paymentId: 'PAY-INR-829104',
      orderId: 'AUR-829104',
      customerName: 'Genevieve Monet',
      customerPhone: '+91 98765 43210',
      customerEmail: 'clara.vance@gmail.com',
      amountINR: 33998,
      paymentMethod: 'UPI (GPay / PhonePe - genevieve@okaxis)',
      gatewayRef: 'UPI/20261028/8291043190',
      status: 'CAPTURED',
      dateStr: 'Oct 28, 2026, 03:20 PM',
      timestamp: '2026-10-28T09:50:00.000Z'
    },
    {
      paymentId: 'PAY-INR-519280',
      orderId: 'AUR-519280',
      customerName: 'Marcus Vance',
      customerPhone: '+91 98201 12345',
      customerEmail: 'marcus.vance@gmail.com',
      amountINR: 32999,
      paymentMethod: 'Credit Card (HDFC RuPay 3D-Secure)',
      gatewayRef: 'RAZORPAY_INR_519280491',
      status: 'CAPTURED',
      dateStr: 'Oct 27, 2026, 11:15 AM',
      timestamp: '2026-10-27T05:45:00.000Z'
    },
    {
      paymentId: 'PAY-INR-382910',
      orderId: 'AUR-382910',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98201 12345',
      customerEmail: 'aarav.sharma@gmail.com',
      amountINR: 22999,
      paymentMethod: 'NetBanking (State Bank of India)',
      gatewayRef: 'SBI_NB_20261025_99382',
      status: 'CAPTURED',
      dateStr: 'Oct 25, 2026, 04:30 PM',
      timestamp: '2026-10-25T11:00:00.000Z'
    },
    {
      paymentId: 'PAY-INR-194028',
      orderId: 'AUR-194028',
      customerName: 'Priya Patel',
      customerPhone: '+91 97112 88990',
      customerEmail: 'priya.patel@gmail.com',
      amountINR: 11499,
      paymentMethod: 'UPI (Paytm - priya@paytm)',
      gatewayRef: 'PAYTM_UPI_20261024_194028',
      status: 'CAPTURED',
      dateStr: 'Oct 24, 2026, 01:10 PM',
      timestamp: '2026-10-24T07:40:00.000Z'
    }
  ],
  orders: [
    {
      orderId: 'AUR-829104',
      orderDate: 'Oct 28, 2026',
      status: 'handcrafting',
      trackingNumber: 'BLUEDART-EXP-995642819034',
      estimatedDeliveryDate: 'Friday, Nov 3',
      items: [
        {
          product: JEWELRY_PRODUCTS[0],
          selectedSize: '7',
          quantity: 1,
        },
        {
          product: JEWELRY_PRODUCTS[1],
          selectedSize: '16 inch (Choker)',
          quantity: 1,
        }
      ],
      totals: {
        subtotal: 33998,
        discount: 5099.7,
        shipping: 0,
        giftWrap: 799,
        tax: 890.95,
        total: 30588.25,
      },
      shippingAddress: {
        fullName: 'Genevieve Monet',
        street: '42 Lotus Boulevard, Indiranagar',
        apt: 'Suite 3A',
        city: 'Bengaluru',
        state: 'KA',
        zipCode: '560038',
        country: 'India',
      },
      shippingMethod: {
        id: 'ship-gift-deluxe',
        name: 'Bespoke Wax-Sealed Keepsake Delivery',
        price: 799,
        duration: '2-3 Business Days',
      },
      giftMessage: 'Happy 5th Anniversary, my love! Forged by hand.',
      paymentMethod: 'UPI (GPay / PhonePe - genevieve@okaxis)',
    },
    {
      orderId: 'AUR-519280',
      orderDate: 'Oct 27, 2026',
      status: 'dispatched',
      trackingNumber: 'FEDEX-IND-995691034812',
      estimatedDeliveryDate: 'Wednesday, Nov 1',
      items: [
        {
          product: JEWELRY_PRODUCTS[2],
          selectedSize: '6.5',
          quantity: 1,
        }
      ],
      totals: {
        subtotal: 32999,
        discount: 0,
        shipping: 0,
        giftWrap: 0,
        tax: 989.97,
        total: 33988.97,
      },
      shippingAddress: {
        fullName: 'Marcus Vance',
        street: '18 Marine Drive, Nariman Point',
        apt: '',
        city: 'Mumbai',
        state: 'MH',
        zipCode: '400021',
        country: 'India',
      },
      shippingMethod: {
        id: 'ship-standard',
        name: 'Artisan Insured Ground (India)',
        price: 0,
        duration: '3-5 Business Days',
      },
      paymentMethod: 'Credit Card (HDFC RuPay 3D-Secure)',
    }
  ],
  products: [...JEWELRY_PRODUCTS]
};

// Singleton in-memory state
let dbInstance: StudioDatabase | null = null;

export function getDatabase(): StudioDatabase {
  if (dbInstance) return dbInstance;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbInstance = JSON.parse(raw);
      // Ensure arrays exist
      if (!dbInstance!.customers) dbInstance!.customers = INITIAL_DATABASE.customers;
      if (!dbInstance!.logins) dbInstance!.logins = INITIAL_DATABASE.logins;
      if (!dbInstance!.payments) dbInstance!.payments = INITIAL_DATABASE.payments;
      if (!dbInstance!.orders) dbInstance!.orders = INITIAL_DATABASE.orders;
      if (!dbInstance!.products || dbInstance!.products.length === 0) dbInstance!.products = [...JEWELRY_PRODUCTS];
    } else {
      dbInstance = JSON.parse(JSON.stringify(INITIAL_DATABASE));
      fs.writeFileSync(DB_FILE, JSON.stringify(dbInstance, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error loading studio database, using seed data:', err);
    dbInstance = JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }

  return dbInstance!;
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbInstance, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting database to disk:', err);
  }
}

export function recordCustomerLogin(params: {
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  loginMethod: 'Phone OTP (SMS)' | 'Email & Password' | 'Master Admin Key';
}): LoginLog {
  const db = getDatabase();
  const customer = db.customers.find(c => c.id === params.customerId);
  const nowStr = new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (customer) {
    customer.loginCount = (customer.loginCount || 0) + 1;
    customer.lastLogin = nowStr;
  }

  const log: LoginLog = {
    loginId: `LOG-${Math.floor(100000 + Math.random() * 900000)}`,
    customerId: params.customerId,
    customerName: params.customerName,
    phone: params.phone,
    email: params.email,
    loginMethod: params.loginMethod,
    status: 'SUCCESS',
    dateStr: nowStr,
    timestamp: new Date().toISOString(),
  };

  db.logins.unshift(log);
  saveDatabase();
  return log;
}

export function recordPayment(params: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  amountINR: number;
  paymentMethod: string;
  gatewayRef?: string;
}): PaymentLog {
  const db = getDatabase();
  const nowStr = new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const payment: PaymentLog = {
    paymentId: `PAY-INR-${Math.floor(100000 + Math.random() * 900000)}`,
    orderId: params.orderId,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    customerEmail: params.customerEmail,
    amountINR: Math.round(params.amountINR * 100) / 100,
    paymentMethod: params.paymentMethod,
    gatewayRef: params.gatewayRef || `RAZORPAY_INR_${Date.now().toString().slice(-8)}`,
    status: 'CAPTURED',
    dateStr: nowStr,
    timestamp: new Date().toISOString(),
  };

  db.payments.unshift(payment);

  // Update customer spend in database if matched
  const cust = db.customers.find(
    c => (c.phone && params.customerPhone && c.phone.replace(/\D/g, '') === params.customerPhone.replace(/\D/g, '')) ||
         (c.email && params.customerEmail && c.email.toLowerCase() === params.customerEmail.toLowerCase())
  );
  if (cust) {
    cust.totalSpendINR = (cust.totalSpendINR || 0) + params.amountINR;
    cust.ordersCount = (cust.ordersCount || 0) + 1;
  }

  saveDatabase();
  return payment;
}
