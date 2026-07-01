import { Router } from 'express';
import { register, login, refresh, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Auth routes
 */

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.get('/me', authMiddleware, getMe);

export default router;
