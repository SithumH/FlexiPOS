import { Router } from 'express';
import { ProductsController } from './products.controller.js';
import { authenticateJwt, requireRoles } from '../../middleware/auth.js';
import { tenantGuard } from '../../middleware/tenant.js';

const router = Router();

// Protect all product routes with JWT & Tenant isolation
router.use(authenticateJwt, tenantGuard);

router.get('/', ProductsController.list);
router.get('/quick-tiles', ProductsController.getQuickTiles);
router.get('/categories', ProductsController.listCategories);

// Admin & Manager can add products
router.post('/', requireRoles(['ADMIN', 'MANAGER']), ProductsController.create);

export default router;

