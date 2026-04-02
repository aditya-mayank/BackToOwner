import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getAllItems, getAllUsers, blockUser, deleteOrArchiveItem, getSystemStats, triggerArchival } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protectRoute);
router.use(requireRole('admin'));


// Admin routes (Protected + Admin Role required)
router.get('/items', getAllItems);
router.get('/users', getAllUsers);
router.put('/users/:userId/block', blockUser);
router.delete('/items/:itemId', deleteOrArchiveItem);
router.get('/stats', getSystemStats);
router.put('/archive/run', triggerArchival);

export default router;
