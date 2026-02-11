import type { SupportedLang } from '../../config';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../utils/errors';
import { toTranslatedResponse } from '../../utils/language';
import type { CreateResumeSectionInput, UpdateResumeSectionInput } from './resume.schema';

export async function getResumeSections(lang: SupportedLang) {
  const sections = await prisma.resumeSection.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return sections.map((s) => ({
    ...toTranslatedResponse(s as Record<string, unknown>, lang),
  }));
}

export async function getResumeSectionByKey(sectionKey: string, lang: SupportedLang) {
  const section = await prisma.resumeSection.findUnique({
    where: { sectionKey },
  });

  if (!section) {
    throw new NotFoundError('Resume section');
  }

  return toTranslatedResponse(section as Record<string, unknown>, lang);
}

export async function getResumeSectionById(id: string) {
  const section = await prisma.resumeSection.findUnique({
    where: { id },
  });

  if (!section) {
    throw new NotFoundError('Resume section');
  }

  return section;
}

export async function createResumeSection(input: CreateResumeSectionInput) {
  return prisma.resumeSection.create({
    data: input,
  });
}

export async function updateResumeSection(id: string, input: UpdateResumeSectionInput) {
  const section = await prisma.resumeSection.findUnique({ where: { id } });
  if (!section) throw new NotFoundError('Resume section');

  return prisma.resumeSection.update({
    where: { id },
    data: input,
  });
}

export async function deleteResumeSection(id: string) {
  const section = await prisma.resumeSection.findUnique({ where: { id } });
  if (!section) throw new NotFoundError('Resume section');

  return prisma.resumeSection.delete({
    where: { id },
  });
}
