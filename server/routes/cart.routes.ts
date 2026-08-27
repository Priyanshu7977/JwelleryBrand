import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { optionalAuthenticate } from '../middleware/auth.middleware';

export const cartRouter = Router();

cartRouter.use(optionalAuthenticate);

cartRouter.get('/', (req, res, next) => cartController.getCart(req, res, next));
cartRouter.post('/items', (req, res, next) => cartController.addItem(req, res, next));
cartRouter.put('/items/:itemId', (req, res, next) => cartController.updateQuantity(req, res, next));
cartRouter.delete('/items/:itemId', (req, res, next) => cartController.removeItem(req, res, next));
cartRouter.delete('/', (req, res, next) => cartController.clear(req, res, next));
