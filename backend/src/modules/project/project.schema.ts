import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createProjectSchema = z.object({
  slug: z.string().min(1).regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens'),
  titleEn: z.string().min(1, 'Title is required'),
  titleRu: z.string().min(1),
  titleUz: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionRu: z.string().min(1),
  descriptionUz: z.string().min(1),
  techStack: z.array(z.string()).default([]),
  thumbnail: z.string().min(1).optional().nullable(),
  linkUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
