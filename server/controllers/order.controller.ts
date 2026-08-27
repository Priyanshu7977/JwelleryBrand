import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index';
import { orderService } from '../services/order.service';
import { pdfService } from '../services/pdf.service';
import { AppError } from '../middleware/errorHandler.middleware';

export class OrderController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items,
        shippingMethod = 'Mumbai Same-Day Express Courier',
        paymentMethod = 'UPI (7718825792@okaxis)',
        cartId,
      } = req.body;

      if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
        throw new AppError('Customer and shipping address details are required.', 400);
      }

      const order = await orderService.createOrder({
        userId: req.user?.userId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items,
        shippingMethod,
        paymentMethod,
        cartId,
        idempotencyKey: req.idempotencyKey,
      });

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const order = await orderService.getOrder(id);
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const orders = await orderService.getUserOrders(req.user.userId);
      res.status(200).json({ success: true, data: orders });
    } catch (err) {
      next(err);
    }
  }

  async getInvoice(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const order = await orderService.getOrder(id);
      const html = pdfService.generateInvoiceHtml(order);

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="Invoice-${order.orderNumber}.html"`);
      res.send(html);
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
