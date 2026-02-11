import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createResumeSectionSchema = z.object({
  sectionKey: z.string().min(1).regex(slugRegex, 'Section key must be lowercase alphanumeric with hyphens'),
  titleEn: z.string().min(1, 'Title is required'),
  titleRu: z.string().min(1),
  titleUz: z.string().min(1),
  contentEn: z.string().min(1),
  contentRu: z.string().min(1),
  contentUz: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const updateResumeSectionSchema = createResumeSectionSchema.partial();

export type CreateResumeSectionInput = z.infer<typeof createResumeSectionSchema>;
export type UpdateResumeSectionInput = z.infer<typeof updateResumeSectionSchema>;
