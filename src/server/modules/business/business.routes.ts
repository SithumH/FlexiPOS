import { Router } from 'express';
import { BusinessController } from './business.controller.js';
import { authenticateJwt, requireRoles } from '../../middleware/auth.js';
import { tenantGuard } from '../../middleware/tenant.js';

const router = Router();

router.use(authenticateJwt, tenantGuard);

// Only Shop Admins or Super Admins can access and update shop settings
router.get('/settings', requireRoles(['SUPER_ADMIN', 'ADMIN']), BusinessController.getSettings);
router.patch('/settings', requireRoles(['SUPER_ADMIN', 'ADMIN']), BusinessController.updateSettings);

// Staff management
router.get('/staff', requireRoles(['SUPER_ADMIN', 'ADMIN', 'MANAGER']), BusinessController.listStaff);
router.post('/staff', requireRoles(['SUPER_ADMIN', 'ADMIN']), BusinessController.createStaff);
router.patch('/staff/:id/status', requireRoles(['SUPER_ADMIN', 'ADMIN']), BusinessController.toggleStaffStatus);

export default router;

