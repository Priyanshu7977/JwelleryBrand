export interface PageMetadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
  faqs?: { question: string; answer: string }[];
}

const BASE_URL = 'https://jwellery-brand.vercel.app';

export const SEO_PAGES: Record<string, PageMetadata> = {
  home: {
    title: 'CELestia — Redefined For All | Fine Jewellery, Bangles & Bespoke Gifting Mumbai',
    description:
      'Immerse in Celestia luxury atelier: 100% anti-tarnish fine jewellery, handcrafted bangles, bespoke celebration hampers, and archival Polaroids. Same-day Mumbai delivery & Pan-India shipping.',
    keywords:
      'Celestia jewellery, anti tarnish bangles, custom gift hampers Mumbai, polaroids 20 your pics, desi barbie hamper, bespoke gifts Mumbai, fine jewellery Bandra',
    canonical: `${BASE_URL}/`,
    ogType: 'website',
    ogImage: `${BASE_URL}/assets/products/red-emerald-set.jpg`,
    faqs: [
      {
        question: 'Is Celestia jewellery 100% anti-tarnish and water-resistant?',
        answer:
          'Yes, every Celestia jewellery piece is handcrafted with premium hypoallergenic stainless steel and triple 18K gold vermeil, engineered to withstand daily wear, water, perfumes, and humidity without tarnishing.',
      },
      {
        question: 'Does Celestia offer same-day delivery in Mumbai?',
        answer:
          'Yes! We offer same-day priority express courier dispatch across Mumbai, Navi Mumbai, and Thane for all orders placed before 4:00 PM IST.',
      },
      {
        question: 'How do custom Polaroid and Hamper orders work?',
        answer:
          'When you curate a hamper or order custom 20-pack Polaroids, you can enter your personal calligraphy note at checkout or upload high-res photos directly via our WhatsApp Concierge for archival gold-wax sealed printing.',
      },
      {
        question: 'What is Celestia’s replacement warranty?',
        answer:
          'We offer a 7-day hassle-free replacement warranty on all transit parcels. Simply record an uncut unboxing video upon receiving your sealed parcel.',
      },
    ],
  },

  shop: {
    title: 'Shop All Fine Jewellery, Bangles & Custom Hampers | CELESTIA',
    description:
      'Explore the complete Celestia catalog: dual-tone enamel bangles, emerald necklace suites, luxury gift hampers, and custom photo keepsakes handcrafted in Mumbai.',
    keywords:
      'buy bangles online India, luxury gift hampers, anti tarnish necklaces, crochet keychains, fine jewellery shop',
    canonical: `${BASE_URL}/shop`,
    ogType: 'website',
    ogImage: `${BASE_URL}/assets/products/pink-blue-bangles.jpg`,
  },

  collections: {
    title: 'Curated Collections & Seasonal Haute Drops | CELESTIA Atelier',
    description:
      'Discover artisanal bangles, evening emerald suites, bespoke hampers, and personalised keepsakes categorized into distinct architectural narratives.',
    keywords:
      'jewellery collections, artisanal bangle stacks, bridal hampers, personalised polaroids, Celestia collections',
    canonical: `${BASE_URL}/collections`,
    ogType: 'website',
    ogImage: `${BASE_URL}/assets/products/desi-barbie-hamper.jpg`,
  },

  gifting: {
    title: 'Bespoke Hamper Builder & Archival Polaroid Gifting | CELESTIA',
    description:
      'Build your custom luxury gift hamper with hand-tied satin ribbons, scented wax seals, personalised handwritten Polaroid notes, and curated jewellery pieces.',
    keywords:
      'custom gift hampers, bespoke gifting Mumbai, personalised gift box, polaroid printing gift, luxury anniversary gifts',
    canonical: `${BASE_URL}/gifting`,
    ogType: 'website',
    ogImage: `${BASE_URL}/assets/products/desi-barbie-hamper.jpg`,
    faqs: [
      {
        question: 'Can I write a custom calligraphy note for my gift hamper?',
        answer:
          'Yes! You can write a personal message during checkout or in our 3D Gifting Builder. Our Mumbai Atelier hand-calligraphs your words onto textured archival cardstock finished with a metallic wax seal.',
      },
      {
        question: 'What items can be added inside a bespoke hamper?',
        answer:
          'You can combine signature bangles, fine jewellery pieces, custom 20-pack Polaroids, crochet charms, scented candles, and luxury keepsake boxes.',
      },
    ],
  },

  theWorld: {
    title: 'The World of Celestia | Heritage, Craftsmanship & Mumbai Atelier',
    description:
      'Learn about Celestia’s journey: from a sunlit studio in Bandra West to 1,000+ parcels dispatched across India with our 100% anti-tarnish guarantee.',
    keywords:
      'Celestia story, Mumbai jewellery atelier, anti tarnish technology, sustainable craftsmanship, founder story',
    canonical: `${BASE_URL}/the-world`,
    ogType: 'article',
    ogImage: `${BASE_URL}/assets/founder/founder-01.jpg`,
  },

  community: {
    title: 'Celestia Patron Circle | Real Customer Reviews & Unboxings',
    description:
      'Browse unfiltered photos, Instagram unboxings, and verified reviews from over 1,000 patrons wearing Celestia fine pieces across India.',
    keywords:
      'Celestia reviews, customer unboxing videos, jewellery ratings, verified buyer photos, Celestia community',
    canonical: `${BASE_URL}/community`,
    ogType: 'website',
    ogImage: `${BASE_URL}/assets/products/purple-tulip-hamper.jpg`,
  },

  blog: {
    title: 'The Celestia Gazette | Jewellery Styling, Gifting & Care Guides',
    description:
      'Editorial journal featuring jewellery stacking guides, anti-tarnish metallurgy insights, bespoke hamper curation ideas, and Mumbai atelier dispatches.',
    keywords:
      'jewellery styling guide, how to style bangles, anti tarnish jewellery care, gift hamper ideas, jewellery blog India',
    canonical: `${BASE_URL}/blog`,
    ogType: 'blog',
    ogImage: `${BASE_URL}/assets/products/pink-blue-bangles.jpg`,
  },

  contact: {
    title: 'Contact & Mumbai Studio Concierge | CELESTIA Bandra West',
    description:
      'Get in touch with Celestia Atelier in Bandra West, Mumbai. WhatsApp Concierge (+91 7718825792), custom hamper consultations, and live order assistance.',
    keywords:
      'Celestia contact, Celestia Mumbai location, jewellery concierge, WhatsApp jewellery order, Bandra West atelier',
    canonical: `${BASE_URL}/contact`,
    ogType: 'website',
    ogImage: `${BASE_URL}/assets/products/red-emerald-set.jpg`,
    faqs: [
      {
        question: 'Where is Celestia Atelier located?',
        answer:
          'Celestia Atelier is located in Bandra West, Mumbai, Maharashtra 400050. We operate a direct-to-consumer digital atelier with same-day express dispatches.',
      },
      {
        question: 'How can I contact customer concierge?',
        answer:
          'You can message our WhatsApp Concierge at +91 7718825792 or email celestiaaaccessories@gmail.com. We respond within 15 minutes during studio hours (10:00 AM – 8:00 PM IST).',
      },
    ],
  },

  orderTracking: {
    title: 'Track Your Live Parcel | CELESTIA Real-Time Courier Dispatch',
    description:
      'Track your Celestia fine jewellery order in real-time with live 6-stage milestone tracking, Delhivery AWB status, and estimated delivery countdown.',
    keywords:
      'track Celestia order, parcel tracking, Delhivery courier track, live jewellery dispatch',
    canonical: `${BASE_URL}/order-tracking`,
    ogType: 'website',
    ogImage: `${BASE_URL}/assets/products/desi-barbie-hamper.jpg`,
  },

  shippingReturns: {
    title: 'Shipping, Returns & Anti-Tarnish Warranty Policy | CELESTIA',
    description:
      'Read Celestia shipping timelines (Same-Day Mumbai, 2-3 day Pan-India Air Cargo), free shipping over ₹999, and our 7-day hassle-free replacement warranty.',
    keywords:
      'Celestia shipping policy, return policy, anti tarnish warranty, delivery cutoff Mumbai',
    canonical: `${BASE_URL}/shipping-returns`,
    ogType: 'website',
    ogImage: `${BASE_URL}/assets/products/pink-blue-bangles.jpg`,
  },

  terms: {
    title: 'Terms of Service & Atelier Conditions | CELESTIA',
    description:
      'Terms and conditions governing orders, payments, bespoke personalization, intellectual property, and deliveries at Celestia Luxury Atelier.',
    keywords: 'Celestia terms of service, legal conditions, shopping terms',
    canonical: `${BASE_URL}/terms`,
    ogType: 'website',
  },

  privacy: {
    title: 'Privacy Policy & Data Security Guarantee | CELESTIA',
    description:
      'Learn how Celestia protects customer data with 256-bit SSL encryption, zero third-party data selling, and secure payment processing.',
    keywords: 'Celestia privacy policy, payment security, customer data protection',
    canonical: `${BASE_URL}/privacy`,
    ogType: 'website',
  },
};
