import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateJwt } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Apply strict rate limiting to prevent brute-force attacks on auth endpoints
router.post('/register-business', authRateLimiter, AuthController.registerBusiness);
router.post('/login', authRateLimiter, AuthController.login);
router.get('/me', authenticateJwt, AuthController.getMe);

export default router;
