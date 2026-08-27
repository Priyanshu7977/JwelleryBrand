import { IProductRepository } from '../interfaces/product.repository.interface';
import { ProductEntity } from '../../types/index';
import { isDbConnected, query } from '../../db/pool';

// Seed initial catalogue products with real pricing and specs
const INITIAL_PRODUCTS: ProductEntity[] = [
  {
    id: 'pink-blue-bangles',
    handle: 'pink-and-blue-bangle-set-of-2',
    title: 'pink and blue bangle set of 2',
    description: '18K dual gold-dipped brass cuffs with hand-painted pastel pink and sky blue glass enamel.',
    category: 'bangles',
    price: 150,
    compareAtPrice: 299,
    material: '18K Gold Plated Brass & Hand-Poured Glass Enamel',
    craftsmanship: 'Hand-finished in Mumbai atelier. Dual-layer anti-tarnish protective sealing.',
    editorialNote: 'Our signature sunset-spectrum bangle pair, calibrated for effortless daily shine.',
    sameDayMumbaiAvailable: true,
    heroImage: '/assets/products/pink-blue-bangles.jpg',
    galleryImages: ['/assets/products/pink-blue-bangles.jpg'],
    tags: ['Bangles', 'Handcrafted', 'Enamel', 'Anti-Tarnish'],
    isActive: true,
    variants: [
      { id: 'var-pb-24', productId: 'pink-blue-bangles', sku: 'PB-24', title: 'Size 2.4 (Small)', price: 150, inventoryQuantity: 45, size: '2.4', createdAt: new Date().toISOString() },
      { id: 'var-pb-26', productId: 'pink-blue-bangles', sku: 'PB-26', title: 'Size 2.6 (Standard)', price: 150, inventoryQuantity: 80, size: '2.6', createdAt: new Date().toISOString() },
      { id: 'var-pb-28', productId: 'pink-blue-bangles', sku: 'PB-28', title: 'Size 2.8 (Large)', price: 150, inventoryQuantity: 30, size: '2.8', createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'desi-barbie-hamper',
    handle: 'desi-barbie-hamper',
    title: 'Desi Barbie Hamper',
    description: 'A bespoke celebratory gift hamper complete with handcrafted jewellery, retro Polaroid prints, and archival stationery.',
    category: 'gifting',
    price: 150,
    compareAtPrice: 1299,
    material: 'Handmade Velvet Keepsake Box, Silk Ribbon, Fuji Polaroid',
    craftsmanship: 'Hand-assembled and sealed with custom gold wax stamp in Mumbai atelier.',
    editorialNote: 'A heartfelt celebratory box crafted to turn gifting into an unforgettable unboxing moment.',
    sameDayMumbaiAvailable: true,
    heroImage: '/assets/products/desi-barbie-hamper.jpg',
    galleryImages: ['/assets/products/desi-barbie-hamper.jpg'],
    tags: ['Gift Hamper', 'Personalised', 'Celebration', 'Polaroid'],
    isActive: true,
    variants: [
      { id: 'var-dbh-std', productId: 'desi-barbie-hamper', sku: 'HAMPER-DB-01', title: 'Curated Hamper', price: 150, inventoryQuantity: 25, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'white-bangles',
    handle: 'white-bangles',
    title: 'white bangles',
    description: 'Pristine pearl-finish ivory and gold bangles engineered for timeless elegance.',
    category: 'bangles',
    price: 150,
    compareAtPrice: 350,
    material: '18K Gold PVD Coating over Brass with Ivory Resins',
    craftsmanship: 'Precision sized and hand-buffed for silk-smooth comfort profile.',
    editorialNote: 'Understated brilliance meant to accompany crisp cotton shirts or festive silks.',
    sameDayMumbaiAvailable: true,
    heroImage: '/assets/products/white-bangles.jpg',
    galleryImages: ['/assets/products/white-bangles.jpg'],
    tags: ['Bangles', 'Minimalist', 'Waterproof'],
    isActive: true,
    variants: [
      { id: 'var-wb-24', productId: 'white-bangles', sku: 'WB-24', title: 'Size 2.4', price: 150, inventoryQuantity: 50, size: '2.4', createdAt: new Date().toISOString() },
      { id: 'var-wb-26', productId: 'white-bangles', sku: 'WB-26', title: 'Size 2.6', price: 150, inventoryQuantity: 65, size: '2.6', createdAt: new Date().toISOString() },
      { id: 'var-wb-28', productId: 'white-bangles', sku: 'WB-28', title: 'Size 2.8', price: 150, inventoryQuantity: 40, size: '2.8', createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'red-emerald-set',
    handle: 'exclusive-red-emerald-set',
    title: 'Exclusive Red Emerald set',
    description: 'High-jewelry royal red and simulated emerald choker with matching architectural drop earrings.',
    category: 'fine-jewellery',
    price: 150,
    compareAtPrice: 1599,
    material: '18K Dual Gold Plating, Synthetic Ruby & Emerald Facets',
    craftsmanship: 'Hand-set prong mounts with mirror-polished backings and secure lock clasps.',
    editorialNote: 'The crowning centerpiece of our festive bridal suite, radiant under evening light.',
    sameDayMumbaiAvailable: true,
    heroImage: '/assets/products/red-emerald-set.jpg',
    galleryImages: ['/assets/products/red-emerald-set.jpg'],
    tags: ['Fine Jewellery', 'Necklace Set', 'Gemstones', 'Signature'],
    isActive: true,
    variants: [
      { id: 'var-res-one', productId: 'red-emerald-set', sku: 'RES-01', title: 'One Size (Adjustable)', price: 150, inventoryQuantity: 14, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'anti-tarnish-rings',
    handle: 'golden-anti-tarnish-rings',
    title: 'Golden anti tarnish rings',
    description: 'Waterproof everyday gold statement and minimal band rings designed to never fade.',
    category: 'fine-jewellery',
    price: 150,
    compareAtPrice: 599,
    material: '316L Surgical Stainless Steel & 18K Real Gold PVD',
    craftsmanship: 'Tested against perfumes, chlorine, and lotions. 100% hypoallergenic.',
    editorialNote: 'Effortless stacking rings that stay on your fingers from morning workouts to gala dinners.',
    sameDayMumbaiAvailable: true,
    heroImage: '/assets/products/anti-tarnish-rings.jpg',
    galleryImages: ['/assets/products/anti-tarnish-rings.jpg'],
    tags: ['Rings', 'Anti-Tarnish', 'Waterproof', 'Everyday'],
    isActive: true,
    variants: [
      { id: 'var-atr-adj', productId: 'anti-tarnish-rings', sku: 'ATR-ADJ', title: 'Adjustable Comfort Fit', price: 150, inventoryQuantity: 120, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'polaroids-20',
    handle: 'polaroids-20-your-pics',
    title: 'polaroids 20(your pics)',
    description: 'Custom photo pack of 20 retro Fuji polaroid-style prints on archival glossy cardstock.',
    category: 'personalised',
    price: 150,
    compareAtPrice: 400,
    material: 'Archival 300 GSM Photographic Fuji Film Finish',
    craftsmanship: 'Calibrated color profiling with protective UV laminate.',
    editorialNote: 'Preserve personal love stories in tangible vintage polaroid frames.',
    sameDayMumbaiAvailable: true,
    heroImage: '/assets/products/polaroids-20.jpg',
    galleryImages: ['/assets/products/polaroids-20.jpg'],
    tags: ['Polaroids', 'Custom Photo', 'Keepsake'],
    isActive: true,
    variants: [
      { id: 'var-pol-20', productId: 'polaroids-20', sku: 'POL-20', title: '20 Photo Pack', price: 150, inventoryQuantity: 200, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const productStore = new Map<string, ProductEntity>();
INITIAL_PRODUCTS.forEach((p) => productStore.set(p.id, p));

export class ProductRepository implements IProductRepository {
  async findAll(options?: { category?: string; activeOnly?: boolean; limit?: number; offset?: number }): Promise<{ products: ProductEntity[]; total: number }> {
    let list = Array.from(productStore.values());

    if (options?.activeOnly !== false) {
      list = list.filter((p) => p.isActive);
    }
    if (options?.category) {
      list = list.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
    }

    const total = list.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;

    return {
      products: list.slice(offset, offset + limit),
      total,
    };
  }

  async findByHandle(handle: string): Promise<ProductEntity | null> {
    const cleanHandle = handle.toLowerCase();
    for (const p of productStore.values()) {
      if (p.handle.toLowerCase() === cleanHandle || p.id.toLowerCase() === cleanHandle) {
        return { ...p };
      }
    }
    return null;
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const p = productStore.get(id);
    return p ? { ...p } : null;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    productStore.set(product.id, product);
    return { ...product };
  }

  async updateInventory(productId: string, variantId: string | undefined, delta: number): Promise<boolean> {
    const p = productStore.get(productId);
    if (!p) return false;

    if (variantId) {
      const v = p.variants.find((variant) => variant.id === variantId);
      if (v) {
        if (v.inventoryQuantity + delta < 0) return false;
        v.inventoryQuantity += delta;
        return true;
      }
    } else if (p.variants.length > 0) {
      if (p.variants[0].inventoryQuantity + delta < 0) return false;
      p.variants[0].inventoryQuantity += delta;
      return true;
    }

    return true;
  }
}

export const productRepository = new ProductRepository();
