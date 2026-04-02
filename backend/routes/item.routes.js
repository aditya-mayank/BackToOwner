import express from 'express';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { reportFoundItem, reportLostItem, searchItems, getItemById } from '../controllers/item.controller.js';
import { validate, itemValidation } from '../middleware/validate.middleware.js';
import { uploadLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();


router.use(protectRoute);


// Routes
router.post('/found', uploadLimiter, uploadMiddleware, validate(itemValidation), reportFoundItem);
router.post('/lost', uploadLimiter, uploadMiddleware, validate(itemValidation), reportLostItem);
router.get('/search', searchItems);
router.get('/:id', getItemById);

export default router;
