import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { langMiddleware } from '../../middlewares/lang';
import {
  getBlogsController,
  getBlogBySlugController,
  getBlogByIdController,
  createBlogController,
  updateBlogController,
  deleteBlogController,
} from './blog.controller';

const router = Router();

router.use(authMiddleware);
router.use(langMiddleware);

router.get('/', getBlogsController);
router.get('/id/:id', getBlogByIdController);
router.get('/:slug', getBlogBySlugController);
router.post('/', createBlogController);
router.put('/:id', updateBlogController);
router.delete('/:id', deleteBlogController);

export const blogAdminRoutes = router;
