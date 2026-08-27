import { Router } from 'express';
import { wishlistController } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth.middleware';

export const wishlistRouter = Router();

wishlistRouter.use(authenticate);

wishlistRouter.get('/', (req, res, next) => wishlistController.getWishlist(req, res, next));
wishlistRouter.post('/:productId', (req, res, next) => wishlistController.toggleItem(req, res, next));
