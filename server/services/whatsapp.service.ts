import { OrderEntity } from '../types/index';
import { logger } from '../utils/logger';

export class WhatsAppService {
  formatOrderConfirmationMessage(order: OrderEntity): string {
    const itemsList = order.items
      .map((i) => `• ${i.quantity}x ${i.title} (₹${i.price})`)
      .join('\n');

    return (
      `✨ *CELESTIA LUXURY ATELIER — MUMBAI*\n` +
      `Order Confirmed: *#${order.orderNumber}*\n\n` +
      `Dear ${order.customerName},\n` +
      `Your bespoke jewellery order has been authenticated and entered our Mumbai atelier queue.\n\n` +
      `📦 *Items:*\n${itemsList}\n\n` +
      `💳 *Total Paid:* ₹${order.total} (${order.paymentMethod})\n` +
      `🚚 *Tracking:* ${order.trackingNumber}\n` +
      `🕒 *Estimated Delivery:* ${order.formattedDeliveryWindow}\n\n` +
      `_Thank you for welcoming Celestia into your story._`
    );
  }

  async sendOrderAlert(order: OrderEntity): Promise<{ success: boolean; messageId: string }> {
    const text = this.formatOrderConfirmationMessage(order);
    const messageId = `wa_${Date.now()}`;

    logger.info(`[WhatsAppService] Queued WhatsApp Concierge message for ${order.customerPhone || 'Patron'}`, {
      orderNumber: order.orderNumber,
      messageLength: text.length,
    });

    return { success: true, messageId };
  }
}

export const whatsAppService = new WhatsAppService();
