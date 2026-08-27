import { orderRepository } from '../repositories/postgres/order.repository';
import { productRepository } from '../repositories/postgres/product.repository';
import { cartRepository } from '../repositories/postgres/cart.repository';
import { emailService } from './email.service';
import { whatsAppService } from './whatsapp.service';
import { calculateDeliveryWindow } from './tracking.service';
import { OrderEntity, FinancialStatus, FulfillmentStatus } from '../types/index';
import { AppError } from '../middleware/errorHandler.middleware';

export class OrderService {
  async createOrder(payload: {
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
    shippingMethod: string;
    paymentMethod: string;
    cartId?: string;
    idempotencyKey?: string;
  }): Promise<OrderEntity> {
    if (!payload.items || payload.items.length === 0) {
      throw new AppError('Cannot place an order with an empty item list.', 400, 'EMPTY_ORDER');
    }

    // Check idempotency if key provided
    if (payload.idempotencyKey) {
      const existing = await orderRepository.findByIdempotencyKey(payload.idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    // Calculate subtotal and shipping
    const subtotal = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const baseShipping = subtotal >= 999 ? 0 : 99;
    
    // Cash on Delivery convenience handling fee (₹50)
    const isCod = payload.paymentMethod.toUpperCase().includes('COD') || payload.paymentMethod.toUpperCase().includes('CASH');
    const codFee = isCod ? 50 : 0;
    const shippingCost = baseShipping + codFee;
    
    // Prepaid ₹50 incentive discount
    const isPrepaid = payload.paymentMethod.toUpperCase().includes('UPI') || payload.paymentMethod.toUpperCase().includes('CARD');
    const discountAmount = isPrepaid ? 50 : 0;

    // Delivery calculation
    const deliveryWindow = calculateDeliveryWindow(payload.shippingMethod);

    // Validate inventory and deduct
    for (const item of payload.items) {
      const success = await productRepository.updateInventory(item.productId, item.variantId, -item.quantity);
      if (!success) {
        throw new AppError(`Insufficient atelier inventory for piece: ${item.title}`, 400, 'INSUFFICIENT_STOCK');
      }
    }

    const order = await orderRepository.create({
      userId: payload.userId,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.shippingAddress,
      items: payload.items,
      shippingCost,
      discountAmount,
      tax: 0,
      shippingMethod: payload.shippingMethod,
      paymentMethod: payload.paymentMethod,
      idempotencyKey: payload.idempotencyKey,
    });

    order.formattedDeliveryWindow = deliveryWindow.formatted;
    order.estimatedDeliveryStart = deliveryWindow.start.toISOString();
    order.estimatedDeliveryEnd = deliveryWindow.end.toISOString();

    // Clear user cart if cartId provided
    if (payload.cartId) {
      try {
        await cartRepository.clearCart(payload.cartId);
      } catch {}
    }

    // Dispatch asynchronous email & WhatsApp notifications (safe background dispatch)
    emailService.sendOrderConfirmation(order).catch(() => {});
    whatsAppService.sendOrderAlert(order).catch(() => {});

    return order;
  }

  async getOrder(orderId: string): Promise<OrderEntity> {
    const order = (await orderRepository.findById(orderId)) || (await orderRepository.findByOrderNumber(orderId));
    if (!order) {
      throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
    }
    return order;
  }

  async getUserOrders(userId: string): Promise<OrderEntity[]> {
    return orderRepository.findByUserId(userId);
  }

  async updateOrderStatus(
    orderId: string,
    updates: { financialStatus?: FinancialStatus; fulfillmentStatus?: FulfillmentStatus; carrier?: string; trackingNumber?: string }
  ): Promise<OrderEntity> {
    const order = await this.getOrder(orderId);

    if (updates.financialStatus) {
      await orderRepository.updateFinancialStatus(order.id, updates.financialStatus);
      order.financialStatus = updates.financialStatus;
    }

    if (updates.fulfillmentStatus) {
      await orderRepository.updateFulfillmentStatus(order.id, updates.fulfillmentStatus, updates.trackingNumber, updates.carrier);
      order.fulfillmentStatus = updates.fulfillmentStatus;
      emailService.sendOrderStatusUpdate(order, updates.fulfillmentStatus).catch(() => {});
    }

    return order;
  }
}

export const orderService = new OrderService();
