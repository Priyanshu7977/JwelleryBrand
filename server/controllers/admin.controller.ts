import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index';
import { orderRepository } from '../repositories/postgres/order.repository';
import { contactRepository } from '../repositories/postgres/contact.repository';
import { orderService } from '../services/order.service';

export class AdminController {
  async listOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, limit, offset } = req.query;
      const result = await orderRepository.findAll({
        status: status ? String(status) : undefined,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
      });

      res.status(200).json({
        success: true,
        data: result.orders,
        total: result.total,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { financialStatus, fulfillmentStatus, carrier, trackingNumber } = req.body;

      const order = await orderService.updateOrderStatus(id, {
        financialStatus,
        fulfillmentStatus,
        carrier,
        trackingNumber,
      });

      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async listInquiries(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, limit, offset } = req.query;
      const result = await contactRepository.findAll({
        status: status ? String(status) : undefined,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
      });

      res.status(200).json({
        success: true,
        data: result.inquiries,
        total: result.total,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateInquiryStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const status = req.body.status as 'new' | 'read' | 'replied';
      const inquiry = await contactRepository.updateStatus(id, status);
      res.status(200).json({ success: true, data: inquiry });
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
