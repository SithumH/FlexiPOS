import { Router } from 'express';
import { SyncController } from './sync.controller.js';
import { authenticateJwt } from '../../middleware/auth.js';
import { tenantGuard } from '../../middleware/tenant.js';
import { syncRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateJwt, tenantGuard);

router.post('/orders', syncRateLimiter, SyncController.syncBatch);

export default router;
