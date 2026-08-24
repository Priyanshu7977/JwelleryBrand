import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

type ApiRequest = IncomingMessage & { body: any; query: any; headers: Record<string, string | string[]> };
type ApiResponse = ServerResponse & { status: (code: number) => ApiResponse; json: (data: any) => void };

// Environment variables
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) 
  : null;

/**
 * Validates Shopify HMAC SHA256 Webhook Signature
 */
function verifyShopifyWebhook(rawBody: string, hmacHeader: string): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET) {
    // If webhook secret not configured yet, allow development bypass
    return true;
  }
  if (!hmacHeader) return false;

  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(generatedHash, 'utf8'),
    Buffer.from(hmacHeader, 'utf8')
  );
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const topic = (req.headers['x-shopify-topic'] as string) || '';
  const shopDomain = (req.headers['x-shopify-shop-domain'] as string) || '';
  const hmac = (req.headers['x-shopify-hmac-sha256'] as string) || '';
  const webhookId = (req.headers['x-shopify-webhook-id'] as string) || `wh-${Date.now()}`;

  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  // 1. Verify HMAC Signature
  if (!verifyShopifyWebhook(rawBody, hmac)) {
    console.warn('[Shopify Webhook] Invalid HMAC signature rejected');
    return res.status(401).json({ error: 'Unauthorized webhook signature' });
  }

  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  console.log(`[Shopify Webhook] Received topic: ${topic} from ${shopDomain}`);

  if (!supabase) {
    console.log('[Shopify Webhook] Supabase not connected; webhook received successfully');
    return res.status(200).json({ status: 'success', message: 'Webhook received (supabase offline)' });
  }

  try {
    // 2. Deduplication check
    const { data: existingWh } = await supabase
      .from('processed_webhooks')
      .select('webhook_id')
      .eq('webhook_id', webhookId)
      .maybeSingle();

    if (existingWh) {
      console.log(`[Shopify Webhook] Duplicate webhook ${webhookId} already processed`);
      return res.status(200).json({ status: 'duplicate', message: 'Webhook already processed' });
    }

    // 3. Process Webhook Event by Topic
    switch (topic) {
      case 'orders/create': {
        const orderNumber = `ORD-2026-${payload.order_number || Math.floor(1000 + Math.random() * 9000)}`;
        const customer = payload.customer || {};
        const shippingAddress = payload.shipping_address || {};

        const { data: createdOrder } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            shopify_order_id: String(payload.id),
            customer_email: payload.email || customer.email || 'guest@celestia.in',
            customer_name: `${shippingAddress.first_name || customer.first_name || 'Valued'} ${shippingAddress.last_name || customer.last_name || 'Patron'}`.trim(),
            customer_phone: shippingAddress.phone || customer.phone || '',
            shipping_address: {
              street: shippingAddress.address1 || 'Mumbai Atelier Delivery',
              city: shippingAddress.city || 'Mumbai',
              state: shippingAddress.province || 'Maharashtra',
              pincode: shippingAddress.zip || '400050',
              country: shippingAddress.country || 'India',
            },
            shipping_method: payload.shipping_lines?.[0]?.title || 'Pan-India Free Express Air Delivery',
            payment_method: payload.gateway?.toUpperCase() || 'SHOPIFY_PAY',
            subtotal: parseFloat(payload.subtotal_price || '0'),
            shipping_cost: parseFloat(payload.total_shipping_price_set?.shop_money?.amount || '0'),
            tax: parseFloat(payload.total_tax || '0'),
            total: parseFloat(payload.total_price || '0'),
            currency: payload.currency || 'INR',
            financial_status: payload.financial_status === 'paid' ? 'paid' : 'pending',
            fulfillment_status: 'confirmed',
          })
          .select('id')
          .single();

        // Insert order line items
        if (createdOrder?.id && Array.isArray(payload.line_items)) {
          const itemsToInsert = payload.line_items.map((item: any) => ({
            order_id: createdOrder.id,
            product_id: String(item.product_id || item.variant_id || `prod-${Date.now()}`),
            shopify_variant_id: String(item.variant_id || ''),
            title: item.title || item.name || 'Celestia Fine Piece',
            handle: (item.title || 'piece').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            image_url: item.image_url || '',
            price: parseFloat(item.price || '0'),
            quantity: item.quantity || 1,
            custom_notes: item.properties?.find((p: any) => p.name === 'Note')?.value || '',
          }));

          await supabase.from('order_items').insert(itemsToInsert);
        }
        break;
      }

      case 'orders/paid': {
        const shopifyOrderId = String(payload.id);
        await supabase
          .from('orders')
          .update({ financial_status: 'paid', updated_at: new Date().toISOString() })
          .eq('shopify_order_id', shopifyOrderId);
        break;
      }

      case 'orders/fulfilled':
      case 'fulfillments/create':
      case 'fulfillments/update': {
        const shopifyOrderId = String(payload.order_id || payload.id);
        const trackingNumber = payload.tracking_number || payload.tracking_numbers?.[0] || `MUM-EXP-${Math.floor(1000 + Math.random() * 9000)}`;
        const carrier = payload.tracking_company || 'Mumbai Atelier Express';

        await supabase
          .from('orders')
          .update({ fulfillment_status: 'shipped', updated_at: new Date().toISOString() })
          .eq('shopify_order_id', shopifyOrderId);

        // Update tracking table
        const { data: matchingOrder } = await supabase
          .from('orders')
          .select('id, order_number, shipping_address')
          .eq('shopify_order_id', shopifyOrderId)
          .maybeSingle();

        if (matchingOrder) {
          await supabase.from('delivery_tracking').upsert({
            order_id: matchingOrder.id,
            tracking_number: trackingNumber,
            carrier: carrier,
            current_status: 'shipped',
            destination_city: (matchingOrder.shipping_address as any)?.city || 'Mumbai',
            estimated_delivery_start: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
            estimated_delivery_end: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'orders/cancelled': {
        const shopifyOrderId = String(payload.id);
        await supabase
          .from('orders')
          .update({
            fulfillment_status: 'cancelled',
            financial_status: payload.financial_status === 'refunded' ? 'refunded' : 'pending',
            updated_at: new Date().toISOString(),
          })
          .eq('shopify_order_id', shopifyOrderId);
        break;
      }

      default:
        console.log(`[Shopify Webhook] Unhandled topic: ${topic}`);
    }

    // 4. Mark webhook as processed for idempotency
    await supabase.from('processed_webhooks').insert({
      webhook_id: webhookId,
      topic: topic,
      shop_domain: shopDomain,
    });

    return res.status(200).json({ status: 'success', topic, webhookId });
  } catch (error: any) {
    console.error('[Shopify Webhook] Error processing event:', error);
    return res.status(500).json({ error: 'Webhook processing failed', details: error.message });
  }
}
