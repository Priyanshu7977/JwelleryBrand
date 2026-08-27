import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index';
import { userRepository } from '../repositories/postgres/user.repository';
import { AppError } from '../middleware/errorHandler.middleware';

export class UserController {
  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const { name, phone } = req.body;
      const updated = await userRepository.update(req.user.userId, { name, phone });
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async getAddresses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const addresses = await userRepository.getAddresses(req.user.userId);
      res.status(200).json({ success: true, data: addresses });
    } catch (err) {
      next(err);
    }
  }

  async addAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const { label, street, city, state, pincode, country, isDefault } = req.body;
      if (!street || !city || !state || !pincode) {
        throw new AppError('Street, city, state and pincode are required.', 400);
      }
      const address = await userRepository.addAddress(req.user.userId, {
        label: label || 'Home',
        street,
        city,
        state,
        pincode,
        country: country || 'India',
        isDefault: Boolean(isDefault),
      });
      res.status(201).json({ success: true, data: address });
    } catch (err) {
      next(err);
    }
  }

  async deleteAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const id = String(req.params.id);
      const success = await userRepository.deleteAddress(req.user.userId, id);
      res.status(200).json({ success });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
