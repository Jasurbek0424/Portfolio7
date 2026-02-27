import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getContactsController, sendMessageController } from './contact.controller';

const router = Router();

const sendMessageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, error: 'Too many messages sent. Please try again later.' },
});

router.get('/', getContactsController);
router.post('/send-message', sendMessageLimiter, sendMessageController);

export const contactRoutes = router;
