import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index';
import { cartRepository } from '../repositories/postgres/cart.repository';
import { productRepository } from '../repositories/postgres/product.repository';
import { AppError } from '../middleware/errorHandler.middleware';

export class CartController {
  async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = (req.headers['x-session-id'] as string) || 'guest_default_session';
      const cart = await cartRepository.getOrCreateCart(sessionId, req.user?.userId);
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = (req.headers['x-session-id'] as string) || 'guest_default_session';
      const { productId, variantId, quantity = 1, boxType, customNote, polaroidUrl } = req.body;

      const product = await productRepository.findById(productId);
      if (!product) {
        throw new AppError('Product not found in atelier catalogue.', 404);
      }

      const cart = await cartRepository.getOrCreateCart(sessionId, req.user?.userId);
      const updated = await cartRepository.addItem(cart.id, {
        productId: product.id,
        variantId,
        title: product.title,
        handle: product.handle,
        imageUrl: product.heroImage,
        unitPrice: product.price,
        quantity: Math.max(1, Number(quantity)),
        boxType,
        customNote,
        polaroidUrl,
      });

      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async updateQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = (req.headers['x-session-id'] as string) || 'guest_default_session';
      const itemId = String(req.params.itemId);
      const { quantity } = req.body;

      const cart = await cartRepository.getOrCreateCart(sessionId, req.user?.userId);
      const updated = await cartRepository.updateItemQuantity(cart.id, itemId, Number(quantity));

      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = (req.headers['x-session-id'] as string) || 'guest_default_session';
      const itemId = String(req.params.itemId);

      const cart = await cartRepository.getOrCreateCart(sessionId, req.user?.userId);
      const updated = await cartRepository.removeItem(cart.id, itemId);

      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async clear(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = (req.headers['x-session-id'] as string) || 'guest_default_session';
      const cart = await cartRepository.getOrCreateCart(sessionId, req.user?.userId);
      const updated = await cartRepository.clearCart(cart.id);

      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const cartController = new CartController();
