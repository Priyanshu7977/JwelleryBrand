import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index';
import { AppError } from './errorHandler.middleware';

interface IdempotentRecord {
  statusCode: number;
  body: unknown;
  createdAt: number;
}

const idempotencyStore = new Map<string, IdempotentRecord>();

export function checkIdempotency(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const key = req.headers['idempotency-key'] as string;

  if (!key) {
    return next();
  }

  // Validate idempotency key format (non-empty string <= 128 chars)
  if (typeof key !== 'string' || key.trim().length === 0 || key.length > 128) {
    return next(new AppError('Invalid Idempotency-Key header.', 400, 'INVALID_IDEMPOTENCY_KEY'));
  }

  req.idempotencyKey = key;

  const cached = idempotencyStore.get(key);
  if (cached) {
    res.setHeader('X-Cache-Lookup', 'HIT-IDEMPOTENT');
    return res.status(cached.statusCode).json(cached.body);
  }

  // Intercept json() calls to cache response
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyStore.set(key, {
        statusCode: res.statusCode,
        body,
        createdAt: Date.now(),
      });
    }
    return originalJson(body);
  };

  next();
}

// Clean up idempotency records older than 24 hours
setInterval(() => {
  const ttl = 24 * 60 * 60 * 1000;
  const now = Date.now();
  for (const [k, record] of idempotencyStore.entries()) {
    if (now - record.createdAt > ttl) {
      idempotencyStore.delete(k);
    }
  }
}, 60 * 60 * 1000).unref();
