import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index';
import { userRepository } from '../repositories/postgres/user.repository';
import { AppError } from '../middleware/errorHandler.middleware';

export class WishlistController {
  async getWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const items = await userRepository.getWishlist(req.user.userId);
      res.status(200).json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  async toggleItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const productId = String(req.params.productId);
      const result = await userRepository.toggleWishlist(req.user.userId, productId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const wishlistController = new WishlistController();
