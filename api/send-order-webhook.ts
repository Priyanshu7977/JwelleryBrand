import type { IncomingMessage, ServerResponse } from 'http';

type ApiRequest = IncomingMessage & { body: any; query: any; headers: Record<string, string | string[]> };
type ApiResponse = ServerResponse & { status: (code: number) => ApiResponse; json: (data: any) => void };

/**
 * Universal Order & Email Webhook Dispatcher for Celestia Atelier
 * (Forwards order events to Make.com, Zapier, n8n, Discord, Telegram, or custom webhook endpoints)
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { order, eventType = 'order_created', emailHtml, emailText, subject } = req.body || {};

    if (!order || !order.orderNumber) {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    const cleanPhone = (order.customer?.phone || '').replace(/\D/g, '');
    const whatsappRecipient = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone.length === 12 && cleanPhone.startsWith('91') ? cleanPhone : '917718825792';

    const webhookPayload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      order_id: order.orderNumber,
      customer: {
        name: order.customer?.name || 'Valued Patron',
        email: order.customer?.email || '',
        phone: order.customer?.phone || '',
        whatsapp: whatsappRecipient,
        address: order.customer?.address || '',
      },
      payment: {
        method: order.paymentMethod || 'UPI',
        status: (order.financialStatus || 'paid').toUpperCase(),
        total_inr: order.total || 0,
        subtotal_inr: order.subtotal || 0,
        shipping_inr: order.shippingCost || 0,
      },
      fulfillment: {
        status: order.fulfillmentStatus || 'confirmed',
        carrier: order.carrier || 'Delhivery Air Express',
        tracking_awb: order.trackingNumber || 'MUM-EXP-LIVE',
        estimated_delivery: order.estimatedDelivery?.estimatedDateFormatted || '2-3 Business Days',
      },
      items: (order.items || []).map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        image_url: item.imageUrl || '',
        packaging: item.selectedPersonalisation?.boxType || '',
        note: item.selectedPersonalisation?.customNote || '',
      })),
      urls: {
        view_order: `https://jwellery-brand.vercel.app/orders/${order.orderNumber}`,
        track_order: `https://jwellery-brand.vercel.app/order-tracking?id=${order.orderNumber}`,
      },
      email: {
        to: order.customer?.email || '',
        subject: subject || `CELESTIA • Order #${order.orderNumber} Confirmed`,
        text: emailText || '',
        html: emailHtml || '',
      },
      whatsapp: {
        recipient_phone: whatsappRecipient,
        message: `*CELESTIA ATELIER • ORDER CONFIRMATION* ✨\n\nDear ${order.customer?.name || 'Patron'},\n\nThank you for choosing CELESTIA. Your order #${order.orderNumber} for ₹${order.total} has been confirmed.\n\n📦 Live Tracking: https://jwellery-brand.vercel.app/order-tracking?id=${order.orderNumber}\n\nWarm regards,\nCELESTIA Atelier Mumbai 💎`,
      },
    };

    const webhookUrls = [
      process.env.EMAIL_WEBHOOK_URL,
      process.env.ORDER_WEBHOOK_URL,
      process.env.ZAPIER_WEBHOOK_URL,
      process.env.MAKE_WEBHOOK_URL,
      process.env.N8N_WEBHOOK_URL,
    ].filter(Boolean) as string[];

    const dispatchResults: Array<{ url: string; status: number; success: boolean }> = [];

    // Dispatch to all configured external webhooks in parallel
    if (webhookUrls.length > 0) {
      await Promise.allSettled(
        webhookUrls.map(async (url) => {
          try {
            const resp = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Celestia-Atelier-Webhook/1.0',
              },
              body: JSON.stringify(webhookPayload),
            });
            dispatchResults.push({ url, status: resp.status, success: resp.ok });
          } catch (err: any) {
            console.warn(`[OrderWebhook] Dispatch to ${url} failed:`, err.message);
            dispatchResults.push({ url, status: 500, success: false });
          }
        })
      );
    }

    console.log(`[OrderWebhook] Successfully processed order #${order.orderNumber} (Dispatched to ${dispatchResults.length} external webhooks)`);

    return res.status(200).json({
      success: true,
      orderNumber: order.orderNumber,
      webhookDispatches: dispatchResults,
      payload: webhookPayload,
      message: 'Order & email webhook dispatched successfully ✨',
    });
  } catch (error: any) {
    console.error('[OrderWebhook API] Error:', error);
    return res.status(500).json({ error: error.message || 'Internal webhook error' });
  }
}
