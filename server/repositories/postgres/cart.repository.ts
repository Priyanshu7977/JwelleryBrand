import { ICartRepository, AddCartItemDTO } from '../interfaces/cart.repository.interface';
import { CartEntity, CartItemEntity } from '../../types/index';
import crypto from 'crypto';

const FREE_SHIPPING_THRESHOLD = 999;

const cartsStore = new Map<string, CartEntity>();

function calculateCartTotals(cart: CartEntity): CartEntity {
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const eligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  cart.subtotal = subtotal;
  cart.freeShippingThreshold = FREE_SHIPPING_THRESHOLD;
  cart.eligibleForFreeShipping = eligibleForFreeShipping;
  cart.remainingForFreeShipping = remainingForFreeShipping;
  cart.updatedAt = new Date().toISOString();

  return cart;
}

export class CartRepository implements ICartRepository {
  async getOrCreateCart(sessionId: string, userId?: string): Promise<CartEntity> {
    let cart = cartsStore.get(sessionId);

    if (!cart) {
      cart = {
        id: crypto.randomUUID(),
        userId,
        sessionId,
        items: [],
        subtotal: 0,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        eligibleForFreeShipping: false,
        remainingForFreeShipping: FREE_SHIPPING_THRESHOLD,
        updatedAt: new Date().toISOString(),
      };
      cartsStore.set(sessionId, cart);
    } else if (userId && !cart.userId) {
      cart.userId = userId;
    }

    return calculateCartTotals(cart);
  }

  async addItem(cartId: string, item: AddCartItemDTO): Promise<CartEntity> {
    let cart: CartEntity | undefined;
    for (const c of cartsStore.values()) {
      if (c.id === cartId) {
        cart = c;
        break;
      }
    }

    if (!cart) {
      throw new Error(`Cart not found: ${cartId}`);
    }

    // Check if duplicate item exists (same product, variant, boxType, note, polaroid)
    const existingIndex = cart.items.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.variantId === item.variantId &&
        i.boxType === item.boxType &&
        i.customNote === item.customNote &&
        i.polaroidUrl === item.polaroidUrl
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += item.quantity;
      cart.items[existingIndex].lineTotal = cart.items[existingIndex].quantity * cart.items[existingIndex].unitPrice;
    } else {
      const newItem: CartItemEntity = {
        id: crypto.randomUUID(),
        cartId,
        productId: item.productId,
        variantId: item.variantId,
        title: item.title,
        handle: item.handle,
        imageUrl: item.imageUrl,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        boxType: item.boxType,
        customNote: item.customNote,
        polaroidUrl: item.polaroidUrl,
        lineTotal: item.unitPrice * item.quantity,
      };
      cart.items.push(newItem);
    }

    return calculateCartTotals(cart);
  }

  async updateItemQuantity(cartId: string, itemId: string, quantity: number): Promise<CartEntity> {
    let cart: CartEntity | undefined;
    for (const c of cartsStore.values()) {
      if (c.id === cartId) {
        cart = c;
        break;
      }
    }

    if (!cart) throw new Error(`Cart not found: ${cartId}`);

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      const item = cart.items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        item.lineTotal = item.unitPrice * quantity;
      }
    }

    return calculateCartTotals(cart);
  }

  async removeItem(cartId: string, itemId: string): Promise<CartEntity> {
    let cart: CartEntity | undefined;
    for (const c of cartsStore.values()) {
      if (c.id === cartId) {
        cart = c;
        break;
      }
    }
    if (!cart) throw new Error(`Cart not found: ${cartId}`);

    cart.items = cart.items.filter((i) => i.id !== itemId);
    return calculateCartTotals(cart);
  }

  async clearCart(cartId: string): Promise<CartEntity> {
    let cart: CartEntity | undefined;
    for (const c of cartsStore.values()) {
      if (c.id === cartId) {
        cart = c;
        break;
      }
    }
    if (!cart) throw new Error(`Cart not found: ${cartId}`);

    cart.items = [];
    return calculateCartTotals(cart);
  }
}

export const cartRepository = new CartRepository();
