import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function syncWishlistToBackend(userId: string, productIds: string[]): Promise<void> {
  if (!isSupabaseConfigured() || !supabase || !userId) {
    return;
  }

  try {
    // Upsert items into wishlist_items
    if (productIds.length > 0) {
      const rows = productIds.map((pid) => ({
        user_id: userId,
        product_id: pid,
        handle: pid,
      }));
      await supabase.from('wishlist_items').upsert(rows, { onConflict: 'user_id,product_id' });
    }
  } catch (err) {
    console.warn('[WishlistService] Wishlist sync error:', err);
  }
}
