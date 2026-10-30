import { Router } from 'express';
import { OrdersController } from './orders.controller.js';
import { authenticateJwt } from '../../middleware/auth.js';
import { tenantGuard } from '../../middleware/tenant.js';

const router = Router();

router.use(authenticateJwt, tenantGuard);

router.post('/', OrdersController.create);
router.get('/', OrdersController.list);

export default router;

