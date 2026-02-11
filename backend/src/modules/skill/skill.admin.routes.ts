import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import {
  getSkillCategoriesController,
  getSkillCategoryByIdController,
  createSkillCategoryController,
  updateSkillCategoryController,
  deleteSkillCategoryController,
  getSkillsController,
  getSkillByIdController,
  createSkillController,
  updateSkillController,
  deleteSkillController,
} from './skill.controller';

const router = Router();

router.use(authMiddleware);

router.get('/categories', getSkillCategoriesController);
router.get('/categories/id/:id', getSkillCategoryByIdController);
router.post('/categories', createSkillCategoryController);
router.put('/categories/:id', updateSkillCategoryController);
router.delete('/categories/:id', deleteSkillCategoryController);

router.get('/', getSkillsController);
router.get('/id/:id', getSkillByIdController);
router.post('/', createSkillController);
router.put('/:id', updateSkillController);
router.delete('/:id', deleteSkillController);

export const skillAdminRoutes = router;
