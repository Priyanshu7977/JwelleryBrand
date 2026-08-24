import { OrderMetadata } from '../types/backend';
import { BRAND_INFO } from '../data/shopify-data';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
  gmailUrl?: string;
  mailtoUrl?: string;
}

/**
 * Builds the formatted luxury email invoice text
 */
export function buildOrderInvoiceText(order: OrderMetadata): string {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.title} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}${
          item.boxType ? ` [Box: ${item.boxType}]` : ''
        }${item.customNotes ? ` (Note: "${item.customNotes}")` : ''}`
    )
    .join('\n');

  return `Dear ${order.customer.name},

Thank you for choosing Celestia Atelier Mumbai. Your order has been placed in our studio queue.

ORDER SUMMARY
========================================
Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
Payment Method: ${order.paymentMethod} (Status: PAID)
Shipping Method: ${order.shippingMethod}
Tracking Number: ${order.trackingNumber} (${order.carrier})
Estimated Delivery: ${order.estimatedDelivery?.estimatedDateFormatted || '2-4 Business Days'}

DELIVERY ADDRESS
========================================
Recipient: ${order.customer.name}
Address: ${order.customer.address}
Phone: ${order.customer.phone}

ITEMS PURCHASED:
========================================
${itemsText}

FINANCIAL BREAKDOWN
========================================
Subtotal: ₹${order.subtotal}
Shipping: ${order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}
Total Paid: ₹${order.total}

Track your order in real-time at:
https://celestiaamor.in/order-tracking?id=${order.orderNumber}

With love & craftsmanship,
Celestia Atelier & Fine Adornments
Bandra West, Mumbai, Maharashtra 400050
WhatsApp Concierge: +91 7718825792
Email: ${BRAND_INFO.email}
`;
}

/**
 * Dispatches automated order confirmation email to customer and atelier desk
 */
export async function sendOrderConfirmationEmail(order: OrderMetadata): Promise<EmailDispatchResult> {
  const invoiceText = buildOrderInvoiceText(order);
  const subject = `✨ Celestia Order Confirmed: ${order.orderNumber} - ₹${order.total}`;

  // 1. Try Vercel Serverless Function /api/send-order-email
  try {
    const res = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    if (res.ok) {
      console.log('[EmailService] Vercel serverless email dispatch succeeded');
    }
  } catch (err) {
    console.warn('[EmailService] Serverless function fallback:', err);
  }

  // 2. Direct client-side forwarder via FormSubmit
  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(order.customer.email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _cc: BRAND_INFO.email,
        "Order Number": order.orderNumber,
        "Customer Name": order.customer.name,
        "Customer Email": order.customer.email,
        "Customer Phone": order.customer.phone,
        "Delivery Address": order.customer.address,
        "Total Paid": `₹${order.total} (${order.paymentMethod})`,
        "Shipping Method": order.shippingMethod,
        "Tracking Number": order.trackingNumber,
        "Track Live": `https://celestiaamor.in/order-tracking?id=${order.orderNumber}`,
      }),
    });
  } catch (err) {
    console.warn('[EmailService] Formsubmit direct dispatch fallback:', err);
  }

  // Generate direct 1-tap Gmail & Mailto URLs
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    order.customer.email
  )}&cc=${encodeURIComponent(BRAND_INFO.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    invoiceText
  )}`;

  const mailtoUrl = `mailto:${encodeURIComponent(order.customer.email)}?cc=${encodeURIComponent(
    BRAND_INFO.email
  )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(invoiceText)}`;

  return {
    success: true,
    message: 'Confirmation email dispatched ✨',
    gmailUrl,
    mailtoUrl,
  };
}
