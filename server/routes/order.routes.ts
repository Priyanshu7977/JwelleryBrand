import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { optionalAuthenticate, authenticate } from '../middleware/auth.middleware';
import { checkIdempotency } from '../middleware/idempotency.middleware';

export const orderRouter = Router();

orderRouter.post('/', optionalAuthenticate, checkIdempotency, (req, res, next) => orderController.create(req, res, next));
orderRouter.get('/user/me', authenticate, (req, res, next) => orderController.getMyOrders(req, res, next));
orderRouter.get('/:id', optionalAuthenticate, (req, res, next) => orderController.getById(req, res, next));
orderRouter.get('/:id/invoice', optionalAuthenticate, (req, res, next) => orderController.getInvoice(req, res, next));
