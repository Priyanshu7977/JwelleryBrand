import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

export const adminRouter = Router();

// Protect all admin endpoints with authentication & 'admin' role check
adminRouter.use(authenticate);
adminRouter.use(requireRole('admin'));

adminRouter.get('/orders', (req, res, next) => adminController.listOrders(req, res, next));
adminRouter.put('/orders/:id/status', (req, res, next) => adminController.updateOrderStatus(req, res, next));
adminRouter.get('/inquiries', (req, res, next) => adminController.listInquiries(req, res, next));
adminRouter.put('/inquiries/:id/status', (req, res, next) => adminController.updateInquiryStatus(req, res, next));
