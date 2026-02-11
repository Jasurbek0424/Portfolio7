import { Router } from 'express';
import { langMiddleware } from '../../middlewares/lang';
import {
  getProjectsController,
  getProjectBySlugController,
} from './project.controller';

const router = Router();

router.use(langMiddleware);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: List published projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, ru, uz]
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', getProjectsController);

/**
 * @swagger
 * /api/projects/{slug}:
 *   get:
 *     summary: Get project by slug
 *     tags: [Projects]
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
 *         description: Project
 *       404:
 *         description: Not found
 */
router.get('/:slug', getProjectBySlugController);

export const projectRoutes = router;
