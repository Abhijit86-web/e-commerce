import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { JEWELRY_PRODUCTS, INITIAL_REVIEWS, AVAILABLE_COUPONS } from './src/data/jewelryData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory store for products, user reviews, and placed orders
let currentProducts = [...JEWELRY_PRODUCTS];
let currentReviews = [...INITIAL_REVIEWS];
let currentOrders: any[] = [
  {
    orderId: 'AUR-829104',
    orderDate: 'Oct 28, 2026',
    status: 'handcrafting',
    trackingNumber: '94001118995642819034',
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
      subtotal: 425,
      discount: 63.75,
      shipping: 0,
      giftWrap: 8,
      tax: 30.46,
      total: 399.71,
    },
    shippingAddress: {
      fullName: 'Genevieve Monet',
      street: '342 Rue Saint-Honoré',
      apt: 'Suite 3A',
      city: 'Montreal',
      state: 'QC',
      zipCode: 'H2Y 1V4',
      country: 'Canada',
    },
    shippingMethod: {
      id: 'ship-gift-deluxe',
      name: 'Bespoke Wax-Sealed Gift Delivery',
      price: 25,
      duration: '2-3 Business Days',
    },
    giftMessage: 'Happy 5th Anniversary, my love! Forged by hand.',
    paymentMethod: 'Apple Pay (Biometric Authorized)',
  },
  {
    orderId: 'AUR-519280',
    orderDate: 'Oct 27, 2026',
    status: 'dispatched',
    trackingNumber: '94001118995691034812',
    estimatedDeliveryDate: 'Wednesday, Nov 1',
    items: [
      {
        product: JEWELRY_PRODUCTS[2],
        selectedSize: '6.5',
        quantity: 1,
      }
    ],
    totals: {
      subtotal: 395,
      discount: 0,
      shipping: 0,
      giftWrap: 0,
      tax: 32.59,
      total: 427.59,
    },
    shippingAddress: {
      fullName: 'Marcus Vance',
      street: '1204 South Congress Ave',
      apt: '',
      city: 'Austin',
      state: 'TX',
      zipCode: '78704',
      country: 'United States',
    },
    shippingMethod: {
      id: 'ship-standard',
      name: 'Artisan Insured Ground',
      price: 0,
      duration: '3-5 Business Days',
    },
    paymentMethod: 'Credit Card (3D Secure Verified)',
  }
];

// Initialize Google GenAI if API key exists
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. Chat endpoint for LLM concierge jewelry advisor
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const catalogSummary = currentProducts.map(p => 
      `- ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Price: $${p.price} | Materials: ${p.materials} | Sizes: ${p.sizes ? p.sizes.join(', ') : 'Standard'} | Highlights: ${p.subtitle}`
    ).join('\n');

    const couponSummary = AVAILABLE_COUPONS.map(c =>
      `- Code: ${c.code} (${c.description})`
    ).join('\n');

    const systemInstruction = `You are Aura, the master jewelry concierge and gemological advisor at AURA Artisanal Fine Jewelry.
You have warm, refined, intimate expertise like a luxury bespoke jeweler who works with handmade pieces.

Store Catalog:
${catalogSummary}

Active Promotional Codes to share when appropriate:
${couponSummary}

Sizing Rules:
- Ring US 5 = 15.7 mm diameter / 49.3 mm circumference
- Ring US 6 = 16.5 mm diameter / 51.9 mm circumference
- Ring US 7 = 17.3 mm diameter / 54.4 mm circumference (most common women's size)
- Ring US 8 = 18.1 mm diameter / 57.0 mm circumference
- Ring US 9 = 18.9 mm diameter / 59.5 mm circumference
- Ring US 10 = 19.8 mm diameter / 62.1 mm circumference
- Necklaces: 14" is collar, 16" is choker, 18" is classic princess (collarbone), 20-22" is matinee.

Guidelines:
1. Always be polite, elegant, warm, and helpful.
2. If the customer asks for a recommendation (e.g. gift for an anniversary, bridal, earrings for sensitive ears, daily ring, pearl lovers), recommend 1 to 3 specific items from the catalog.
3. At the very end of your response, if you recommend specific products, output a metadata line exactly in this format:
RECOMMENDED_PRODUCTS: [comma separated product IDs like "sol-invictus-ring, luna-baroque-pearl-choker"]
4. If the user asks about ring size or finger measurement, guide them gently and offer to help calculate their size.
5. If the user asks about materials, explain that our pieces use Fairmined recycled 18k gold vermeil (2.5 micron thickness) and recycled 925 sterling silver with genuine ethically sourced gems.
6. If the user asks for a discount, graciously share one of the active codes like ARTISAN15 (15% off).
7. Keep responses concise, engaging, and easy to read with tasteful paragraph breaks.`;

    if (genAI) {
      try {
        const contents: any[] = [];
        
        // Add previous conversation turns if provided
        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }

        // Add the current user query
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const rawText = response.text || '';
        
        // Extract RECOMMENDED_PRODUCTS tag if present
        let cleanText = rawText;
        const recommendedIds: string[] = [];
        const match = rawText.match(/RECOMMENDED_PRODUCTS:\s*\[(.*?)\]/);
        if (match && match[1]) {
          const ids = match[1].split(',').map((s: string) => s.trim().replace(/['"]/g, ''));
          recommendedIds.push(...ids.filter(id => currentProducts.some(p => p.id === id)));
          cleanText = rawText.replace(/RECOMMENDED_PRODUCTS:\s*\[.*?\]/, '').trim();
        }

        return res.json({
          reply: cleanText,
          recommendedProductIds: recommendedIds,
        });
      } catch (genAiError) {
        console.error('Gemini generation error, falling back to smart concierge response:', genAiError);
      }
    }

    // Graceful smart fallback when Gemini API key is not configured or offline
    const query = message.toLowerCase();
    let reply = "";
    const recommendedProductIds: string[] = [];

    if (query.includes('size') || query.includes('sizing') || query.includes('fit') || query.includes('measure') || query.includes('finger')) {
      reply = "Finding your exact ring size is effortless! Our most common ring size is US 7 (17.3 mm diameter / 54.4 mm inner circumference). If you are between sizes, we recommend sizing up a half size for wider bands like our Sol Invictus band, and true-to-size for solitaire bands. You can also use our interactive Ring & Necklace Sizing Guide anytime!";
      recommendedProductIds.push('sol-invictus-ring', 'celestial-sapphire-ring');
    } else if (query.includes('necklace') || query.includes('choker') || query.includes('pearl')) {
      reply = "Our necklaces are crafted with versatile adjustable lengths. The Luna Baroque Pearl Talisman features natural Grade-AAA Keshi pearls hand-knotted on silk cord, while the Soleil Ancient Sun Medallion comes with a 2-inch extender to transition from collarbone to deep neckline.";
      recommendedProductIds.push('luna-baroque-pearl-choker', 'soleil-medallion-necklace');
    } else if (query.includes('coupon') || query.includes('discount') || query.includes('promo') || query.includes('code') || query.includes('offer')) {
      reply = "We are delighted to welcome you to our atelier! You can apply coupon code **ARTISAN15** at checkout for 15% off your entire order, or **SPARKLE10** for $10 off orders over $75. Both can be entered in your cart or during checkout.";
    } else if (query.includes('gift') || query.includes('present') || query.includes('anniversary') || query.includes('birthday') || query.includes('recommend')) {
      reply = "For an unforgettable gift, our collectors cherish the Luna Baroque Pearl Talisman (each baroque pearl has a one-of-a-kind organic silhouette) and the Sol Invictus Hammered Band. Every piece arrives in an embossed velvet keepsake box with wax seal and a handwritten artisan card.";
      recommendedProductIds.push('luna-baroque-pearl-choker', 'sol-invictus-ring');
    } else if (query.includes('material') || query.includes('gold') || query.includes('silver') || query.includes('sensitive') || query.includes('waterproof')) {
      reply = "We prioritize ethical sustainability: our gold pieces feature heavy 18k Fairmined Gold Vermeil (2.5 microns thick, 5x thicker than ordinary fashion plating) over recycled 925 sterling silver. All earrings use 14k solid gold or sterling posts, making them 100% hypoallergenic and nickel-free.";
      recommendedProductIds.push('botanical-foliage-earrings', 'aegis-hammered-cuff');
    } else {
      reply = "Welcome to AURA Artisanal Fine Jewelry! I am Aura, your personal jeweler concierge. I can assist you with sizing recommendations, heirloom styling, ring measurements, gift suggestions, or sharing active studio coupon codes like ARTISAN15. How can I delight you today?";
      if (currentProducts.length > 0) {
        recommendedProductIds.push(currentProducts[0].id);
        if (currentProducts[1]) recommendedProductIds.push(currentProducts[1].id);
      }
    }

    return res.json({
      reply,
      recommendedProductIds,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal server error processing chat' });
  }
});

// 2. Coupon validation endpoint
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, cartSubtotal } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Please enter a coupon code' });
  }

  const cleanCode = String(code).trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS.find(c => c.code === cleanCode);

  if (!coupon) {
    return res.status(404).json({
      valid: false,
      message: `Coupon code "${cleanCode}" is invalid or expired. Try "ARTISAN15" for 15% off!`,
    });
  }

  const subtotal = Number(cartSubtotal) || 0;
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return res.status(400).json({
      valid: false,
      message: `Coupon "${cleanCode}" requires a minimum order of $${coupon.minPurchase}. Current subtotal is $${subtotal.toFixed(2)}.`,
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (subtotal * coupon.discountValue) / 100;
  } else {
    discountAmount = Math.min(coupon.discountValue, subtotal);
  }

  return res.json({
    valid: true,
    coupon,
    discountAmount: Math.round(discountAmount * 100) / 100,
    message: `Coupon "${coupon.code}" applied! ${coupon.description}`,
  });
});

// 3. User reviews endpoint (GET and POST)
app.get('/api/reviews', (req: Request, res: Response) => {
  const { productId } = req.query;
  if (productId && typeof productId === 'string') {
    const filtered = currentReviews.filter(r => r.productId === productId);
    return res.json({ reviews: filtered, total: filtered.length });
  }
  return res.json({ reviews: currentReviews, total: currentReviews.length });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { productId, author, location, rating, title, comment, fitFeedback, customerPhotos, metalChosen } = req.body;

  if (!productId || !author || !rating || !title || !comment) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    author: String(author).trim(),
    location: location ? String(location).trim() : 'Verified Patron',
    rating: Math.min(5, Math.max(1, Number(rating))),
    date: 'Just now',
    verified: true,
    title: String(title).trim(),
    comment: String(comment).trim(),
    fitFeedback: fitFeedback || 'True to size',
    metalChosen: metalChosen || 'Handcrafted Selection',
    customerPhotos: Array.isArray(customerPhotos) ? customerPhotos : [],
    helpfulCount: 1,
  };

  currentReviews.unshift(newReview);

  return res.status(201).json({
    success: true,
    review: newReview,
    message: 'Thank you! Your verified artisan review has been published.',
  });
});

// 4. Products Management Endpoints (CRUD for Admin Portal & Storefront)
app.get('/api/products', (_req: Request, res: Response) => {
  return res.json({ products: currentProducts, total: currentProducts.length });
});

app.post('/api/products', (req: Request, res: Response) => {
  const {
    name,
    subtitle,
    category,
    price,
    originalPrice,
    materials,
    finish,
    gemstone,
    description,
    craftStory,
    sizes,
    badge,
    images,
    careGuide,
    dimensions,
    stockCount,
  } = req.body;

  if (!name || !price || !category || !description) {
    return res.status(400).json({ error: 'Name, price, category, and description are required' });
  }

  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newProduct = {
    id: `${slug}-${Date.now().toString().slice(-4)}`,
    name: String(name).trim(),
    subtitle: subtitle ? String(subtitle).trim() : 'Bespoke hand-forged edition',
    category: category || 'rings',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    rating: 5.0,
    reviewCount: 0,
    images: Array.isArray(images) && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80'
    ],
    materials: materials ? String(materials).trim() : '18k Fairmined Gold Vermeil on 925 Recycled Silver',
    finish: finish ? String(finish).trim() : 'Artisan hand-hammered satin finish',
    gemstone: gemstone ? String(gemstone).trim() : undefined,
    description: String(description).trim(),
    craftStory: craftStory ? String(craftStory).trim() : 'Handcrafted in our coastal atelier using slow bench jewelry methods.',
    sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : undefined,
    inStock: true,
    stockCount: stockCount ? Number(stockCount) : 10,
    isNewArrival: true,
    isArtisanPick: true,
    badge: badge ? String(badge).trim() : 'New Atelier Launch',
    careGuide: careGuide ? String(careGuide).trim() : 'Gently buff with artisan micro-suede cloth after wear. Store in velvet pouch.',
    dimensions: dimensions ? String(dimensions).trim() : 'Handcrafted standard dimensions',
  };

  currentProducts.unshift(newProduct);

  return res.status(201).json({
    success: true,
    product: newProduct,
    message: `"${newProduct.name}" launched successfully to the live atelier website!`,
  });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = currentProducts.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  currentProducts[index] = {
    ...currentProducts[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : currentProducts[index].price,
  };

  return res.json({
    success: true,
    product: currentProducts[index],
    message: 'Product updated successfully.',
  });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = currentProducts.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const removed = currentProducts.splice(index, 1)[0];
  return res.json({
    success: true,
    message: `"${removed.name}" removed from catalog.`,
  });
});

// 5. Orders Management Endpoints (Admin Orders + Customer Live Tracking)
app.get('/api/orders', (_req: Request, res: Response) => {
  return res.json({ orders: currentOrders, total: currentOrders.length });
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = currentOrders.find(o => o.orderId === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  return res.json({
    success: true,
    order,
    message: `Order #${id} status updated to ${status}.`,
  });
});

app.get('/api/orders/track/:query', (req: Request, res: Response) => {
  const { query } = req.params;
  const cleanQ = String(query).trim().toLowerCase().replace('#', '');
  
  const found = currentOrders.find(o => 
    o.orderId.toLowerCase().replace('#', '') === cleanQ ||
    o.trackingNumber === cleanQ ||
    (o.shippingAddress?.fullName && o.shippingAddress.fullName.toLowerCase().includes(cleanQ))
  );

  if (!found) {
    return res.status(404).json({
      found: false,
      message: `No active atelier order found matching "${query}". Please check your order ID or tracking code.`,
    });
  }

  return res.json({ found: true, order: found });
});

// 6. Secure checkout process simulation
app.post('/api/checkout/process', (req: Request, res: Response) => {
  const { items, shippingAddress, shippingMethod, paymentMethod, appliedCoupon, giftWrapping, giftMessage } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Checkout cart is empty' });
  }
  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
    return res.status(400).json({ error: 'Complete shipping address is required' });
  }

  // Calculate pricing breakdown securely
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.product.price * item.quantity;
  }

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const shippingCost = shippingMethod?.price ?? (subtotal > 150 ? 0 : 15);
  const giftWrapCost = giftWrapping ? 8 : 0;
  const tax = Math.round((subtotal - discount) * 0.0825 * 100) / 100;
  const total = Math.max(0, subtotal - discount + shippingCost + giftWrapCost + tax);

  // Calculate estimated delivery
  const deliveryDays = shippingMethod?.id === 'ship-express' ? 2 : 4;
  const arrivalDate = new Date();
  arrivalDate.setDate(arrivalDate.getDate() + deliveryDays);
  const formattedArrival = arrivalDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const orderId = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingNumber = `940011189956${Math.floor(10000000 + Math.random() * 90000000)}`;

  const orderConfirmation = {
    orderId,
    orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'confirmed',
    trackingNumber,
    estimatedDeliveryDate: formattedArrival,
    items,
    totals: {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      shipping: shippingCost,
      giftWrap: giftWrapCost,
      tax,
      total: Math.round(total * 100) / 100,
    },
    shippingAddress,
    shippingMethod: shippingMethod || {
      id: 'ship-standard',
      name: 'Artisan Insured Ground',
      price: shippingCost,
      duration: '3-5 Business Days',
    },
    giftMessage: giftWrapping ? giftMessage : undefined,
    paymentMethod: paymentMethod || 'Card (3D Secure Verified)',
  };

  // Register order in store for Admin Portal and Customer Tracking
  currentOrders.unshift(orderConfirmation);

  return res.json({
    success: true,
    order: orderConfirmation,
    message: 'Payment authorized successfully. Your handcrafted pieces have entered the studio queue.',
  });
});

// Mount Vite or static dist
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve static files from dist in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development mode: attach Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Artisan Jewelry Studio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
