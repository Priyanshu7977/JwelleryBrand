import { Request, Response, NextFunction } from 'express';
import { verifyShopifyWebhookHmac } from '../utils/crypto';
import { config } from '../config/index';
import { webhookRepository } from '../repositories/postgres/webhook.repository';
import { AppError } from '../middleware/errorHandler.middleware';
import { logger } from '../utils/logger';

export class WebhookController {
  async handleShopifyWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
      const topic = req.headers['x-shopify-topic'] as string;
      const webhookId = req.headers['x-shopify-webhook-id'] as string;

      if (!hmacHeader) {
        throw new AppError('Missing Shopify HMAC signature header.', 401, 'INVALID_WEBHOOK_SIGNATURE');
      }

      // Verify HMAC against secret
      const rawBody = JSON.stringify(req.body);
      const isValid = verifyShopifyWebhookHmac(rawBody, hmacHeader, config.shopify.webhookSecret);

      if (!isValid) {
        logger.warn('[Webhook] Rejected unauthorized Shopify webhook request.');
        throw new AppError('Unauthorized Shopify webhook signature.', 401, 'UNAUTHORIZED_WEBHOOK');
      }

      // Check idempotency
      if (webhookId && (await webhookRepository.isIdempotencyKeyProcessed(webhookId))) {
        logger.info(`[Webhook] Duplicate webhook skipped: ${webhookId}`);
        return res.status(200).json({ success: true, message: 'Already processed' });
      }

      await webhookRepository.logEvent({
        source: 'shopify',
        eventType: topic || 'unknown',
        idempotencyKey: webhookId,
        payload: req.body,
        status: 'processed',
      });

      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

export const webhookController = new WebhookController();
