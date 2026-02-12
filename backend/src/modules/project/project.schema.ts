import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createProjectSchema = z.object({
  slug: z.string().min(1).max(200).regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens'),
  titleEn: z.string().min(1, 'Title is required').max(500),
  titleRu: z.string().min(1).max(500),
  titleUz: z.string().min(1).max(500),
  descriptionEn: z.string().min(1).max(5000),
  descriptionRu: z.string().min(1).max(5000),
  descriptionUz: z.string().min(1).max(5000),
  techStack: z.array(z.string().max(50)).max(20).default([]),
  thumbnail: z.string().min(1).max(500).optional().nullable(),
  linkUrl: z.string().url().max(1000).optional().nullable(),
  githubUrl: z.string().url().max(1000).optional().nullable(),
  published: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(9999).default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
