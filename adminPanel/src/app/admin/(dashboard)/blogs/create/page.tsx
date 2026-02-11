'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { blogsApi, type CreateBlogInput } from '@/lib/api';
import { BlogForm } from '@/components/admin/BlogForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: CreateBlogInput) {
    setIsLoading(true);
    try {
      await blogsApi.create(data);
      toast.success('Blog post created');
      router.push('/admin/blogs');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Failed to create blog';
      toast.error(msg || 'Failed to create blog');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Blog Post</h1>
          <p className="text-muted-foreground">Add a new blog post</p>
        </div>
      </div>

      <BlogForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create Post" />
    </div>
  );
}
