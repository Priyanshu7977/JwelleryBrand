import { Request, Response, NextFunction } from 'express';
import { productRepository } from '../repositories/postgres/product.repository';
import { AppError } from '../middleware/errorHandler.middleware';

export class ProductController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, limit, offset } = req.query;
      const result = await productRepository.findAll({
        category: category ? String(category) : undefined,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
      });

      res.status(200).json({
        success: true,
        data: result.products,
        total: result.total,
      });
    } catch (err) {
      next(err);
    }
  }

  async getByHandle(req: Request, res: Response, next: NextFunction) {
    try {
      const handle = String(req.params.handle);
      const product = await productRepository.findByHandle(handle);
      if (!product) {
        throw new AppError('Product not found in atelier catalogue.', 404, 'PRODUCT_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
