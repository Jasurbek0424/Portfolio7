import { z } from 'zod';

export const createSkillCategorySchema = z.object({
  titleEn: z.string().min(1, 'Title (EN) is required').max(100),
  titleRu: z.string().min(1, 'Title (RU) is required').max(100),
  titleUz: z.string().min(1, 'Title (UZ) is required').max(100),
  sortOrder: z.number().int().default(0),
});

export const updateSkillCategorySchema = z.object({
  titleEn: z.string().min(1).max(100).optional(),
  titleRu: z.string().min(1).max(100).optional(),
  titleUz: z.string().min(1).max(100).optional(),
  sortOrder: z.number().int().optional(),
});

export const createSkillSchema = z.object({
  skillCategoryId: z.string().min(1, 'Category is required'),
  label: z.string().trim().min(1, 'Label is required').max(100),
  sortOrder: z.number().int().default(0),
});

export const updateSkillSchema = z.object({
  skillCategoryId: z.string().min(1).optional(),
  label: z.string().trim().min(1).max(100).optional(),
  sortOrder: z.number().int().optional(),
});

export type CreateSkillCategoryInput = z.infer<typeof createSkillCategorySchema>;
export type UpdateSkillCategoryInput = z.infer<typeof updateSkillCategorySchema>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
