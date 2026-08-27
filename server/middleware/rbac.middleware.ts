import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types/index';
import { AppError } from './errorHandler.middleware';

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden. You do not have permission to access this atelier resource.', 403, 'FORBIDDEN'));
    }

    next();
  };
}
