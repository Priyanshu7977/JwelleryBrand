import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';

export const webhookRouter = Router();

webhookRouter.post('/shopify', (req, res, next) => webhookController.handleShopifyWebhook(req, res, next));
