import type { IncomingMessage, ServerResponse } from 'http';

type ApiRequest = IncomingMessage & { body: any; query: any; headers: Record<string, string | string[]> };
type ApiResponse = ServerResponse & { status: (code: number) => ApiResponse; json: (data: any) => void };

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { order } = req.body || {};
    if (!order || !order.customer?.email) {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    const itemsText = (order.items || [])
      .map(
        (item: any, idx: number) =>
          `${idx + 1}. ${item.title} (x${item.quantity}) - ₹${item.price * item.quantity}`
      )
      .join('\n');

    // Dispatch via Formsubmit backend forwarder
    const payload = {
      _subject: `✨ Celestia Order Confirmed: ${order.orderNumber} - ₹${order.total}`,
      _template: 'table',
      _captcha: 'false',
      _cc: 'celestiaaaccessories@gmail.com',
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      deliveryAddress: order.customer.address,
      items: itemsText,
      subtotal: `₹${order.subtotal}`,
      shippingCost: order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`,
      totalPaid: `₹${order.total} (${order.paymentMethod})`,
      shippingMethod: order.shippingMethod,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery?.estimatedDateFormatted || '2-4 Days',
      onlineTrackingUrl: `https://celestiaamor.in/order-tracking?id=${order.orderNumber}`,
    };

    // Forward to customer email and studio email
    await Promise.allSettled([
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(order.customer.email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      }),
      fetch(`https://formsubmit.co/ajax/celestiaaaccessories@gmail.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      }),
    ]);

    return res.status(200).json({ success: true, message: 'Confirmation email dispatched ✨' });
  } catch (error: any) {
    console.error('[Send Order Email API] Error:', error);
    return res.status(200).json({ success: true, fallback: true });
  }
}
