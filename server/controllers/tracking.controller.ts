import { Request, Response, NextFunction } from 'express';
import { orderRepository } from '../repositories/postgres/order.repository';
import { getFulfillmentProgress } from '../services/tracking.service';
import { AppError } from '../middleware/errorHandler.middleware';

export class TrackingController {
  async track(req: Request, res: Response, next: NextFunction) {
    try {
      const trackingNumber = String(req.params.trackingNumber);
      const order = await orderRepository.findByOrderNumber(trackingNumber);

      if (!order) {
        throw new AppError(`No active dispatch found for tracking reference: ${trackingNumber}`, 404);
      }

      const progress = getFulfillmentProgress(order.fulfillmentStatus);

      res.status(200).json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          trackingNumber: order.trackingNumber,
          carrier: order.carrier,
          fulfillmentStatus: order.fulfillmentStatus,
          financialStatus: order.financialStatus,
          destinationCity: order.shippingAddress.city,
          estimatedDeliveryWindow: order.formattedDeliveryWindow,
          progress,
          timeline: order.timeline,
          itemsCount: order.items.reduce((s, i) => s + i.quantity, 0),
          lastUpdated: order.updatedAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const trackingController = new TrackingController();
