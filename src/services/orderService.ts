import { OrderMetadata, OrderItem, DeliveryStage } from '../types/backend';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  calculateDeliveryEstimate,
  generateTimelineEvents,
  saveDeliveryTracking,
} from './trackingService';
import { sendOrderConfirmationEmail } from './emailService';

const ORDERS_STORAGE_KEY = 'celestia_user_orders';

// Empty default list - orders are fetched directly from production backend database
const INITIAL_DEMO_ORDERS: OrderMetadata[] = [];

/**
 * Creates a brand new order and persists it to Supabase + Local Storage
 */
export async function createOrder(payload: {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax?: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  userId?: string;
  shopifyOrderId?: string;
  shopifyCheckoutId?: string;
}): Promise<OrderMetadata> {
  const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const isSameDay = payload.shippingMethod.toLowerCase().includes('same-day') || payload.shippingMethod.toLowerCase().includes('mumbai');
  const carrier = isSameDay ? 'Mumbai Atelier Express' : 'Delhivery Air Cargo';
  const trackingNumber = isSameDay
    ? `MUM-LIVE-${Math.floor(1000 + Math.random() * 9000)}`
    : `DLV-AIR-${Math.floor(100000 + Math.random() * 900000)}`;

  const now = new Date();
  const estimatedDelivery = calculateDeliveryEstimate(payload.shippingMethod, now);

  const city = payload.customer.address.split(',')[1]?.trim() || (isSameDay ? 'Mumbai' : 'India');

  const newOrder: OrderMetadata = {
    id: `ord-${Date.now()}`,
    orderNumber,
    shopifyOrderId: payload.shopifyOrderId,
    shopifyCheckoutId: payload.shopifyCheckoutId,
    userId: payload.userId,
    customer: payload.customer,
    items: payload.items,
    subtotal: payload.subtotal,
    shippingCost: payload.shippingCost,
    tax: payload.tax || 0,
    total: payload.total,
    shippingMethod: payload.shippingMethod,
    paymentMethod: payload.paymentMethod,
    financialStatus: 'paid',
    fulfillmentStatus: 'confirmed',
    trackingNumber,
    carrier,
    estimatedDelivery,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  // Generate and save initial tracking record
  const timeline = generateTimelineEvents('confirmed', now, city);
  await saveDeliveryTracking({
    orderId: orderNumber,
    trackingNumber,
    carrier,
    currentStatus: 'confirmed',
    estimatedDelivery,
    destinationCity: city,
    timeline,
    lastUpdated: now.toISOString(),
  });

  // Save to Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: insertedOrder } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          shopify_order_id: payload.shopifyOrderId,
          shopify_checkout_id: payload.shopifyCheckoutId,
          user_id: payload.userId,
          customer_email: payload.customer.email,
          customer_name: payload.customer.name,
          customer_phone: payload.customer.phone,
          shipping_address: { full_address: payload.customer.address },
          shipping_method: payload.shippingMethod,
          payment_method: payload.paymentMethod,
          subtotal: payload.subtotal,
          shipping_cost: payload.shippingCost,
          tax: payload.tax || 0,
          total: payload.total,
          financial_status: 'paid',
          fulfillment_status: 'confirmed',
        })
        .select('id')
        .single();

      if (insertedOrder && payload.items.length > 0) {
        const itemRows = payload.items.map((item) => ({
          order_id: insertedOrder.id,
          product_id: item.productId,
          title: item.title,
          handle: item.handle,
          image_url: item.imageUrl,
          price: item.price,
          quantity: item.quantity,
          box_type: item.boxType,
          custom_notes: item.customNotes,
        }));
        await supabase.from('order_items').insert(itemRows);
      }
    } catch (err) {
      console.warn('[OrderService] Supabase insert failed, relying on local adapter:', err);
    }
  }

    // Synchronize to Production Backend API
    try {
      const token = (typeof window !== 'undefined') ? (sessionStorage.getItem('celestia_auth_token') || localStorage.getItem('celestia_auth_token')) : null;
      const apiRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `idemp_${orderNumber}`,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customerName: payload.customer.name,
          customerEmail: payload.customer.email,
          customerPhone: payload.customer.phone,
          shippingAddress: {
            name: payload.customer.name,
            street: payload.customer.address,
            city,
            state: 'Maharashtra',
            pincode: '400050',
            country: 'India',
          },
          items: payload.items,
          shippingMethod: payload.shippingMethod,
          paymentMethod: payload.paymentMethod,
          userId: payload.userId,
        }),
      });

      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (apiData.data?.orderNumber) {
          newOrder.orderNumber = apiData.data.orderNumber;
          newOrder.id = apiData.data.id;
          newOrder.trackingNumber = apiData.data.trackingNumber;
        }
      }
    } catch {}

    // Save to Local Storage Registry for offline resilience
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      const existing: OrderMetadata[] = raw ? JSON.parse(raw) : INITIAL_DEMO_ORDERS;
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([newOrder, ...existing]));
    } catch {}

  // Automatically dispatch confirmation email in background
  sendOrderConfirmationEmail(newOrder).catch((e) => console.warn('Email dispatch failed:', e));

  return newOrder;
}

/**
 * Retrieves an order by its ID or order number
 */
export async function getOrderById(orderIdOrNumber: string): Promise<OrderMetadata | null> {
  const cleanId = orderIdOrNumber.trim().toUpperCase();

  // Check Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .or(`order_number.ilike.%${cleanId}%,id.eq.${cleanId}`)
        .maybeSingle();

      if (orderData && !error) {
        const estDelivery = calculateDeliveryEstimate(orderData.shipping_method, new Date(orderData.created_at));
        return {
          id: orderData.id,
          orderNumber: orderData.order_number,
          shopifyOrderId: orderData.shopify_order_id,
          shopifyCheckoutId: orderData.shopify_checkout_id,
          userId: orderData.user_id,
          customer: {
            name: orderData.customer_name,
            email: orderData.customer_email,
            phone: orderData.customer_phone || '',
            address: orderData.shipping_address?.full_address || 'Mumbai Atelier Delivery',
          },
          items: (orderData.order_items || []).map((item: any) => ({
            productId: item.product_id,
            title: item.title,
            handle: item.handle,
            imageUrl: item.image_url,
            price: Number(item.price),
            quantity: item.quantity,
            boxType: item.box_type,
            customNotes: item.custom_notes,
          })),
          subtotal: Number(orderData.subtotal),
          shippingCost: Number(orderData.shipping_cost),
          tax: Number(orderData.tax),
          total: Number(orderData.total),
          shippingMethod: orderData.shipping_method,
          paymentMethod: orderData.payment_method,
          financialStatus: orderData.financial_status,
          fulfillmentStatus: orderData.fulfillment_status as DeliveryStage,
          trackingNumber: `MUM-${orderData.order_number.replace('ORD-', '')}`,
          carrier: orderData.shipping_method.includes('Same-Day') ? 'Mumbai Atelier Express' : 'Delhivery Air Cargo',
          estimatedDelivery: estDelivery,
          createdAt: orderData.created_at,
          updatedAt: orderData.updated_at,
        };
      }
    } catch (err) {
      console.warn('[OrderService] Supabase getOrder error:', err);
    }
  }

  // Fetch from Production Backend API
  try {
    const token = (typeof window !== 'undefined') ? (sessionStorage.getItem('celestia_auth_token') || localStorage.getItem('celestia_auth_token')) : null;
    const apiRes = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (apiRes.ok) {
      const { data } = await apiRes.json();
      if (data) {
        return {
          id: data.id,
          orderNumber: data.orderNumber,
          customer: {
            name: data.customerName,
            email: data.customerEmail,
            phone: data.customerPhone || '',
            address: `${data.shippingAddress?.street || ''}, ${data.shippingAddress?.city || ''}`,
          },
          items: data.items,
          subtotal: Number(data.subtotal),
          shippingCost: Number(data.shippingCost),
          tax: Number(data.tax),
          total: Number(data.total),
          shippingMethod: data.carrier || 'Mumbai Atelier Express',
          paymentMethod: data.paymentMethod,
          financialStatus: data.financialStatus,
          fulfillmentStatus: data.fulfillmentStatus as DeliveryStage,
          trackingNumber: data.trackingNumber,
          carrier: data.carrier,
          estimatedDelivery: calculateDeliveryEstimate(data.carrier, new Date(data.createdAt)),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      }
    }
  } catch {}

  // Fallback to local orders
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    const list: OrderMetadata[] = raw ? JSON.parse(raw) : INITIAL_DEMO_ORDERS;
    const match = list.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanId ||
        o.id.toUpperCase() === cleanId ||
        o.orderNumber.toUpperCase().includes(cleanId)
    );
    if (match) return match;
  } catch {}

  // Check demo seed orders
  return INITIAL_DEMO_ORDERS.find((o) => o.orderNumber.toUpperCase() === cleanId) || null;
}

/**
 * Returns all orders associated with a user
 */
export async function getUserOrders(userEmail?: string): Promise<OrderMetadata[]> {
  const cleanEmail = userEmail?.trim().toLowerCase();

  // Query Production Backend API for authenticated user orders
  try {
    const token = (typeof window !== 'undefined') ? (sessionStorage.getItem('celestia_auth_token') || localStorage.getItem('celestia_auth_token')) : null;
    if (token) {
      const apiRes = await fetch('/api/orders/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (apiRes.ok) {
        const { data } = await apiRes.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            orderNumber: d.orderNumber,
            customer: {
              name: d.customerName,
              email: d.customerEmail,
              phone: d.customerPhone || '',
              address: `${d.shippingAddress?.street || ''}, ${d.shippingAddress?.city || ''}`,
            },
            items: d.items,
            subtotal: Number(d.subtotal),
            shippingCost: Number(d.shippingCost),
            tax: Number(d.tax),
            total: Number(d.total),
            shippingMethod: d.carrier || 'Mumbai Atelier Express',
            paymentMethod: d.paymentMethod,
            financialStatus: d.financialStatus,
            fulfillmentStatus: d.fulfillmentStatus as DeliveryStage,
            trackingNumber: d.trackingNumber,
            carrier: d.carrier,
            estimatedDelivery: calculateDeliveryEstimate(d.carrier, new Date(d.createdAt)),
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
          }));
        }
      }
    }
  } catch {}

  // If Supabase configured, query for user
  if (isSupabaseConfigured() && supabase && cleanEmail) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('customer_email', cleanEmail)
        .order('created_at', { ascending: false });

      if (data && !error && data.length > 0) {
        return data.map((orderData: any) => {
          const estDelivery = calculateDeliveryEstimate(orderData.shipping_method, new Date(orderData.created_at));
          return {
            id: orderData.id,
            orderNumber: orderData.order_number,
            customer: {
              name: orderData.customer_name,
              email: orderData.customer_email,
              phone: orderData.customer_phone || '',
              address: orderData.shipping_address?.full_address || '',
            },
            items: (orderData.order_items || []).map((item: any) => ({
              productId: item.product_id,
              title: item.title,
              handle: item.handle,
              imageUrl: item.image_url,
              price: Number(item.price),
              quantity: item.quantity,
              boxType: item.box_type,
              customNotes: item.custom_notes,
            })),
            subtotal: Number(orderData.subtotal),
            shippingCost: Number(orderData.shipping_cost),
            tax: Number(orderData.tax),
            total: Number(orderData.total),
            shippingMethod: orderData.shipping_method,
            paymentMethod: orderData.payment_method,
            financialStatus: orderData.financial_status,
            fulfillmentStatus: orderData.fulfillment_status as DeliveryStage,
            trackingNumber: `MUM-${orderData.order_number.replace('ORD-', '')}`,
            carrier: orderData.shipping_method.includes('Same-Day') ? 'Mumbai Atelier Express' : 'Delhivery Air Cargo',
            estimatedDelivery: estDelivery,
            createdAt: orderData.created_at,
            updatedAt: orderData.updated_at,
          };
        });
      }
    } catch (err) {
      console.warn('[OrderService] Supabase getUserOrders error:', err);
    }
  }

  // Fallback to local storage list
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed: OrderMetadata[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  return INITIAL_DEMO_ORDERS;
}
