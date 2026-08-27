/**
 * CELESTIA LUXURY ATELIER — REAL-TIME CART INVENTORY LOCK SERVICE
 * 
 * Provides synchronized cross-patron cart reservation:
 * - When Customer A adds a piece to their bag, it is reserved in Supabase and locally.
 * - All other patrons across devices and tabs immediately see the piece as "Out of Stock".
 * - When Customer A removes the piece from their bag, the reservation is released
 *   and the piece instantly returns to "In Stock" for all other patrons.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://olifntjfwaywigwfovqb.supabase.co';
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_mP9c4_58vGZ1yyfNot5QlQ_xYhyrVfn';

const SESSION_KEY = 'celestia_patron_session_id';
const LOCAL_RESERVATIONS_KEY = 'celestia_active_cart_reservations';
const BROADCAST_CHANNEL_NAME = 'celestia_inventory_lock_v1';

const PRODUCT_ID_TO_SUPABASE: Record<string, string> = {
  'prod-real-bangles-01': 'pink-blue-bangles',
  'prod-real-hamper-02': 'desi-barbie-hamper',
  'prod-real-bangles-03': 'white-bangles',
  'prod-real-jewellery-04': 'red-emerald-set',
  'prod-real-rings-05': 'anti-tarnish-rings',
  'prod-real-polaroid-06': 'polaroids-20',
};

const SUPABASE_TO_FRONTEND: Record<string, string> = {
  'pink-blue-bangles': 'prod-real-bangles-01',
  'desi-barbie-hamper': 'prod-real-hamper-02',
  'white-bangles': 'prod-real-bangles-03',
  'red-emerald-set': 'prod-real-jewellery-04',
  'anti-tarnish-rings': 'prod-real-rings-05',
  'polaroids-20': 'prod-real-polaroid-06',
};

export function toSupabaseProductId(id: string): string {
  return PRODUCT_ID_TO_SUPABASE[id] || id;
}

export function toFrontendProductId(id: string): string {
  return SUPABASE_TO_FRONTEND[id] || id;
}

// Unique persistent Patron Session ID
export function getPatronSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = 'patron_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return 'patron_temp_' + Date.now();
  }
}

// In-memory cache for Supabase cart ID
let cachedCartId: string | null = null;

// Headers for Supabase REST API
function getSupabaseHeaders(representation = false): HeadersInit {
  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };
  if (representation) {
    headers['Prefer'] = 'return=representation';
  }
  return headers;
}

/**
 * Ensures a cart record exists in Supabase for the current patron session
 */
export async function ensureSupabaseCart(): Promise<string | null> {
  if (cachedCartId) return cachedCartId;
  const sessionId = getPatronSessionId();

  try {
    // 1. Check if cart already exists for this session
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/carts?session_id=eq.${sessionId}&select=id`,
      { headers: getSupabaseHeaders() }
    );

    if (checkRes.ok) {
      const carts = await checkRes.json();
      if (carts && carts.length > 0) {
        cachedCartId = carts[0].id;
        return cachedCartId;
      }
    }

    // 2. Create new cart
    const createRes = await fetch(`${SUPABASE_URL}/rest/v1/carts`, {
      method: 'POST',
      headers: getSupabaseHeaders(true),
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (createRes.ok) {
      const [newCart] = await createRes.json();
      if (newCart?.id) {
        cachedCartId = newCart.id;
        return cachedCartId;
      }
    }
  } catch (err) {
    console.warn('[InventoryLock] Supabase cart check error:', err);
  }

  return null;
}

// Broadcast channel for instant multi-tab notification
const broadcastChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel(BROADCAST_CHANNEL_NAME)
    : null;

function notifyLocalChange(type: 'UPDATE', productId?: string) {
  if (typeof window === 'undefined') return;
  try {
    const payload = { type, timestamp: Date.now(), productId, sessionId: getPatronSessionId() };
    broadcastChannel?.postMessage(payload);
    window.dispatchEvent(new CustomEvent('celestia-inventory-lock-change', { detail: payload }));
  } catch {}
}

/**
 * Reserves an item for the current patron in Supabase and broadcasts to all clients
 */
export async function reserveCartItem(
  productId: string,
  quantity = 1,
  unitPrice = 0
): Promise<void> {
  const sessionId = getPatronSessionId();
  const dbProductId = toSupabaseProductId(productId);

  // 1. Update local storage reservation index for instant 0ms feedback
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_RESERVATIONS_KEY) || '{}');
    local[sessionId] = local[sessionId] || {};
    local[sessionId][productId] = quantity;
    local[sessionId][dbProductId] = quantity;
    localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(local));
  } catch {}

  notifyLocalChange('UPDATE', productId);

  // 2. Persist to Supabase PostgreSQL database
  try {
    const cartId = await ensureSupabaseCart();
    if (cartId) {
      // Upsert: First remove any existing entry for this cart+product
      await fetch(
        `${SUPABASE_URL}/rest/v1/cart_items?cart_id=eq.${cartId}&product_id=eq.${dbProductId}`,
        { method: 'DELETE', headers: getSupabaseHeaders() }
      );

      // Insert new reserved item
      await fetch(`${SUPABASE_URL}/rest/v1/cart_items`, {
        method: 'POST',
        headers: getSupabaseHeaders(),
        body: JSON.stringify({
          cart_id: cartId,
          product_id: dbProductId,
          quantity,
          unit_price: unitPrice,
        }),
      });
    }
  } catch (err) {
    console.warn('[InventoryLock] Error syncing reservation to Supabase:', err);
  }
}

/**
 * Releases an item reservation when removed from cart
 */
export async function releaseCartItem(productId: string): Promise<void> {
  const sessionId = getPatronSessionId();
  const dbProductId = toSupabaseProductId(productId);

  // 1. Update local storage reservation index
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_RESERVATIONS_KEY) || '{}');
    if (local[sessionId]) {
      delete local[sessionId][productId];
      delete local[sessionId][dbProductId];
      localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(local));
    }
  } catch {}

  notifyLocalChange('UPDATE', productId);

  // 2. Delete from Supabase PostgreSQL database
  try {
    const cartId = await ensureSupabaseCart();
    if (cartId) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/cart_items?cart_id=eq.${cartId}&product_id=eq.${dbProductId}`,
        { method: 'DELETE', headers: getSupabaseHeaders() }
      );
    }
  } catch (err) {
    console.warn('[InventoryLock] Error releasing item in Supabase:', err);
  }
}

/**
 * Clears all reservations held by the current patron
 */
export async function clearAllPatronReservations(): Promise<void> {
  const sessionId = getPatronSessionId();

  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_RESERVATIONS_KEY) || '{}');
    delete local[sessionId];
    localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(local));
  } catch {}

  notifyLocalChange('UPDATE');

  try {
    const cartId = await ensureSupabaseCart();
    if (cartId) {
      await fetch(`${SUPABASE_URL}/rest/v1/cart_items?cart_id=eq.${cartId}`, {
        method: 'DELETE',
        headers: getSupabaseHeaders(),
      });
    }
  } catch (err) {
    console.warn('[InventoryLock] Error clearing reservations in Supabase:', err);
  }
}

/**
 * Synchronizes the patron's entire active bag to Supabase
 */
export async function syncEntireCart(
  items: { productId: string; quantity: number; unitPrice: number }[]
): Promise<void> {
  const sessionId = getPatronSessionId();

  // Update local index
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_RESERVATIONS_KEY) || '{}');
    local[sessionId] = {};
    for (const item of items) {
      const dbId = toSupabaseProductId(item.productId);
      local[sessionId][item.productId] = item.quantity;
      local[sessionId][dbId] = item.quantity;
    }
    localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(local));
  } catch {}

  notifyLocalChange('UPDATE');

  // Sync to Supabase
  try {
    const cartId = await ensureSupabaseCart();
    if (cartId) {
      // Clear old items
      await fetch(`${SUPABASE_URL}/rest/v1/cart_items?cart_id=eq.${cartId}`, {
        method: 'DELETE',
        headers: getSupabaseHeaders(),
      });

      // Insert current items
      if (items.length > 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/cart_items`, {
          method: 'POST',
          headers: getSupabaseHeaders(),
          body: JSON.stringify(
            items.map((i) => ({
              cart_id: cartId,
              product_id: toSupabaseProductId(i.productId),
              quantity: i.quantity,
              unit_price: i.unitPrice,
            }))
          ),
        });
      }
    }
  } catch (err) {
    console.warn('[InventoryLock] Error syncing full cart to Supabase:', err);
  }
}

/**
 * Queries all active reservations held by OTHER patrons
 * Returns a map of: { [productId: string]: totalQuantityReservedByOthers }
 */
export async function fetchReservedByOthers(): Promise<Record<string, number>> {
  const mySessionId = getPatronSessionId();
  const reservedMap: Record<string, number> = {};

  // 1. Read from Supabase PostgreSQL database
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cart_items?select=product_id,quantity,carts!inner(session_id)`,
      { headers: getSupabaseHeaders() }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const item of data) {
          const session = item.carts?.session_id;
          if (session && session !== mySessionId) {
            const dbId = item.product_id;
            const frontId = toFrontendProductId(dbId);
            const qty = item.quantity || 1;
            reservedMap[dbId] = (reservedMap[dbId] || 0) + qty;
            reservedMap[frontId] = (reservedMap[frontId] || 0) + qty;
          }
        }
      }
    }
  } catch (err) {
    console.warn('[InventoryLock] Supabase fetch error, fallback to local:', err);
  }

  // 2. Also merge any local cross-tab reservations (if browser tabs are running concurrently)
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_RESERVATIONS_KEY) || '{}');
    for (const [session, products] of Object.entries(local)) {
      if (session !== mySessionId && typeof products === 'object' && products !== null) {
        for (const [prodId, qty] of Object.entries(products as Record<string, number>)) {
          const dbId = toSupabaseProductId(prodId);
          const frontId = toFrontendProductId(prodId);
          reservedMap[prodId] = Math.max(reservedMap[prodId] || 0, qty);
          reservedMap[dbId] = Math.max(reservedMap[dbId] || 0, qty);
          reservedMap[frontId] = Math.max(reservedMap[frontId] || 0, qty);
        }
      }
    }
  } catch {}

  return reservedMap;
}

/**
 * Subscribes to real-time inventory updates across patrons
 */
export function subscribeToInventoryUpdates(
  callback: (reserved: Record<string, number>) => void
): () => void {
  let isMounted = true;

  const triggerUpdate = async () => {
    if (!isMounted) return;
    const reserved = await fetchReservedByOthers();
    if (isMounted) {
      callback(reserved);
    }
  };

  // Immediate initial load
  triggerUpdate();

  // Listen to BroadcastChannel for 0ms cross-tab updates
  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'UPDATE') {
      triggerUpdate();
    }
  };
  broadcastChannel?.addEventListener('message', handleBroadcast);

  // Listen to local CustomEvent
  const handleCustomEvent = () => {
    triggerUpdate();
  };
  window.addEventListener('celestia-inventory-lock-change', handleCustomEvent);

  // Periodic polling fallback (every 3.5 seconds) for cross-device/cross-browser real-time sync
  const intervalId = setInterval(triggerUpdate, 3500);

  // Window focus listener for instant freshness when switching apps
  window.addEventListener('focus', triggerUpdate);

  return () => {
    isMounted = false;
    broadcastChannel?.removeEventListener('message', handleBroadcast);
    window.removeEventListener('celestia-inventory-lock-change', handleCustomEvent);
    window.removeEventListener('focus', triggerUpdate);
    clearInterval(intervalId);
  };
}
