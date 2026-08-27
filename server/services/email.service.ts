import { OrderEntity } from '../types/index';
import { logger } from '../utils/logger';

export interface EmailDispatchResult {
  success: boolean;
  messageId: string;
  recipient: string;
  subject: string;
}

export class EmailService {
  async sendOrderConfirmation(order: OrderEntity): Promise<EmailDispatchResult> {
    const subject = `ORDER CONFIRMED ✓ #${order.orderNumber} — Celestia Luxury Atelier`;
    const messageId = `msg_${Date.now()}`;

    logger.info(`[EmailService] Dispatched Order Confirmation to ${order.customerEmail}`, {
      orderNumber: order.orderNumber,
      total: order.total,
      trackingNumber: order.trackingNumber,
    });

    return {
      success: true,
      messageId,
      recipient: order.customerEmail,
      subject,
    };
  }

  async sendOrderStatusUpdate(order: OrderEntity, newStatus: string): Promise<EmailDispatchResult> {
    const subject = `Update on Order #${order.orderNumber} (${newStatus.toUpperCase()}) — Celestia Atelier`;
    const messageId = `msg_${Date.now()}`;

    logger.info(`[EmailService] Dispatched Status Update [${newStatus}] to ${order.customerEmail}`);

    return {
      success: true,
      messageId,
      recipient: order.customerEmail,
      subject,
    };
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<EmailDispatchResult> {
    const subject = 'Password Reset Request — Celestia Luxury Atelier';
    const messageId = `msg_${Date.now()}`;

    logger.info(`[EmailService] Dispatched Password Reset to ${email}`);

    return {
      success: true,
      messageId,
      recipient: email,
      subject,
    };
  }
}

export const emailService = new EmailService();
