import type { Request, Response } from 'express';
import type { LangRequest } from '../../middlewares/lang';
import {
  createSkillCategorySchema,
  updateSkillCategorySchema,
  createSkillSchema,
  updateSkillSchema,
} from './skill.schema';
import {
  getSkillsForPublic,
  getAllSkillCategories,
  getSkillCategoryById,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from './skill.service';

export async function getSkillsPublicController(req: LangRequest, res: Response): Promise<void> {
  const lang = req.lang ?? 'en';
  const data = await getSkillsForPublic(lang);
  res.json({ success: true, data });
}

export async function getSkillCategoriesController(_req: Request, res: Response): Promise<void> {
  const categories = await getAllSkillCategories();
  res.json({ success: true, data: categories });
}

export async function getSkillCategoryByIdController(req: Request, res: Response): Promise<void> {
  const category = await getSkillCategoryById(req.params.id!);
  res.json({ success: true, data: category });
}

export async function createSkillCategoryController(req: Request, res: Response): Promise<void> {
  const parsed = createSkillCategorySchema.parse(req.body);
  const category = await createSkillCategory(parsed);
  res.status(201).json({ success: true, data: category });
}

export async function updateSkillCategoryController(req: Request, res: Response): Promise<void> {
  const parsed = updateSkillCategorySchema.parse(req.body);
  const category = await updateSkillCategory(req.params.id!, parsed);
  res.json({ success: true, data: category });
}

export async function deleteSkillCategoryController(req: Request, res: Response): Promise<void> {
  await deleteSkillCategory(req.params.id!);
  res.status(204).send();
}

export async function getSkillsController(_req: Request, res: Response): Promise<void> {
  const skills = await getAllSkills();
  res.json({ success: true, data: skills });
}

export async function getSkillByIdController(req: Request, res: Response): Promise<void> {
  const skill = await getSkillById(req.params.id!);
  res.json({ success: true, data: skill });
}

export async function createSkillController(req: Request, res: Response): Promise<void> {
  const parsed = createSkillSchema.parse(req.body);
  const skill = await createSkill(parsed);
  res.status(201).json({ success: true, data: skill });
}

export async function updateSkillController(req: Request, res: Response): Promise<void> {
  const parsed = updateSkillSchema.parse(req.body);
  const skill = await updateSkill(req.params.id!, parsed);
  res.json({ success: true, data: skill });
}

export async function deleteSkillController(req: Request, res: Response): Promise<void> {
  await deleteSkill(req.params.id!);
  res.status(204).send();
}
