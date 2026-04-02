import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', protectRoute, getProfile);

export default router;
