import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createBlogSchema = z.object({
  slug: z.string().min(1).regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens'),
  titleEn: z.string().min(1, 'Title is required'),
  titleRu: z.string().min(1),
  titleUz: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionRu: z.string().min(1),
  descriptionUz: z.string().min(1),
  contentEn: z.string().min(1),
  contentRu: z.string().min(1),
  contentUz: z.string().min(1),
  thumbnail: z.string().min(1).optional().nullable(),
  published: z.boolean().default(false),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
