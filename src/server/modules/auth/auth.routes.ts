import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateJwt } from '../../middleware/auth.js';

const router = Router();

router.post('/register-business', AuthController.registerBusiness);
router.post('/login', AuthController.login);
router.get('/me', authenticateJwt, AuthController.getMe);

export default router;

