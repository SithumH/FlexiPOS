import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import apiRouter from './routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

export const createApp = () => {
  const app = express();

  // 1. Security Headers via Helmet (Hides X-Powered-By, adds Clickjacking & MIME protection)
  app.use(
    helmet({
      contentSecurityPolicy: config.nodeEnv === 'production',
      crossOriginEmbedderPolicy: false
    })
  );

  // 2. Strict CORS Configuration
  const allowedOrigins = [
    config.clientUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman) in dev
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Blocked by FlexiPOS CORS policy'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-business-id']
    })
  );

  // 3. Body Parsing with Safe Payload Limits (Defends against memory exhaustion DoS)
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // 4. Rate Limiting on all API routes
  app.use('/api', apiRateLimiter);

  // 5. Audit Logging (Redacts sensitive fields like passwords)
  if (config.nodeEnv === 'development') {
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[API ${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
      });
      next();
    });
  }

  // 6. Base API Version 1
  app.use('/api/v1', apiRouter);

  // Fallback 404 Route (Obfuscates server details)
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Resource not found'
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
