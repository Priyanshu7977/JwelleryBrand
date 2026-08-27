import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface ServerConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  databaseUrl: string;
  timezone: string;
  corsOrigins: string[];
  shopify: {
    shopDomain: string;
    storefrontAccessToken: string;
    adminApiAccessToken: string;
    webhookSecret: string;
    apiVersion: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  mumbaiSameDayCutoffHour: number; // 13 = 1:00 PM IST
}

export const config: ServerConfig = {
  env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  port: Number(process.env.PORT || 3001),
  jwtSecret: process.env.JWT_SECRET || 'celestia_atelier_super_secure_jwt_secret_key_2026_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/celestia_luxury',
  timezone: 'Asia/Kolkata',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,https://jwellery-brand.vercel.app,https://celestia-jewellery-live.surge.sh')
    .split(',')
    .map((o) => o.trim()),
  shopify: {
    shopDomain: process.env.SHOPIFY_SHOP_DOMAIN || 'celestia-amor.myshopify.com',
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN || '',
    adminApiAccessToken: process.env.SHOPIFY_ADMIN_TOKEN || '',
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET || 'celestia_webhook_secret_hmac_sha256',
    apiVersion: '2026-01',
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200,
  },
  mumbaiSameDayCutoffHour: 13, // 1:00 PM IST cutoff
};
