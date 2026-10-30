import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // 1. Handle Zod Schema Validation Errors (Safe to return client field errors)
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }

  // 2. Handle Malformed JSON payload
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body'
    });
    return;
  }

  // 3. Security: Sanitize Database / Prisma errors to prevent internal schema & connection string leaks
  const isPrismaError =
    err.name === 'PrismaClientKnownRequestError' ||
    err.name === 'PrismaClientValidationError' ||
    err.name === 'PrismaClientInitializationError';

  console.error('[Server Error Security Log]:', {
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    name: err.name,
    message: err.message
  });

  if (isPrismaError) {
    res.status(400).json({
      success: false,
      message: 'Database operation failed or validation constraint was violated'
    });
    return;
  }

  // 4. In production, never return raw internal error messages
  const safeMessage =
    config.nodeEnv === 'production'
      ? 'An unexpected internal error occurred'
      : err.message || 'Internal server error';

  res.status(err.status || 500).json({
    success: false,
    message: safeMessage
  });
};
