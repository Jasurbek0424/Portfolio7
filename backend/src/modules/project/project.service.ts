import type { SupportedLang } from '../../config';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../utils/errors';
import { toTranslatedResponse } from '../../utils/language';
import type { CreateProjectInput, UpdateProjectInput } from './project.schema';

export async function getProjects(lang: SupportedLang, publishedOnly = true) {
  const projects = await prisma.project.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return projects.map((p) => ({
    ...toTranslatedResponse(p as Record<string, unknown>, lang),
  }));
}

export async function getProjectBySlug(slug: string, lang: SupportedLang, publishedOnly = true) {
  const project = await prisma.project.findFirst({
    where: {
      slug,
      ...(publishedOnly ? { published: true } : {}),
    },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  return toTranslatedResponse(project as Record<string, unknown>, lang);
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  return project;
}

export async function createProject(input: CreateProjectInput) {
  return prisma.project.create({
    data: input,
  });
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new NotFoundError('Project');

  return prisma.project.update({
    where: { id },
    data: input,
  });
}

export async function deleteProject(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new NotFoundError('Project');

  return prisma.project.delete({
    where: { id },
  });
}
