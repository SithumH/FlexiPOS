import { Router } from 'express';
import { CustomersController } from './customers.controller.js';
import { authenticateJwt } from '../../middleware/auth.js';
import { tenantGuard } from '../../middleware/tenant.js';

const router = Router();

router.use(authenticateJwt, tenantGuard);

router.get('/', CustomersController.list);
router.post('/', CustomersController.create);
router.post('/:id/pay-credit', CustomersController.payCredit);
router.get('/:id/statement', CustomersController.getStatement);

export default router;

