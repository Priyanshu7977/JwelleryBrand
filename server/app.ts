import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/index';
import { apiRouter } from './routes/index';
import { requestLogger } from './middleware/logger.middleware';
import { createRateLimiter } from './middleware/rateLimiter.middleware';
import { sanitizeInputs } from './middleware/sanitizer.middleware';
import { errorHandler, AppError } from './middleware/errorHandler.middleware';

export function createApp(): Express {
  const app = express();

  // Basic security and parsing middleware
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (config.corsOrigins.includes(origin) || config.env === 'development') {
          return callback(null, true);
        }
        return callback(null, true); // Dev-permissive fallback
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id', 'Idempotency-Key', 'X-Shopify-Hmac-Sha256'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request tracing and structured logging
  app.use(requestLogger);

  // Global rate limiter
  app.use(
    createRateLimiter({
      windowMs: config.rateLimit.windowMs,
      maxRequests: config.rateLimit.maxRequests,
    })
  );

  // Universal input sanitization against XSS
  app.use(sanitizeInputs);

  // API master routes
  app.use('/api', apiRouter);

  // Catch 404 routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`The requested atelier route was not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
