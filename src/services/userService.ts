import { UserProfileData } from '../types/backend';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function syncUserProfile(profile: UserProfileData): Promise<void> {
  if (!isSupabaseConfigured() || !supabase || !profile.id) {
    return;
  }

  try {
    await supabase.from('profiles').upsert({
      id: profile.id,
      email: profile.email,
      full_name: profile.name,
      phone: profile.phone,
      tier: profile.tier,
      orders_count: profile.ordersCount,
      saved_addresses: profile.savedAddresses,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[UserService] Profile sync error:', err);
  }
}
