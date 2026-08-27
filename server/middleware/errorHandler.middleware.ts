import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const code = 'code' in err ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected atelier server error occurred';

  logger.error(`Error processing ${req.method} ${req.originalUrl}: ${message}`, {
    code,
    statusCode,
    stack: err.stack,
    requestId: req.headers['x-request-id'],
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      statusCode,
    },
  });
}
