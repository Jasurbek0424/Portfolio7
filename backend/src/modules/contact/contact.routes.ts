import { Router } from 'express';
import { getContactsController, sendMessageController } from './contact.controller';

const router = Router();

router.get('/', getContactsController);
router.post('/send-message', sendMessageController);

export const contactRoutes = router;
