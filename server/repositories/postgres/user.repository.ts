import { IUserRepository, CreateUserDTO } from '../interfaces/user.repository.interface';
import { UserEntity, UserAddress, UserRole, UserTier } from '../../types/index';
import { isDbConnected, query } from '../../db/pool';
import crypto from 'crypto';

// In-memory resilient store for local offline testing & fast execution
const inMemoryUsers = new Map<string, UserEntity>();
const inMemoryAddresses = new Map<string, UserAddress[]>();
const inMemoryWishlists = new Map<string, Set<string>>();

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const cleanEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      try {
        const res = await query<UserEntity>(
          'SELECT id, email, password_hash as "passwordHash", name, phone, role, tier, orders_count as "ordersCount", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE LOWER(email) = $1',
          [cleanEmail]
        );
        return res.rows[0] || null;
      } catch {}
    }

    for (const u of inMemoryUsers.values()) {
      if (u.email.toLowerCase() === cleanEmail) {
        return { ...u };
      }
    }
    return null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    if (isDbConnected()) {
      try {
        const res = await query<UserEntity>(
          'SELECT id, email, password_hash as "passwordHash", name, phone, role, tier, orders_count as "ordersCount", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = $1',
          [id]
        );
        return res.rows[0] || null;
      } catch {}
    }

    const u = inMemoryUsers.get(id);
    return u ? { ...u } : null;
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const cleanEmail = data.email.trim().toLowerCase();
    const role: UserRole = data.role || 'customer';
    const tier: UserTier = data.tier || 'Circle Member';

    const user: UserEntity = {
      id,
      email: cleanEmail,
      passwordHash: data.passwordHash,
      name: data.name.trim(),
      phone: data.phone?.trim() || '',
      role,
      tier,
      ordersCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (isDbConnected()) {
      try {
        await query(
          'INSERT INTO users (id, email, password_hash, name, phone, role, tier, orders_count, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          [id, cleanEmail, data.passwordHash, user.name, user.phone, role, tier, 0, now, now]
        );
      } catch {}
    }

    inMemoryUsers.set(id, user);
    return { ...user };
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: UserEntity = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (isDbConnected()) {
      try {
        await query(
          'UPDATE users SET name = $1, phone = $2, tier = $3, updated_at = $4 WHERE id = $5',
          [updated.name, updated.phone, updated.tier, updated.updatedAt, id]
        );
      } catch {}
    }

    inMemoryUsers.set(id, updated);
    return { ...updated };
  }

  async incrementOrdersCount(id: string): Promise<void> {
    if (isDbConnected()) {
      try {
        await query('UPDATE users SET orders_count = orders_count + 1 WHERE id = $1', [id]);
      } catch {}
    }
    const u = inMemoryUsers.get(id);
    if (u) {
      u.ordersCount += 1;
      inMemoryUsers.set(id, u);
    }
  }

  async getAddresses(userId: string): Promise<UserAddress[]> {
    if (isDbConnected()) {
      try {
        const res = await query<UserAddress>(
          'SELECT id, user_id as "userId", label, street, city, state, pincode, country, is_default as "isDefault", created_at as "createdAt" FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
          [userId]
        );
        return res.rows;
      } catch {}
    }
    return inMemoryAddresses.get(userId) || [];
  }

  async addAddress(userId: string, address: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>): Promise<UserAddress> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newAddr: UserAddress = {
      id,
      userId,
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || 'India',
      isDefault: Boolean(address.isDefault),
      createdAt: now,
    };

    if (isDbConnected()) {
      try {
        if (newAddr.isDefault) {
          await query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }
        await query(
          'INSERT INTO addresses (id, user_id, label, street, city, state, pincode, country, is_default, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          [id, userId, newAddr.label, newAddr.street, newAddr.city, newAddr.state, newAddr.pincode, newAddr.country, newAddr.isDefault, now]
        );
      } catch {}
    }

    const list = inMemoryAddresses.get(userId) || [];
    if (newAddr.isDefault) {
      list.forEach((a) => (a.isDefault = false));
    }
    list.push(newAddr);
    inMemoryAddresses.set(userId, list);

    return newAddr;
  }

  async deleteAddress(userId: string, addressId: string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        const res = await query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [addressId, userId]);
        return (res.rowCount || 0) > 0;
      } catch {}
    }
    const list = inMemoryAddresses.get(userId) || [];
    const filtered = list.filter((a) => a.id !== addressId);
    inMemoryAddresses.set(userId, filtered);
    return filtered.length !== list.length;
  }

  async getWishlist(userId: string): Promise<string[]> {
    if (isDbConnected()) {
      try {
        const res = await query<{ product_id: string }>(
          'SELECT product_id FROM wishlists WHERE user_id = $1',
          [userId]
        );
        return res.rows.map((r) => r.product_id);
      } catch {}
    }
    const set = inMemoryWishlists.get(userId) || new Set<string>();
    return Array.from(set);
  }

  async toggleWishlist(userId: string, productId: string): Promise<{ productIds: string[]; added: boolean }> {
    const set = inMemoryWishlists.get(userId) || new Set<string>();
    let added = false;

    if (set.has(productId)) {
      set.delete(productId);
      if (isDbConnected()) {
        try {
          await query('DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2', [userId, productId]);
        } catch {}
      }
    } else {
      set.add(productId);
      added = true;
      if (isDbConnected()) {
        try {
          await query('INSERT INTO wishlists (id, user_id, product_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [
            crypto.randomUUID(),
            userId,
            productId,
          ]);
        } catch {}
      }
    }

    inMemoryWishlists.set(userId, set);
    return { productIds: Array.from(set), added };
  }
}

export const userRepository = new UserRepository();
