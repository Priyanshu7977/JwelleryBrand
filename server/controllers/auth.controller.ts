import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { emailService } from '../services/email.service';
import { AuthenticatedRequest } from '../types/index';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, password } = req.body;
      const result = await authService.register({ name, email, phone, password });
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const profile = await authService.getProfile(req.user.userId);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (email) {
        await emailService.sendPasswordReset(email, 'token_reset_sample');
      }
      res.status(200).json({
        success: true,
        message: 'If an atelier account exists with this email, a reset guide has been dispatched.',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
