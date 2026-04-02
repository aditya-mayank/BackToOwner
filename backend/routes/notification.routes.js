import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMyNotifications, markAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/my', protectRoute, getMyNotifications);
router.put('/:id/read', protectRoute, markAsRead);

export default router;
