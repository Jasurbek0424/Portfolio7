import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from './contact.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getContactsController);
router.get('/id/:id', getContactByIdController);
router.post('/', createContactController);
router.put('/:id', updateContactController);
router.delete('/:id', deleteContactController);

export const contactAdminRoutes = router;
