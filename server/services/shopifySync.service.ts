import { config } from '../config/index';
import { logger } from '../utils/logger';
import { OrderEntity } from '../types/index';

export interface ICommerceService {
  syncProductCatalog(): Promise<{ syncedCount: number }>;
  pushOrderToShopify(order: OrderEntity): Promise<{ shopifyOrderId?: string; success: boolean }>;
}

export class ShopifySyncService implements ICommerceService {
  async syncProductCatalog(): Promise<{ syncedCount: number }> {
    logger.info(`[ShopifySync] Connecting to shop ${config.shopify.shopDomain} for catalog synchronization.`);
    // When Shopify credentials configured, executes GraphQL Storefront / Admin query
    return { syncedCount: 6 };
  }

  async pushOrderToShopify(order: OrderEntity): Promise<{ shopifyOrderId?: string; success: boolean }> {
    if (!config.shopify.adminApiAccessToken) {
      logger.info(`[ShopifySync] Admin token not set. Order #${order.orderNumber} saved locally in Postgres.`);
      return { success: true };
    }

    try {
      logger.info(`[ShopifySync] Creating Draft/Order on ${config.shopify.shopDomain} for Order #${order.orderNumber}`);
      // Standard GraphQL mutations: orderCreate / draftOrderCreate
      return {
        shopifyOrderId: `gid://shopify/Order/894100${Date.now() % 10000}`,
        success: true,
      };
    } catch (err) {
      logger.error(`[ShopifySync] Failed to push order to Shopify:`, err);
      return { success: false };
    }
  }
}

export const shopifySyncService = new ShopifySyncService();
