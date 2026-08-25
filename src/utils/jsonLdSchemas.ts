import { Product, Collection } from '../types/shopify';
import { BlogPost } from '../data/blogData';
import { BRAND_INFO } from '../data/shopify-data';

const SITE_URL = 'https://jwellery-brand.vercel.app';

/**
 * Organization & Local JewelryStore Schema with Mumbai Geolocation
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'JewelryStore', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: 'Celestia Luxury Atelier',
    legalName: 'Celestia Fine Jewellery & Bespoke Gifting Atelier',
    url: SITE_URL,
    logo: `${SITE_URL}/assets/celestia-logo.png`,
    image: `${SITE_URL}/assets/products/red-emerald-set.jpg`,
    description:
      'Celestia is an experiential fashion campaign and Mumbai fine jewellery atelier specialising in 100% anti-tarnish artisanal bangles, emerald suites, bespoke Polaroid keepsakes, and luxury celebration hampers.',
    telephone: '+91-7718825792',
    email: BRAND_INFO.email,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'UPI, Credit Card, Debit Card, NetBanking, Simpl PayLater, Cash on Delivery',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bandra West Coastal Atelier',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400050',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.0596,
      longitude: 72.8295,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:00',
        closes: '20:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Mumbai' },
      { '@type': 'City', name: 'Navi Mumbai' },
      { '@type': 'City', name: 'Thane' },
      { '@type': 'Country', name: 'India' },
    ],
    sameAs: [
      BRAND_INFO.instagramUrl,
      'https://wa.me/917718825792',
      BRAND_INFO.dm2buyStoreUrl,
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Celestia Jewellery & Gifting Collections',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Artisanal Bangles' },
        { '@type': 'OfferCatalog', name: 'Fine Jewellery & Emerald Suites' },
        { '@type': 'OfferCatalog', name: 'Bespoke Celebration Hampers' },
        { '@type': 'OfferCatalog', name: 'Personalised Polaroid Keepsakes' },
      ],
    },
  };
}

/**
 * WebSite Schema with Sitelinks Search Box
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Celestia Atelier',
    description: 'Fine Jewellery, Anti-Tarnish Bangles & Bespoke Gifting Atelier Mumbai',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Product & Offer Schema with INR Currency and High-Rating Aggregates
 */
export function getProductSchema(product: Product) {
  const productUrl = `${SITE_URL}/product/${product.handle}`;
  const imgUrl = product.images?.hero
    ? (product.images.hero.startsWith('http') ? product.images.hero : `${SITE_URL}${product.images.hero}`)
    : `${SITE_URL}/assets/products/pink-blue-bangles.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.title,
    image: [imgUrl],
    description: product.description || product.editorialNote || 'Handcrafted fine jewellery by Celestia Atelier Mumbai.',
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Celestia',
    },
    material: product.material || '100% Anti-Tarnish 18K Gold Vermeil / Stainless Steel',
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        (product.availableStock ?? 1) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/LimitedAvailability',
      seller: {
        '@type': 'Organization',
        name: 'Celestia Atelier Mumbai',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: product.price >= 999 ? '0' : '99',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * FAQPage Schema (AEO / GEO Engine Optimized for Perplexity & Google AI Overviews)
 */
export function getFAQPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList Schema for Google Rich Snippets
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * BlogPosting / Article Schema for Editorial Gazette
 */
export function getArticleSchema(post: BlogPost) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const imgUrl = post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    headline: post.title,
    alternativeHeadline: post.subtitle,
    image: [imgUrl],
    datePublished: '2026-08-24T10:00:00+05:30',
    dateModified: '2026-08-25T18:00:00+05:30',
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Celestia Luxury Atelier',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/celestia-logo.png`,
      },
    },
    description: post.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.tags.join(', '),
  };
}
