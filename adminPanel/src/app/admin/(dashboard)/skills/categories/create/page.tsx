'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { skillCategoriesApi, type CreateSkillCategoryInput } from '@/lib/api';
import { SkillCategoryForm } from '@/components/admin/SkillCategoryForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateSkillCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: CreateSkillCategoryInput) {
    setIsLoading(true);
    try {
      await skillCategoriesApi.create(data);
      toast.success('Category added');
      router.push('/admin/skills');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : 'Failed to create';
      toast.error(msg || 'Failed to create');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/skills">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Category</h1>
          <p className="text-muted-foreground">New category for Core Skills</p>
        </div>
      </div>

      <SkillCategoryForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create" />
    </div>
  );
}
