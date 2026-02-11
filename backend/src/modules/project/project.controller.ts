import type { Request, Response } from 'express';
import { createProjectSchema, updateProjectSchema } from './project.schema';
import type { LangRequest } from '../../middlewares/lang';
import {
  getProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from './project.service';

export async function getProjectsController(req: LangRequest, res: Response): Promise<void> {
  const lang = req.lang ?? 'en';
  const isAdmin = req.originalUrl?.includes('/admin') ?? false;
  const publishedOnly = !isAdmin;
  const projects = await getProjects(lang, publishedOnly);
  res.json({ success: true, data: projects });
}

export async function getProjectBySlugController(req: LangRequest, res: Response): Promise<void> {
  const { slug } = req.params;
  const lang = req.lang ?? 'en';
  const isAdmin = req.originalUrl?.includes('/admin') ?? false;
  const publishedOnly = !isAdmin;
  const project = await getProjectBySlug(slug!, lang, publishedOnly);
  res.json({ success: true, data: project });
}

export async function getProjectByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const project = await getProjectById(id!);
  res.json({ success: true, data: project });
}

export async function createProjectController(req: Request, res: Response): Promise<void> {
  const parsed = createProjectSchema.parse(req.body);
  const project = await createProject(parsed);
  res.status(201).json({ success: true, data: project });
}

export async function updateProjectController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const parsed = updateProjectSchema.parse(req.body);
  const project = await updateProject(id!, parsed);
  res.json({ success: true, data: project });
}

export async function deleteProjectController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await deleteProject(id!);
  res.status(204).send();
}
