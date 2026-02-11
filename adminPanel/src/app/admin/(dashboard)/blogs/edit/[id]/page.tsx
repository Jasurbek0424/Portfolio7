'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { blogsApi, type CreateBlogInput, type UpdateBlogInput } from '@/lib/api';
import { BlogForm } from '@/components/admin/BlogForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<CreateBlogInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await blogsApi.getById(id);
        setInitialData(res.data.data);
      } catch {
        toast.error('Blog not found');
        router.push('/admin/blogs');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetch();
  }, [id, router]);

  async function handleSubmit(data: CreateBlogInput) {
    setIsSubmitting(true);
    try {
      const payload: UpdateBlogInput = { ...data };
      await blogsApi.update(id, payload);
      toast.success('Blog post updated');
      router.push('/admin/blogs');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Failed to update blog';
      toast.error(msg || 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
          <p className="text-muted-foreground">Update blog post</p>
        </div>
      </div>

      <BlogForm
        defaultValues={initialData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel="Update Post"
      />
    </div>
  );
}
