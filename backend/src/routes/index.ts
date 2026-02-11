import { Router } from 'express';
import { authRoutes } from '../modules/auth';
import { blogRoutes } from '../modules/blog/blog.routes';
import { blogAdminRoutes } from '../modules/blog/blog.admin.routes';
import { projectRoutes } from '../modules/project/project.routes';
import { projectAdminRoutes } from '../modules/project/project.admin.routes';
import { resumeRoutes } from '../modules/resume/resume.routes';
import { resumeAdminRoutes } from '../modules/resume/resume.admin.routes';
import { contactRoutes, contactAdminRoutes } from '../modules/contact';
import { skillRoutes, skillAdminRoutes } from '../modules/skill';
import { uploadRoutes } from '../modules/upload/upload.routes';

const router = Router();

// Public API
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/projects', projectRoutes);
router.use('/resume', resumeRoutes);
router.use('/contact', contactRoutes);
router.use('/skills', skillRoutes);

// Admin API (protected)
router.use('/admin/blogs', blogAdminRoutes);
router.use('/admin/projects', projectAdminRoutes);
router.use('/admin/resume', resumeAdminRoutes);
router.use('/admin/contact', contactAdminRoutes);
router.use('/admin/skills', skillAdminRoutes);
router.use('/admin/upload', uploadRoutes);

export const apiRoutes = router;
