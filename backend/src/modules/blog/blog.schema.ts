import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createBlogSchema = z.object({
  slug: z.string().min(1).max(200).regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens'),
  titleEn: z.string().min(1, 'Title is required').max(500),
  titleRu: z.string().min(1).max(500),
  titleUz: z.string().min(1).max(500),
  descriptionEn: z.string().min(1).max(2000),
  descriptionRu: z.string().min(1).max(2000),
  descriptionUz: z.string().min(1).max(2000),
  contentEn: z.string().min(1).max(50000),
  contentRu: z.string().min(1).max(50000),
  contentUz: z.string().min(1).max(50000),
  thumbnail: z.string().min(1).max(500).optional().nullable(),
  published: z.boolean().default(false),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
