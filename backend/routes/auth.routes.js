import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validate, registerValidation, loginValidation } from '../middleware/validate.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Auth routes
router.post('/register', authLimiter, validate(registerValidation), register);
router.post('/login', authLimiter, validate(loginValidation), login);

export default router;
