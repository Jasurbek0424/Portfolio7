import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { langMiddleware } from '../../middlewares/lang';
import {
  getResumeController,
  getResumeSectionByKeyController,
  getResumeSectionByIdController,
  createResumeSectionController,
  updateResumeSectionController,
  deleteResumeSectionController,
  getCvInfoAdminController,
  uploadCvController,
} from './resume.controller';
import { uploadCv } from './cv.upload';

const router = Router();

router.use(authMiddleware);
router.use(langMiddleware);

// CV file
router.get('/cv', getCvInfoAdminController);
router.post('/cv', uploadCv.single('file'), uploadCvController);

router.get('/', getResumeController);
router.get('/id/:id', getResumeSectionByIdController);
router.get('/section/:sectionKey', getResumeSectionByKeyController);
router.post('/', createResumeSectionController);
router.put('/:id', updateResumeSectionController);
router.delete('/:id', deleteResumeSectionController);

export const resumeAdminRoutes = router;
