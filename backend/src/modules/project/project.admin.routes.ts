import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { langMiddleware } from '../../middlewares/lang';
import {
  getProjectsController,
  getProjectBySlugController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
} from './project.controller';

const router = Router();

router.use(authMiddleware);
router.use(langMiddleware);

router.get('/', getProjectsController);
router.get('/id/:id', getProjectByIdController);
router.get('/:slug', getProjectBySlugController);
router.post('/', createProjectController);
router.put('/:id', updateProjectController);
router.delete('/:id', deleteProjectController);

export const projectAdminRoutes = router;
