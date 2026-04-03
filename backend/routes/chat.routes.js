import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { initiateChat, getMessages, sendMessage, closeChat, getUserChats } from '../controllers/chat.controller.js';
import { validate, messageValidation } from '../middleware/validate.middleware.js';

const router = express.Router();

router.use(protectRoute);

// Chat routes
router.get('/', getUserChats);
router.post('/initiate', initiateChat);
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', validate(messageValidation), sendMessage);
router.put('/:chatId/close', closeChat);

export default router;
