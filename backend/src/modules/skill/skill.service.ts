import type { SupportedLang } from '../../config';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../utils/errors';
import type {
  CreateSkillCategoryInput,
  UpdateSkillCategoryInput,
  CreateSkillInput,
  UpdateSkillInput,
} from './skill.schema';

export async function getSkillsForPublic(lang: SupportedLang) {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      skills: {
        orderBy: { sortOrder: 'asc' },
        select: { id: true, label: true, sortOrder: true },
      },
    },
  });
  const titleKey = lang === 'en' ? 'titleEn' : lang === 'ru' ? 'titleRu' : 'titleUz';
  return categories.map((cat) => ({
    id: cat.id,
    title: cat[titleKey],
    sortOrder: cat.sortOrder,
    skills: cat.skills.map((s) => ({ id: s.id, label: s.label, sortOrder: s.sortOrder })),
  }));
}

// SkillCategory CRUD
export async function getAllSkillCategories() {
  return prisma.skillCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { skills: { orderBy: { sortOrder: 'asc' } } },
  });
}

export async function getSkillCategoryById(id: string) {
  const cat = await prisma.skillCategory.findUnique({
    where: { id },
    include: { skills: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!cat) throw new NotFoundError('SkillCategory');
  return cat;
}

export async function createSkillCategory(input: CreateSkillCategoryInput) {
  return prisma.skillCategory.create({
    data: input,
  });
}

export async function updateSkillCategory(id: string, input: UpdateSkillCategoryInput) {
  await getSkillCategoryById(id);
  return prisma.skillCategory.update({
    where: { id },
    data: input,
  });
}

export async function deleteSkillCategory(id: string) {
  await getSkillCategoryById(id);
  return prisma.skillCategory.delete({
    where: { id },
  });
}

// Skill CRUD
export async function getAllSkills() {
  return prisma.skill.findMany({
    orderBy: [{ skillCategory: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    include: { skillCategory: true },
  });
}

export async function getSkillById(id: string) {
  const skill = await prisma.skill.findUnique({
    where: { id },
    include: { skillCategory: true },
  });
  if (!skill) throw new NotFoundError('Skill');
  return skill;
}

export async function createSkill(input: CreateSkillInput) {
  return prisma.skill.create({
    data: {
      skillCategoryId: input.skillCategoryId,
      label: input.label,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function updateSkill(id: string, input: UpdateSkillInput) {
  await getSkillById(id);
  return prisma.skill.update({
    where: { id },
    data: {
      ...(input.skillCategoryId !== undefined && { skillCategoryId: input.skillCategoryId }),
      ...(input.label !== undefined && { label: input.label }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    },
  });
}

export async function deleteSkill(id: string) {
  await getSkillById(id);
  return prisma.skill.delete({
    where: { id },
  });
}
