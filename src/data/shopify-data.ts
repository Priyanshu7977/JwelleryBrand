import { Product, Collection, CustomerReview, InstagramMedia, HamperBoxOption } from '../types/shopify';

export const BRAND_INFO = {
  name: 'CELestia',
  storeName: 'Celestia Amor',
  tagline: 'redefined for all.',
  subtagline: 'Handpicked charms, aesthetic jewelry, and little pieces of magic designed to elevate your everyday style.',
  instagram: '@celestiaamor.in',
  instagramUrl: 'https://www.instagram.com/celestiaamor.in/',
  whatsapp: '+91 7718825792',
  whatsappUrl: 'https://wa.me/917718825792?text=Hello%20Celestia,%20I%20would%20like%20to%20inquire%20about%20your%20curated%20pieces.',
  phone: '+91 7718825792',
  email: 'celestiaaaccessories@gmail.com',
  dm2buyStoreUrl: 'https://celestia.dm2buy.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio',
  stats: {
    orders: '1000+',
    delivery: 'Same-day Mumbai',
    shipping: 'Pan-India Delivery',
    rating: '4.95 / 5.0'
  },
  freeShippingThreshold: 999,
  currency: '₹',
};

export const FOUNDER_INFO = {
  name: 'Founder & Lead Atelier Curator',
  title: 'Creative Direction & Founder',
  subtitle: 'From The Atelier',
  location: 'Mumbai Atelier',
  quote: '"Every parcel we pack is a tiny fragment of our heart."',
  storyParagraph1: 'We believe you should not need an excuse to wear beautiful fine jewellery or gift your loved ones a box filled with flowers, bangles, and retro Polaroids.',
  storyParagraph2: 'From our bustling Mumbai studio to over 1,000 parcels delivered across India, each order is inspected under coastal daylight, hand-finished with our 100% anti-tarnish promise, and sealed with warm metallic wax.',
  image: '/assets/founder/founder-portrait.jpg',
  fallbackImage: '/assets/founder/founder-01.jpg',
  altText: 'Portrait of Celestia founder wearing statement silver earrings in warm daylight'
};

export const CELESTIA_COLLECTIONS: Collection[] = [
  {
    id: 'col-bangles',
    handle: 'bangles',
    title: 'Artisanal Bangles',
    subtitle: 'Modern Heritage & Stacks',
    editorialNarrative: 'Fluid curves, white pearl lustre, and dual-tone hand-finished bangle sets designed for daily stacking.',
    accentQuote: 'The rhythmic poetry of modern gold and enamel.',
    featuredImage: '/assets/products/pink-blue-bangles.jpg',
    productCount: 18,
    tags: ['Handcrafted', 'Bangle Sets', 'Dual-Tone']
  },
  {
    id: 'col-jewellery',
    handle: 'jewellery',
    title: 'Fine Jewellery & Sets',
    subtitle: 'Sculptural Adornments',
    editorialNarrative: 'Anti-tarnish golden rings, statement jhumkas, and radiant emerald pendant sets crafted for special evenings.',
    accentQuote: 'Adornment as a personal signature.',
    featuredImage: '/assets/products/red-emerald-set.jpg',
    productCount: 24,
    tags: ['Anti-Tarnish', 'Emerald Sets', 'Jhumkas']
  },
  {
    id: 'col-gifting',
    handle: 'custom-gifting',
    title: 'Bespoke Hampers & Gifting',
    subtitle: 'Curated Expressions of Love',
    editorialNarrative: 'Signature luxury hampers including Desi Barbie, Purple Tulip, and festive celebration boxes tied with satin ribbons.',
    accentQuote: 'Unboxing is where the magic begins.',
    featuredImage: '/assets/products/desi-barbie-hamper.jpg',
    productCount: 12,
    tags: ['Custom Ribbon', 'Bespoke Packaging', 'Same-Day Mumbai']
  },
  {
    id: 'col-personalised',
    handle: 'polaroids-personalised',
    title: 'Polaroids & Personalised',
    subtitle: 'Moments Captured in Gold',
    editorialNarrative: 'Custom printed 20-pack retro glossy polaroids, clear memory keychains, and keepsake moments preserved forever.',
    accentQuote: 'Little things that become your moments.',
    featuredImage: '/assets/products/polaroids-20.jpg',
    productCount: 10,
    tags: ['Custom Polaroids', 'Photo Keychains', 'Memories']
  },
  {
    id: 'col-accessories',
    handle: 'accessories',
    title: 'Fashion Charms & Crochet',
    subtitle: 'The Statement Details',
    editorialNarrative: 'Hand-stitched ice cream crochet charms, gold honeybee keychains, phone straps, and pop-culture tributes.',
    accentQuote: 'Subtle magnetism in every detail.',
    featuredImage: '/assets/products/honeybee-keychain.jpg',
    productCount: 16,
    tags: ['Crochet', 'Enamel Charms', 'Keychains']
  }
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'prod-real-bangles-01',
    dm2buyId: '67ab2d6f859bf5a7a7bbbc86',
    handle: 'pink-and-blue-bangle-set-of-2',
    url: 'https://celestia.dm2buy.com/product/pink-and-blue-bangle-set-of-2',
    title: 'pink and blue bangle set of 2',
    category: 'bangles',
    price: 500,
    compareAtPrice: 650,
    description: 'Handcrafted dual-tone pink and blue artisanal bangle pair. Lightweight, smooth comfort fit, and designed for versatile stacking.',
    editorialNote: 'A tactile dialogue between vibrant artisanal enamel and fluid gold contours.',
    material: 'Handcrafted Metal & Enamel Glass Bangle Set',
    dimensions: 'Size 2.4 / 2.6 / 2.8 available',
    craftsmanship: 'Hand-assembled in our Mumbai atelier with protective lustre seal.',
    isBestseller: true,
    isNewArrival: false,
    availableStock: 1,
    sameDayMumbaiAvailable: true,
    images: {
      hero: '/assets/products/pink-blue-bangles.jpg',
      detail: '/assets/products/white-bangles.jpg',
      onModel: '/assets/products/pink-blue-bangles.jpg',
      alt: 'Celestia pink and blue bangle set of 2'
    },
    tags: ['Bangles', 'Handcrafted', 'Set of 2', 'Bestseller']
  },
  {
    id: 'prod-real-hamper-01',
    dm2buyId: '67a84e27859bf5a7a7bb3794',
    handle: 'desi-barbie-hamper',
    url: 'https://celestia.dm2buy.com/product/Desi-Barbie-Hamper',
    title: 'Desi Barbie Hamper',
    category: 'gifting',
    price: 999,
    compareAtPrice: 1299,
    description: 'Curated luxury gift hamper box featuring signature pink accessories, keepsake goodies, and personalized packaging with satin ribbon.',
    editorialNote: 'The ultimate celebratory curation for birthdays and unprovoked gestures of love.',
    material: 'Luxury Keepsake Rigid Box with Hand-Tied Double Satin Ribbon',
    dimensions: '22cm x 16cm x 8cm keepsake box',
    craftsmanship: 'Hand-curated in Mumbai with custom wax seal & personal calligraphy.',
    isBestseller: true,
    isNewArrival: true,
    availableStock: 1,
    sameDayMumbaiAvailable: true,
    images: {
      hero: '/assets/products/desi-barbie-hamper.jpg',
      detail: '/assets/products/purple-tulip-hamper.jpg',
      alt: 'Celestia Desi Barbie Hamper gift box with satin ribbon'
    },
    tags: ['Gifting', 'Hamper', 'Luxury Box', 'Same-Day Mumbai']
  },
  {
    id: 'prod-real-bangles-02',
    dm2buyId: '67ab2d1d859bf5a7a7bbbc6b',
    handle: 'white-bangles',
    url: 'https://celestia.dm2buy.com/product/white-bangles',
    title: 'white bangles',
    category: 'bangles',
    price: 300,
    compareAtPrice: 400,
    description: 'Classic pearl-finish white bangles. Timeless everyday accessory that effortlessly complements western and ethnic silhouettes.',
    editorialNote: 'Clean monochrome poetry for the wrist.',
    material: 'Pearl Lustre Finish on Durable Core',
    dimensions: 'Universal comfort fit',
    craftsmanship: 'Smooth rounded inner bezel for zero-snag everyday comfort.',
    isBestseller: true,
    isNewArrival: false,
    availableStock: 1,
    sameDayMumbaiAvailable: true,
    images: {
      hero: '/assets/products/white-bangles.jpg',
      detail: '/assets/products/kashmiri-bangles.jpg',
      alt: 'Celestia white bangles with pearl lustre finish'
    },
    tags: ['Bangles', 'Monochrome', 'Daily Wear']
  },
  {
    id: 'prod-real-polaroid-01',
    dm2buyId: '67a9a130859bf5a7a7bb7d53',
    handle: 'polaroids-20-your-pics-',
    url: 'https://celestia.dm2buy.com/product/polaroids-20-your-pics-',
    title: 'polaroids 20(your pics)',
    category: 'personalised',
    price: 100,
    compareAtPrice: 150,
    description: 'Set of 20 high-grade custom printed retro polaroid prints of your own photos. Comes enclosed in a protective Celestia envelope with wax seal.',
    editorialNote: 'Twenty tangible fragments of your favourite memories.',
    material: 'Glossy Emulsion Photo Cardstock, Acid-Free Envelope',
    dimensions: '8.6cm x 5.4cm per polaroid',
    craftsmanship: 'Printed within 2 hours of order in Mumbai atelier.',
    isBestseller: true,
    isNewArrival: false,
    availableStock: 1,
    sameDayMumbaiAvailable: true,
    images: {
      hero: '/assets/products/polaroids-20.jpg',
      detail: '/assets/products/clear-photo-keychain.jpg',
      alt: 'Celestia custom polaroids 20 pack set'
    },
    tags: ['Personalised', 'Polaroids', 'Custom Prints', 'Under 100']
  },
  {
    id: 'prod-real-jewel-01',
    dm2buyId: '67a84589859bf5a7a7bb35c4',
    handle: 'exclusive-red-emerald-set',
    url: 'https://celestia.dm2buy.com/product/Exclusive-Red-Emerald-set',
    title: 'Exclusive Red Emerald set',
    category: 'jewellery',
    price: 150,
    compareAtPrice: 250,
    description: 'Stunning rich red simulated emerald pendant with matching stud earrings. Radiates timeless royalty and festive grace.',
    editorialNote: 'A regal flash of crimson brilliance for celebration nights.',
    material: 'Gold-Tone Plated Alloy, Faceted Red Emerald Crystal',
    dimensions: '42cm chain + 1.8cm pendant',
    craftsmanship: 'Precision micro-prong claw setting with mirror shine finish.',
    isBestseller: false,
    isNewArrival: true,
    availableStock: 1,
    sameDayMumbaiAvailable: true,
    images: {
      hero: '/assets/products/red-emerald-set.jpg',
      detail: '/assets/products/anti-tarnish-rings.jpg',
      alt: 'Celestia Exclusive Red Emerald pendant and earring set'
    },
    tags: ['Jewellery', 'Pendant Set', 'Festive', 'Red Emerald']
  },
  {
    id: 'prod-real-jewel-02',
    dm2buyId: '67a9cf06859bf5a7a7bb88f3',
    handle: 'golden-anti-tarnish-rings',
    url: 'https://celestia.dm2buy.com/product/Golden-anti-tarnish-rings',
    title: 'Golden anti tarnish rings',
    category: 'jewellery',
    price: 35,
    compareAtPrice: 60,
    description: 'Minimalist stackable gold ring with anti-tarnish protective coating. Everyday luxury designed for effortless mixing.',
    editorialNote: 'Subtle shine that never dims under water or sun.',
    material: 'Anti-Tarnish Coated Alloy',
    dimensions: 'Adjustable band fit',
    craftsmanship: 'Dual-dip anti-tarnish protective sealant.',
    isBestseller: true,
    isNewArrival: false,
    availableStock: 1,
    sameDayMumbaiAvailable: true,
    images: {
      hero: '/assets/products/anti-tarnish-rings.jpg',
      alt: 'Celestia Golden anti tarnish rings stack'
    },
    tags: ['Jewellery', 'Rings', 'Anti-Tarnish', 'Under 50']
  },
  {
    id: 'prod-real-acc-01',
    dm2buyId: '67aa9f86859bf5a7a7bbb6b3',
    handle: 'cute-honeybee-keychain',
    url: 'https://celestia.dm2buy.com/product/cute-honeybee-keychain',
    title: 'cute honeybee keychain',
    category: 'accessories',
    price: 99,
    compareAtPrice: 140,
    description: 'Whimsical enamel honeybee charm with polished gold-tone hardware. Adds playful luxury to bags and keys.',
    editorialNote: 'A tiny burst of joyful gold for your everyday essentials.',
    material: 'Enamel on Polished Gold Alloy',
    dimensions: '4.5cm total length',
    craftsmanship: 'Hand-filled enamel with anti-scratch lacquer coat.',
    isBestseller: false,
    isNewArrival: true,
    availableStock: 2,
    sameDayMumbaiAvailable: true,
    images: {
      hero: '/assets/products/honeybee-keychain.jpg',
      alt: 'Celestia cute honeybee keychain charm'
    },
    tags: ['Accessories', 'Keychain', 'Honeybee', 'Under 100']
  },
  {
    id: 'prod-real-bangles-03',
    dm2buyId: '67aa1d62859bf5a7a7bb94da',
    handle: 'kashmiri-bangles',
    url: 'https://celestia.dm2buy.com/product/Kashmiri-Bangles',
    title: 'Kashmiri Bangles',
    category: 'bangles',
    price: 400,
    compareAtPrice: 550,
    description: 'Intricately detailed traditional Kashmiri style bangles with warm gold undertones and rich artisan filigree.',
    editorialNote: 'Heritage craft reimagined for today’s moments.',
    material: 'Artisanal Brass with Kashmiri Inlay Detailing',
    dimensions: 'Size 2.6 standard fit',
    craftsmanship: 'Hand-crafted filigree detailing from traditional artisans.',
    isBestseller: false,
    isNewArrival: true,
    availableStock: 1,
    sameDayMumbaiAvailable: true,
    images: {
      hero: '/assets/products/kashmiri-bangles.jpg',
      alt: 'Celestia Kashmiri Bangles with intricate artisan detailing'
    },
    tags: ['Bangles', 'Kashmiri', 'Heritage']
  }
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    author: 'Aanya M.',
    location: 'Bandra West, Mumbai',
    productName: 'pink and blue bangle set of 2',
    rating: 5,
    comment: 'The unboxing experience was pure art! Ordered at 11 AM and had it at my doorstep in Bandra by 4 PM. The bangles shine so beautifully and have zero weight.',
    date: '2 days ago',
    verified: true,
    tag: 'Same-Day Mumbai Delivery'
  },
  {
    id: 'rev-02',
    author: 'Tanvi R.',
    location: 'Indiranagar, Bengaluru',
    productName: 'Golden anti tarnish rings',
    rating: 5,
    comment: 'I have worn the anti-tarnish rings in the shower and gym for over 3 weeks now — absolutely ZERO tarnishing or color fading. Best everyday rings!',
    date: '1 week ago',
    verified: true,
    tag: 'Anti-Tarnish Tested'
  },
  {
    id: 'rev-03',
    author: 'Mehek Rajput',
    location: 'South Delhi',
    productName: 'Desi Barbie Hamper & Polaroids',
    rating: 5,
    comment: 'Ordered through their Instagram @celestiaamor.in first and now obsessed. The 20 custom polaroids inside the Barbie hamper made my bestie cry happy tears!',
    date: '2 weeks ago',
    verified: true,
    tag: 'Instagram Verified'
  },
  {
    id: 'rev-04',
    author: 'Sanjana K.',
    location: 'Juhu, Mumbai',
    productName: 'Exclusive Red Emerald set',
    rating: 5,
    comment: 'The red emerald pendant looks so regal in candlelight. Premium packaging with wax seals and satin ribbons. Truly redefined gifting.',
    date: '3 weeks ago',
    verified: true,
    tag: 'Bespoke Gifting'
  }
];

export const INSTAGRAM_POSTS: InstagramMedia[] = [
  {
    id: 'ig-1',
    caption: 'Dual tone love: Pink & Blue bangle set. Restocked in limited batches ✨ #CelestiaAmor #RedefinedForAll',
    likes: '1,420',
    comments: '88',
    type: 'image',
    mediaUrl: '/assets/products/pink-blue-bangles.jpg',
    tags: ['#Bangles', '#MumbaiAesthetic', '#Handcrafted']
  },
  {
    id: 'ig-2',
    caption: 'Same-day Mumbai hampers packed with love & custom memories 🎀 DM to curate yours before 2 PM!',
    likes: '2,180',
    comments: '143',
    type: 'reel',
    mediaUrl: '/assets/products/desi-barbie-hamper.jpg',
    tags: ['#GiftingHamper', '#CustomPolaroids', '#SameDayMumbai']
  },
  {
    id: 'ig-3',
    caption: 'Classic white bangles + Golden anti tarnish rings. Daily wear luxury ✨',
    likes: '964',
    comments: '52',
    type: 'image',
    mediaUrl: '/assets/products/white-bangles.jpg',
    tags: ['#BanglesStack', '#AntiTarnish']
  },
  {
    id: 'ig-4',
    caption: 'Regal reflections: The Exclusive Red Emerald set in warm studio light ✨',
    likes: '1,890',
    comments: '97',
    type: 'image',
    mediaUrl: '/assets/products/red-emerald-set.jpg',
    tags: ['#RedEmerald', '#FestiveSet', '#CelestiaStudio']
  },
  {
    id: 'ig-5',
    caption: 'Moments frozen in time. 20 custom retro polaroids printed in our Mumbai studio 🎞️✨',
    likes: '3,120',
    comments: '210',
    type: 'reel',
    mediaUrl: '/assets/products/polaroids-20.jpg',
    tags: ['#PolaroidMemories', '#CustomGifts']
  },
  {
    id: 'ig-6',
    caption: 'Playful details: cute honeybee keychain on gold hardware 🐝💫',
    likes: '1,750',
    comments: '84',
    type: 'image',
    mediaUrl: '/assets/products/honeybee-keychain.jpg',
    tags: ['#KeychainCharm', '#EverydayJoy']
  }
];

export const HAMPER_BOX_OPTIONS: HamperBoxOption[] = [
  {
    id: 'box-desi-barbie',
    name: 'Desi Barbie Luxury Gift Box',
    price: 999,
    color: '#E8A5B8',
    description: 'Signature pink keepsake box with hand-tied double satin ribbon and custom wax-sealed note.',
    imageUrl: '/assets/products/desi-barbie-hamper.jpg'
  },
  {
    id: 'box-purple-tulip',
    name: 'Purple Tulip Lavender Atelier Box',
    price: 1000,
    color: '#D4C2E2',
    description: 'Aesthetic lavender box with lilac grosgrain ribbon and botanical charms.',
    imageUrl: '/assets/products/purple-tulip-hamper.jpg'
  },
  {
    id: 'box-pearl-ivory-magnetic',
    name: 'Pearl Ivory Magnetic Keepsake Box',
    price: 499,
    color: '#F4EFE6',
    description: 'Clean minimalist ivory box with concealed magnetic closure and gold monogram.',
    imageUrl: '/assets/products/white-bangles.jpg'
  }
];
