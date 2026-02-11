import { Router } from 'express';
import { langMiddleware } from '../../middlewares/lang';
import {
  getResumeController,
  getResumeSectionByKeyController,
  getCvInfoController,
  downloadCvController,
} from './resume.controller';

const router = Router();

router.use(langMiddleware);

// CV file (must be before /:sectionKey)
router.get('/cv', getCvInfoController);
router.get('/cv/download', downloadCvController);

/**
 * @swagger
 * /api/resume:
 *   get:
 *     summary: Get all resume sections
 *     tags: [Resume]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, ru, uz]
 *     responses:
 *       200:
 *         description: All resume sections
 */
router.get('/', getResumeController);

/**
 * @swagger
 * /api/resume/{sectionKey}:
 *   get:
 *     summary: Get resume section by key
 *     tags: [Resume]
 *     parameters:
 *       - in: path
 *         name: sectionKey
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
 *         description: Resume section
 *       404:
 *         description: Not found
 */
router.get('/:sectionKey', getResumeSectionByKeyController);

export const resumeRoutes = router;
