import { ProductEntity } from '../../types/index';

export interface IProductRepository {
  findAll(options?: { category?: string; activeOnly?: boolean; limit?: number; offset?: number }): Promise<{ products: ProductEntity[]; total: number }>;
  findByHandle(handle: string): Promise<ProductEntity | null>;
  findById(id: string): Promise<ProductEntity | null>;
  create(product: ProductEntity): Promise<ProductEntity>;
  updateInventory(productId: string, variantId: string | undefined, delta: number): Promise<boolean>;
}
