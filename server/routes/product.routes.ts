import { Router } from 'express';
import { productController } from '../controllers/product.controller';

export const productRouter = Router();

productRouter.get('/', (req, res, next) => productController.list(req, res, next));
productRouter.get('/:handle', (req, res, next) => productController.getByHandle(req, res, next));
