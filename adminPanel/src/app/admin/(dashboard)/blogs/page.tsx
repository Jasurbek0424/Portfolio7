'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { blogsApi, type BlogPost } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchBlogs() {
    try {
      const res = await blogsApi.getAll();
      setBlogs(res.data.data);
    } catch {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await blogsApi.delete(deleteId);
      toast.success('Blog deleted');
      setDeleteId(null);
      fetchBlogs();
    } catch {
      toast.error('Failed to delete blog');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Link href="/admin/blogs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>Create, edit, or delete blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No blog posts yet. Create your first post!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">
                      {(blog as BlogPost & { title?: string }).title ?? blog.titleEn}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{blog.slug}</TableCell>
                    <TableCell>
                      <Badge variant={blog.published ? 'default' : 'secondary'}>
                        {blog.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/blogs/edit/${blog.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(blog.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
