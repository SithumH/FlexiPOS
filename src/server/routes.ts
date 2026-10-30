import { Router } from 'express';
import authRouter from './modules/auth/auth.routes.js';
import productsRouter from './modules/products/products.routes.js';
import customersRouter from './modules/customers/customers.routes.js';
import ordersRouter from './modules/orders/orders.routes.js';
import syncRouter from './modules/sync/sync.routes.js';
import businessRouter from './modules/business/business.routes.js';
import { prisma } from './db/prisma.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'CONNECTED',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'DEGRADED',
      database: 'DISCONNECTED',
      error: 'Database connection failed'
    });
  }
});

// Domain routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/customers', customersRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/sync', syncRouter);
apiRouter.use('/business', businessRouter);

export default apiRouter;

