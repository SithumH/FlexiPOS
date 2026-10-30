import { Router } from 'express';
import { SyncController } from './sync.controller.js';
import { authenticateJwt } from '../../middleware/auth.js';
import { tenantGuard } from '../../middleware/tenant.js';

const router = Router();

router.use(authenticateJwt, tenantGuard);

router.post('/orders', SyncController.syncBatch);

export default router;

