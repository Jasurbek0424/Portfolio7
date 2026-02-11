import { Router } from 'express';
import { langMiddleware } from '../../middlewares/lang';
import {
  getBlogsController,
  getBlogBySlugController,
} from './blog.controller';

const router = Router();

router.use(langMiddleware);

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: List published blog posts
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, ru, uz]
 *         description: Language (default en)
 *     responses:
 *       200:
 *         description: List of blog posts
 */
router.get('/', getBlogsController);

/**
 * @swagger
 * /api/blogs/{slug}:
 *   get:
 *     summary: Get blog post by slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, ru, uz]
 *     responses:
 *       200:
 *         description: Blog post
 *       404:
 *         description: Not found
 */
router.get('/:slug', getBlogBySlugController);

export const blogRoutes = router;
