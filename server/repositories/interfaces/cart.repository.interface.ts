import { CartEntity, CartItemEntity } from '../../types/index';

export interface AddCartItemDTO {
  productId: string;
  variantId?: string;
  title: string;
  handle: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  boxType?: string;
  customNote?: string;
  polaroidUrl?: string;
}

export interface ICartRepository {
  getOrCreateCart(sessionId: string, userId?: string): Promise<CartEntity>;
  addItem(cartId: string, item: AddCartItemDTO): Promise<CartEntity>;
  updateItemQuantity(cartId: string, itemId: string, quantity: number): Promise<CartEntity>;
  removeItem(cartId: string, itemId: string): Promise<CartEntity>;
  clearCart(cartId: string): Promise<CartEntity>;
}
