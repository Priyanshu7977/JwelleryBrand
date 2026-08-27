import { OrderEntity, FinancialStatus, FulfillmentStatus, PaymentEntity } from '../../types/index';

export interface CreateOrderDTO {
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
  items: Array<{
    productId: string;
    variantId?: string;
    title: string;
    handle: string;
    imageUrl?: string;
    price: number;
    quantity: number;
    boxType?: string;
    customNotes?: string;
  }>;
  shippingCost: number;
  discountAmount: number;
  tax: number;
  shippingMethod: string;
  paymentMethod: string;
  idempotencyKey?: string;
}

export interface IOrderRepository {
  create(data: CreateOrderDTO): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | null>;
  findByOrderNumber(orderNumber: string): Promise<OrderEntity | null>;
  findByIdempotencyKey(key: string): Promise<OrderEntity | null>;
  findByUserId(userId: string): Promise<OrderEntity[]>;
  findAll(options?: { limit?: number; offset?: number; status?: string }): Promise<{ orders: OrderEntity[]; total: number }>;
  updateFinancialStatus(id: string, status: FinancialStatus): Promise<OrderEntity | null>;
  updateFulfillmentStatus(id: string, status: FulfillmentStatus, trackingNumber?: string, carrier?: string): Promise<OrderEntity | null>;
  
  // Payment record
  createPaymentRecord(payment: Omit<PaymentEntity, 'id' | 'createdAt'>): Promise<PaymentEntity>;
}
