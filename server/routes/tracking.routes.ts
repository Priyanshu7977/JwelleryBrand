import { Router } from 'express';
import { trackingController } from '../controllers/tracking.controller';

export const trackingRouter = Router();

trackingRouter.get('/:trackingNumber', (req, res, next) => trackingController.track(req, res, next));
