import { Request } from 'express';

export type UserRole = 'customer' | 'admin';

export type UserTier = 'Circle Member' | 'Patron' | 'VIP Atelier';

export type FinancialStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type FulfillmentStatus = 
  | 'confirmed' 
  | 'packed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered';

export interface UserAddress {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  role: UserRole;
  tier: UserTier;
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPublicProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  tier: UserTier;
  ordersCount: number;
  savedAddresses: UserAddress[];
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  price: number;
  inventoryQuantity: number;
  size?: string;
  createdAt: string;
}

export interface ProductEntity {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  material: string;
  craftsmanship: string;
  editorialNote?: string;
  sameDayMumbaiAvailable: boolean;
  heroImage: string;
  galleryImages: string[];
  tags: string[];
  isActive: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItemEntity {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  title: string;
  handle: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  boxType?: string;
  customNote?: string;
  polaroidUrl?: string;
  lineTotal: number;
}

export interface CartEntity {
  id: string;
  userId?: string;
  sessionId: string;
  items: CartItemEntity[];
  subtotal: number;
  freeShippingThreshold: number;
  eligibleForFreeShipping: boolean;
  remainingForFreeShipping: number;
  updatedAt: string;
}

export interface OrderItemEntity {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  title: string;
  handle: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  boxType?: string;
  customNotes?: string;
  lineTotal: number;
}

export interface TrackingEventEntity {
  stage: FulfillmentStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderEntity {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItemEntity[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string;
  financialStatus: FinancialStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDeliveryStart: string;
  estimatedDeliveryEnd: string;
  formattedDeliveryWindow: string;
  timeline: TrackingEventEntity[];
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEntity {
  id: string;
  orderId: string;
  idempotencyKey: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: FinancialStatus;
  gatewayTransactionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ContactInquiryEntity {
  id: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface WebhookLogEntity {
  id: string;
  source: 'shopify' | 'payment_gateway' | 'whatsapp';
  eventType: string;
  idempotencyKey?: string;
  payload: Record<string, unknown>;
  status: 'received' | 'processed' | 'failed';
  error?: string;
  createdAt: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  tier: UserTier;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
  idempotencyKey?: string;
}
