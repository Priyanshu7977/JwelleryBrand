/**
 * Celestia Luxury Atelier - Backend & Commerce Type Definitions
 */

export type DeliveryStage = 
  | 'confirmed' 
  | 'packed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered';

export interface OrderItem {
  id?: string;
  productId: string;
  shopifyVariantId?: string;
  title: string;
  handle: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  boxType?: string;
  customNotes?: string;
}

export interface CustomerShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface DeliveryTimelineEvent {
  stage: DeliveryStage;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
}

export interface DeliveryEstimate {
  estimatedDateFormatted: string; // e.g. "02 Sep 2026" or "28 Aug 2026"
  expectedTimeWindow: string; // e.g. "Expected between 10:00 AM – 8:00 PM IST"
  formattedRange: string;
  isSameDay: boolean;
  minDays: number;
  maxDays: number;
  deliveryDateStart: string;
  deliveryDateEnd: string;
  cutoffInfo?: string;
}

export interface DeliveryTracking {
  id?: string;
  orderId: string;
  trackingNumber: string;
  carrier: string; // 'Mumbai Atelier Express' | 'Delhivery Air Cargo' | 'Bluedart Express'
  currentStatus: DeliveryStage;
  estimatedDelivery: DeliveryEstimate;
  destinationCity: string;
  timeline: DeliveryTimelineEvent[];
  lastUpdated: string;
}

export interface OrderMetadata {
  id: string; // Internal or UUID
  orderNumber: string; // e.g. ORD-2026-8941 or Shopify #1042
  shopifyOrderId?: string;
  shopifyCheckoutId?: string;
  shopifyCheckoutUrl?: string;
  userId?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    structuredAddress?: CustomerShippingAddress;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  financialStatus: 'pending' | 'paid' | 'refunded';
  fulfillmentStatus: DeliveryStage;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: DeliveryEstimate;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileData {
  id: string;
  email: string;
  name: string;
  phone: string;
  memberSince: string;
  tier: 'Circle Member' | 'Patron' | 'VIP Atelier';
  ordersCount: number;
  savedAddresses: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
}

export interface ShopifyCheckoutLineItem {
  variantId: string;
  quantity: number;
  customAttributes?: Array<{ key: string; value: string }>;
}
