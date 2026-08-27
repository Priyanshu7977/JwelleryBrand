import { IOrderRepository, CreateOrderDTO } from '../interfaces/order.repository.interface';
import { OrderEntity, OrderItemEntity, TrackingEventEntity, FinancialStatus, FulfillmentStatus, PaymentEntity } from '../../types/index';
import crypto from 'crypto';

const ordersStore = new Map<string, OrderEntity>();
const paymentsStore = new Map<string, PaymentEntity>();

export class OrderRepository implements IOrderRepository {
  async create(data: CreateOrderDTO): Promise<OrderEntity> {
    const id = crypto.randomUUID();
    const now = new Date();
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `MUM-EXP-${Math.floor(10000 + Math.random() * 90000)}`;

    const items: OrderItemEntity[] = data.items.map((i) => ({
      id: crypto.randomUUID(),
      orderId: id,
      productId: i.productId,
      variantId: i.variantId,
      title: i.title,
      handle: i.handle,
      imageUrl: i.imageUrl,
      price: i.price,
      quantity: i.quantity,
      boxType: i.boxType,
      customNotes: i.customNotes,
      lineTotal: i.price * i.quantity,
    }));

    const subtotal = items.reduce((acc, i) => acc + i.lineTotal, 0);
    const total = Math.max(0, subtotal + data.shippingCost - data.discountAmount + data.tax);

    // Initial 6-stage milestone timeline progression
    const timeline: TrackingEventEntity[] = [
      {
        stage: 'confirmed',
        title: 'Order Confirmed & Payment Verified',
        description: `Order ${orderNumber} securely authenticated. Production queue initiated.`,
        location: 'Mumbai Atelier Sanctuary',
        timestamp: now.toISOString(),
        completed: true,
      },
      {
        stage: 'packed',
        title: 'Atelier Box Assembly & Wax Seal',
        description: 'Handcrafted jewellery wrapped in signature velvet case with custom polaroid.',
        location: 'Bandra West Design Studio',
        timestamp: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        completed: false,
      },
      {
        stage: 'shipped',
        title: 'Dispatched with Express Logistics',
        description: 'Air manifest generated and securely handed to priority transit partner.',
        location: 'Mumbai Hub Sort Facility',
        timestamp: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
        completed: false,
      },
      {
        stage: 'out_for_delivery',
        title: 'Courier Assigned for Delivery',
        description: 'Delivery partner out on route with temperature-controlled security box.',
        location: `${data.shippingAddress.city || 'Mumbai'} Local Hub`,
        timestamp: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
      },
      {
        stage: 'delivered',
        title: 'Package Handed to Recipient',
        description: 'Signed and delivered with love from Celestia Atelier.',
        location: data.shippingAddress.street || 'Recipient Destination',
        timestamp: new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString(),
        completed: false,
      },
    ];

    const order: OrderEntity = {
      id,
      orderNumber,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail.toLowerCase().trim(),
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      items,
      subtotal,
      shippingCost: data.shippingCost,
      discountAmount: data.discountAmount,
      tax: data.tax,
      total,
      currency: 'INR',
      paymentMethod: data.paymentMethod,
      financialStatus: data.paymentMethod.toUpperCase().includes('COD') ? 'pending' : 'paid',
      fulfillmentStatus: 'confirmed',
      trackingNumber,
      carrier: 'Mumbai Atelier Express',
      estimatedDeliveryStart: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      estimatedDeliveryEnd: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),
      formattedDeliveryWindow: 'Expected within 24–48 Hours IST',
      timeline,
      idempotencyKey: data.idempotencyKey,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    ordersStore.set(id, order);
    return { ...order };
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const o = ordersStore.get(id);
    return o ? { ...o } : null;
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderEntity | null> {
    const clean = orderNumber.trim().toUpperCase();
    for (const o of ordersStore.values()) {
      if (o.orderNumber.toUpperCase() === clean || o.trackingNumber.toUpperCase() === clean) {
        return { ...o };
      }
    }
    return null;
  }

  async findByIdempotencyKey(key: string): Promise<OrderEntity | null> {
    for (const o of ordersStore.values()) {
      if (o.idempotencyKey === key) {
        return { ...o };
      }
    }
    return null;
  }

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    return Array.from(ordersStore.values())
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findAll(options?: { limit?: number; offset?: number; status?: string }): Promise<{ orders: OrderEntity[]; total: number }> {
    let list = Array.from(ordersStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (options?.status) {
      list = list.filter((o) => o.fulfillmentStatus === options.status || o.financialStatus === options.status);
    }

    const total = list.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;

    return {
      orders: list.slice(offset, offset + limit),
      total,
    };
  }

  async updateFinancialStatus(id: string, status: FinancialStatus): Promise<OrderEntity | null> {
    const order = ordersStore.get(id);
    if (!order) return null;

    order.financialStatus = status;
    order.updatedAt = new Date().toISOString();
    ordersStore.set(id, order);
    return { ...order };
  }

  async updateFulfillmentStatus(
    id: string,
    status: FulfillmentStatus,
    trackingNumber?: string,
    carrier?: string
  ): Promise<OrderEntity | null> {
    const order = ordersStore.get(id);
    if (!order) return null;

    order.fulfillmentStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;

    // Advance completed flag on timeline
    const stages: FulfillmentStatus[] = ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIdx = stages.indexOf(status);

    order.timeline.forEach((event) => {
      const stageIdx = stages.indexOf(event.stage);
      if (stageIdx <= currentIdx) {
        event.completed = true;
      }
    });

    order.updatedAt = new Date().toISOString();
    ordersStore.set(id, order);
    return { ...order };
  }

  async createPaymentRecord(payment: Omit<PaymentEntity, 'id' | 'createdAt'>): Promise<PaymentEntity> {
    const id = crypto.randomUUID();
    const record: PaymentEntity = {
      id,
      ...payment,
      createdAt: new Date().toISOString(),
    };
    paymentsStore.set(record.idempotencyKey, record);
    return record;
  }
}

export const orderRepository = new OrderRepository();
