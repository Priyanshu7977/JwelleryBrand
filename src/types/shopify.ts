export interface Product {
  id: string;
  shopifyVariantId?: string;
  handle: string;
  dm2buyId?: string;
  url?: string;
  title: string;
  category: 'jewellery' | 'bangles' | 'accessories' | 'gifting' | 'personalised';
  price: number;
  compareAtPrice?: number;
  description: string;
  editorialNote: string;
  material: string;
  dimensions?: string;
  craftsmanship: string;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  availableStock?: number;
  sameDayMumbaiAvailable: boolean;
  images: {
    hero: string;
    detail?: string;
    onModel?: string;
    alt: string;
  };
  tags: string[];
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  editorialNarrative: string;
  accentQuote: string;
  featuredImage: string;
  productCount: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPersonalisation?: {
    polaroidPhotoUrl?: string;
    customNote?: string;
    ribbonColor?: string;
    boxType?: string;
    selectedSize?: string;
  };
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  tag: string;
}

export interface InstagramMedia {
  id: string;
  caption: string;
  likes: string;
  comments: string;
  type: 'image' | 'reel';
  mediaUrl: string;
  tags: string[];
  productLink?: string;
}

export interface HamperBoxOption {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  imageUrl: string;
}
