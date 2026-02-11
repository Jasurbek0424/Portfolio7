import type { Request, Response } from 'express';
import { createBlogSchema, updateBlogSchema } from './blog.schema';
import type { LangRequest } from '../../middlewares/lang';
import {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from './blog.service';

export async function getBlogsController(req: LangRequest, res: Response): Promise<void> {
  const lang = req.lang ?? 'en';
  const isAdmin = req.originalUrl?.includes('/admin') ?? false;
  const publishedOnly = !isAdmin;
  const posts = await getBlogs(lang, publishedOnly);
  res.json({ success: true, data: posts });
}

export async function getBlogBySlugController(req: LangRequest, res: Response): Promise<void> {
  const { slug } = req.params;
  const lang = req.lang ?? 'en';
  const isAdmin = req.originalUrl?.includes('/admin') ?? false;
  const publishedOnly = !isAdmin;
  const post = await getBlogBySlug(slug!, lang, publishedOnly);
  res.json({ success: true, data: post });
}

export async function getBlogByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const post = await getBlogById(id!);
  res.json({ success: true, data: post });
}

export async function createBlogController(req: Request, res: Response): Promise<void> {
  const parsed = createBlogSchema.parse(req.body);
  const post = await createBlog(parsed);
  res.status(201).json({ success: true, data: post });
}

export async function updateBlogController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const parsed = updateBlogSchema.parse(req.body);
  const post = await updateBlog(id!, parsed);
  res.json({ success: true, data: post });
}

export async function deleteBlogController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await deleteBlog(id!);
  res.status(204).send();
}
