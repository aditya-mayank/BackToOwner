import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute);


// Placeholder route
router.post('/:itemId/claim', (req, res) => {
  res.json({ message: `POST /claim placeholder for item ID: ${req.params.itemId}` });
});

export default router;
