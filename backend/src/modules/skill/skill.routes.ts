import { Router } from 'express';
import { langMiddleware } from '../../middlewares/lang';
import { getSkillsPublicController } from './skill.controller';

const router = Router();

router.use(langMiddleware);
router.get('/', getSkillsPublicController);

export const skillRoutes = router;
