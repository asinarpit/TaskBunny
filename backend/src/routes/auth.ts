import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth';
import { registerValidator, loginValidator } from '../validators/auth';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.get('/profile', authenticate, getProfile);

export default router;
