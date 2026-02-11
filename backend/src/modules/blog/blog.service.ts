import type { SupportedLang } from '../../config';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../utils/errors';
import { toTranslatedResponse } from '../../utils/language';
import type { CreateBlogInput, UpdateBlogInput } from './blog.schema';

export async function getBlogs(lang: SupportedLang, publishedOnly = true) {
  const posts = await prisma.blogPost.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return posts.map((p) => ({
    ...toTranslatedResponse(p as Record<string, unknown>, lang),
  }));
}

export async function getBlogBySlug(slug: string, lang: SupportedLang, publishedOnly = true) {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      ...(publishedOnly ? { published: true } : {}),
    },
  });

  if (!post) {
    throw new NotFoundError('Blog post');
  }

  return toTranslatedResponse(post as Record<string, unknown>, lang);
}

export async function getBlogById(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    throw new NotFoundError('Blog post');
  }

  return post;
}

export async function createBlog(input: CreateBlogInput) {
  return prisma.blogPost.create({
    data: input,
  });
}

export async function updateBlog(id: string, input: UpdateBlogInput) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw new NotFoundError('Blog post');

  return prisma.blogPost.update({
    where: { id },
    data: input,
  });
}

export async function deleteBlog(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw new NotFoundError('Blog post');

  return prisma.blogPost.delete({
    where: { id },
  });
}
