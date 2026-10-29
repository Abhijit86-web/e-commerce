import { Product, Review, Coupon, ShippingMethod } from '../types';

export const JEWELRY_PRODUCTS: Product[] = [
  {
    id: 'sol-invictus-ring',
    name: 'Sol Invictus Hammered Band',
    subtitle: 'Hand-forged 18k solid gold finish with organic molten texture',
    category: 'rings',
    price: 185,
    originalPrice: 220,
    rating: 4.9,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=80'
    ],
    materials: '18k Fairmined Gold Vermeil on 925 Recycled Sterling Silver',
    finish: 'Hand-hammered molten satin finish',
    description: 'Forged individually over an anvil in our studio, each Sol Invictus ring bears unique micro-facets that capture daylight like ripples on Mediterranean waters. Designed to wear alone as a subtle statement or stacked.',
    craftStory: 'Heated with an artisan jewelers torch and cold-hammered by master silversmith Elena to impart an enduring organic texture that ages gracefully.',
    sizes: ['5', '6', '7', '8', '9', '10'],
    inStock: true,
    stockCount: 8,
    isBestSeller: true,
    isArtisanPick: true,
    badge: 'Artisan Bestseller',
    careGuide: 'Wipe gently with the included micro-suede artisan cloth after wearing. Store separately in your velvet keepsake pouch away from moisture.',
    dimensions: 'Band width: 3.5mm, Thickness: 1.8mm comfort-fit interior'
  },
  {
    id: 'luna-baroque-pearl-choker',
    name: 'Luna Baroque Pearl Talisman',
    subtitle: 'Organic cultured freshwater baroque pearl on hand-knotted silk cord',
    category: 'necklaces',
    price: 240,
    rating: 5.0,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611591475155-4284fa2c2e7f?auto=format&fit=crop&w=1000&q=80'
    ],
    materials: 'Grade-AAA Keshi Freshwater Baroque Pearl, 14k Solid Gold Toggle Clasp',
    finish: 'Natural iridescent nacre lustre',
    gemstone: 'Natural Baroque Keshi Pearl (no two pearls are identical)',
    description: 'Each Baroque pearl is selected by hand for its dramatic luminous contours and deep pearlescent fire. Suspended from hand-spun Japanese silk cord with an artisanal 14k gold sculpted loop clasp.',
    craftStory: 'Hand-drilled in small batches in our coastal studio and individually double-knotted to protect each pearl from friction.',
    sizes: ['16 inch (Choker)', '18 inch (Classic Collar)', '20 inch (Princess)'],
    inStock: true,
    stockCount: 5,
    isBestSeller: true,
    badge: 'Limited Studio Batch',
    careGuide: 'Pearls love natural skin moisture! Put on after cosmetics, perfumes, and hairspray. Never soak in harsh ultrasonic cleaners.',
    dimensions: 'Pearl length approx 18-22mm; 14k gold toggle diameter 12mm'
  },
  {
    id: 'celestial-sapphire-ring',
    name: 'Celestial Teal Sapphire Solitaire',
    subtitle: 'Ethically mined Montana teal sapphire set in granulated gold claw prongs',
    category: 'rings',
    price: 395,
    originalPrice: 450,
    rating: 4.9,
    reviewCount: 29,
    images: [
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=80'
    ],
    materials: '18k Solid Yellow Gold, Natural Untreated Montana Teal Sapphire',
    finish: 'Brushed Florentine band with polished claw bezels',
    gemstone: '1.1ct Natural Montana Sapphire (Ocean Teal hue with silk inclusions)',
    description: 'A mesmerizing shift from eucalyptus green to midnight ocean teal under changing light. Cut in an antique rose-cut silhouette and set in our signature hand-carved low-profile basket.',
    craftStory: 'Cast via lost-wax technique from hand-carved jeweler’s wax, retaining the subtle impressions of the craftsman’s sculpting knives.',
    sizes: ['5', '6', '6.5', '7', '7.5', '8', '9'],
    inStock: true,
    stockCount: 4,
    isNewArrival: true,
    isArtisanPick: true,
    badge: 'One-of-a-Kind Stone',
    careGuide: 'Warm soapy water with a baby toothbrush restores full brilliance. Avoid heavy manual labor or gym impacts.',
    dimensions: 'Center stone: 6mm diameter; Band taper: 2.2mm to 1.6mm'
  },
  {
    id: 'botanical-foliage-earrings',
    name: 'Ginkgo Botanical Drop Earrings',
    subtitle: 'Delicate hand-chiseled fan leaves with kinetic ear wire movement',
    category: 'earrings',
    price: 135,
    rating: 4.8,
    reviewCount: 31,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
    ],
    materials: 'Heavy 18k Gold Plated Brass & Hypoallergenic 14k Solid Gold Posts',
    finish: 'Satin ribbed leaf veining with mirror polished perimeter',
    description: 'Inspired by ancient ginkgo biloba groves in Kyoto, these lightweight mobile drops sway gently with your movement, catching overhead light with subtle radiance.',
    craftStory: 'Each delicate leaf pattern is manually stamped and file-shaped by artisan hands before undergoing thick gold plating for years of tarnish resistance.',
    inStock: true,
    stockCount: 12,
    isBestSeller: false,
    isNewArrival: true,
    careGuide: 'Avoid contact with chlorine, perfumes, and saltwater. Clean with a dry cotton swab.',
    dimensions: 'Total drop length: 38mm; Leaf width: 22mm; Weight: 3.2g per ear (featherlight)'
  },
  {
    id: 'aegis-hammered-cuff',
    name: 'Aegis Sculpted Silver Cuff',
    subtitle: 'Substantial solid recycled 925 sterling silver wrist torque',
    category: 'bracelets',
    price: 210,
    originalPrice: 245,
    rating: 4.9,
    reviewCount: 24,
    images: [
      'https://images.unsplash.com/photo-1611591475152-47e2467d1656?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=80'
    ],
    materials: '100% Recycled Certified 925 Sterling Silver',
    finish: 'Oxidized recesses with high-buff raised hammer facets',
    description: 'A sculptural wrist cuff engineered for both day-to-day comfort and striking presence. Gently malleable to fit any wrist diameter comfortably without pinching.',
    craftStory: 'Formed from heavy-gauge solid silver ingot rolled through a vintage rolling mill and hand-planished over a steel horn stake.',
    sizes: ['Small (Wrist 5.5" - 6.2")', 'Medium (Wrist 6.3" - 7.0")', 'Large (Wrist 7.1" - 7.8")'],
    inStock: true,
    stockCount: 6,
    isBestSeller: true,
    badge: 'Heirloom Grade',
    careGuide: 'Sterling silver loves being worn daily. If oxidation fades, a light buff with silver polish cloth brings out the deep dimensional contrast.',
    dimensions: 'Cuff width: 14mm tapering to 8mm ends; Metal thickness: 2.5mm'
  },
  {
    id: 'soleil-medallion-necklace',
    name: 'Soleil Ancient Sun Medallion',
    subtitle: 'Cast relief coin pendant featuring solar rays and bezel-set diamond',
    category: 'necklaces',
    price: 195,
    rating: 5.0,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80'
    ],
    materials: '18k Vermeil (2.5 microns) on 925 Silver, Lab-Grown Conflict-Free Diamond',
    finish: 'Ancient antique matte coin patina',
    gemstone: '0.04ct VS1-G Round Brilliant Cut Diamond',
    description: 'Embodying dawn and boundless optimism, the Soleil coin features an off-center recessed sunburst with a sparkling diamond star at its focal point.',
    craftStory: 'Direct replica of an artifact carved in wax by studio founder Maya, preserved in cast gold vermeil with an ultra-thick 2.5 micron micron layer.',
    sizes: ['18 inch + 2 inch extender', '22 inch + 2 inch extender'],
    inStock: true,
    stockCount: 15,
    isBestSeller: true,
    isArtisanPick: true,
    badge: 'Staff Favorite',
    careGuide: 'Store flat to prevent chain tangles. Remove before swimming or sleeping.',
    dimensions: 'Medallion diameter: 19mm; Chain: 1.4mm diamond-cut wheat chain'
  },
  {
    id: 'amor-fati-bridal-band',
    name: 'Amor Fati Ceremonial Curved Band',
    subtitle: 'Chevron nesting wedding band designed to hug solitaire rings seamlessly',
    category: 'bridal',
    price: 310,
    originalPrice: 360,
    rating: 4.9,
    reviewCount: 19,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80'
    ],
    materials: 'Solid 14k Warm Peach Gold, Micro-Pave Moissanite Accents',
    finish: 'Satin silk band with high-polish prong settings',
    gemstone: '7 x 1.5mm D-Color Flawless Moissanite Stones',
    description: 'Specially contoured with a graceful arch that slides underneath or hugs engagement solitaires without leaving an unsightly gap.',
    craftStory: 'Custom fitted using 3D microscope setting ensuring micro-claws hold every gemstone with utmost lifetime security.',
    sizes: ['4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9'],
    inStock: true,
    stockCount: 7,
    isArtisanPick: true,
    badge: 'Bridal Atelier',
    careGuide: 'Includes complimentary annual prong inspection and professional ultrasonic cleaning certificate.',
    dimensions: 'Arch height: 2.4mm clearance; Band width: 1.8mm'
  },
  {
    id: 'kintsugi-emerald-hoops',
    name: 'Kintsugi Raw Emerald Huggies',
    subtitle: 'Golden seam texture inspired by Japanese porcelain repair with raw emerald baguettes',
    category: 'earrings',
    price: 165,
    rating: 4.8,
    reviewCount: 22,
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
    ],
    materials: '18k Gold Plated 925 Silver, Natural Zambian Raw Emeralds',
    finish: 'Organic gold drip fissure texture',
    gemstone: 'Natural Emerald Baguettes (0.40tcw)',
    description: 'Celebrating beauty in imperfection. A crackle of golden lightning embraces an uncut green emerald slice that glows vibrantly against the earlobe.',
    craftStory: 'Individual emerald rough stones are cleaved by hand along their natural crystalline planes, meaning no two earrings share the exact same facet reflections.',
    inStock: true,
    stockCount: 9,
    isNewArrival: true,
    careGuide: 'Emeralds are softer stones (7.5-8 Mohs). Clean with gentle damp cloth; never steam-clean.',
    dimensions: 'Hoop outer diameter: 14mm; Inner diameter: 10mm; Emerald drop: 6x4mm'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'sol-invictus-ring',
    author: 'Clara Vance',
    location: 'Portland, OR',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    title: 'The texture is breathtaking in natural sunlight!',
    comment: 'I was hesitant about ordering jewelry online without feeling the weight, but the moment I slipped the Sol Invictus band on, I was in love. The hammer marks are so organic and tactile. I haven’t taken it off in a month and it has accumulated zero scratches.',
    fitFeedback: 'True to size',
    metalChosen: '18k Gold Vermeil - Size 7',
    customerPhotos: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80'
    ],
    helpfulCount: 47
  },
  {
    id: 'rev-2',
    productId: 'luna-baroque-pearl-choker',
    author: 'Genevieve Monet',
    location: 'Montreal, Canada',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '1 month ago',
    verified: true,
    title: 'Wore this for my rehearsal dinner - endless compliments',
    comment: 'The baroque pearl I received had this stunning, cloud-like iridescent shape with hints of soft pink and champagne when turned. The wax-sealed artisan packaging made unboxing feel like opening an heirloom from 1920.',
    fitFeedback: 'True to size',
    metalChosen: '16 inch Choker / 14k Clasp',
    customerPhotos: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
    ],
    helpfulCount: 32
  },
  {
    id: 'rev-3',
    productId: 'celestial-sapphire-ring',
    author: 'Marcus & Soren K.',
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '3 weeks ago',
    verified: true,
    title: 'A dream engagement ring. Custom sizing was spot on.',
    comment: 'The Aura AI chatbot helped me figure out how to secretly measure my partner’s ring size using the circumference guide. When the Montana teal sapphire arrived, the color depth blew us away. Greenish indoors, electric ocean blue outdoors.',
    fitFeedback: 'True to size',
    metalChosen: '18k Yellow Gold - Size 6.5',
    customerPhotos: [
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=600&q=80'
    ],
    helpfulCount: 28
  },
  {
    id: 'rev-4',
    productId: 'aegis-hammered-cuff',
    author: 'David Lindqvist',
    location: 'Stockholm, Sweden',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Just now',
    verified: true,
    title: 'Heavy, architectural, flawless silver craftsmanship',
    comment: 'Real, solid 925 silver with reassuring heft. You can see the hand-filing along the edges. It shapes easily to the wrist and stays put. Packaging included an artisan certification signed by the smith.',
    fitFeedback: 'True to size',
    metalChosen: 'Medium Silver Cuff',
    customerPhotos: [
      'https://images.unsplash.com/photo-1611591475152-47e2467d1656?auto=format&fit=crop&w=600&q=80'
    ],
    helpfulCount: 15
  },
  {
    id: 'rev-5',
    productId: 'soleil-medallion-necklace',
    author: 'Amara Chen',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Yesterday',
    verified: true,
    title: 'My everyday talisman. The diamond glints subtly.',
    comment: 'I pair this with a high crew-neck sweater or a silk slip dress. The 2-inch extender allows you to adjust the drop depending on your neckline. Top tier customer care and quick insured delivery.',
    fitFeedback: 'True to size',
    metalChosen: '18" + 2" Vermeil',
    customerPhotos: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=600&q=80'
    ],
    helpfulCount: 19
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'ARTISAN15',
    discountType: 'percentage',
    discountValue: 15,
    description: '15% off your entire handcrafted order',
    expiresText: 'Limited Seasonal Offer'
  },
  {
    code: 'SPARKLE10',
    discountType: 'fixed',
    discountValue: 10,
    minPurchase: 75,
    description: '$10 off orders over $75',
    expiresText: 'Welcome gift'
  },
  {
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 120,
    description: '20% off for first-time studio collectors (min. $120)',
    expiresText: 'New collector privilege'
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 15, // offsets shipping cost
    description: 'Free expedited courier delivery worldwide',
    expiresText: 'Exclusive perks'
  }
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'ship-standard',
    name: 'Artisan Insured Ground',
    price: 0,
    duration: '3-5 Business Days',
    description: 'Tracked, insured carbon-neutral packaging in recyclable cotton pouches',
    icon: 'Truck'
  },
  {
    id: 'ship-express',
    name: 'Atelier Priority Courier',
    price: 15,
    duration: '1-2 Business Days',
    description: 'Guaranteed signature-on-delivery via FedEx Priority, tamper-evident security seal',
    icon: 'Zap'
  },
  {
    id: 'ship-gift-deluxe',
    name: 'Bespoke Wax-Sealed Gift Delivery',
    price: 25,
    duration: '2-3 Business Days',
    description: 'Hand-written calligraphy card, dried botanical sprig, embossed velvet keepsake box & wax seal',
    icon: 'Gift'
  }
];

export const RING_SIZES_CHART = [
  { us: '4', diameterMm: '14.9 mm', circMm: '46.8 mm', uk: 'H' },
  { us: '5', diameterMm: '15.7 mm', circMm: '49.3 mm', uk: 'J 1/2' },
  { us: '6', diameterMm: '16.5 mm', circMm: '51.9 mm', uk: 'L 1/2' },
  { us: '7', diameterMm: '17.3 mm', circMm: '54.4 mm', uk: 'N 1/2' },
  { us: '8', diameterMm: '18.1 mm', circMm: '57.0 mm', uk: 'P 1/2' },
  { us: '9', diameterMm: '18.9 mm', circMm: '59.5 mm', uk: 'R 1/2' },
  { us: '10', diameterMm: '19.8 mm', circMm: '62.1 mm', uk: 'T 1/2' }
];

export const NECKLACE_LENGTHS_CHART = [
  { length: '14"', name: 'Collar', desc: 'Rests tightly around the base of the throat. Ideal for open necklines and off-shoulder tops.' },
  { length: '16"', name: 'Choker', desc: 'Rests snugly against base of neck. Perfect for high necklines, crew necks, and button-downs.' },
  { length: '18"', name: 'Princess', desc: 'The most popular classic length. Falls delicately over the collarbone. Fits almost every neckline.' },
  { length: '20"-24"', name: 'Matinee', desc: 'Falls between collarbone and sternum. Splendid for statement medallions, layering, and plunging necklines.' }
];
