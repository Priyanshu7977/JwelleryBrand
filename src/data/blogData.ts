export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Styling' | 'Care & Craft' | 'Gifting' | 'Atelier Story' | 'Trends';
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string;
  readTime: string;
  isFeatured?: boolean;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      highlightQuote?: string;
      image?: string;
    }[];
    conclusion: string;
  };
  tags: string[];
  featuredProductHandles: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'how-to-style-hand-painted-enamel-bangles',
    title: 'How to Style Hand-Painted Enamel Bangles with Modern Outfits',
    subtitle: 'From minimal white linen shirts to royal festive silks, master the art of effortless bangle stacking.',
    category: 'Styling',
    coverImage: '/assets/products/pink-blue-bangles.jpg',
    author: {
      name: 'Radhika Sharma',
      role: 'Head of Styling, Celestia Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    publishDate: '24 Aug 2026',
    readTime: '4 min read',
    isFeatured: true,
    excerpt: 'Traditional royal motifs meet modern high-street chic. Discover the golden ratio for stacking colourful enamel bangles without overpowering your daily silhouette.',
    tags: ['Bangles', 'Styling Guide', 'Everyday Luxury', 'Streetwear Fusion'],
    featuredProductHandles: ['artisanal-pink-blue-bangles', 'green-meenakari-choker-suite'],
    content: {
      intro: 'For centuries, Indian enamel (Meenakari) was reserved solely for bridal royal heirlooms. At Celestia Atelier, we have broken those boundaries—transforming vibrant pink, sky-blue, and emerald bangles into sculptural everyday staples you can effortlessly pair with a classic oversized blazer, denim, or handloom linen.',
      sections: [
        {
          heading: '1. The Solo Hero Statement',
          body: [
            'When wearing structured monochrome outfits (such as a tailored beige pantsuit or a crisp white poplin shirt), let a single hand-painted enamel bangle take centre stage on your watch arm.',
            'The contrast between sharp western tailoring and organic hand-painted floral swirls creates an instant editorial aesthetic.'
          ],
          highlightQuote: 'Luxury is not about piling on weight; it is about intentional contrast.'
        },
        {
          heading: '2. The 3:1 Golden Ratio of Stacking',
          body: [
            'To create visual harmony without clutter, follow our 3:1 stacking rule:',
            'Combine 2 sleek, minimal gold-dipped spacer bands with 1 prominent colourful hand-painted bangle in the middle.',
            'This frames the enamel work, giving it breathing room while allowing the gold finish to catch ambient light.'
          ]
        },
        {
          heading: '3. Mixing Metals and Enamel Tones',
          body: [
            'Do not be afraid to pair soft pastel blue enamel with 18k yellow gold and silver rings. Contemporary fashion thrives on tonal tension.',
            'Ensure the enamel base tone echoes at least one subtle element of your footwear or handbag.'
          ]
        }
      ],
      conclusion: 'Whether you are rushing to a morning client briefing in Bandra or stepping out for sunset cocktails at Marine Drive, our artisanal bangles offer an unmatched blend of cultural heritage and everyday durability.'
    }
  },
  {
    id: 'blog-2',
    slug: 'anti-tarnish-jewellery-care-guide',
    title: 'Anti-Tarnish Jewellery 101: Keep Your Gold-Dipped Pieces Shining Forever',
    subtitle: 'The ultimate maintenance handbook for sweat-proof, perfume-safe, and humidity-resistant everyday jewellery.',
    category: 'Care & Craft',
    coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Aditya Mehta',
      role: 'Master Craftsman & Metallurgist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    publishDate: '20 Aug 2026',
    readTime: '3 min read',
    isFeatured: false,
    excerpt: 'Mumbai humidity and everyday sweat are no match for PVD triple-gold coating. Here is the exact routine our studio artisans recommend.',
    tags: ['Anti-Tarnish', 'Jewellery Care', 'Gold Plated', 'Craftsmanship'],
    featuredProductHandles: ['celestia-signature-suite', 'honeybee-keychain'],
    content: {
      intro: 'There is nothing more disappointing than buying a favourite ring or pendant only to watch it fade into dull grey within weeks. Celestia Atelier uses high-grade surgical stainless steel triple-dipped in 18k gold with a protective PVD nano-seal, making our pieces sweat-proof and anti-tarnish.',
      sections: [
        {
          heading: 'The 3 Golden Rules of Jewellery Care',
          body: [
            '1. Store in the Velvet Pouch: Avoid leaving your pieces exposed on open trays where dust and direct sunlight can accumulate.',
            '2. The Gentle Wipe: After a humid day out in Mumbai, use the complimentary microfiber cloth provided in your Celestia unboxing to wipe away skin oils.',
            '3. Perfume First, Jewellery Second: Always spray your favourite mist or fragrance before slipping on your rings and suites.'
          ],
          highlightQuote: 'Our pieces are designed for living in—gym workouts, monsoon rain, and late-night celebrations included.'
        },
        {
          heading: 'Can I Wear Celestia Jewellery in the Shower?',
          body: [
            'Yes! Our waterproof anti-tarnish collection is rated for fresh water exposure. Simply rinse with clean water if exposed to sea salt water or chlorinated swimming pools, and pat dry.'
          ]
        }
      ],
      conclusion: 'With just 30 seconds of monthly care, your Celestia jewellery will retain its mirror-like golden radiance for years to come.'
    }
  },
  {
    id: 'blog-3',
    slug: 'the-art-of-bespoke-gifting-polaroid-keepsakes',
    title: 'The Art of the Bespoke Hamper: Why Polaroids & Wax Seals Win Hearts',
    subtitle: 'Transforming a regular birthday or anniversary gift into an emotional unboxing memory.',
    category: 'Gifting',
    coverImage: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Priyanshu & Team',
      role: 'Founders, Celestia Atelier',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    publishDate: '18 Aug 2026',
    readTime: '5 min read',
    isFeatured: false,
    excerpt: 'In a digital age of instant texts, holding a real physical Fujifilm Instax print alongside hand-lettered calligraphy creates an unboxing experience that cannot be replicated.',
    tags: ['Gifting', 'Polaroid', 'Hamper Workshop', 'Celebration'],
    featuredProductHandles: ['bespoke-celebration-hamper', 'celestia-polaroid-keepsake'],
    content: {
      intro: 'When we created the Celestia Gifting Studio in Mumbai, we asked ourselves: What makes a gift truly unforgettable? It is never just the item inside—it is the anticipation of cracking the golden wax seal, reading handwritten words, and finding a timeless polaroid of a shared memory.',
      sections: [
        {
          heading: '1. Why Tactile Keepsakes Matter More Than Ever',
          body: [
            'We receive thousands of digital notifications every day. A physical retro Polaroid print with genuine chemical film is something your loved one will stick on their bedside mirror, journal, or work desk for years.',
            'Every Celestia bespoke hamper comes with custom photo printing directly on our studio Fujifilm printers.'
          ]
        },
        {
          heading: '2. Anatomy of a Perfect Celestia Gift Hamper',
          body: [
            '• Outer Shell: Structured velvet keepsake box in midnight obsidian or royal emerald.',
            '• Core Piece: Handcrafted jewellery or artisanal bangles nestled in satin lining.',
            '• Personal Touch: Hand-calligraphed letter signed with an authentic brass wax seal.',
            '• Instant Sweetness: Premium artisanal chocolates and celebration glitter.'
          ],
          highlightQuote: 'Gifts are forgotten; feelings and unboxings are remembered forever.'
        }
      ],
      conclusion: 'Explore our Hamper Workshop to build your custom celebration hamper with live preview and same-day Mumbai delivery.'
    }
  },
  {
    id: 'blog-4',
    slug: 'inside-mumbai-atelier-craftsmanship',
    title: 'Inside Our Mumbai Atelier: Where Traditional Meenakari Meets Contemporary Redefined Design',
    subtitle: 'A photographic journey through our workbench, raw brass shaping, and hand-enameling process.',
    category: 'Atelier Story',
    coverImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Radhika Sharma',
      role: 'Head of Styling, Celestia Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    publishDate: '15 Aug 2026',
    readTime: '6 min read',
    isFeatured: false,
    excerpt: 'Take a peek behind the studio doors in Mumbai where each piece undergoes 14 steps of hand-finishing, precision hallmarking, and velvet box packaging.',
    tags: ['Atelier', 'Behind The Scenes', 'Mumbai Studio', 'Handmade'],
    featuredProductHandles: ['artisanal-pink-blue-bangles', 'celestia-signature-suite'],
    content: {
      intro: 'Nestled in the heart of Mumbai, the Celestia Atelier is a sanctuary where molten metal, powdered mineral glass, and modern ergonomic design converge.',
      sections: [
        {
          heading: 'The 14-Step Handcrafting Cycle',
          body: [
            'Every bangle starts as an alloy core selected for lightweight comfort. Our master artisans carve the recessed floral patterns using miniature chisels.',
            'The vibrant colors are hand-poured glass enamel pigments fired under controlled temperatures to achieve that signature glossy, scratch-resistant sheen.'
          ]
        },
        {
          heading: 'Zero Waste & Ethical Production',
          body: [
            'We recycle 100% of our metal shavings, ensuring minimal ecological footprint while supporting local generational artisan families in Maharashtra and Rajasthan.'
          ]
        }
      ],
      conclusion: 'Every order you unbox directly supports the continuation of authentic Indian jewellery craftsmanship.'
    }
  },
  {
    id: 'blog-5',
    slug: '5-rules-for-sculptural-ring-stacking',
    title: 'Stacking & Layering: The 5 Rules for Sculptural Rings and Dainty Pendants',
    subtitle: 'How to curate an effortless everyday jewellery stack that looks editorial, not cluttered.',
    category: 'Trends',
    coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Radhika Sharma',
      role: 'Head of Styling, Celestia Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    publishDate: '10 Aug 2026',
    readTime: '3 min read',
    isFeatured: false,
    excerpt: 'From index finger statement bands to alternating neck drops, discover the secrets stylists use to create effortless dimensional layering.',
    tags: ['Rings', 'Necklaces', 'Layering', 'Fashion Guide'],
    featuredProductHandles: ['celestia-signature-suite'],
    content: {
      intro: 'Layering jewellery is an art form. Done right, it elevates a simple white tee and jeans into an effortlessly chic look. Done wrong, chains tangle and rings feel restrictive.',
      sections: [
        {
          heading: 'Rule 1: Vary Chain Lengths by at Least 2 Inches',
          body: [
            'Pair a 14-inch choker with an 18-inch pendant and a 22-inch drop chain. This creates a flattering V-shaped silhouette that elongates the neckline.'
          ]
        },
        {
          heading: 'Rule 2: The Anchor Finger Technique',
          body: [
            'Choose one bold statement ring for your middle or index finger (the anchor), and keep the adjacent fingers adorned with slim minimalist bands.'
          ]
        }
      ],
      conclusion: 'Mix textures, experiment with heights, and remember: confidence is your finest accessory.'
    }
  }
];
